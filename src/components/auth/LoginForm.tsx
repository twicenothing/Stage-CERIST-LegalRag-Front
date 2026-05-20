import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { login, register as registerUser } from "@/services/auth";
import logoUrl from "@/assets/CERIST.png";

const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const registerSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const LoginForm = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await login(values.email, values.password);
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Invalid email or password",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      await registerUser(values);
      await login(values.email, values.password);
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to create account",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "register") {
    return (
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(handleRegister)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <img src={logoUrl} alt="CERIST Logo" className="h-28 w-auto object-contain mb-6" />
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Join LegalRag in a few seconds
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={registerForm.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.trim())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button isLoading={isSubmitting} type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 shadow-sm rounded-full">
              Create account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary underline-offset-4 hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(handleLogin)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <img src={logoUrl} alt="CERIST Logo" className="h-28 w-auto object-contain mb-6" />
          <h1 className="text-2xl font-bold">Bienvenue à Légal DjazairIA</h1>
          <p className="text-sm text-muted-foreground">
Connectez-vous avec votre adresse e-mail et votre mot de passe          </p>
        </div>
        <div className="grid gap-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="m@example.com"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.trim())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button isLoading={isSubmitting} type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 shadow-sm rounded-full">
            Se connecter
          </Button>

        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
