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
      summary += `- ${item.candle.name} (Color: ${item.color.name}) x ${item.quantity} - $${(item.candle.price * item.quantity).toFixed(2)}\n`;
    });
    summary += `\nTotal: $${totalPrice.toFixed(2)}`;
    return summary;
  }, [cartItems, totalPrice]);

  const handleCheckout = () => {
    setShowContactForm(true);
  };

  const handleFormSubmitSuccess = () => {
    clearCart();
    setShowContactForm(false); 
    // Optionally navigate to a success page or show a global success message
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
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-card rounded-lg shadow">
            <Button variant="outline" onClick={clearCart} disabled={cartItems.length === 0} className="mb-4 sm:mb-0">
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar Carrito ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
            </Button>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">Total: ${totalPrice.toFixed(2)}</p>
              <Button onClick={handleCheckout} size="lg" className="mt-2 w-full sm:w-auto" disabled={cartItems.length === 0}>
                Realizar Pedido
              </Button>
            </div>
          </div>
        </>
      )}

      {showContactForm && (
        <div className="mt-12">
           <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Finalizar Pedido</h2>
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
