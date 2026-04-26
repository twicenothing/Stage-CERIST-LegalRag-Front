import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useModal } from "@/hooks/use-modal";
import { useSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { RiAddLine, RiRobot2Line, RiSearchLine } from "@remixicon/react";
import Logo from "../Logo";
import ChatHistory from "./ChatHistory";
import { ChatSession } from "@/types/globals";
import { Link, useLocation } from "react-router-dom";

interface ChatSidebarProps extends React.ComponentProps<typeof Sidebar> {
    sessionId: ChatSession["id"];
}

const ChatSidebar = ({ sessionId, ...props }: ChatSidebarProps) => {
    const session = useSession();
    const isLoggedIn = !!session.data;
    const { pathname } = useLocation();
    const { toggle } = useModal();
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTrigger />
                <Link
                    to="/"
                    className="py-4 px-2 w-fit group-data-[collapsible=icon]:hidden"
                >
                    <Logo />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup
                    className={cn("group-data-[collapsible=icon]:hidden")}
                >
                    <SidebarMenu>
                        <SidebarMenuItem className="group">
                            <SidebarMenuButton asChild>
                                <Link className="group" to={pathname}>
                                    <RiAddLine className="size-5 mr-2" />
                                    <span>New chat</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="group">
                            <SidebarMenuButton
                                onClick={() =>
                                    toggle("SEARCH_CHAT_SESSIONS", {
                                        currentSessionId: sessionId,
                                    })
                                }
                            >
                                <RiSearchLine className="size-5 mr-2" />
                                <span>Search chats</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <ChatHistory />
            </SidebarContent>
            {!isLoggedIn && (
                <SidebarFooter>
                    <SidebarMenuButton
                        asChild
                        tooltip="Create your own assistant"
                    >
                        <Link to="/">
                            <RiRobot2Line />{" "}
                            <span>Create your own assistant</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarFooter>
            )}
        </Sidebar>
    );
};

export default ChatSidebar;
