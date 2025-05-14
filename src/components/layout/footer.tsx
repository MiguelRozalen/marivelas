// src/components/layout/footer.tsx
"use client"; // Required for new Date() to prevent hydration mismatch
import { useEffect, useState } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card shadow-md mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {currentYear} Marivelas Catálogo. Todos los derechos reservados.</p>
        <p className="text-sm">Velas artesanales hechas con cariño</p>
      </div>
    </footer>
  );
}
