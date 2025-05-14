// src/lib/actions.ts
"use server";

import { contactFormSchema } from "@/lib/schemas";

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
    subject: formData.get("subject") || "Consulta de Pedido", // Default subject if not provided
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

  // In a real application, you would send an email or save to a database here.
  console.log("Formulario de Contacto/Pedido Recibido:");
  console.log("Nombre:", name);
  console.log("Email:", email);
  console.log("Asunto:", subject);
  console.log("Mensaje (Detalles del Pedido):", message);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: "¡Tu consulta/pedido ha sido enviado con éxito! Nos pondremos en contacto contigo pronto.",
    status: "success",
  };
}
