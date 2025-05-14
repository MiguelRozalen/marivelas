import CandleList from '@/components/candle-list';
import type { Candle } from '@/types';
import { fetchCandles, getTotalCandlesCount } from '@/lib/actions';

export default async function Home() {
  const initialCandles = await fetchCandles(0);
  const totalCandles = await getTotalCandlesCount(); 

  return (
    <div className="container mx-auto px-4 py-8">
      <section id="catalog" className="mb-16">
        <CandleList initialCandles={initialCandles} totalCandles={totalCandles} />
      </section>
    </div>
  );
}
