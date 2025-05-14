import CandleCard from '@/components/candle-card';
import type { Candle } from '@/types';

const candles: Candle[] = [
  { id: '1', name: 'Sueño de Vainilla', price: 15.99, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'vanilla candle', description: 'Una relajante mezcla de rica vainilla y crema dulce.' },
  { id: '2', name: 'Campos de Lavanda', price: 18.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'lavender candle', description: 'Lavanda calmante para relajar tus sentidos.' },
  { id: '3', name: 'Explosión Cítrica', price: 16.75, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'citrus candle', description: 'Una mezcla estimulante de naranja, limón y pomelo.' },
  { id: '4', name: 'Sándalo Serenidad', price: 22.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'sandalwood candle', description: 'Sándalo terroso para una atmósfera tranquila.' },
  { id: '5', name: 'Felicidad de Pétalos de Rosa', price: 19.99, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'rose candle', description: 'Fragancia romántica y delicada de pétalos de rosa.' },
  { id: '6', name: 'Brisa Oceánica', price: 17.25, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'ocean candle', description: 'Fresco y vigorizante, como un paseo junto al mar.' },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section id="hero" className="text-center py-12 md:py-20 bg-secondary/50 rounded-lg mb-16 shadow">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">Descubre las Velas Marivelas</h1>
        <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
          Experimenta la calidez y elegancia de nuestras velas artesanales, hechas con amor y los mejores ingredientes.
        </p>
      </section>

      <section id="catalog" className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Nuestra Colección</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {candles.map(candle => (
            <CandleCard key={candle.id} candle={candle} />
          ))}
        </div>
      </section>
    </div>
  );
}
