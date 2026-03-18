import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  console.log('Layout rendering');
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
