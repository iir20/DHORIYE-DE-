import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Stats from '@/components/Stats';
import Leaderboard from '@/components/Leaderboard';
import { ShieldAlert, MapPin, ShieldCheck, Users, Trophy } from 'lucide-react';

const ReportMap = React.lazy(() => import('@/components/map/ReportMap'));

export default function HomePage() {
  console.log('[HomePage] Rendering');
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary/5 py-16 md:py-24 border-b border-border/40 overflow-hidden">
        <div className="container relative z-10 max-w-screen-2xl mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              <ShieldAlert className="mr-1 h-4 w-4" />
              <span>দুর্নীতির বিরুদ্ধে এক আওয়াজ</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl">
              দুর্নীতি ও চাঁদাবাজি <span className="text-primary">ধরিয়ে দিন</span>, সমাজকে কলঙ্কমুক্ত করুন
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              আপনার পরিচয় সম্পূর্ণ গোপন রেখে নির্ভয়ে তথ্য দিন। আপনার একটি সঠিক তথ্য হয়তো বাঁচিয়ে দিতে পারে অনেকের জীবন ও জীবিকা।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-lg font-semibold">
                <Link to="/report/new">রিপোর্ট করুন</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg font-semibold">
                <a href="#map">লাইভ ম্যাপ দেখুন</a>
              </Button>
            </div>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-border/40">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <Stats />
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="relative py-12 md:py-20">
        <div className="container max-w-screen-2xl mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">লাইভ রিপোর্ট ম্যাপ</h2>
              <p className="text-muted-foreground">সারা দেশে ঘটে যাওয়া দুর্নীতির রিয়েল-টাইম চিত্র</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-primary mr-2"></div>রিপোর্ট</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>ভেরিফাইড</div>
            </div>
          </div>
        </div>
        <div className="relative h-[600px] border-y border-border/40">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">ম্যাপ লোড হচ্ছে...</div>}>
            <ReportMap />
          </Suspense>
        </div>
      </section>

      {/* Leaderboard & Info Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">কেন "ধরিয়ে দে" ব্যবহার করবেন?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                  <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">সম্পূর্ণ গোপনীয়তা</h3>
                  <p className="text-sm text-muted-foreground">আপনার পরিচয় কোনোভাবেই প্রকাশ করা হবে না। আমরা কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না।</p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">জনগণের শক্তি</h3>
                  <p className="text-sm text-muted-foreground">ভোটের মাধ্যমে রিপোর্টের সত্যতা যাচাই করুন। মিথ্যা রিপোর্ট রুখতে সাহায্য করুন।</p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                  <MapPin className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">সঠিক অবস্থান</h3>
                  <p className="text-sm text-muted-foreground">ঘটনার সঠিক স্থান ম্যাপে চিহ্নিত করুন যাতে কর্তৃপক্ষ সহজে ব্যবস্থা নিতে পারে।</p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                  <Trophy className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">স্বীকৃতি (Awards)</h3>
                  <p className="text-sm text-muted-foreground">শীর্ষ ভেরিফাইড রিপোর্টগুলো আমাদের লিডারবোর্ডে প্রদর্শিত হয়।</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Leaderboard />
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle>একটি সুন্দর বাংলাদেশ গড়ুন</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 opacity-90">
                    আপনার চারপাশের অনিয়ম দেখে চুপ থাকবেন না। আজই রিপোর্ট করুন এবং দুর্নীতির বিরুদ্ধে রুখে দাঁড়ান।
                  </p>
                  <Button asChild variant="secondary" className="w-full font-bold">
                    <Link to="/report/new">এখনই রিপোর্ট করুন</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
