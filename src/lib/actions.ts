
"use server";

import { contactFormSchema } from "@/lib/schemas";
import { AVAILABLE_CANDLE_COLORS } from "@/config/candle-options";

export type ContactFormState = {
  message: string;
  status: "success" | "error" | "idle";
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
    product?: string[];
    color?: string[];
  };
};

// Helper to get color name from value for logging/display
const getColorNameByValue = (value: string | null | undefined): string => {
  if (!value) return "";
  const foundColor = AVAILABLE_CANDLE_COLORS.find(c => c.value === value);
  return foundColor ? foundColor.name : value; // fallback to value if not found
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    product: formData.get("product"),
    color: formData.get("color"), // Get color value
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject: formSubject, message, product, color } = validatedFields.data;

  // In a real application, you would send an email or save to a database here.
  // For this example, we'll just log the data.
  console.log("Contact Form Submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  
  let finalSubject = formSubject;
  const colorDisplayName = getColorNameByValue(color);

  if (product) {
    console.log("Inquiring about product:", product);
    if (color) { // color value
      console.log("Selected color (value):", color);
      console.log("Selected color (name):", colorDisplayName);
    }
    // Ensure subject reflects product and color if not already set by client
    if (!finalSubject) {
      finalSubject = `Consulta sobre ${product}${colorDisplayName ? ` (Color: ${colorDisplayName})` : ""}`;
    }
  } else if (!finalSubject) {
    finalSubject = "Consulta General";
  }
  
  console.log("Subject:", finalSubject);
  console.log("Message:", message);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: "¡Tu mensaje ha sido enviado con éxito! Nos pondremos en contacto contigo pronto.",
    status: "success",
  };
}
