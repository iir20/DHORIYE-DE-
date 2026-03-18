import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';

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
  );
}
