
// src/components/contact-form.tsx
"use client";

import { useEffect, useRef, useActionState, useTransition } from "react";
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

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
      {isPending ? "Enviando..." : "Confirmar Envío de Pedido por Email"}
    </Button>
  );
}

interface ContactFormProps {
  orderSummary: string; 
  orderId: string;
  onFormSubmitSuccess?: () => void;
}

export default function ContactForm({ orderSummary, orderId, onFormSubmitSuccess }: ContactFormProps) {
  const [state, formAction, isActionPending] = useActionState(submitContactForm, initialState);
  const [, startTransition] = useTransition();
  const { toast } = useToast();
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
      subject: `Nuevo Pedido - ID: ${orderId}`,
      message: orderSummary,
      orderId: orderId,
    },
  });

  useEffect(() => {
    setValue("message", orderSummary);
    setValue("subject", `Nuevo Pedido - ID: ${orderId}`);
    setValue("orderId", orderId);
  }, [orderSummary, orderId, setValue]);
  
  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "¡Éxito!",
        description: state.message, // This message now comes from the server action with instructions.
        variant: "default",
        duration: 10000, // Keep success message longer
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />, 
      });
      // Don't reset the form here as the user needs to copy the details.
      // The parent component (CartDisplay) will handle clearing cart and navigation.
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
  }, [state, toast, onFormSubmitSuccess]);

  const getFieldError = (fieldName: keyof z.infer<typeof contactFormSchema>) => {
    return state.errors?.[fieldName]?.[0] || errors[fieldName]?.message;
  };

  const handleFormSubmit: SubmitHandler<z.infer<typeof contactFormSchema>> = (data) => {
    const formData = new FormData();
    // Ensure orderId is explicitly added if not directly part of schema/form controls in UI
    formData.append("orderId", data.orderId || orderId); 
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    startTransition(() => {
      (formAction as (payload: FormData) => void)(formData);
    });
  };


  return (
    <Card className="max-w-2xl mx-auto shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-card-foreground">
          Confirma tus Datos y Envía el Resumen del Pedido
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Por favor, completa tus datos de contacto. El resumen del pedido se enviará tal como se muestra.
          Recuerda seguir las instrucciones del popup para enviar el correo y realizar el pago.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Hidden input for orderId, though it's also passed in formData directly */}
          <input type="hidden" {...register("orderId")} value={orderId} />
          
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
            <Label htmlFor="subject" className="text-card-foreground">Asunto (para tus registros)</Label>
            <Input id="subject" {...register("subject")} aria-invalid={!!getFieldError("subject")} readOnly className="bg-muted/50" />
            {getFieldError("subject") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("subject")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-card-foreground">Resumen del Pedido (para tus registros)</Label>
            <Textarea 
              id="message" 
              rows={12} 
              {...register("message")} 
              aria-invalid={!!getFieldError("message")}
              readOnly 
              className="bg-muted/50"
            />
            {getFieldError("message") && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{getFieldError("message")}</p>}
          </div>
          
          <SubmitButton isPending={isActionPending} />
        </form>
      </CardContent>
    </Card>
  );
}
