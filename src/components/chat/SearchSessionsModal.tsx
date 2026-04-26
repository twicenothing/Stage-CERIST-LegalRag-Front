import { Button } from "@/components/ui/button";
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
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { RiSearchLine } from "@remixicon/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Spinner } from "../ui/spinner";
import { ChatSession } from "@/types/globals";
import { Link } from "react-router-dom";

const SearchSessionsModal = () => {
    const { isOpen, toggle, actionData } = useModal("SEARCH_CHAT_SESSIONS");
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearchValue] = useDebounceValue(searchValue, 500);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["chat-sessions-history-search", debouncedSearchValue],
            queryFn: ({ pageParam = 1 }) => {
                return getUserChatSessions(
                    pageParam as number,
                    10,
                    debouncedSearchValue,
                );
            },
            getNextPageParam: (
                lastPage: Pick<ChatSession, "id" | "title">[],
                allPages: Pick<ChatSession, "id" | "title">[][],
            ) => {
                return lastPage.length === 10 ? allPages.length + 1 : undefined;
            },
            initialPageParam: 1,
            enabled: isOpen("SEARCH_CHAT_SESSIONS"),
        });

    const sessions =
        data?.pages
            .flatMap((p) => p)
            .filter((s) => s.id !== actionData?.currentSessionId) || [];

    const handleDelete = (
        e: React.MouseEvent,
        sessionId: ChatSession["id"],
    ) => {
        e.preventDefault();
        e.stopPropagation();

        toggle("DELETE_SESSION_CONFIRMATION", {
            sessionId,
        });
    };

    return (
        <Dialog
            open={isOpen("SEARCH_CHAT_SESSIONS")}
            onOpenChange={() => toggle("SEARCH_CHAT_SESSIONS")}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Search sessions</DialogTitle>
                    <DialogDescription>
                        Search through your sessions history.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative">
                        <RiSearchLine className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search chats..."
                            className="pl-9"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <div className="h-75 overflow-y-auto space-y-2 pr-1">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <Spinner className="size-6" />
                            </div>
                        ) : sessions.length > 0 ? (
                            <>
                                {sessions.map((session) => (
                                    <Link
                                        key={session.id}
                                        to={`?sessionId=${session.id}`}
                                        onClick={() =>
                                            toggle("SEARCH_CHAT_SESSIONS")
                                        }
                                        className="flex items-center justify-between gap-2 rounded-lg border p-3 hover:bg-muted transition-colors"
                                    >
                                        <span className="font-medium truncate flex-1 text-left">
                                            {session.title}
                                        </span>
                                        <button
                                            className="shrink-0"
                                            onClick={(e) =>
                                                handleDelete(e, session.id)
                                            }
                                        >
                                            <HugeiconsIcon
                                                strokeWidth={2}
                                                className="size-4 text-destructive hover:text-destructive/80"
                                                icon={Delete02Icon}
                                            />
                                        </button>
                                    </Link>
                                ))}
                                {hasNextPage && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                    >
                                        {isFetchingNextPage
                                            ? "Loading..."
                                            : "Load more"}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                                <p>No sessions found</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SearchSessionsModal;
