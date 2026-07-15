/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiPlus, FiSend, FiTrash2 } from 'react-icons/fi';
import { Button, Card, Popup, TextArea } from 'pixel-retroui';
import BG from '@assets/chat-bg.gif';
import Scroll from '@components/Scroll';
import { THEME } from '@pages/Theme';

function extractList(raw) {
    if (raw == null) return [];
    if (Array.isArray(raw)) return raw;
    const d = raw.data;
    if (Array.isArray(d)) return d;
    if (d && typeof d === 'object') {
        for (const k of ['messages', 'chats', 'items', 'data']) {
            if (Array.isArray(d[k])) return d[k];
        }
    }
    if (Array.isArray(raw.messages)) return raw.messages;
    if (Array.isArray(raw.chats)) return raw.chats;
    return [];
}

function chatIdFromRow(row) {
    if (row == null) return null;
    const oid = row._id && typeof row._id === 'object' ? row._id.$oid : null;
    const id = row.id ?? oid ?? (typeof row._id === 'string' ? row._id : null);
    return id != null ? String(id) : null;
}

function normalizeConversations(raw) {
    const list = extractList(raw);
    return list.map((row, index) => {
        const id = chatIdFromRow(row) ?? `chat-${index}`;
        const title =
            row?.title ?? row?.name ?? row?.label ?? row?.subject ?? `Chat ${index + 1}`;
        return { id, title: String(title), raw: row };
    });
}

function messagesUrl(di, resolvedChatOid) {
    const base = di.api.get('ai-messages');
    if (!resolvedChatOid) return base;
    const q = new URLSearchParams({ chat_id: String(resolvedChatOid) });
    return `${base}?${q.toString()}`;
}

function apiChatOid(di, chats, listId) {
    if (listId == null || listId === '') return null;
    const chat = chats.find((c) => c.id === listId);
    const rawId = chat?.raw?._id;
    if (rawId !== undefined && rawId !== null) {
        const r = di.resolveOid(rawId);
        if (r != null && String(r).trim() !== '') return String(r);
    }
    return String(listId);
}

function pickActiveChatIdAfterRefresh(di, newList, preferredActiveId, currentId, prevChats) {
    if (!newList.length) return null;
    if (preferredActiveId) {
        const p = newList.find((c) => c.id === preferredActiveId);
        if (p) return p.id;
    }
    if (currentId != null && currentId !== '') {
        const exact = newList.find((c) => c.id === currentId);
        if (exact) return exact.id;
        const prev = Array.isArray(prevChats) ? prevChats.find((c) => c.id === currentId) : undefined;
        const fromPrev =
            prev != null ? di.resolveOid(prev.raw?._id) ?? chatIdFromRow(prev.raw) : null;
        const targetOid =
            fromPrev != null && String(fromPrev).trim() !== ''
                ? String(fromPrev)
                : String(currentId);
        const byOid = newList.find((c) => {
            const r = di.resolveOid(c.raw?._id);
            return r != null && String(r) === targetOid;
        });
        if (byOid) return byOid.id;
    }
    return newList[0].id;
}

const CHAT_ACTIVE_ID_KEY = 'chat_active_id';

