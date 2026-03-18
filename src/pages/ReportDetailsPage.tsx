import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Report } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ShieldAlert, MapPin, ArrowLeft, ThumbsUp, ThumbsDown, Trophy } from 'lucide-react';

// A simple static map component for the details page
const StaticMap = ({ lat, lng }: { lat: number, lng: number }) => {
  return <img src={`https://api.maptiler.com/maps/streets/static/${lng},${lat},14/800x400.png?key=GET_A_FREE_API_KEY_AT_MAPTILER.COM`} alt="Map of the report location" className="rounded-md w-full object-cover h-64 bg-muted" />;
}

export default function ReportDetailsPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
      if (error) {
        console.error('Error fetching report:', error);
      } else {
        setReport(data);
      }
      setLoading(false);
    };

    fetchReport();

    const channel = supabase
      .channel(`report-${id}`)
      .on<Report>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'reports', filter: `id=eq.${id}` },
        (payload) => {
          setReport(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleVote = async (voteType: boolean) => {
    try {
      // Basic client-side check to prevent double voting
      const votedReports = JSON.parse(localStorage.getItem('voted_reports') || '{}');
      if (votedReports[id!]) {
        alert('আপনি ইতিমধ্যে এই রিপোর্টে ভোট দিয়েছেন।');
        return;
      }

      const { error } = await supabase.rpc('increment_vote_count', { 
        report_id: id, 
        vote_type: voteType 
      });

      if (error) {
        throw error;
      }

      // Mark as voted locally
      votedReports[id!] = true;
      localStorage.setItem('voted_reports', JSON.stringify(votedReports));

      alert('আপনার ভোট গ্রহণ করা হয়েছে।');
    } catch (error: any) {
      console.error('Error voting:', error);
      alert(`ভোট দিতে একটি ত্রুটি হয়েছে: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">রিপোর্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">রিপোর্টটি খুঁজে পাওয়া যায়নি</h2>
        <Button asChild>
          <Link to="/">হোম পেজে ফিরে যান</Link>
        </Button>
      </div>
    );
  }

  const isVerified = report.true_votes > 5;

  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          ফিরে যান
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8">
        <Card className="overflow-hidden border-border/40 shadow-xl">
          <div className="relative">
            {report.image_url ? (
              <img src={report.image_url} alt={report.title} className="w-full max-h-[500px] object-contain bg-black/5" />
            ) : (
              <div className="w-full h-48 bg-muted flex items-center justify-center">
                <ShieldAlert className="h-12 w-12 text-muted-foreground/20" />
              </div>
            )}
            {isVerified && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center shadow-lg font-bold animate-bounce">
                <Trophy className="h-4 w-4 mr-2" />
                ভেরিফাইড রিপোর্ট
              </div>
            )}
          </div>
          
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {report.corruption_type}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(report.created_at).toLocaleDateString('bn-BD')}
              </span>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight">{report.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/90">
                {report.description}
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-xl font-bold">ঘটনার স্থান</h3>
              </div>
              <StaticMap lat={report.latitude} lng={report.longitude} />
              <p className="mt-2 text-sm text-muted-foreground text-center italic">
                অক্ষাংশ: {report.latitude.toFixed(5)}, দ্রাঘিমাংশ: {report.longitude.toFixed(5)}
              </p>
            </div>

            <div className="border-t border-border/40 pt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">জনগণের মতামত</h3>
                  <p className="text-sm text-muted-foreground">এই রিপোর্টটি কি সত্য? আপনার ভোট দিন।</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-16 px-8 border-green-500/50 hover:bg-green-500/10 hover:text-green-600 group"
                      onClick={() => handleVote(true)}
                    >
                      <ThumbsUp className="mr-2 h-6 w-6 text-green-500 group-hover:scale-110 transition-transform" />
                      <span className="text-xl font-bold">সত্য</span>
                    </Button>
                    <span className="mt-2 font-bold text-green-600">{report.true_votes} ভোট</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-16 px-8 border-destructive/50 hover:bg-destructive/10 hover:text-destructive group"
                      onClick={() => handleVote(false)}
                    >
                      <ThumbsDown className="mr-2 h-6 w-6 text-destructive group-hover:scale-110 transition-transform" />
                      <span className="text-xl font-bold">মিথ্যা</span>
                    </Button>
                    <span className="mt-2 font-bold text-destructive">{report.false_votes} ভোট</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 text-center space-y-4">
          <ShieldCheck className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-xl font-bold">আপনার তথ্য নিরাপদ</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            আমরা কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না। আপনার ভোট বা রিপোর্ট সম্পূর্ণ বেনামী। 
            একটি স্বচ্ছ সমাজ গঠনে আপনার অংশগ্রহণ অপরিহার্য।
          </p>
        </div>
      </div>
    </div>
  );
}
