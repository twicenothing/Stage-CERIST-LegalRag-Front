import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
    return (
        <div className="px-4 py-6 w-full min-h-svh grid grid-cols-1 items-center">
            <div className="w-full max-w-md mx-auto">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
