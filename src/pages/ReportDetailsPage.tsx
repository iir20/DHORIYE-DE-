import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Report } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// A simple static map component for the details page
const StaticMap = ({ lat, lng }: { lat: number, lng: number }) => {
  const mapUrl = `https://api.maptiler.com/maps/streets/static/${lng},${lat},14/800x400.png?key=get-your-own-key`; // Replace with your key
  return <img src={`https://api.maptiler.com/maps/streets/static/${lng},${lat},14/800x400.png?key=GET_A_FREE_API_KEY_AT_MAPTILER.COM`} alt="Map of the report location" className="rounded-md w-full object-cover" />;
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
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId: id, voteType }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to vote');
      }

      alert('আপনার ভোট গ্রহণ করা হয়েছে।');
    } catch (error: any) {
      console.error('Error voting:', error);
      alert(`ভোট দিতে একটি ত্রুটি হয়েছে: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="container py-8">Loading report...</div>;
  }

  if (!report) {
    return <div className="container py-8">Report not found.</div>;
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{report.title}</CardTitle>
          <CardDescription>দুর্নীতির ধরন: {report.corruption_type}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {report.image_url && (
            <img src={report.image_url} alt={report.title} className="rounded-md w-full max-h-[600px] object-contain bg-muted" />
          )}
          <p className="text-lg whitespace-pre-wrap">{report.description}</p>
          <div>
            <h3 className="text-xl font-semibold mb-2">ঘটনার স্থান</h3>
            <StaticMap lat={report.latitude} lng={report.longitude} />
          </div>
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">ভোট দিন:</h3>
            <div className="flex gap-4">
                <Button size="lg" variant="outline" onClick={() => handleVote(true)}>সত্য ({report.true_votes})</Button>
                <Button size="lg" variant="destructive" onClick={() => handleVote(false)}>মিথ্যা ({report.false_votes})</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
