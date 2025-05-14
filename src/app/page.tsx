import CandleCard from '@/components/candle-card';
import ContactForm from '@/components/contact-form';
import type { Candle } from '@/types';
import { Separator } from '@/components/ui/separator';

const candles: Candle[] = [
  { id: '1', name: 'Vanilla Dream', price: 15.99, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'vanilla candle', description: 'A soothing blend of rich vanilla and sweet cream.' },
  { id: '2', name: 'Lavender Fields', price: 18.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'lavender candle', description: 'Calming lavender to relax your senses.' },
  { id: '3', name: 'Citrus Burst', price: 16.75, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'citrus candle', description: 'An uplifting mix of orange, lemon, and grapefruit.' },
  { id: '4', name: 'Sandalwood Serenity', price: 22.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'sandalwood candle', description: 'Earthy sandalwood for a tranquil atmosphere.' },
  { id: '5', name: 'Rose Petal Bliss', price: 19.99, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'rose candle', description: 'Romantic and delicate rose petal fragrance.' },
  { id: '6', name: 'Ocean Breeze', price: 17.25, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'ocean candle', description: 'Fresh and invigorating, like a walk by the sea.' },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section id="hero" className="text-center py-12 md:py-20 bg-secondary/50 rounded-lg mb-16 shadow">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">Discover Marivelas Candles</h1>
        <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
          Experience the warmth and elegance of our handcrafted candles, made with love and the finest ingredients.
        </p>
      </section>

      <section id="catalog" className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Our Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {candles.map(candle => (
            <CandleCard key={candle.id} candle={candle} />
          ))}
        </div>
      </section>

      <Separator className="my-16" />

      <section id="contact" className="mb-12 scroll-mt-20">
        {/* Suspense boundary for ContactForm if needed, but it's client component already handled by Next.js */}
        <ContactForm />
      </section>
    </div>
  );
}
