// src/components/contact-form.tsx
"use client";

import { useEffect, useRef, useActionState, useTransition } from "react"; // Updated imports
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

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

// SubmitButton now takes isPending as a prop
function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
      {isPending ? "Enviando..." : "Enviar Consulta"}
    </Button>
  );
}

interface ContactFormProps {
  orderSummary?: string; // Optional pre-filled message for order summary
  onFormSubmitSuccess?: () => void; // Optional callback on success
}

export default function ContactForm({ orderSummary, onFormSubmitSuccess }: ContactFormProps) {
  // useActionState now returns [state, formAction, isActionPending]
  const [state, formAction, isActionPending] = useActionState(submitContactForm, initialState);
  const [, startTransition] = useTransition(); // We only need startTransition from useTransition
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit, // react-hook-form's handleSubmit
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: orderSummary ? "Detalles del Pedido" : "Consulta General",
      message: orderSummary || "",
    },
  });

  // Update message if orderSummary prop changes (e.g. cart updates)
  useEffect(() => {
    if (orderSummary) {
      setValue("message", orderSummary);
      setValue("subject", "Consulta sobre Pedido");
    }
  }, [orderSummary, setValue]);
  
  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "¡Éxito!",
        description: state.message,
        variant: "default",
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />, 
      });
      reset({ name: "", email: "", subject: orderSummary ? "Consulta sobre Pedido" : "Consulta General", message: orderSummary || "" }); 
      formRef.current?.reset();
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } else if (state.status === "error" && state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, reset, orderSummary, onFormSubmitSuccess]);

  const getFieldError = (fieldName: keyof z.infer<typeof contactFormSchema>) => {
    return state.errors?.[fieldName]?.[0] || errors[fieldName]?.message;
  };

  // Wrapper for react-hook-form's handleSubmit to work with useActionState
  const handleFormSubmit: SubmitHandler<z.infer<typeof contactFormSchema>> = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    // Wrap the call to formAction in startTransition
    startTransition(() => {
      (formAction as (payload: FormData) => void)(formData);
    });
  };


  return (
    <Card className="max-w-2xl mx-auto shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-card-foreground">
          {orderSummary ? "Completa tus Datos para el Pedido" : "Ponte en Contacto"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {orderSummary 
            ? "Revisa los detalles de tu pedido en el mensaje y completa tu información para enviar la consulta."
            : "Nos encantaría saber de ti. ¡Envíanos un mensaje!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Use react-hook-form's handleSubmit */}
        <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
            <Input id="subject" placeholder={orderSummary ? "Consulta sobre Pedido" : "Pregunta sobre..."} {...register("subject")} aria-invalid={!!getFieldError("subject")} />
            {getFieldError("subject") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("subject")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-card-foreground">Mensaje {orderSummary ? "(Detalles del Pedido)" : ""}</Label>
            <Textarea 
              id="message" 
              placeholder={orderSummary ? "Revisa aquí tu pedido..." : "Tu mensaje aquí..."} 
              rows={orderSummary ? 8 : 5} 
              {...register("message")} 
              aria-invalid={!!getFieldError("message")}
              readOnly={!!orderSummary} // Make it read-only if pre-filled from cart
            />
            {getFieldError("message") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("message")}</p>}
          </div>
          
          {/* Pass isActionPending to SubmitButton */}
          <SubmitButton isPending={isActionPending} />
        </form>
      </CardContent>
    </Card>
  );
}
