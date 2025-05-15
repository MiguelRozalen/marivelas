
// src/lib/actions.ts
"use server";

import { contactFormSchema } from "@/lib/schemas";
import type { Candle } from "@/types"; 
import { PAGE_SIZE } from "@/config/pagination";
import catalogData from '@/config/catalog.json';
import { SELLER_EMAIL } from "@/config/constants";

export type ContactFormState = {
  message: string;
  status: "success" | "error" | "idle";
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
    orderId?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const orderId = formData.get("orderId") as string;
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || `Nuevo Pedido - ID: ${orderId}`, 
    message: formData.get("message"),
    orderId: orderId,
  });

  if (!validatedFields.success) {
    return {
      message: "Error de validación. Por favor, revisa tus datos.",
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject: formSubject, message: formMessage } = validatedFields.data;
  
  // The actual subject line for the email the *customer* will send.
  const customerEmailSubject = `Nuevo Pedido - ID: ${orderId}`;

  // Simulate API delay for the server action itself
  await new Promise(resolve => setTimeout(resolve, 700));

  // --- Simulación de lo que el sistema interno haría (ej. guardar en DB, notificar admin) ---
  // Esto NO es el correo que el cliente envía, sino lo que tu sistema haría.
  const internalNotificationData = {
    to: SELLER_EMAIL, 
    from: "sistema@marivelas.com", // System's internal email
    subject: `Notificación: Pedido ${orderId} listo para confirmación manual por cliente`,
    htmlBody: `
      <h1>Pedido ${orderId} Pendiente de Confirmación por Cliente</h1>
      <p>Un cliente ha llegado al paso de confirmar su pedido mediante el envío de un correo manual.</p>
      <p><strong>ID del Pedido:</strong> ${orderId}</p>
      <p><strong>Datos del Cliente (proporcionados en el formulario):</strong></p>
      <ul>
        <li><strong>Nombre:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      <hr/>
      <h2>Detalles del Pedido (como se mostraron al cliente):</h2>
      <pre style="white-space: pre-wrap; font-family: monospace;">${formMessage}</pre>
      <hr/>
      <p><em>Este es un mensaje automático del sistema. El cliente ha sido instruido para enviar un correo a ${SELLER_EMAIL} con el asunto "${customerEmailSubject}" y este resumen.</em></p>
    `,
  };

  console.log("--- INICIO SIMULACIÓN NOTIFICACIÓN INTERNA DEL SISTEMA ---");
  console.log("Para (admin):", internalNotificationData.to);
  console.log("De (sistema):", internalNotificationData.from);
  console.log("Asunto (notificación interna):", internalNotificationData.subject);
  console.log("Cuerpo del correo (HTML para admin):");
  console.log(internalNotificationData.htmlBody);
  console.log("--- FIN SIMULACIÓN NOTIFICACIÓN INTERNA ---");
  
  // Message for the user, confirming they need to take the next step.
  const successMessage = `¡Casi listo! Tu resumen de pedido (ID: ${orderId}) ha sido preparado.
  \n\nPOR FAVOR, SIGUE ESTOS PASOS CRUCIALES:
  1. Revisa las instrucciones que se mostraron en el popup.
  2. Envía un correo electrónico a ${SELLER_EMAIL} con:
     - Asunto: ${customerEmailSubject}
     - Cuerpo: Copia y pega el resumen del pedido y tus datos de contacto.
  3. Realiza el pago por Bizum como se te indicará por correo.
  \nTu pedido NO se procesará hasta que recibamos tu correo y el pago por Bizum.
  \n¡Gracias!`;

  return {
    message: successMessage,
    status: "success",
  };
}

const ALL_CANDLES_DATA: Candle[] = catalogData.candles;

export async function fetchCandles(currentOffset: number): Promise<Candle[]> {
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  const newCandles = ALL_CANDLES_DATA.slice(currentOffset, currentOffset + PAGE_SIZE);
  return newCandles;
}

export async function getTotalCandlesCount(): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return ALL_CANDLES_DATA.length;
}
