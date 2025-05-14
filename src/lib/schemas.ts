import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Dirección de correo electrónico inválida." }),
  subject: z.string().min(5, { message: "El asunto debe tener al menos 5 caracteres."}).optional(),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
  // product and color are removed as they will be part of the message if it's an order inquiry
});
