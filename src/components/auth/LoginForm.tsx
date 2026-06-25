import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Scale } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email({ message: "Veuillez saisir une adresse e-mail valide." }),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const fieldClassName =
  "h-14 rounded-full border-neutral-200 bg-neutral-100/80 px-6 text-neutral-950 shadow-none placeholder:text-neutral-500 focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-800";

const translateAuthError = (message: string, fallback: string) => {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("invalid email") ||
    normalizedMessage.includes("incorrect password") ||
    normalizedMessage.includes("invalid credentials")
  ) {
    return "Adresse e-mail ou mot de passe incorrect.";
  }

  if (
    normalizedMessage.includes("network error") ||
    normalizedMessage.includes("failed to fetch")
  ) {
    return "Connexion au serveur impossible. Veuillez réessayer.";
  }

  return message || fallback;
};

const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<{ detail?: string }>(error)) {
    const message = error.response?.data?.detail;
    return message ? translateAuthError(message, fallback) : fallback;
  }

  if (error instanceof Error) {
    return translateAuthError(error.message, fallback);
  }

  return fallback;
};

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      queryClient.clear();
      await login(values.email, values.password);
      navigate("/", { replace: true });
    } catch (error: unknown) {
      toast.error(
        getAuthErrorMessage(error, "Adresse e-mail ou mot de passe incorrect."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-9 text-center">
      <div className="flex flex-col items-center">
        <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          <Scale className="size-6" strokeWidth={1.4} aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-medium leading-tight text-neutral-950 dark:text-neutral-50">
          Connexion
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Accédez à votre espace juridique
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    aria-label="Adresse e-mail"
                    placeholder="Adresse e-mail"
                    className={fieldClassName}
                    {...field}
                    onChange={(event) =>
                      field.onChange(event.target.value.trim())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    aria-label="Mot de passe"
                    placeholder="Mot de passe"
                    className={fieldClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            isLoading={isSubmitting}
            type="submit"
            className="mt-2 h-14 w-full rounded-full bg-neutral-950 text-white shadow-none hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Se connecter
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
