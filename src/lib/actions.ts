
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
    product?: string[];
  };
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
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message, product } = validatedFields.data;

  // In a real application, you would send an email or save to a database here.
  // For this example, we'll just log the data.
  console.log("Contact Form Submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  if (product) {
    console.log("Inquiring about product:", product)
  }
  console.log("Subject:", subject || (product ? `Inquiry about ${product}` : "General Inquiry"));
  console.log("Message:", message);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: "Your message has been sent successfully! We will get back to you soon.",
    status: "success",
  };
}
