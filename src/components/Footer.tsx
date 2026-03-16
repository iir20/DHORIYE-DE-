export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card py-8 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-xl font-bold text-primary tracking-tight">ধরিয়ে দে</span>
          <p className="text-center text-sm text-muted-foreground md:text-left max-w-md">
            সতর্কতা: এই প্ল্যাটফর্মে প্রদত্ত তথ্যের সত্যতা যাচাই করা ব্যবহারকারীর দায়িত্ব। 
            কর্তৃপক্ষ কোনো মিথ্যা রিপোর্টের জন্য দায়ী নয়। এটি একটি উন্মুক্ত প্ল্যাটফর্ম।
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ধরিয়ে দে. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
