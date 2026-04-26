import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Logout01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSession } from "@/lib/auth";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router-dom";

export function AccountDetailsSection() {
    const { data: session } = useSession();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

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
                            value={session?.user.name || ""}
                            disabled
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={session?.user.email || ""}
                            disabled
                            type="email"
                        />
                    </div>
                </CardContent>
                <CardFooter className=" pt-6 border-t border-card">
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full"
                    >
                        <HugeiconsIcon
                            strokeWidth={2}
                            icon={Logout01Icon}
                            className="mr-3 size-4"
                        />
                        Log out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
