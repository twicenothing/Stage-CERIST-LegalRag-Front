import { Button } from "@/components/ui/button";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { getUserChatSessions } from "@/services/chat-sessions";
import { cn } from "@/lib/utils";
import { RiDeleteBin7Line } from "@remixicon/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { ChatSession } from "@/types/globals";
import { Link } from "react-router-dom";

const ChatHistory = () => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["chat-sessions-history"],
            queryFn: ({ pageParam = 1 }) =>
                getUserChatSessions(pageParam as number, 10),
            getNextPageParam: (
                lastPage: Pick<ChatSession, "id" | "title">[],
                allPages: Pick<ChatSession, "id" | "title">[][],
            ) => {
                return lastPage.length === 10 ? allPages.length + 1 : undefined;
            },
            initialPageParam: 1,
        });

    const pastChatSessions = data?.pages.flatMap((page) => page) || [];

    return (
        <SidebarGroup
            className={cn(
                "group-data-[collapsible=icon]:hidden",
                isLoading && "h-full",
            )}
        >
            <SidebarGroupLabel>History</SidebarGroupLabel>
            {!isLoading ? (
                <>
                    {pastChatSessions.length > 0 ? (
                        <>
                            <SidebarMenu>
                                {pastChatSessions.map((chatSession) => (
                                    <SidebarMenuItem
                                        className="group"
                                        key={chatSession.id}
                                    >
                                        <SidebarMenuButton asChild>
                                            <div className="flex items-center justify-between w-full gap-0">
                                                <Link
                                                    title={chatSession.title}
                                                    className="flex-1 truncate peer m-0"
                                                    to={`?sessionId=${chatSession.id}`}
                                                >
                                                    {chatSession.title}
                                                </Link>
                                                <button className="opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-opacity shrink-0">
                                                    <RiDeleteBin7Line className="h-4 w-4 text-destructive" />
                                                </button>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                            {hasNextPage && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full mt-2 text-muted-foreground"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? (
                                        <Spinner className="size-7" />
                                    ) : (
                                        "Load more"
                                    )}
                                </Button>
                            )}
                        </>
                    ) : (
                        <p className="text-center py-8 text-sm">
                            No chat history available
                        </p>
                    )}
                </>
            ) : (
                <div className="h-full flex justify-center items-center">
                    <Spinner className="size-9" />
                </div>
            )}
        </SidebarGroup>
    );
};

export default ChatHistory;
