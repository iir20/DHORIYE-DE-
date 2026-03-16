import React, { Suspense } from 'react';

const ReportMap = React.lazy(() => import('@/components/map/ReportMap'));

export default function HomePage() {
  return (
    <section className="relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center">দুর্নীতির বিরুদ্ধে, এক আওয়াজ</h1>
      </div>
      <Suspense fallback={<div className="w-full h-[calc(100vh-56px)] flex items-center justify-center bg-muted">Loading Map...</div>}>
        <ReportMap />
      </Suspense>
    </section>
  );
}
