import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const app = express();
const PORT = 3000;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for backend

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL and Service Key must be defined in .env file');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API route for submitting a report
app.use(express.json());

app.post('/api/vote', async (req, res) => {
  try {
    const { reportId, voteType } = req.body;

    if (!reportId || typeof voteType !== 'boolean') {
      return res.status(400).json({ message: 'Invalid request body.' });
    }

    // 1. Hash IP for anonymity
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const hashedIp = crypto.createHash('sha256').update(ip + (process.env.IP_SECRET || '')).digest('hex');
    const today = new Date().toISOString().split('T')[0];

    // 2. Check if user has already voted today
    const { data: existingVote, error: existingVoteError } = await supabase
      .from('votes')
      .select('id')
      .eq('report_id', reportId)
      .eq('hashed_ip', hashedIp)
      .eq('voted_at', today)
      .single();

    if (existingVoteError && existingVoteError.code !== 'PGRST116') { // Ignore 'not found' error
      throw existingVoteError;
    }

    if (existingVote) {
      return res.status(429).json({ message: 'You have already voted on this report today.' });
    }

    // 3. Record the new vote
    const { error: voteInsertError } = await supabase
      .from('votes')
      .insert({ report_id: reportId, hashed_ip: hashedIp, voted_at: today, vote_type: voteType });

    if (voteInsertError) throw voteInsertError;

    // 4. Increment the vote count on the report
    const columnToIncrement = voteType ? 'true_votes' : 'false_votes';
    const { error: rpcError } = await supabase.rpc('increment_vote_count', { 
      report_id_to_update: reportId, 
      column_to_increment: columnToIncrement 
    });

    if (rpcError) throw rpcError;

    res.status(200).json({ message: 'Vote recorded successfully.' });

  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ message: 'An error occurred while recording the vote.' });
  }
});

app.post('/api/report', upload.single('photo'), async (req, res) => {
  try {
    const { title, description, corruptionType, lat, lng } = req.body;
    const photo = req.file;

    // 1. Hash IP for anonymity
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const hashedIp = crypto.createHash('sha256').update(ip + (process.env.IP_SECRET || '')).digest('hex');

    let imageUrl = null;

    // 2. Process and upload photo if it exists
    if (photo) {
      // Strip EXIF data
      const imageBuffer = await sharp(photo.buffer).toBuffer();
      const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.webp`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('report_photos')
        .upload(fileName, imageBuffer, { 
          contentType: 'image/webp',
          upsert: false 
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('report_photos').getPublicUrl(fileName);
      imageUrl = publicUrl;
    }

    // 3. Insert report into database
    const { data: reportData, error: reportError } = await supabase
      .from('reports')
      .insert({
        title,
        description,
        corruption_type: corruptionType,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        image_url: imageUrl,
        // We don't store the hashed IP with the report to maintain anonymity
      })
      .select();

    if (reportError) throw reportError;

    res.status(201).json({ message: 'Report submitted successfully', data: reportData });

  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'An error occurred while submitting the report.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
