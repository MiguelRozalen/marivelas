// src/lib/actions.ts
"use server";

import { contactFormSchema } from "@/lib/schemas";
import type { Candle } from "@/types"; // Assuming Candle type is defined in types
import { PAGE_SIZE } from "@/config/pagination";

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

// Mock data for infinite scroll
const ALL_CANDLES_DATA: Candle[] = [
  { id: '1', name: 'Sueño de Vainilla', price: 15.99, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'vanilla candle', description: 'Una relajante mezcla de rica vainilla y crema dulce.' },
  { id: '2', name: 'Campos de Lavanda', price: 18.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'lavender fields', description: 'Lavanda calmante para relajar tus sentidos.' },
  { id: '3', name: 'Explosión Cítrica', price: 16.75, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'citrus burst', description: 'Una mezcla estimulante de naranja, limón y pomelo.' },
  { id: '4', name: 'Sándalo Serenidad', price: 22.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'sandalwood peace', description: 'Sándalo terroso para una atmósfera tranquila.' },
  { id: '5', name: 'Felicidad de Rosa', price: 19.99, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'rose petal', description: 'Fragancia romántica y delicada de pétalos de rosa.' },
  { id: '6', name: 'Brisa Oceánica', price: 17.25, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'ocean breeze', description: 'Fresco y vigorizante, como un paseo junto al mar.' },
  { id: '7', name: 'Bosque Encantado', price: 20.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'forest pine', description: 'Aroma fresco de pino y musgo de roble.' },
  { id: '8', name: 'Coco Paraíso', price: 17.75, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'coconut beach', description: 'Dulce coco tropical con un toque de vainilla.' },
  { id: '9', name: 'Jazmín Nocturno', price: 21.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'jasmine flower', description: 'Embriagador aroma de jazmín floreciendo en la noche.' },
  { id: '10', name: 'Manzana Canela', price: 16.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'apple cinnamon', description: 'Cálida mezcla de manzana horneada y canela especiada.' },
  { id: '11', name: 'Té Blanco y Jengibre', price: 18.75, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'white tea', description: 'Sofisticada infusión de té blanco con un toque de jengibre.' },
  { id: '12', name: 'Café Matutino', price: 19.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'coffee beans', description: 'Aroma estimulante de granos de café recién tostados.' },
  { id: '13', name: 'Menta Refrescante', price: 15.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'mint leaves', description: 'Fragancia pura y vigorizante de hojas de menta fresca.' },
  { id: '14', name: 'Higo Mediterráneo', price: 23.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'fig fruit', description: 'Dulce y terroso aroma de higos maduros del Mediterráneo.' },
  { id: '15', name: 'Ambar Sensual', price: 22.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'amber resin', description: 'Cálida y rica fragancia de ámbar con notas de almizcle.' },
  { id: '16', name: 'Vainilla Francesa', price: 16.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'french vanilla', description: 'Clásica vainilla con un toque sofisticado y cremoso.'},
  { id: '17', name: 'Bambú Verde', price: 19.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'green bamboo', description: 'Aroma limpio y fresco de hojas de bambú y hierba cortada.'},
  { id: '18', name: 'Pachulí Místico', price: 21.75, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'patchouli earth', description: 'Profundo y terroso pachulí con notas especiadas.'}
];

export async function fetchCandles(currentOffset: number): Promise<Candle[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  
  const newCandles = ALL_CANDLES_DATA.slice(currentOffset, currentOffset + PAGE_SIZE);
  return newCandles;
}

export async function getTotalCandlesCount(): Promise<number> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return ALL_CANDLES_DATA.length;
}
