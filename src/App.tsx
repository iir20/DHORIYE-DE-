import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import NewReportPage from '@/pages/NewReportPage';
import ReportDetailsPage from '@/pages/ReportDetailsPage';
import AboutPage from '@/pages/AboutPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/report/new" element={<NewReportPage />} />
          <Route path="/report/:id" element={<ReportDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
