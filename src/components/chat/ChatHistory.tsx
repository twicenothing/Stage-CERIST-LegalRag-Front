import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getUserChatSessions,
  archiveChatSession,
  unarchiveChatSession,
  getChatSession,
} from "@/services/chat-sessions";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Link, useSearchParams } from "react-router-dom";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { useSession } from "@/lib/auth";
import {
  MoreHorizontalIcon,
  ArchiveIcon,
  TrashIcon,
  ArchiveRestoreIcon,
  ChevronRightIcon,
  FileDownIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ChatSessionPdfExport from "./ChatSessionPdfExport";
import { printChatSessionPdf } from "@/lib/chat-session-pdf";

const SessionList = ({ archived }: { archived: boolean }) => {
  const [searchParams] = useSearchParams();
  const currentSessionId = searchParams.get("sessionId");
  const { data: session } = useSession();
  const userKey = session?.user.id || session?.user.email;
  const { toggle } = useModal();
  const queryClient = useQueryClient();
  const [exportingSessionId, setExportingSessionId] = useState<string | null>(null);

  const { data: allSessions, isLoading } = useQuery({
    queryKey: ["chat-sessions-history", userKey],
    queryFn: getUserChatSessions,
    enabled: !!userKey,
  });

  const sessions = allSessions?.filter((s) => !!s.archived === archived) || [];

  const archiveMutation = useMutation({
    mutationFn: (id: string) =>
      archived ? unarchiveChatSession(id) : archiveChatSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions-history"] });
      toast.success(archived ? "Session désarchivée" : "Session archivée");
    },
    onError: () => toast.error("Une erreur s'est produite"),
  });

  const handleExportPdf = async (chatSession: { id: string; title: string }) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      toast.error("Autorisez les fenêtres pop-up pour exporter le PDF.");
      return;
    }

    setExportingSessionId(chatSession.id);

    try {
      const session = await getChatSession(chatSession.id, { fresh: true });
      const messages = session.chatMessages ?? [];

      if (messages.length === 0) {
        printWindow.close();
        toast.error("Aucune conversation à exporter.");
        return;
      }

      const title = session.title || chatSession.title || "Conversation JurIA";
      const contentHtml = renderToStaticMarkup(
        <ChatSessionPdfExport messages={messages} title={title} />,
      );

      printChatSessionPdf({
        contentHtml,
        printWindow,
        title,
      });
    } catch {
      printWindow.close();
      toast.error("Impossible d'exporter cette conversation.");
    } finally {
      setExportingSessionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <p className="text-center py-4 text-xs text-muted-foreground">
        {archived ? "Aucun chat archivé" : "Aucun historique disponible"}
      </p>
    );
  }

  return (
    <>
      <SidebarMenu>
        {sessions.map((chatSession) => {
          const isActive = chatSession.id === currentSessionId;
          return (
            <SidebarMenuItem className="group" key={chatSession.id}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={cn(
                  isActive
                    ? "border border-border text-foreground font-medium bg-secondary/50"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex items-center justify-between w-full gap-0">
                  <Link
                    title={chatSession.title}
                    className="flex-1 truncate peer m-0"
                    to={`?sessionId=${chatSession.id}`}
                  >
                    {chatSession.title}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-opacity shrink-0 p-1 rounded-sm focus:opacity-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveMutation.mutate(chatSession.id);
                        }}
                      >
                        {archived ? (
                          <>
                            <ArchiveRestoreIcon className="mr-2 size-4" />
                            Désarchiver
                          </>
                        ) : (
                          <>
                            <ArchiveIcon className="mr-2 size-4" />
                            Archiver
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={exportingSessionId === chatSession.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleExportPdf(chatSession);
                        }}
                      >
                        <FileDownIcon className="mr-2 size-4" />
                        {exportingSessionId === chatSession.id
                          ? "Préparation..."
                          : "Exporter PDF"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle("DELETE_SESSION_CONFIRMATION", {
                            sessionId: chatSession.id,
                            sessionTitle: chatSession.title,
                            fromSearch: false,
                          });
                        }}
                      >
                        <TrashIcon className="mr-2 size-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </>
  );
};

const ChatHistory = () => {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      <Collapsible defaultOpen={false} className="group/collapsible">
        <SidebarGroup className="group-data-[collapsible=icon]:hidden pb-0">
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="hover:bg-muted/50 cursor-pointer w-full flex items-center">
              Archivés
              <ChevronRightIcon className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <div className="pt-2">
              <SessionList archived={true} />
            </div>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>

      <SidebarGroup className="group-data-[collapsible=icon]:hidden pt-2 border-t">
        <SidebarGroupLabel>Historique</SidebarGroupLabel>
        <SessionList archived={false} />
      </SidebarGroup>
    </div>
  );
};

export default ChatHistory;
