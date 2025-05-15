// src/lib/actions.ts
"use server";

import { contactFormSchema } from "@/lib/schemas";
import type { Candle } from "@/types"; 
import { PAGE_SIZE } from "@/config/pagination";
import catalogData from '@/config/catalog.json';

export type ContactFormState = {
  message: string;
  status: "success" | "error" | "idle";
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || "Consulta de Pedido", 
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      message: "Error de validación. Por favor, revisa tus datos.",
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // --- Simulación de envío de correo electrónico ---
  const emailData = {
    to: "mikelangel1993@gmail.com", // Target email address
    from: "noreply@marivelas.com", // Sender email, configure with your email service
    subject: `Nuevo Pedido/Consulta de Marivelas: ${subject}`,
    htmlBody: `
      <h1>Nuevo Pedido/Consulta Recibida</h1>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <hr/>
      <h2>Detalles del Pedido/Mensaje:</h2>
      <pre style="white-space: pre-wrap; font-family: monospace;">${message}</pre>
      <hr/>
      <p><em>Este es un mensaje automático. Contactar al cliente a través de su email: ${email}</em></p>
    `,
  };

  console.log("--- INICIO SIMULACIÓN ENVÍO DE CORREO ---");
  console.log("Para:", emailData.to);
  console.log("De:", emailData.from);
  console.log("Asunto:", emailData.subject);
  console.log("Cuerpo del correo (HTML):");
  console.log(emailData.htmlBody);
  console.log("--- FIN SIMULACIÓN ENVÍO DE CORREO ---");
  
  // **NOTA IMPORTANTE:**
  // La implementación real del envío de correos requiere un servicio externo.
  // Aquí es donde integrarías un servicio como Resend, SendGrid, Nodemailer, etc.
  // Por ejemplo, con Resend (asegúrate de instalar 'resend' y configurar RESEND_API_KEY en .env):
  // try {
  //   const { Resend } = await import('resend');
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send(emailData);
  //   console.log("Correo electrónico enviado con éxito.");
  // } catch (error) {
  //   console.error("Error al enviar correo:", error);
  //   // Consider how to handle email sending failures. For now, we assume success for the user form.
  // }

  return {
    message: "¡Tu consulta/pedido ha sido enviado con éxito! Nos pondremos en contacto contigo pronto.",
    status: "success",
  };
}

const ALL_CANDLES_DATA: Candle[] = catalogData.candles;

export async function fetchCandles(currentOffset: number): Promise<Candle[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  
  const newCandles = ALL_CANDLES_DATA.slice(currentOffset, currentOffset + PAGE_SIZE);
  return newCandles;
}

export async function getTotalCandlesCount(): Promise<number> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return ALL_CANDLES_DATA.length;
}
