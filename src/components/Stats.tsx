import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle, Users, MapPin } from 'lucide-react';

export default function Stats() {
  const [stats, setStats] = useState({
    totalReports: 0,
    verifiedReports: 0,
    activeUsers: 0,
    activeAreas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('id, true_votes');

      if (reportsError) {
        console.error('Error fetching stats:', reportsError);
      } else {
        const total = reports?.length || 0;
        const verified = reports?.filter(r => r.true_votes > 5).length || 0;
        setStats({
          totalReports: total,
          verifiedReports: verified,
          activeUsers: total * 3, // Mocking active users based on reports
          activeAreas: Math.ceil(total / 2), // Mocking active areas
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="h-32 flex items-center justify-center">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">মোট রিপোর্ট</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
            {stats.totalReports}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-green-500/5 border-green-500/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">ভেরিফাইড রিপোর্ট</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
            {stats.verifiedReports}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">সক্রিয় ব্যবহারকারী</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            {stats.activeUsers}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-orange-500/5 border-orange-500/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">সক্রিয় এলাকা</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-orange-500" />
            {stats.activeAreas}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
