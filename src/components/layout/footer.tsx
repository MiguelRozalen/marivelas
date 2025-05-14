// src/components/layout/footer.tsx
"use client"; 
import { useEffect, useState } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card shadow-md mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {currentYear} Marivelas. Todos los derechos reservados.</p> {/* Updated Name */}
        <p className="text-xs italic">Handcrafted candles made with love</p> {/* Updated text, made smaller and italic */}
      </div>
    </footer>
  );
}
