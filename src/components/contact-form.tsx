
"use client";

import { useEffect, useRef, useActionState } from "react";
// useFormStatus is still needed for the SubmitButton
import { useFormStatus } from "react-dom"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm, type ContactFormState } from "@/lib/actions";
import { contactFormSchema } from "@/lib/schemas";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const initialState: ContactFormState = {
  message: "",
  status: "idle",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const productInquiry = searchParams.get("product");

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: productInquiry ? `Inquiry about ${productInquiry}` : "",
      message: "",
      product: productInquiry || "",
    },
  });

  useEffect(() => {
    if (productInquiry) {
      setValue("subject", `Inquiry about ${productInquiry}`);
      setValue("product", productInquiry);
    }
  }, [productInquiry, setValue]);
  
  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "Success!",
        description: state.message,
        variant: "default",
        // Adding an icon for success
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />, 
      });
      reset(); // Reset form fields on successful submission
      formRef.current?.reset(); // Also reset the native form element
    } else if (state.status === "error" && state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, reset]);

  // For errors from useFormState (server-side validation)
  const getFieldError = (fieldName: keyof z.infer<typeof contactFormSchema>) => {
    return state.errors?.[fieldName]?.[0] || errors[fieldName]?.message;
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Get in Touch</CardTitle>
        <CardDescription>
          {productInquiry 
            ? `Have a question about ${productInquiry}? Fill out the form below.`
            : "We'd love to hear from you. Send us a message!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          {productInquiry && <input type="hidden" {...register("product")} />}
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your Name" {...register("name")} aria-invalid={!!getFieldError("name")} />
            {getFieldError("name") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("name")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="your@email.com" {...register("email")} aria-invalid={!!getFieldError("email")} />
            {getFieldError("email") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("email")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Question about..." {...register("subject")} aria-invalid={!!getFieldError("subject")} />
            {getFieldError("subject") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("subject")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Your message here..." rows={5} {...register("message")} aria-invalid={!!getFieldError("message")} />
            {getFieldError("message") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("message")}</p>}
          </div>
          
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
