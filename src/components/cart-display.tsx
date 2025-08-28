
// src/components/cart-display.tsx
"use client";

import { useContext, useState, useMemo, useRef } from 'react';
import { CartContext } from '@/context/cart-context';
import CartItem from './cart-item';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2, Package, PackageCheck, Info, CheckCircle, AlertTriangle } from 'lucide-react';
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
  const [isSummaryPopupOpen, setIsSummaryPopupOpen] = useState(false);
  const [isClearCartConfirmPopupOpen, setIsClearCartConfirmPopupOpen] = useState(false);
  const proceedingToNextStepRef = useRef(false);


  const totalItems = getItemCount();
  const subtotalValue = getSubtotal;
  const packagingCostValue = getPackagingCost;
  const shippingCostValue = getShippingCost();
  const totalPriceValue = getTotalPrice;

  const generateOrderEmailBody = (orderId: string | null) => {
    if (cartItems.length === 0 && !orderId) return "";

    let summary = `Estimado equipo de Marivelas,\n\n`;
    summary += `Quisiera realizar el siguiente pedido con ID: ${orderId}\n\n`;

    cartItems.forEach(item => {
      summary += `- ${item.candle.name} (Color: ${item.color.name}, Aroma: ${item.scent.name}) x ${item.quantity} - €${(item.candle.price * item.quantity).toFixed(2)}\n`;
    });

    summary += `\nSubtotal: €${subtotalValue.toFixed(2)}\n`;
    summary += `Coste de Packaging (${packagingOption}): €${packagingCostValue.toFixed(2)}\n`;
    summary += `Coste de Envío: €${shippingCostValue.toFixed(2)}\n`;
    summary += `-------------------------------------\n`;
    summary += `TOTAL DEL PEDIDO: €${totalPriceValue.toFixed(2)}\n`;
    summary += `-------------------------------------\n\n`;
    summary += `Mis datos de contacto son:\n`;
    summary += `[Por favor, completa aquí tu Nombre, Email y Teléfono si es necesario]\n`;

    return summary;
  };

  const orderEmailBodyForPopup = useMemo(() => currentOrderId ? generateOrderEmailBody(currentOrderId) : "", [cartItems, totalPriceValue, currentOrderId, packagingOption, subtotalValue, packagingCostValue, shippingCostValue]);

  const handleProceedToCheckout = () => {
    const newOrderId = `MV-${Date.now()}`;
    setCurrentOrderId(newOrderId);
    proceedingToNextStepRef.current = false;
    setIsSummaryPopupOpen(true);
  };

  const handleInstructionsAcknowledged = () => {
    proceedingToNextStepRef.current = true;
    setIsSummaryPopupOpen(false);
    setIsClearCartConfirmPopupOpen(true);
  };

  const handleConfirmClearCartAndFinalize = () => {
    if (currentOrderId) {
      clearCart();
      toast({
        title: "¡Instrucciones de Pedido Recibidas!",
        description: (
          <div>
            <p>Tu ID de Pedido es: <span className="font-semibold">{currentOrderId}</span>.</p>
            <p className="mt-2">Por favor, envía ahora un correo electrónico a <span className="font-semibold">{SELLER_EMAIL}</span> con el resumen de tu pedido y este ID para finalizar la compra.</p>
            <p className="mt-1">Tu pedido se procesará una vez recibido el correo y el pago.</p>
          </div>
        ),
        action: <CheckCircle className="h-5 w-5 text-green-500" />,
        duration: 15000,
      });
    }
    setIsClearCartConfirmPopupOpen(false);
    setCurrentOrderId(null);
  };

  const handleCancelClearCart = () => {
    setIsClearCartConfirmPopupOpen(false);
    if (currentOrderId) { 
        setCurrentOrderId(null); 
    }
    proceedingToNextStepRef.current = false; 
  }

  const handleCancelSummaryPopup = () => {
    setIsSummaryPopupOpen(false);
    setCurrentOrderId(null);
  }

  const handleCopyInstructions = async () => {
    if (!currentOrderId || !orderEmailBodyForPopup) return;

    const instructionsText = `
Instrucciones para Finalizar tu Pedido (ID: ${currentOrderId}):

PASO 1: Envía un Correo Electrónico
------------------------------------
A: ${SELLER_EMAIL}
Asunto: Nuevo Pedido - ID: ${currentOrderId}
Cuerpo del Correo (copia y pega el siguiente resumen):
${orderEmailBodyForPopup}

PASO 2: Realiza el Pago
------------------------------------
Importe TOTAL DEL PEDIDO: €${totalPriceValue.toFixed(2)}
Método: Bizum (el número se te facilitará por correo electrónico tras recibir tu email de pedido).
Concepto del Bizum (indica tu ID de pedido): ${currentOrderId}

PASO 3: Confirmación
------------------------------------
Tu pedido comenzará a elaborarse una vez recibido tanto el correo electrónico como la confirmación del pago.

Por favor, asegúrate de completar todos los pasos.
    `;

    try {
      await navigator.clipboard.writeText(instructionsText.trim());
      toast({
        title: "¡Instrucciones Copiadas!",
        description: "Las instrucciones del pedido se han copiado a tu portapapeles.",
        action: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (err) {
      toast({
        title: "Error al Copiar",
        description: "No se pudieron copiar las instrucciones. Por favor, inténtalo manualmente.",
        variant: "destructive",
        action: <AlertTriangle className="h-5 w-5" />,
      });
      console.error('Failed to copy instructions: ', err);
    }
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
            <div className="flex justify-between"><span>Packaging ({packagingOption === 'none' || cartItems.length === 0 ? 'N/A' : packagingOption}):</span> <span>€{packagingCostValue.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío:</span> <span>€{shippingCostValue.toFixed(2)}</span></div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg"><span>Total Estimado:</span> <span>€{totalPriceValue.toFixed(2)}</span></div>
             <p className="text-xs text-muted-foreground pt-2"><Info size={14} className="inline mr-1"/>El coste de envío final puede variar ligeramente según el peso y volumen total.</p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-card rounded-lg shadow gap-4">
        <div className="w-full sm:w-auto">
          <Button variant="outline" onClick={() => { proceedingToNextStepRef.current = false; setIsClearCartConfirmPopupOpen(true); }} disabled={cartItems.length === 0} className="w-full sm:w-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Vaciar Carrito ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto sm:ml-auto">
          <p className="text-2xl font-bold text-primary">Total: €{totalPriceValue.toFixed(2)}</p>

          <AlertDialog
            open={isSummaryPopupOpen}
            onOpenChange={(openState) => {
              setIsSummaryPopupOpen(openState);
              if (!openState) { 
                if (proceedingToNextStepRef.current) {
                   proceedingToNextStepRef.current = false; 
                } else {
                   setCurrentOrderId(null); 
                }
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button onClick={handleProceedToCheckout} size="lg" className="w-full sm:w-auto" disabled={cartItems.length === 0}>
                Realizar Pedido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmación e Instrucciones del Pedido</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription asChild>
                <div className="text-sm text-foreground space-y-3 mt-2 mb-4">
                  <p className="mb-4">Tu ID de Pedido es: <span className="font-bold">{currentOrderId}</span>. Para finalizar tu compra, por favor, sigue estos pasos:</p>
                  
                  <div className="space-y-6">
                    {/* Step 1: Send Email */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold mr-4">1</div>
                      <div className="flex-1">
                        <h4 className="text-md font-semibold text-foreground mb-1">Envía un correo electrónico</h4>
                        <p className="text-xs text-muted-foreground">A: <span className="font-medium text-foreground">{SELLER_EMAIL}</span></p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Asunto del correo: <br/>
                          <code className="text-xs bg-muted text-muted-foreground p-1 rounded block mt-1 break-all">{`Nuevo Pedido - ID: ${currentOrderId}`}</code>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Cuerpo del correo: Copia y pega TODO el resumen del pedido que se muestra abajo.</p>
                        
                        <div className="max-h-[20vh] overflow-y-auto py-1 mt-1">
                            <pre className="text-xs whitespace-pre-wrap bg-muted p-3 rounded-md font-sans">{orderEmailBodyForPopup}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Payment */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold mr-4">2</div>
                      <div className="flex-1">
                        <h4 className="text-md font-semibold text-foreground mb-1">Realiza el Pago</h4>
                        <p className="text-xs text-muted-foreground">Importe TOTAL DEL PEDIDO: <span className="font-medium text-foreground">€{totalPriceValue.toFixed(2)}</span></p>
                        <p className="text-xs text-muted-foreground mt-1">Método: Bizum (el número se te facilitará por correo electrónico tras recibir tu email de pedido).</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Importante - Concepto del Bizum (indica tu ID de pedido): <br/>
                          <code className="text-xs bg-muted text-muted-foreground p-1 rounded block mt-1 break-all">{currentOrderId}</code>
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Confirmation */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold mr-4">3</div>
                      <div className="flex-1">
                        <h4 className="text-md font-semibold text-foreground mb-1">Confirmación</h4>
                        <p className="text-xs text-muted-foreground">Tu pedido comenzará a elaborarse una vez recibido tanto el correo electrónico como la confirmación del pago.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
              <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between">
                <AlertDialogCancel onClick={handleCancelSummaryPopup} className="sm:mr-auto">Cancelar</AlertDialogCancel>
                <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" onClick={handleCopyInstructions}>Copiar Instrucciones</Button>
                    <AlertDialogAction onClick={handleInstructionsAcknowledged}>Entendido, Continuar</AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isClearCartConfirmPopupOpen} onOpenChange={(open) => {
            if (cartItems.length === 0 && open && currentOrderId) { 
                 setIsClearCartConfirmPopupOpen(false);
                 setCurrentOrderId(null);
                 return;
            }
            if (!open) { 
                if (!proceedingToNextStepRef.current) { 
                    setCurrentOrderId(null); 
                } 
                setIsClearCartConfirmPopupOpen(false);
            } else { 
                setIsClearCartConfirmPopupOpen(open);
            }
          }}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                   {currentOrderId ? 'Confirmar Pedido y Vaciar Carrito' : 'Vaciar Carrito'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {currentOrderId ? (
                    <>
                    Estás a punto de confirmar tu pedido con ID: <span className="font-semibold">{currentOrderId}</span>.
                    Al continuar, tu carrito se vaciará y deberás seguir las instrucciones enviando un correo electrónico para completar la compra.
                    <br/><br/>
                    ¿Estás seguro de que quieres proceder?
                    </>
                  ) : (
                    "¿Estás seguro de que quieres vaciar todos los artículos de tu carrito? Esta acción no se puede deshacer."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => {
                    setIsClearCartConfirmPopupOpen(false);
                    if (currentOrderId) { 
                        setCurrentOrderId(null); 
                    }
                    proceedingToNextStepRef.current = false; 
                }}>{currentOrderId ? 'No, Volver al Carrito' : 'Cancelar'}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={currentOrderId ? handleConfirmClearCartAndFinalize : () => { clearCart(); setIsClearCartConfirmPopupOpen(false); proceedingToNextStepRef.current = false; setCurrentOrderId(null);}}
                  className={currentOrderId ? "bg-primary hover:bg-primary/90" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"}
                >
                  {currentOrderId ? 'Sí, Confirmar y Vaciar' : 'Sí, Vaciar Carrito'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </div>
    </div>
  );
}
