import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Report } from '@/lib/types';

export default function Leaderboard() {
  const [topReports, setTopReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('true_votes', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching top reports:', error);
      } else {
        setTopReports(data || []);
      }
      setLoading(false);
    };

    fetchTopReports();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading leaderboard...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <CardTitle>শীর্ষ ভেরিফাইড রিপোর্ট (Awards)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topReports.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">এখনো কোনো রিপোর্ট ভেরিফাইড হয়নি।</p>
          ) : (
            topReports.map((report, index) => (
              <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium line-clamp-1">{report.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ShieldCheck className="h-3 w-3 mr-1 text-green-500" />
                      <span>{report.true_votes} ভেরিফিকেশন</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded bg-background border border-border">
                  {report.corruption_type}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
