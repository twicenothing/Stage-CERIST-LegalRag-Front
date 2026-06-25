import LoginForm from "@/components/auth/LoginForm";
import realisticImageUrl from "@/assets/realistic.png";
import { Scale } from "lucide-react";

const LoginPage = () => {
    return (
        <main className="relative grid h-svh overflow-hidden bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 lg:grid-cols-2">
            <header className="absolute left-6 top-6 z-10 flex items-center gap-2.5 text-neutral-950 sm:left-10 sm:top-8 lg:left-14 lg:text-white lg:drop-shadow-sm dark:text-neutral-50">
                <Scale className="size-6" strokeWidth={1.7} aria-hidden="true" />
                <span className="text-lg font-medium">JurIA</span>
            </header>

            <section
                className="relative hidden h-svh min-h-0 overflow-hidden border-r border-neutral-200/70 dark:border-neutral-800 lg:block"
                aria-label="Identité visuelle de JurIA"
            >
                <img
                    src={realisticImageUrl}
                    alt=""
                    className="absolute inset-0 size-full object-cover object-center"
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/55" />
                <p className="absolute bottom-8 left-14 text-xs font-medium text-white/85 drop-shadow-sm">
                    Justice · Clarté · Confiance
                </p>
            </section>

            <section className="flex h-svh min-h-0 items-center justify-center px-6 pt-16 sm:px-10 lg:px-14 lg:pt-0">
                <div className="w-full max-w-[27rem]">
                    <LoginForm />
                </div>
            </section>
        </main>
    );
};

export default LoginPage;
