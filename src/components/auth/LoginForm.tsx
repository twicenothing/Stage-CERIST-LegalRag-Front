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
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail } from "@hugeicons/core-free-icons";
import { useCountdown } from "usehooks-ts";
import { sendSignInOtp, verifySignInOtp } from "@/services/auth";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

export const loginSchema = z.object({
    email: z.email({
        message: "Please enter a valid email address.",
    }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const [pendingEmail, setPendingEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
        },
    });

    const [count, { startCountdown, resetCountdown }] = useCountdown({
        countStart: 60,
        intervalMs: 1000,
    });

    const handleSendOtp = async (values: LoginFormValues) => {
        try {
            setIsSending(true);
            await sendSignInOtp(values.email);
            setPendingEmail(values.email);
            resetCountdown();
            startCountdown();
            toast.success("Verification code sent to your email.");
        } catch (error: any) {
            toast.error(error?.message || "Failed to send code");
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        setIsVerifying(true);
        try {
            await verifySignInOtp(pendingEmail, verificationCode);

            navigate("/", { replace: true });
        } catch (error: any) {
            toast.error(error?.message || "Invalid or expired code");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setIsSending(true);
            await sendSignInOtp(pendingEmail);
            toast.success("Verification code resent.");
            resetCountdown();
            startCountdown();
        } catch (error: any) {
            toast.error(error?.message || "Failed to resend code");
        } finally {
            setIsSending(false);
        }
    };

    if (pendingEmail) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <HugeiconsIcon
                        strokeWidth={2}
                        icon={Mail}
                        className="size-6 text-primary"
                    />
                </div>
                <h1 className="text-2xl font-bold">Check your email</h1>
                <p className="text-muted-foreground text-sm">
                    We sent a 6-digit verification code to
                    <br />
                    <span className="font-medium text-foreground">
                        {pendingEmail}
                    </span>
                </p>
                <div className="flex flex-col items-center w-full space-y-4 pt-2">
                    <InputOTP
                        maxLength={6}
                        value={verificationCode}
                        onChange={(value) => setVerificationCode(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <Button
                        onClick={handleVerifyOtp}
                        isLoading={isVerifying}
                        disabled={verificationCode.length !== 6}
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </div>
                <div className="flex w-full flex-col gap-2 pt-2">
                    <Button
                        disabled={isSending || count > 0}
                        isLoading={isSending}
                        onClick={handleResendOtp}
                        className="w-full"
                        variant="outline"
                    >
                        {count > 0 ? `Resend Code (${count}s)` : "Resend Code"}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setPendingEmail("");
                            setVerificationCode("");
                        }}
                        className="w-full"
                    >
                        Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSendOtp)}
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome to Zamili</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email to sign in or create an account
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="m@example.com"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value.trim(),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        isLoading={isSending}
                        type="submit"
                        className="w-full"
                    >
                        Continue with Email
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default LoginForm;
