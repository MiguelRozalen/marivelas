import Link from 'next/link';
import {FlameKindling} from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-foreground hover:text-accent-foreground transition-colors flex items-center">
          <FlameKindling className="h-8 w-8 mr-2 text-primary" />
          Marivelas Catalog
        </Link>
        <nav>
          <Link href="/#catalog" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
            Catalog
          </Link>
          <Link href="/#contact" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
