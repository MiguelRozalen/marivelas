import Image from 'next/image';
import type { Candle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CandleCardProps {
  candle: Candle;
}

export default function CandleCard({ candle }: CandleCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative w-full">
          <Image
            src={candle.imageUrl}
            alt={candle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={candle.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 text-foreground">{candle.name}</CardTitle>
        {candle.description && <CardDescription className="text-muted-foreground mb-4 text-sm">{candle.description}</CardDescription>}
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <p className="text-2xl font-bold text-accent-foreground" style={{color: "hsl(var(--accent))"}}>${candle.price.toFixed(2)}</p>
        <Button asChild variant="default">
          <Link href={`/#contact?product=${encodeURIComponent(candle.name)}`}>Inquire</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