function renderAsLiteralMarkdownText(text) {
    return String(text ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

function lsJson(key) {
    try {
        const s = localStorage.getItem(key);
        if (s == null) return null;
        return JSON.parse(s);
    } catch {
        return null;
    }
}

function providerKey(p) {
    if (!p) return '';
    const oid = p._id && typeof p._id === 'object' ? p._id.$oid : null;
    return String(oid ?? p.id ?? p._id ?? p.code ?? '');
}

function pickChatTitleFromMessageResponse(res) {
    if (res == null || typeof res !== 'object') return null;
    const d = res.data ?? res;
    if (d == null || typeof d !== 'object') return null;
    const chat = d.chat ?? (chatIdFromRow(d) && (d.title != null || d.name != null) ? d : null);
    if (chat && typeof chat === 'object') {
        const id = chatIdFromRow(chat);
        const title = chat.title ?? chat.name;
        if (id && title != null && String(title).trim() !== '') {
            return { id: String(id), title: String(title) };
        }
    }
    const cid = d.chat_id ?? d.chatId;
    const t = d.chat_title ?? d.chatTitle ?? d.title;
    if (cid != null && t != null && String(t).trim() !== '') {
        return { id: String(cid), title: String(t) };
    }
    return null;
}

function normalizeChatRows(raw) {
    const list = extractList(raw);
    return list.map((row, index) => {
        const text = row?.message ?? row?.text ?? row?.body ?? row?.content ?? '';
        const from = String(row?.from ?? row?.role ?? row?.sender ?? '').toLowerCase();
        let isUser;
        if (row?.isUser === true) isUser = true;
        else if (row?.isUser === false) isUser = false;
        else if (
            ['assistant', 'ai', 'bot', 'model', 'system', 'agent', 'gpt', 'claude'].includes(from)
        ) {
            isUser = false;
        } else if (from === 'user' || from === 'human') {
            isUser = true;
        } else {
            isUser = false;
        }
        const t = row?.time ?? row?.created_at ?? row?.createdAt ?? row?.timestamp;
        let time = Date.now();
        if (t != null) {
            if (typeof t === 'number') {
                time = t < 1e12 ? t * 1000 : t;
            } else if (typeof t === 'object' && t.$date) {
                const d = t.$date.$numberLong ?? t.$date;
                const parsed = typeof d === 'number' ? d : Number(d);
                if (Number.isFinite(parsed)) time = parsed;
            } else {
                const parsed = new Date(t).getTime();
                time = Number.isFinite(parsed) ? parsed : Date.now();
            }
        }
        const id = chatIdFromRow(row) ?? `${time}-${index}`;
        return { id, text, isUser, time, additional_data: row?.additional_data };
    });
}

function sortMessagesChronological(rows) {
    return [...rows].sort((a, b) => {
        const ta = Number(a.time) || 0;
        const tb = Number(b.time) || 0;
        if (ta !== tb) return ta - tb;
        return String(a.id).localeCompare(String(b.id));
    });
}

function serverRowsEchoUserText(rows, text) {
    const t = String(text).trim();
    return rows.some((m) => m.isUser && String(m.text).trim() === t);
}

function mergeOptimisticUserRow(rows, pending) {
    if (!pending) return { rows, echoed: true };
    if (serverRowsEchoUserText(rows, pending.text)) {
        return { rows, echoed: true };
    }
    return {
        rows: [
            ...rows,
            {
                id: pending.localId,
                text: pending.text,
                isUser: true,
                time: pending.time,
            },
        ],
        echoed: false,
    };
}

function formatMessageTimeFull(ms) {
    return new Date(ms).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const mdTextFlow =
    'w-full text-sm leading-normal text-white break-words [overflow-wrap:anywhere]';

const MessageBubble = React.memo(({ message, isUser, mdEnabled, mdComponents }) => {
    const full = formatMessageTimeFull(message.time);
    const t = Number(message.time);
    const iso = Number.isFinite(t) ? new Date(t).toISOString() : undefined;

    const senderLabel = isUser
        ? 'You'
        : message?.additional_data?.model
            ? message.additional_data.model
            : 'System';

    const theme = isUser ? THEME.SUCCESS_DARK : THEME.SECONDARY;
    const accent = isUser ? 'text-amber-200' : 'text-cyan-200';

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
            <Card
                {...theme}
                className="max-w-[90%] w-fit flex flex-col gap-2 p-0 overflow-hidden"
            >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-black/40 px-3 py-2 text-xs">
                    <span className={`font-bold uppercase tracking-widest ${accent}`}>
                        {senderLabel}
                    </span>
                    <time dateTime={iso} className="text-[11px] text-white/60 tabular-nums">
                        {full}
                    </time>
                </div>
                <div className="chat-message-body flex flex-col gap-3 break-words px-4 py-3 text-sm [overflow-wrap:anywhere]">
                    {mdEnabled ? (
                        <div className="flex flex-col gap-y-3">
                            <Markdown components={mdComponents} remarkPlugins={[remarkGfm]} skipHtml>
                                {renderAsLiteralMarkdownText(message.text)}
                            </Markdown>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap break-words text-sm leading-normal text-white [overflow-wrap:anywhere]">
                            {message.text}
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';

const sidebarSelectClassName =
    'scheme-dark w-full px-3 py-2 text-sm font-bold text-white bg-black/60 border-2 border-white/20 ' +
    'focus:border-white/60 focus:outline-none ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ' +
    '[&>option]:bg-zinc-900 [&>option]:text-white';

const SideBar = ({
    models,
    providers,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    mdEnabled,
    setMdEnabled,
    chats,
    chatsLoading,
    activeChatId,
    onSelectChat,
    onNewChat,
    onDeleteChat,
}) => {
    return (
        <Card
            {...THEME.SECONDARY}
            className="flex h-full w-72 shrink-0 flex-col gap-3 p-4 overflow-hidden"
        >
            <div className="flex flex-col gap-0 pb-2 border-b-2 border-white/10">
                <span className="text-xl font-bold text-white">Artificial</span>
                <span className="text-xl font-bold text-cyan-300 text-right">Stupidity</span>
            </div>

            <Card {...THEME.ACTIVE} className="flex flex-col gap-3 p-3">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                    Model
                </span>
                <div className="flex flex-col gap-1">
                    <label htmlFor="chat-provider" className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                        Provider
                    </label>
                    <select
                        id="chat-provider"
                        className={sidebarSelectClassName}
                        value={providerKey(selectedProvider) || ''}
                        onChange={(e) => {
                            const provider = providers.find((p) => providerKey(p) === e.target.value);
                            setSelectedProvider(provider || null);
                        }}
                    >
                        <option value="" disabled>
                            {providers.length === 0 ? 'Loading…' : 'Select provider'}
                        </option>
                        {providers.map((provider) => (
                            <option key={providerKey(provider)} className="capitalize" value={providerKey(provider)}>
                                {provider.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="chat-model" className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                        Model
                    </label>
                    <select
                        id="chat-model"
                        className={sidebarSelectClassName}
                        value={selectedModel?.code || ''}
                        onChange={(e) => {
                            const model = models.find((m) => m.code === e.target.value);
                            setSelectedModel(model || null);
                        }}
                        disabled={!selectedProvider}
                    >
                        <option value="" disabled>
                            {models.length === 0 ? 'Loading…' : 'Select model'}
                        </option>
                        {models.map((model) => (
                            <option key={model.code} value={model.code} className="capitalize">
                                {model.code.split('/').pop().replaceAll('-', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <label
                    htmlFor="chat-md-enabled"
                    className="flex cursor-pointer items-center gap-2 select-none text-sm text-white"
                >
                    <input
                        id="chat-md-enabled"
                        type="checkbox"
                        checked={mdEnabled}
                        onChange={(e) => setMdEnabled(e.target.checked)}
                        className="size-4 accent-cyan-400"
                    />
                    <span>Render markdown</span>
                </label>
            </Card>

            <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                    Chats
                </span>
                <Button
                    {...THEME.SUCCESS_DARK}
                    type="button"
                    onClick={onNewChat}
                    className="px-3 py-1 flex items-center gap-1"
                    aria-label="Create new chat"
                    title="New chat"
                >
                    <FiPlus className="text-lg" aria-hidden />
                    <span className="text-sm">New</span>
                </Button>
            </div>

            <div className="flex-1 overflow-hidden">
                <Scroll className="h-full">
                    <div className="flex flex-col gap-2 w-full">
                        {chatsLoading && (
                            <p className="py-2 text-sm text-white/70">Loading…</p>
                        )}
                        {!chatsLoading && chats.length === 0 && (
                            <p className="py-2 text-sm text-white/50">No chats yet.</p>
                        )}
                        {!chatsLoading &&
                            chats.map((c) => {
                                const active = c.id === activeChatId;
                                return (
                                    <div
                                        key={c.id}
                                        className="flex items-stretch gap-1 w-full"
                                    >
                                        <Button
                                            {...(active ? THEME.SUCCESS : THEME.ACTIVE)}
                                            type="button"
                                            onClick={() => onSelectChat(c.id)}
                                            className="flex-1 text-left px-3 py-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                                            title={c.title}
                                        >
                                            {c.title}
                                        </Button>
                                        <Button
                                            {...THEME.DANGER}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteChat(c.id);
                                            }}
                                            className="px-2 py-2 shrink-0 flex items-center justify-center"
                                            title="Delete chat"
                                        >
                                            <FiTrash2 className="text-sm" aria-hidden />
                                        </Button>
                                    </div>
                                );
                            })}
                    </div>
                </Scroll>
            </div>
        </Card>
    );
};

const ChatInput = ({ inputRef, input, setInput, onSend, canSend, activeChatId, waiting }) => {
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 96);
            textarea.style.height = newHeight + 'px';
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (canSend && input.trim()) onSend();
        }
    };

    const placeholder = !activeChatId
        ? 'Choose a chat in the sidebar…'
        : waiting
            ? 'Waiting for response…'
            : 'Message…  Enter to send · Shift+Enter new line';

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (canSend && input.trim()) onSend();
            }}
            className="w-full"
        >
            <Card {...THEME.ACTIVE} className="flex items-center gap-2 p-1.5">
                <TextArea
                    {...THEME.SEAMLESS}
                    ref={(el) => {
                        textareaRef.current = el;
                        if (inputRef) inputRef.current = el;
                    }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!canSend}
                    placeholder={placeholder}
                    className="grow resize-none bg-transparent text-white placeholder:text-white/40 h-9 max-h-24 py-1.5 leading-tight focus:outline-0!"
                    rows={1}
                />
                <Button
                    {...(canSend && input.trim() ? THEME.SUCCESS_DARK : THEME.BLOCKED)}
                    type="submit"
                    disabled={!canSend || !input.trim()}
                    className="px-2.5 py-1 flex items-center justify-center shrink-0 self-stretch"
                    aria-label="Send message"
                >
                    <FiSend className="text-base" />
                </Button>
            </Card>
        </form>
    );
};

const Chat = ({
    messages,
    input,
    setInput,
    onSend,
    scrollRef,
    inputRef,
    chatLoading,
    waiting,
    mdEnabled,
    activeChatId,
}) => {
    const canSend = !waiting && !!activeChatId;

    const mdComponents = useMemo(() => ({
        pre({ children }) {
            return (
                <pre className="chat-code-block w-full overflow-x-auto whitespace-pre rounded border-2 border-lime-500/40 bg-black/80 p-3 text-lime-200">
                    {children}
                </pre>
            );
        },
        code({ node, className, children, ...props }) {
            const isBlock = /language-/.test(className || '') || (node?.position && String(children).includes('\n'));
            if (!isBlock) {
                return (
                    <code
                        className="chat-code-block inline break-words [overflow-wrap:anywhere] whitespace-pre-wrap align-baseline rounded border border-lime-500/50 bg-black/80 px-1.5 py-0.5 font-bold text-lime-200"
                        {...props}
                    >
                        {children}
                    </code>
                );
            }
            const lang = className?.replace('language-', '') || '';
            return (
                <div className="flex w-full flex-col gap-1 overflow-x-auto">
                    {lang && <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-cyan-300 select-none">{lang}</span>}
                    <code className="chat-code-block block w-full whitespace-pre" {...props}>
                        {children}
                    </code>
                </div>
            );
        },
        p({ children }) {
            return <p className={`${mdTextFlow} whitespace-pre-wrap`}>{children}</p>;
        },
        ul({ children }) {
            return <ul className={`flex list-disc list-outside flex-col gap-2 pl-5 ${mdTextFlow}`}>{children}</ul>;
        },
        ol({ children }) {
            return <ol className={`flex list-decimal list-outside flex-col gap-2 pl-5 ${mdTextFlow}`}>{children}</ol>;
        },
        li({ children, node }) {
            const classNames = node?.properties?.className ?? [];
            const isTask = Array.isArray(classNames) && classNames.includes('task-list-item');
            if (isTask) {
                return (
                    <li className="list-none flex w-full items-start gap-2 break-words [overflow-wrap:anywhere] [&>input]:shrink-0 [&>p]:w-full [&>p]:flex-1">
                        {children}
                    </li>
                );
            }
            return (
                <li className="marker:font-bold marker:text-cyan-400/90 list-item w-full break-words [overflow-wrap:anywhere]">
                    <div className="w-full">{children}</div>
                </li>
            );
        },
        strong({ children }) {
            return <strong className="font-bold text-white">{children}</strong>;
        },
        em({ children }) {
            return <em className="italic text-white/90">{children}</em>;
        },
        h1({ children }) {
            return <h1 className="w-full break-words text-xl font-bold text-white">{children}</h1>;
        },
        h2({ children }) {
            return <h2 className="w-full break-words text-lg font-bold text-white">{children}</h2>;
        },
        h3({ children }) {
            return <h3 className="w-full break-words text-sm font-bold uppercase tracking-wide text-cyan-200">{children}</h3>;
        },
        blockquote({ children }) {
            return (
                <blockquote className={`w-full border-l-4 border-cyan-400/70 bg-white/5 py-2 pl-3 italic ${mdTextFlow}`}>
                    {children}
                </blockquote>
            );
        },
        a({ children, href }) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="break-words [overflow-wrap:anywhere] font-bold text-cyan-300 underline decoration-cyan-400 underline-offset-4 hover:text-cyan-200"
                >
                    {children}
                </a>
            );
        },
        input({ type, checked, disabled }) {
            if (type !== 'checkbox') return <input type={type} disabled={disabled} />;
            return (
                <input
                    type="checkbox"
                    checked={Boolean(checked)}
                    readOnly
                    aria-readonly="true"
                    tabIndex={-1}
                    className="size-4 shrink-0 rounded border border-slate-500 bg-slate-900 accent-green-500 pointer-events-none"
                />
            );
        },
        table({ children }) {
            return (
                <div className="w-full overflow-x-auto rounded border-2 border-white/20 bg-black/30">
                    <table className="w-full border-collapse text-sm leading-normal text-white">
                        {children}
                    </table>
                </div>
            );
        },
        thead({ children }) {
            return <thead className="border-b border-white/20 bg-white/10">{children}</thead>;
        },
        tbody({ children }) {
            return <tbody>{children}</tbody>;
        },
        tr({ children }) {
            return <tr className="border-b border-white/10 last:border-b-0">{children}</tr>;
        },
        th({ children }) {
            return (
                <th className="break-words [overflow-wrap:anywhere] px-3 py-2 text-left text-[0.8125rem] font-bold uppercase tracking-wide text-white">
                    {children}
                </th>
            );
        },
        td({ children }) {
            return (
                <td className="break-words [overflow-wrap:anywhere] px-3 py-2 align-top text-white/90">
                    {children}
                </td>
            );
        },
    }), []);

    return (
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
            <div
                ref={scrollRef}
                className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto px-4 py-4"
            >
                {!activeChatId && (
                    <Card {...THEME.ACTIVE} className="mx-auto mt-10 w-fit px-6 py-5 text-center text-white">
                        Select or create a chat in the sidebar.
                    </Card>
                )}
                {activeChatId && chatLoading && messages.length === 0 && (
                    <p className="text-sm text-cyan-200 px-2 py-1">Loading messages…</p>
                )}
                {activeChatId && !chatLoading && messages.length === 0 && (
                    <Card {...THEME.ACTIVE} className="mx-auto w-fit px-5 py-3 text-white">
                        No messages yet. Say something.
                    </Card>
                )}
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isUser={msg.isUser}
                        mdEnabled={mdEnabled}
                        mdComponents={mdComponents}
                    />
                ))}
                {waiting && (
                    <Card {...THEME.SECONDARY} className="w-fit px-3 py-2 text-cyan-200 text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <span className="inline-block size-2 bg-cyan-300 animate-pulse" aria-hidden />
                        Thinking…
                    </Card>
                )}
            </div>
            <div className="px-3 pb-2 pt-1 shrink-0">
                <ChatInput
                    inputRef={inputRef}
                    input={input}
                    setInput={setInput}
                    onSend={onSend}
                    canSend={canSend}
                    activeChatId={activeChatId}
                    waiting={waiting}
                />
            </div>
        </div>
    );
};

const Main = ({ di }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [models, setModels] = useState([]);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, _setSelectedProvider] = useState(() => lsJson('chat_provider'));
    const [selectedModel, _setSelectedModel] = useState(() => lsJson('chat_model'));
    const setSelectedProvider = useCallback((v) => {
        _setSelectedProvider((prev) => {
            const next = typeof v === 'function' ? v(prev) : v;
            if (next) localStorage.setItem('chat_provider', JSON.stringify(next));
            else localStorage.removeItem('chat_provider');
            return next;
        });
    }, []);
    const setSelectedModel = useCallback((v) => {
        _setSelectedModel((prev) => {
            const next = typeof v === 'function' ? v(prev) : v;
            if (next) localStorage.setItem('chat_model', JSON.stringify(next));
            else localStorage.removeItem('chat_model');
            return next;
        });
    }, []);
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [deleteChatTargetId, setDeleteChatTargetId] = useState(null);
    const [chatsLoading, setChatsLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [mdEnabled, setMdEnabled] = useState(() => {
        const stored = localStorage.getItem('chat_md_enabled');
        return stored !== null ? stored === 'true' : true;
    });
    const toggleMd = (val) => {
        setMdEnabled(val);
        localStorage.setItem('chat_md_enabled', String(val));
    };
    const scrollRef = useRef(null);
    const chatInputRef = useRef(null);
    const prevWaitingRef = useRef(false);
    const pollRef = useRef(null);
    const userMsgCountRef = useRef(0);
    const activeChatIdRef = useRef(null);
    const titleRefreshPendingRef = useRef(false);
    const pendingOptimisticUserRef = useRef(null);
    const chatsRef = useRef(chats);
    const activeConversationOidRef = useRef(null);

    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);

    useEffect(() => {
        chatsRef.current = chats;
    }, [chats]);

    const stopPolling = useCallback(() => {
        if (pollRef.current) {
            clearTimeout(pollRef.current);
            pollRef.current = null;
        }
    }, []);

    const settleMessagesFromServer = useCallback((rows, chatId) => {
        if (chatId !== activeChatIdRef.current) return;
        const pending = pendingOptimisticUserRef.current;
        let next;
        if (!pending || pending.chatId !== chatId) {
            next = rows;
        } else {
            const { rows: merged, echoed } = mergeOptimisticUserRow(rows, pending);
            if (echoed) pendingOptimisticUserRef.current = null;
            next = merged;
        }
        setMessages(sortMessagesChronological(next));
    }, []);

    const fetchMessagesForChat = useCallback(
        (chatId, showLoading = true) => {
            if (!chatId) {
                pendingOptimisticUserRef.current = null;
                setMessages([]);
                setChatLoading(false);
                return;
            }
            const p = pendingOptimisticUserRef.current;
            if (p && p.chatId !== chatId) {
                pendingOptimisticUserRef.current = null;
            }
            if (showLoading) setChatLoading(true);
            const apiOid = apiChatOid(di, chatsRef.current, chatId) ?? chatId;
            di.request.get({
                url: messagesUrl(di, apiOid),
                suppressMessageToast: true,
                callback: (res) => {
                    if (chatId !== activeChatIdRef.current) return;
                    const rows = normalizeChatRows(res);
                    settleMessagesFromServer(rows, chatId);
                    setChatLoading(false);
                },
                error_callback: () => {
                    if (chatId !== activeChatIdRef.current) return;
                    setChatLoading(false);
                },
            });
        },
        [di, settleMessagesFromServer],
    );

    const refreshChatsList = useCallback(
        (preferredActiveId = null) => {
            setChatsLoading(true);
            di.request.get({
                url: di.api.get('ai-chat'),
                suppressMessageToast: true,
                callback: (res) => {
                    const list = normalizeConversations(res);
                    setChats(list);
                    setChatsLoading(false);

                    const current = activeChatIdRef.current;
                    const pick = pickActiveChatIdAfterRefresh(
                        di,
                        list,
                        preferredActiveId,
                        current,
                        chatsRef.current,
                    );

                    setActiveChatId(pick);
                    if (pick) localStorage.setItem(CHAT_ACTIVE_ID_KEY, pick);
                    else localStorage.removeItem(CHAT_ACTIVE_ID_KEY);
                },
                error_callback: () => {
                    setChatsLoading(false);
                },
            });
        },
        [di],
    );

    const startPolling = useCallback(
        (sentCount) => {
            stopPolling();
            userMsgCountRef.current = sentCount;
            const POLL_INTERVAL = 2000;
            const poll = () => {
                pollRef.current = setTimeout(() => {
                    const cid = activeChatIdRef.current;
                    if (!cid) {
                        setWaiting(false);
                        return;
                    }
                    const apiOid = apiChatOid(di, chatsRef.current, cid) ?? cid;
                    di.request.get({
                        url: messagesUrl(di, apiOid),
                        suppressMessageToast: true,
                        callback: (res) => {
                            if (cid !== activeChatIdRef.current) return;
                            const rows = normalizeChatRows(res);
                            const sorted = sortMessagesChronological(rows);
                            settleMessagesFromServer(sorted, cid);
                            const systemMsgs = sorted.filter((m) => !m.isUser);
                            const last = sorted[sorted.length - 1];
                            const assistantArrived =
                                systemMsgs.length > userMsgCountRef.current ||
                                (Boolean(last) && !last.isUser && sorted.some((m) => m.isUser));
                            if (assistantArrived) {
                                stopPolling();
                                setWaiting(false);
                                pendingOptimisticUserRef.current = null;
                                if (titleRefreshPendingRef.current) {
                                    titleRefreshPendingRef.current = false;
                                    refreshChatsList();
                                }
                            } else {
                                poll();
                            }
                        },
                        error_callback: () => {
                            poll();
                        },
                    });
                }, POLL_INTERVAL);
            };
            poll();
        },
        [di, stopPolling, refreshChatsList, settleMessagesFromServer],
    );

    const createChat = useCallback(() => {
        di.request.post({
            url: di.api.get('ai-chat'),
            body: JSON.stringify({
                title: 'New chat',
                model: selectedModel?.code ?? null,
                provider: selectedProvider?.code ?? null,
            }),
            suppressMessageToast: true,
            callback: (res, meta) => {
                if (!meta?.ok) return;
                const newId = res?.chat_id ?? chatIdFromRow(res?.data) ?? null;
                refreshChatsList(newId ? String(newId) : null);
            },
        });
    }, [di, selectedModel, selectedProvider, refreshChatsList]);

    const deleteChat = useCallback(
        (chatId) => {
            const apiOid = apiChatOid(di, chatsRef.current, chatId) ?? chatId;
            const q = new URLSearchParams({ chat_id: String(apiOid) });
            di.request.delete({
                url: `${di.api.get('ai-chat')}?${q.toString()}`,
                suppressMessageToast: true,
                callback: (_res, meta) => {
                    if (!meta?.ok) return;
                    if (activeChatIdRef.current === chatId) {
                        activeConversationOidRef.current = null;
                        setActiveChatId(null);
                        setMessages([]);
                    }
                    refreshChatsList();
                },
            });
        },
        [di, refreshChatsList],
    );

    const requestDeleteChat = useCallback((chatId) => {
        setDeleteChatTargetId(chatId);
    }, []);

    const confirmDeleteChat = useCallback(() => {
        setDeleteChatTargetId((tid) => {
            if (tid) deleteChat(tid);
            return null;
        });
    }, [deleteChat]);

    const selectChat = useCallback((id) => {
        setActiveChatId(id);
        localStorage.setItem(CHAT_ACTIVE_ID_KEY, id);
    }, []);

    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    useEffect(() => {
        refreshChatsList(localStorage.getItem(CHAT_ACTIVE_ID_KEY) || null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        stopPolling();
        setWaiting(false);
        if (!activeChatId) {
            activeConversationOidRef.current = null;
            fetchMessagesForChat(null);
            return;
        }
        const oid = apiChatOid(di, chatsRef.current, activeChatId) ?? String(activeChatId);
        const oidKey = String(oid);
        if (activeConversationOidRef.current === oidKey) {
            return;
        }
        activeConversationOidRef.current = oidKey;
        setMessages([]);
        setChatLoading(true);
        fetchMessagesForChat(activeChatId, false);
    }, [activeChatId, di, fetchMessagesForChat, stopPolling]);

    useEffect(() => {
        di.request.get({
            url: di.api.get('ai-provider'),
            suppressMessageToast: true,
            callback: (res) => {
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                setProviders(list);
                if (list.length > 0) {
                    setSelectedProvider((prev) => {
                        const savedKey = providerKey(prev);
                        const match = savedKey ? list.find((p) => providerKey(p) === savedKey) : null;
                        return match || list[0];
                    });
                }
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!selectedProvider) return;
        const rawPid = di.resolveOid(selectedProvider._id) ?? selectedProvider.id;
        if (rawPid == null || String(rawPid).trim() === '') {
            setModels([]);
            return;
        }
        const pid = encodeURIComponent(String(rawPid));
        di.request.get({
            url: `${di.api.get('ai-models')}?filter[provider_id][1]=${pid}`,
            suppressMessageToast: true,
            callback: (res) => {
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                setModels(list);
                setSelectedModel((saved) => {
                    if (saved && list.some((m) => m.code === saved.code)) return saved;
                    return list[0] ?? null;
                });
            },
        });
    }, [di, selectedProvider, setSelectedModel]);

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, []);

    const isNearBottom = useCallback(() => {
        if (!scrollRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        return scrollHeight - scrollTop - clientHeight < 120;
    }, []);

    useEffect(() => {
        if (isNearBottom()) {
            scrollToBottom();
        }
    }, [messages, chatLoading, scrollToBottom, isNearBottom]);

    useEffect(() => {
        const wasWaiting = prevWaitingRef.current;
        prevWaitingRef.current = waiting;
        if (wasWaiting && !waiting && activeChatId) {
            requestAnimationFrame(() => {
                chatInputRef.current?.focus({ preventScroll: true });
            });
        }
    }, [waiting, activeChatId]);

    useEffect(() => {
        if (!chatLoading && messages.length > 0) {
            scrollToBottom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatLoading, messages.length]);

    const handleSend = useCallback(() => {
        const text = input.trim();
        const cid = activeChatId;
        if (!text || waiting || !cid) return;

        const systemCountBeforeSend = messages.filter((m) => !m.isUser).length;
        const isFirstUserMessage = messages.filter((m) => m.isUser).length === 0;

        const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const time = Date.now();
        pendingOptimisticUserRef.current = { localId, text, time, chatId: cid };
        setMessages((prev) => [...prev, { id: localId, text, isUser: true, time }]);

        setInput('');
        setWaiting(true);
        scrollToBottom();

        const chatOidForApi = apiChatOid(di, chatsRef.current, cid) ?? cid;

        di.request.post({
            url: di.api.get('ai-messages'),
            body: JSON.stringify({
                message: text,
                from: 'user',
                model: selectedModel?.code ?? null,
                provider: selectedProvider?.code ?? null,
                chat_id: chatOidForApi,
            }),
            suppressMessageToast: true,
            callback: (res, meta) => {
                if (meta?.ok) {
                    const patch = pickChatTitleFromMessageResponse(res);
                    if (patch && patch.id === cid) {
                        setChats((prev) =>
                            prev.map((c) => (c.id === patch.id ? { ...c, title: patch.title } : c)),
                        );
                    }
                    if (isFirstUserMessage) titleRefreshPendingRef.current = true;
                    startPolling(systemCountBeforeSend);
                } else {
                    pendingOptimisticUserRef.current = null;
                    setMessages((prev) => prev.filter((m) => m.id !== localId));
                    setInput(text);
                    setWaiting(false);
                }
            },
            error_callback: () => {
                pendingOptimisticUserRef.current = null;
                setMessages((prev) => prev.filter((m) => m.id !== localId));
                setInput(text);
                setWaiting(false);
            },
        });
    }, [input, activeChatId, waiting, messages, di, selectedModel, selectedProvider, scrollToBottom, startPolling]);

    return (
        <div
            className="flex h-full min-h-0 w-full flex-row overflow-hidden bg-cover bg-center bg-no-repeat gap-3 p-3"
            style={{ backgroundImage: `url(${BG})` }}
        >
            <SideBar
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                providers={providers}
                models={models}
                mdEnabled={mdEnabled}
                setMdEnabled={toggleMd}
                chats={chats}
                chatsLoading={chatsLoading}
                activeChatId={activeChatId}
                onSelectChat={selectChat}
                onNewChat={createChat}
                onDeleteChat={requestDeleteChat}
            />
            <Card {...THEME.ACTIVE} className="flex flex-1 min-h-0 flex-col overflow-hidden p-0 bg-black/40! backdrop-blur-md">
                <Chat
                    messages={messages}
                    input={input}
                    mdEnabled={mdEnabled}
                    setInput={setInput}
                    onSend={handleSend}
                    scrollRef={scrollRef}
                    inputRef={chatInputRef}
                    chatLoading={chatLoading}
                    waiting={waiting}
                    activeChatId={activeChatId}
                />
            </Card>
            <Popup
                {...THEME.SECONDARY}
                isOpen={deleteChatTargetId !== null}
                onClose={() => setDeleteChatTargetId(null)}
            >
                <div className="flex flex-col gap-4 p-2 min-w-72">
                    <h3 className="text-lg font-bold text-white">Delete chat?</h3>
                    <p className="text-sm text-white/80">
                        This will remove the chat and its messages.
                    </p>
                    <div className="flex flex-row items-center justify-end gap-2">
                        <Button
                            {...THEME.ACTIVE}
                            type="button"
                            onClick={() => setDeleteChatTargetId(null)}
                            className="px-3 py-1.5 text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            {...THEME.DANGER}
                            type="button"
                            onClick={confirmDeleteChat}
                            className="px-3 py-1.5 text-sm"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default Main;
