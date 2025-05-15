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
        <p className="text-xs">&copy; {currentYear} Marivelas. Todos los derechos reservados.</p>
        <p className="text-xs italic">Handcrafted candles made with love</p>
      </div>
    </footer>
  );
}
