import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 text-primary">
            <ShieldAlert className="h-6 w-6" />
            <span className="font-bold sm:inline-block text-2xl tracking-tight">ধরিয়ে দে</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-primary text-foreground/80">Home</Link>
            <Link to="/report/new" className="transition-colors hover:text-primary text-foreground/80">রিপোর্ট করুন</Link>
            <Link to="/" className="transition-colors hover:text-primary text-foreground/80">লাইভ রিপোর্ট</Link>
            <Link to="/about" className="transition-colors hover:text-primary text-foreground/80">About</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              <Link to="/report/new">নতুন রিপোর্ট করুন</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
