import React, { useEffect, useState, useRef } from "react";
import { SearchIcon, XIcon, Loader2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface DictionaryResult {
    title: string;
    extract: string;
    type?: string;
    description?: string;
}

export function TextSelectionDictionary() {
    const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
    const [selectedText, setSelectedText] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DictionaryResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
                if (!isResultOpen) {
                    setIsMenuOpen(false);
                }
                return;
            }

            const text = selection.toString().trim();
            if (text.length === 0 || text.split(/\s+/).length > 5) {
                // Ignore empty or very long selections (more than 5 words)
                if (!isResultOpen) {
                    setIsMenuOpen(false);
                }
                return;
            }

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Check if selection is within our app area to avoid triggering on external iframes/inputs
            // Simple heuristic: if we have a rect with width, it's valid.
            if (rect.width > 0) {
                setSelectedText(text);
                setSelectionRect(rect);
                if (!isResultOpen) {
                    setIsMenuOpen(true);
                }
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            // Click outside the menu and result box closes everything
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                resultRef.current && !resultRef.current.contains(e.target as Node)
            ) {
                setIsMenuOpen(false);
                setIsResultOpen(false);
            }
        };

        document.addEventListener("selectionchange", handleSelectionChange);
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            document.removeEventListener("selectionchange", handleSelectionChange);
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [isResultOpen]);

    const handleDefine = async () => {
        setIsMenuOpen(false);
        setIsResultOpen(true);
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Use French Wikipedia API
            const response = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selectedText)}`);
            if (response.status === 404) {
                setError("Aucune définition trouvée pour ce terme.");
                setLoading(false);
                return;
            }
            if (!response.ok) {
                throw new Error("Erreur de réseau");
            }
            const data = await response.json();
            setResult({
                title: data.title,
                extract: data.extract,
                description: data.description
            });
        } catch (err) {
            setError("Erreur lors de la recherche de la définition.");
        } finally {
            setLoading(false);
        }
    };

    if (!selectionRect) return null;

    const topPosition = selectionRect.top + window.scrollY;
    const leftPosition = selectionRect.left + window.scrollX + (selectionRect.width / 2);

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            <AnimatePresence>
                {isMenuOpen && !isResultOpen && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute pointer-events-auto shadow-lg shadow-black/10 border bg-background text-foreground rounded-md px-1 py-1 flex items-center gap-1"
                        style={{
                            top: `${Math.max(10, topPosition - 40)}px`,
                            left: `${Math.max(10, leftPosition)}px`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDefine();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium hover:bg-muted rounded transition-colors"
                        >
                            <SearchIcon className="size-4" />
                            Définir
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isResultOpen && (
                    <motion.div
                        ref={resultRef}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute pointer-events-auto shadow-xl shadow-black/10 border bg-background text-foreground rounded-xl w-80 max-h-[400px] flex flex-col overflow-hidden"
                        style={{
                            top: `${Math.max(10, topPosition + 25)}px`,
                            left: `${Math.max(10, leftPosition)}px`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                            <div className="flex items-center gap-2">
                                <SearchIcon className="size-4" />
                                <span className="font-semibold text-sm truncate max-w-[200px]">
                                    {selectedText}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsResultOpen(false)}
                                className="p-1 hover:bg-muted rounded-full transition-colors"
                            >
                                <XIcon className="size-4" />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto text-sm leading-relaxed">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-6 gap-3 text-muted-foreground">
                                    <Loader2Icon className="size-6 animate-spin text-primary" />
                                    <span>Recherche en cours...</span>
                                </div>
                            ) : error ? (
                                <div className="text-destructive text-center py-4">{error}</div>
                            ) : result ? (
                                <div className="space-y-2">
                                    <h4 className="font-bold text-base">{result.title}</h4>
                                    {result.description && (
                                        <p className="text-xs text-muted-foreground italic mb-2">
                                            {result.description}
                                        </p>
                                    )}
                                    <p>{result.extract}</p>
                                    <a 
                                        href={`https://fr.wikipedia.org/wiki/${encodeURIComponent(result.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-3 text-xs text-primary hover:underline"
                                    >
                                        Voir sur Wikipédia →
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
