
"use client";

import { useEffect, useRef, useActionState } from "react";
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
import { AVAILABLE_CANDLE_COLORS } from "@/config/candle-options";


const initialState: ContactFormState = {
  message: "",
  status: "idle",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Enviando..." : "Enviar Mensaje"}
    </Button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const productInquiry = searchParams.get("product");
  const colorInquiryParams = searchParams.get("color");
  
  const formRef = useRef<HTMLFormElement>(null);

  const getColorNameByValue = (value: string | null) => {
    if (!value) return "";
    const foundColor = AVAILABLE_CANDLE_COLORS.find(c => c.value === value);
    return foundColor ? foundColor.name : value;
  }
  const colorInquiry = getColorNameByValue(colorInquiryParams);


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
      subject: productInquiry 
        ? `Consulta sobre ${productInquiry}${colorInquiry ? ` (Color: ${colorInquiry})` : ""}` 
        : "",
      message: "",
      product: productInquiry || "",
      color: colorInquiryParams || "", // Store the value, not the display name
    },
  });

  useEffect(() => {
    const currentProduct = searchParams.get("product");
    const currentColorParam = searchParams.get("color");
    const currentColorName = getColorNameByValue(currentColorParam);

    if (currentProduct) {
      setValue("subject", `Consulta sobre ${currentProduct}${currentColorName ? ` (Color: ${currentColorName})` : ""}`);
      setValue("product", currentProduct);
    } else {
       setValue("subject", "");
       setValue("product", "");
    }
    if (currentColorParam) {
        setValue("color", currentColorParam);
    } else {
        setValue("color", "");
    }
  }, [searchParams, setValue]);
  
  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "¡Éxito!",
        description: state.message,
        variant: "default",
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />, 
      });
      reset(); 
      formRef.current?.reset(); 
      // Clear search params from URL manually if desired, or navigate
      // window.history.replaceState({}, '', window.location.pathname + '#contact');
    } else if (state.status === "error" && state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, reset]);

  const getFieldError = (fieldName: keyof z.infer<typeof contactFormSchema>) => {
    return state.errors?.[fieldName]?.[0] || errors[fieldName]?.message;
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-card-foreground">Ponte en Contacto</CardTitle>
        <CardDescription className="text-muted-foreground">
          {productInquiry 
            ? `¿Tienes alguna pregunta sobre ${productInquiry}${colorInquiry ? ` (Color: ${colorInquiry})` : ''}? Completa el formulario.`
            : "Nos encantaría saber de ti. ¡Envíanos un mensaje!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          {productInquiry && <input type="hidden" {...register("product")} />}
          {colorInquiryParams && <input type="hidden" {...register("color")} />}
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">Nombre Completo</Label>
            <Input id="name" placeholder="Tu Nombre" {...register("name")} aria-invalid={!!getFieldError("name")} />
            {getFieldError("name") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("name")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="tu@email.com" {...register("email")} aria-invalid={!!getFieldError("email")} />
            {getFieldError("email") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("email")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-card-foreground">Asunto</Label>
            <Input id="subject" placeholder="Pregunta sobre..." {...register("subject")} aria-invalid={!!getFieldError("subject")} />
            {getFieldError("subject") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("subject")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-card-foreground">Mensaje</Label>
            <Textarea id="message" placeholder="Tu mensaje aquí..." rows={5} {...register("message")} aria-invalid={!!getFieldError("message")} />
            {getFieldError("message") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("message")}</p>}
          </div>
          
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
