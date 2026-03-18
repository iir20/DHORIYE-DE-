import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';

// Simple Error Boundary
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      setHasError(true);
      setError(e.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">দুঃখিত, একটি ত্রুটি হয়েছে</h1>
        <p className="text-muted-foreground mb-4">অ্যাপ্লিকেশনটি লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।</p>
        {error && <pre className="bg-muted p-4 rounded text-xs text-left overflow-auto max-w-full">{error.message}</pre>}
      </div>
    );
  }

  return <>{children}</>;
}

// Lazy load pages for performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const NewReportPage = lazy(() => import('@/pages/NewReportPage'));
const ReportDetailsPage = lazy(() => import('@/pages/ReportDetailsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

const LoadingFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/report/new" element={<NewReportPage />} />
              <Route path="/report/:id" element={<ReportDetailsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}
