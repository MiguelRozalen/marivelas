
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Dirección de correo electrónico inválida." }),
  subject: z.string().optional(), // Subject is now pre-filled and read-only in form
  message: z.string().optional(), // Message is now pre-filled and read-only in form
  orderId: z.string().min(1, { message: "ID de pedido es requerido." }), // Added orderId
});
