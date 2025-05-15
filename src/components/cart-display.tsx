
// src/components/cart-display.tsx
"use client";

import { useContext, useState, useMemo, useEffect } from 'react';
import { CartContext } from '@/context/cart-context';
import CartItem from './cart-item';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2, Package, PackageCheck, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { PackagingType } from '@/types';
import { STANDARD_PACKAGING_COST, PREMIUM_PACKAGING_COST_PER_ITEM, SHIPPING_COST, SELLER_EMAIL } from '@/config/constants';
import { useToast } from "@/hooks/use-toast";

export default function CartDisplay() {
  const { 
    cartItems, 
    getSubtotal,
    getPackagingCost,
    getShippingCost,
    getTotalPrice,
    clearCart, 
    getItemCount,
    packagingOption,
    updatePackagingOption
  } = useContext(CartContext);

  const { toast } = useToast();
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const totalItems = getItemCount();
  const subtotalValue = getSubtotal;
  const packagingCostValue = getPackagingCost;
  const shippingCostValue = getShippingCost();
  const totalPriceValue = getTotalPrice;

  const generateOrderSummary = (orderId: string | null, includeInstructions: boolean = false) => {
    if (cartItems.length === 0 && !orderId) return "";
    
    let summary = `Asunto: Nuevo Pedido - ID: ${orderId}\n\n`;
    summary += `Estimado equipo de Marivelas,\n\n`;
    summary += `Quisiera realizar el siguiente pedido:\n\n`;

    cartItems.forEach(item => {
      summary += `- ${item.candle.name} (Color: ${item.color.name}) x ${item.quantity} - €${(item.candle.price * item.quantity).toFixed(2)}\n`;
    });

    summary += `\nSubtotal: €${subtotalValue.toFixed(2)}\n`;
    summary += `Coste de Packaging (${packagingOption}): €${packagingCostValue.toFixed(2)}\n`;
    summary += `Coste de Envío: €${shippingCostValue.toFixed(2)}\n`;
    summary += `-------------------------------------\n`;
    summary += `TOTAL DEL PEDIDO: €${totalPriceValue.toFixed(2)}\n`;
    summary += `-------------------------------------\n\n`;
    
    if (includeInstructions && orderId) {
      summary += `Mis datos de contacto son:\n`;
      summary += `[Por favor, completa aquí tu Nombre, Email y Teléfono si es necesario]\n\n`;
      summary += `--- Instrucciones para el Cliente ---\n`;
      summary += `Para finalizar tu pedido, por favor, envía un correo electrónico a: ${SELLER_EMAIL}\n`;
      summary += `1. Asunto del correo: Nuevo Pedido - ID: ${orderId} (¡Copia y pega esto!)\n`;
      summary += `2. Cuerpo del correo: Copia y pega TODO este resumen del pedido, incluyendo tus datos de contacto si lo deseas.\n`;
      summary += `3. Pago: Realiza el pago del TOTAL DEL PEDIDO (€${totalPriceValue.toFixed(2)}) por Bizum al número que te facilitaremos por correo tras recibir tu email.\n`;
      summary += `4. Importante: Indica el ID del Pedido (${orderId}) en el concepto del Bizum.\n`;
      summary += `Tu pedido comenzará a elaborarse una vez recibido el pago y el correo.\n`;
      summary += `¡Gracias por tu compra!\n`;
    }
    // Removed "else if (!includeInstructions)" part as ContactForm is removed.

    return summary;
  };
  
  const orderSummaryForPopup = useMemo(() => currentOrderId ? generateOrderSummary(currentOrderId, true) : "", [cartItems, totalPriceValue, currentOrderId, packagingOption, subtotalValue, packagingCostValue, shippingCostValue]);

  const handleProceedToCheckout = () => {
    const newOrderId = `MV-${Date.now()}`;
    setCurrentOrderId(newOrderId);
    setIsPopupOpen(true);
  };

  const handleOrderInstructionsConfirmed = () => {
    clearCart();
    toast({
      title: "¡Instrucciones Recibidas!",
      description: `Tu ID de Pedido es: ${currentOrderId}. Por favor, envía ahora el correo electrónico a ${SELLER_EMAIL} con el resumen de tu pedido y este ID para finalizar la compra. Tu pedido se procesará una vez recibido el correo y el pago.`,
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
      duration: 10000, // Longer duration for important instructions
    });
    setCurrentOrderId(null);
    setIsPopupOpen(false); 
  };

  if (cartItems.length === 0) {
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
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
      <Separator className="my-6" />

      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Opciones de Packaging</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={packagingOption}
            onValueChange={(value) => updatePackagingOption(value as PackagingType)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="standard" id="standard-packaging" />
              <Label htmlFor="standard-packaging" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span><Package className="inline mr-2 h-5 w-5" />Packaging Estándar</span>
                  <span className="font-semibold">€{STANDARD_PACKAGING_COST.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Empaquetado global para tu pedido.</p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="premium" id="premium-packaging" />
              <Label htmlFor="premium-packaging" className="flex-1 cursor-pointer">
                 <div className="flex items-center justify-between">
                  <span><PackageCheck className="inline mr-2 h-5 w-5" />Packaging Premium</span>
                  <span className="font-semibold">€{PREMIUM_PACKAGING_COST_PER_ITEM.toFixed(2)} / vela</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Cada vela empaquetada individualmente con un toque especial.</p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card className="mb-6 shadow-md">
         <CardHeader>
            <CardTitle className="text-xl">Resumen de Costes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="flex justify-between"><span>Subtotal:</span> <span>€{subtotalValue.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Packaging ({packagingOption}):</span> <span>€{packagingCostValue.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío:</span> <span>€{shippingCostValue.toFixed(2)}</span></div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg"><span>Total Estimado:</span> <span>€{totalPriceValue.toFixed(2)}</span></div>
             <p className="text-xs text-muted-foreground pt-2"><Info size={14} className="inline mr-1"/>El coste de envío final puede variar ligeramente según el peso y volumen total.</p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-card rounded-lg shadow gap-4">
        <div className="w-full sm:w-auto">
          <Button variant="outline" onClick={clearCart} disabled={cartItems.length === 0} className="w-full sm:w-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Vaciar Carrito ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto sm:ml-auto">
          <p className="text-2xl font-bold text-primary">Total: €{totalPriceValue.toFixed(2)}</p>
          
          <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <AlertDialogTrigger asChild>
              <Button onClick={handleProceedToCheckout} size="lg" className="w-full sm:w-auto" disabled={cartItems.length === 0}>
                Realizar Pedido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmación e Instrucciones del Pedido</AlertDialogTitle>
                <AlertDialogDescription>
                  Tu ID de Pedido es: <span className="font-bold">{currentOrderId}</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="max-h-[60vh] overflow-y-auto py-4">
                <pre className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md font-sans">{orderSummaryForPopup}</pre>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCurrentOrderId(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleOrderInstructionsConfirmed}>Entendido, Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
