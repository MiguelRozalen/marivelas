// src/components/cart-display.tsx
"use client";

import { useContext, useState, useMemo } from 'react';
import { CartContext } from '@/context/cart-context';
import CartItem from './cart-item';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ContactForm from './contact-form';
import { ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartDisplay() {
  const { cartItems, getTotalPrice, clearCart, getItemCount } = useContext(CartContext);
  const [showContactForm, setShowContactForm] = useState(false);

  const totalItems = getItemCount();
  const totalPrice = getTotalPrice();

  const orderSummary = useMemo(() => {
    if (cartItems.length === 0) return "";
    let summary = "Resumen del Pedido:\n\n";
    cartItems.forEach(item => {
      summary += `- ${item.candle.name} (Color: ${item.color.name}) x ${item.quantity} - €${(item.candle.price * item.quantity).toFixed(2)}\n`;
    });
    summary += `\nTotal: €${totalPrice.toFixed(2)}`; // Currency updated to €
    return summary;
  }, [cartItems, totalPrice]);

  const handleCheckout = () => {
    setShowContactForm(true);
  };

  const handleFormSubmitSuccess = () => {
    clearCart();
    setShowContactForm(false); 
  };

  if (cartItems.length === 0 && !showContactForm) {
    return (
      <div className="text-center py-10">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
        <p className="text-xl text-muted-foreground mb-6">Tu carrito está vacío.</p>
        <Button asChild>
          <Link href="/#catalog">Continuar Comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {!showContactForm && (
        <>
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-card rounded-lg shadow gap-4">
            <div className="w-full sm:w-auto">
              <Button variant="outline" onClick={clearCart} disabled={cartItems.length === 0} className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Vaciar Carrito ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto sm:ml-auto">
              <p className="text-2xl font-bold text-primary">Total: €{totalPrice.toFixed(2)}</p> {/* Currency updated to €, color changed to primary */}
              <Button onClick={handleCheckout} size="lg" className="w-full sm:w-auto" disabled={cartItems.length === 0}>
                Realizar Pedido
              </Button>
            </div>
          </div>
        </>
      )}

      {showContactForm && (
        <div className="mt-12">
           {/* Removed title: <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Finalizar Pedido</h2> */}
          <ContactForm 
            orderSummary={orderSummary} 
            onFormSubmitSuccess={handleFormSubmitSuccess}
          />
          <Button variant="outline" onClick={() => setShowContactForm(false)} className="mt-6 mx-auto block">
            Volver al Carrito
          </Button>
        </div>
      )}
    </div>
  );
}
