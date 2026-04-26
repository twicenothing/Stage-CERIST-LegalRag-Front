import { ChatSession } from "@/types/globals";
import { create } from "zustand";

const initialModalState = {
    DELETE_SESSION_CONFIRMATION: false,
    SEARCH_CHAT_SESSIONS: false,
};

type Modal = keyof typeof initialModalState;

export interface ModalDataMap {
    DELETE_SESSION_CONFIRMATION: {
        sessionId: string;
    };

    SEARCH_CHAT_SESSIONS: {
        currentSessionId: ChatSession["id"];
    };
}

// Store data as a partial record keyed by the modal type
type ScopedActionData = {
    [K in Modal]?: ModalDataMap[K] | null;
};

type ModalStore = {
    modalState: typeof initialModalState;
    actionData: ScopedActionData;
    timeoutId: NodeJS.Timeout | null;
    toggle: <K extends Modal>(type: K, data?: ModalDataMap[K]) => void;
    isOpen: (type: Modal) => boolean;
};

const modalStore = create<ModalStore>((set, get) => ({
    modalState: initialModalState,
    actionData: {},
    timeoutId: null,
    toggle: (type, data) => {
        const currentState = get();
        const isCurrentlyOpen = currentState.modalState[type];

        if (currentState.timeoutId) {
            clearTimeout(currentState.timeoutId);
        }

        if (isCurrentlyOpen) {
            // Closing
            set({
                modalState: { ...currentState.modalState, [type]: false },
                // We keep the data for animation purposes
            });

            // Optional: Clear data after timeout if robust cleanup is needed,
            // but for this issue, we just need to ensure *other* modals don't read it.
            // Since data is keyed by 'type', other modals won't see it anyway.
            // So we can skip the complex timeout cleanup for now or keep it simplistic.
        } else {
            // Opening
            set((state) => ({
                modalState: { ...state.modalState, [type]: true },
                actionData: {
                    ...state.actionData,
                    [type]: data ?? null,
                },
                timeoutId: null,
            }));
        }
    },
    isOpen: (type) => get().modalState[type],
}));

// Update hook to accept a specific modal type for data scoping
const useModal = <K extends Modal>(scope?: K) => {
    const modalState = modalStore((state) => state.modalState);
    const globalActionData = modalStore((state) => state.actionData);
    const toggle = modalStore((state) => state.toggle);
    const isOpen = modalStore((state) => state.isOpen);

    // If scope is provided, return ONLY the relevant data.
    // If no scope, return null (or all? safest is null to force scoping for data access)
    // Legacy support: logic might break if we return null here for calls that didn't pass scope.
    // But since we are updating all calls, it is fine.

    const actionData = scope
        ? (globalActionData[scope] as ModalDataMap[K] | null)
        : null;

    return { modalState, actionData, toggle, isOpen };
};

export { useModal };
