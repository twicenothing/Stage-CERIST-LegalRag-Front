import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Logout01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountDetailsSection() {
    const { data: session, isPending } = authClient.useSession();
    const navigate = useNavigate();
    const [name, setName] = useState(session?.user?.name || "");
    const [email, setEmail] = useState(session?.user?.email || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setEmail(session.user.email || "");
        }
    }, [session]);

    const handleUpdate = async () => {
        try {
            setIsUpdating(true);
            const { error } = await authClient.updateUser({
                name: name,
            });

            if (error) {
                toast.error(error.message || "Failed to update profile");
            } else {
                toast.success("Profile updated successfully");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        navigate("/login");
                    },
                },
            });
        } catch (err) {
            toast.error("Failed to log out");
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isPending) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 pl-1">
                    <Skeleton className="size-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                </div>

                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </CardContent>
                    <CardFooter className="pt-6 border-t border-card">
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pl-1">
                <HugeiconsIcon
                    strokeWidth={2}
                    icon={UserIcon}
                    className="text-primary size-4"
                />
                <h2 className="text-sm font-semibold">Account</h2>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={email} disabled type="email" />
                    </div>
                    <Button
                        onClick={handleUpdate}
                        disabled={isUpdating || name === session?.user?.name}
                        isLoading={isUpdating}
                        className="w-full"
                    >
                        Save Changes
                    </Button>
                </CardContent>
                <CardFooter className=" pt-6 border-t border-card">
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        isLoading={isLoggingOut}
                        className="w-full"
                    >
                        {!isLoggingOut && (
                            <HugeiconsIcon
                                strokeWidth={2}
                                icon={Logout01Icon}
                                className="mr-3 size-4"
                            />
                        )}
                        Log out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
