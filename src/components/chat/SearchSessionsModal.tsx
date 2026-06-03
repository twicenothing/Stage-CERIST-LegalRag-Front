import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { getUserChatSessions } from "@/services/chat-sessions";
import { RiSearchLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Spinner } from "../ui/spinner";
import { Link } from "react-router-dom";
import { useSession } from "@/lib/auth";

const SearchSessionsModal = () => {
    const { isOpen, toggle, actionData } = useModal("SEARCH_CHAT_SESSIONS");
    const { data: session } = useSession();
    const userKey = session?.user.id || session?.user.email;
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearchValue] = useDebounceValue(searchValue, 300);

    const { data: allSessions, isLoading } = useQuery({
        queryKey: ["chat-sessions-history", userKey],
        queryFn: getUserChatSessions,
        enabled: !!userKey && isOpen("SEARCH_CHAT_SESSIONS"),
    });

    const sessions = useMemo(() => {
        if (!allSessions) return [];
        let filtered = allSessions.filter((s) => s.id !== actionData?.currentSessionId);
        if (debouncedSearchValue) {
            const lowerQuery = debouncedSearchValue.toLowerCase();
            filtered = filtered.filter(s => s.title.toLowerCase().includes(lowerQuery));
        }
        return filtered;
    }, [allSessions, debouncedSearchValue, actionData?.currentSessionId]);

    return (
        <Dialog
            open={isOpen("SEARCH_CHAT_SESSIONS")}
            onOpenChange={() => toggle("SEARCH_CHAT_SESSIONS")}
        >
            <DialogContent className="w-[95vw] max-w-md overflow-hidden flex flex-col p-6">
                <DialogHeader className="shrink-0">
                    <DialogTitle>Rechercher des sessions</DialogTitle>
                    <DialogDescription>
                        Recherchez dans l'historique de vos sessions.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 flex flex-col overflow-hidden min-h-0 w-full">
                    <div className="relative shrink-0 w-full">
                        <RiSearchLine className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher des chats..."
                            className="pl-9 w-full"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[50vh] overflow-y-auto overflow-x-hidden space-y-2 pr-1 w-full min-h-0">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center py-4">
                                <Spinner className="size-6" />
                            </div>
                        ) : sessions.length > 0 ? (
                            <div className="flex flex-col gap-2 w-full">
                                {sessions.map((session) => (
                                    <Link
                                        key={session.id}
                                        to={`?sessionId=${session.id}`}
                                        onClick={() =>
                                            toggle("SEARCH_CHAT_SESSIONS")
                                        }
                                        className="flex flex-row items-center justify-between gap-2 rounded-lg border p-3 hover:bg-muted transition-colors w-full overflow-hidden"
                                    >
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <span className="font-medium truncate block text-left w-full text-sm">
                                                {session.title}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted-foreground">
                                <p>Aucune session trouvée</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SearchSessionsModal;
