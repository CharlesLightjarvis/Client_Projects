"use client";

import axios from "axios";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Paperclip,
  RefreshCcw,
  Copy,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Trash,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessageType = "user" | "system";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  completed?: boolean;
  newSection?: boolean;
  question?: string;
  answer?: string;
}

interface MessageSection {
  id: string;
  messages: Message[];
  isNewSection: boolean;
  isActive?: boolean;
  sectionIndex: number;
}

interface StreamingWord {
  id: number;
  text: string;
}

interface AITextLoadingProps {
  texts?: string[];
  className?: string;
  interval?: number;
}

// Faster word delay for smoother streaming
const WORD_DELAY = 40; // ms per word
const CHUNK_SIZE = 2; // Number of words to add at once

// AI Models and Icons
const OPENAI_SVG = (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="256"
      height="260"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 260"
      aria-label="o3-mini icon"
      className="dark:hidden block"
    >
      <title>OpenAI Icon Light</title>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="256"
      height="260"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 260"
      aria-label="o3-mini icon"
      className="hidden dark:block"
    >
      <title>OpenAI Icon Dark</title>
      <path
        fill="#fff"
        d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.30c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
      />
    </svg>
  </div>
);

const AI_MODELS = [
  "o3-mini",
  "Gemini 2.5 Flash",
  "Claude 3.5 Sonnet",
  "GPT-4-1 Mini",
  "GPT-4-1",
];

const MODEL_ICONS: Record<string, React.ReactNode> = {
  "o3-mini": OPENAI_SVG,
  "Gemini 2.5 Flash": (
    <svg
      height="1em"
      style={{ flex: "none", lineHeight: "1" }}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Gemini</title>
      <defs>
        <linearGradient
          id="lobe-icons-gemini-fill"
          x1="0%"
          x2="68.73%"
          y1="100%"
          y2="30.395%"
        >
          <stop offset="0%" stopColor="#1C7DFF" />
          <stop offset="52.021%" stopColor="#1C69FF" />
          <stop offset="100%" stopColor="#F0DCD6" />
        </linearGradient>
      </defs>
      <path
        d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
        fill="url(#lobe-icons-gemini-fill)"
        fillRule="nonzero"
      />
    </svg>
  ),
  "Claude 3.5 Sonnet": (
    <div>
      <svg
        fill="#000"
        fillRule="evenodd"
        style={{ flex: "none", lineHeight: "1" }}
        viewBox="0 0 24 24"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        className="dark:hidden block"
      >
        <title>Anthropic Icon Light</title>
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
      </svg>
      <svg
        fill="#fff"
        fillRule="evenodd"
        style={{ flex: "none", lineHeight: "1" }}
        viewBox="0 0 24 24"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden dark:block"
      >
        <title>Anthropic Icon Dark</title>
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
      </svg>
    </div>
  ),
  "GPT-4-1 Mini": OPENAI_SVG,
  "GPT-4-1": OPENAI_SVG,
};

// AI Text Loading Component
function AITextLoading({
  texts = [
    "Thinking...",
    "Processing...",
    "Analyzing...",
    "Computing...",
    "Almost...",
  ],
  className,
  interval = 1500,
}: AITextLoadingProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, texts.length]);

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="relative px-4 py-2 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTextIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundPosition: ["200% center", "-200% center"],
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              opacity: { duration: 0.3 },
              y: { duration: 0.3 },
              backgroundPosition: {
                duration: 2.5,
                ease: "linear",
                repeat: Infinity,
              },
            }}
            className={cn(
              "flex justify-center text-3xl font-bold bg-gradient-to-r from-neutral-950 via-neutral-400 to-neutral-950 dark:from-white dark:via-neutral-600 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent whitespace-nowrap min-w-max",
              className
            )}
          >
            {texts[currentTextIndex]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ChatInterface() {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const newSectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageSections, setMessageSections] = useState<MessageSection[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingWords, setStreamingWords] = useState<StreamingWord[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [viewportHeight, setViewportHeight] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(
    new Set()
  );
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState("GPT-4-1 Mini");

  // Constants for layout calculations to account for the padding values
  const TOP_PADDING = 48; // pt-12 (3rem = 48px)
  const BOTTOM_PADDING = 128; // pb-32 (8rem = 128px)
  const ADDITIONAL_OFFSET = 16; // Reduced offset for fine-tuning

  // Check if device is mobile and get viewport height
  useEffect(() => {
    const checkMobileAndViewport = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);

      // Capture the viewport height
      const vh = window.innerHeight;
      setViewportHeight(vh);

      // Apply fixed height to main container on mobile
      if (isMobileDevice && mainContainerRef.current) {
        mainContainerRef.current.style.height = `${vh}px`;
      }
    };

    checkMobileAndViewport();

    // Set initial height
    if (mainContainerRef.current) {
      mainContainerRef.current.style.height = isMobile
        ? `${viewportHeight}px`
        : "100svh";
    }

    // Update on resize
    window.addEventListener("resize", checkMobileAndViewport);

    return () => {
      window.removeEventListener("resize", checkMobileAndViewport);
    };
  }, [isMobile, viewportHeight]);

  // Organize messages into sections
  useEffect(() => {
    if (messages.length === 0) {
      setMessageSections([]);
      setActiveSectionId(null);
      return;
    }

    const sections: MessageSection[] = [];
    let currentSection: MessageSection = {
      id: `section-${Date.now()}-0`,
      messages: [],
      isNewSection: false,
      sectionIndex: 0,
    };

    messages.forEach((message) => {
      if (message.newSection) {
        // Start a new section
        if (currentSection.messages.length > 0) {
          // Mark previous section as inactive
          sections.push({
            ...currentSection,
            isActive: false,
          });
        }

        // Create new active section
        const newSectionId = `section-${Date.now()}-${sections.length}`;
        currentSection = {
          id: newSectionId,
          messages: [message],
          isNewSection: true,
          isActive: true,
          sectionIndex: sections.length,
        };

        // Update active section ID
        setActiveSectionId(newSectionId);
      } else {
        // Add to current section
        currentSection.messages.push(message);
      }
    });

    // Add the last section if it has messages
    if (currentSection.messages.length > 0) {
      sections.push(currentSection);
    }

    setMessageSections(sections);
  }, [messages]);

  // Scroll to maximum position when new section is created, but only for sections after the first
  useEffect(() => {
    if (messageSections.length > 1) {
      setTimeout(() => {
        const scrollContainer = chatContainerRef.current;

        if (scrollContainer) {
          // Scroll to maximum possible position
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [messageSections]);

  // Focus the textarea on component mount (only on desktop)
  useEffect(() => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus();
    }
  }, [isMobile]);

  // Set focus back to textarea after streaming ends (only on desktop)
  useEffect(() => {
    if (!isStreaming && !isMobile) {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [isStreaming, isMobile]);

  // Calculate available content height (viewport minus header and input)
  const getContentHeight = () => {
    // Calculate available height by subtracting the top and bottom padding from viewport height
    return viewportHeight - TOP_PADDING - BOTTOM_PADDING - ADDITIONAL_OFFSET;
  };

  const adjustHeight = (reset = false) => {
    if (textareaRef.current) {
      if (reset) {
        textareaRef.current.style.height = "72px";
      } else {
        textareaRef.current.style.height = "auto";
        const newHeight = Math.max(
          72,
          Math.min(textareaRef.current.scrollHeight, 300)
        );
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  const simulateTextStreaming = async (text: string) => {
    // Split text into words
    const words = text.split(" ");
    let currentIndex = 0;
    setStreamingWords([]);
    setIsStreaming(true);

    return new Promise<void>((resolve) => {
      const streamInterval = setInterval(() => {
        if (currentIndex < words.length) {
          // Add a few words at a time
          const nextIndex = Math.min(currentIndex + CHUNK_SIZE, words.length);
          const newWords = words.slice(currentIndex, nextIndex);

          setStreamingWords((prev) => [
            ...prev,
            {
              id: Date.now() + currentIndex,
              text: newWords.join(" ") + " ",
            },
          ]);

          currentIndex = nextIndex;
        } else {
          clearInterval(streamInterval);
          resolve();
        }
      }, WORD_DELAY);
    });
  };

  const handleAIResponse = async (userMessage: string) => {
    try {
      // Create a new message with loading state
      const messageId = Date.now().toString();
      setStreamingMessageId(messageId);

      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          content: "",
          type: "system",
        },
      ]);

      // Add vibration when request begins
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      console.log("Sending request to API with question:", userMessage);

      // Make API request with full URL and proper headers
      const response = await api.post("/api/v1/prism/ask", {
        question: userMessage,
      });

      console.log("API response:", response.data);

      const aiResponse = response.data.answer;

      // Stream the text
      await simulateTextStreaming(aiResponse);

      // Update with complete message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: aiResponse, completed: true }
            : msg
        )
      );

      // Add to completed messages set to prevent re-animation
      setCompletedMessages((prev) => new Set(prev).add(messageId));

      // Add vibration when streaming ends
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // Reset streaming state
      setStreamingWords([]);
      setStreamingMessageId(null);
      setIsStreaming(false);
    } catch (error) {
      console.error("Error fetching AI response:", error);

      // Log more detailed error information
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data,
          },
        });
      }

      // Handle error - update the message to show error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMessageId
            ? {
                ...msg,
                content:
                  "Sorry, there was an error processing your request. Please try again.",
                completed: true,
              }
            : msg
        )
      );

      // Reset streaming state
      setStreamingWords([]);
      setStreamingMessageId(null);
      setIsStreaming(false);
    }
  };

  const clearConversation = async () => {
    try {
      console.log("Clearing conversation...");
      const response = await api.post("/api/v1/prism/clear");
      console.log("Clear conversation response:", response.data);

      setMessages([]);
      setMessageSections([]);
      setActiveSectionId(null);
      setCompletedMessages(new Set());
    } catch (error) {
      console.error("Error clearing conversation:", error);

      // Log more detailed error information
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }

      alert("Failed to clear conversation. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Only allow input changes when not streaming
    if (!isStreaming) {
      setInputValue(newValue);
      adjustHeight();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      // Add vibration when message is submitted
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      const userMessage = inputValue.trim();

      // Add as a new section if messages already exist
      const shouldAddNewSection = messages.length > 0;

      const newUserMessage = {
        id: `user-${Date.now()}`,
        content: userMessage,
        type: "user" as MessageType,
        newSection: shouldAddNewSection,
      };

      // Reset input before starting the AI response
      setInputValue("");
      adjustHeight(true);

      // Add the message after resetting input
      setMessages((prev) => [...prev, newUserMessage]);

      // Only focus the textarea on desktop, not on mobile
      if (!isMobile) {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      } else {
        // On mobile, blur the textarea to dismiss the keyboard
        if (textareaRef.current) {
          textareaRef.current.blur();
        }
      }

      // Start AI response using the API
      handleAIResponse(userMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderMessage = (message: Message) => {
    const isCompleted = completedMessages.has(message.id);

    return (
      <div
        key={message.id}
        className={cn(
          "flex flex-col",
          message.type === "user" ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] px-4 py-2 rounded-2xl",
            message.type === "user"
              ? "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-br-none text-gray-900 dark:text-white"
              : "text-gray-900 dark:text-white"
          )}
        >
          {/* Show loading animation when streaming and no content yet */}
          {message.id === streamingMessageId &&
            !message.content &&
            streamingWords.length === 0 && <AITextLoading />}

          {/* For user messages or completed system messages, render without animation */}
          {message.content && (
            <div
              className={
                message.type === "system" && !isCompleted
                  ? "animate-fade-in"
                  : ""
              }
            >
              {message.type === "system" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-900 dark:prose-p:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-gray-900 dark:prose-code:text-white prose-pre:bg-gray-100 dark:prose-pre:bg-neutral-800 prose-table:text-gray-900 dark:prose-table:text-white prose-th:border-gray-300 dark:prose-th:border-neutral-600 prose-td:border-gray-300 dark:prose-td:border-neutral-600"
                  components={{
                    table: (props: any) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-600">
                          {props.children}
                        </table>
                      </div>
                    ),
                    th: (props: any) => (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-neutral-800">
                        {props.children}
                      </th>
                    ),
                    td: (props: any) => (
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {props.children}
                      </td>
                    ),
                    code: (props: any) => {
                      const isInline = !props.className?.includes("language-");
                      return isInline ? (
                        <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-sm font-mono text-gray-900 dark:text-white">
                          {props.children}
                        </code>
                      ) : (
                        <code className="block p-3 rounded bg-gray-100 dark:bg-neutral-800 text-sm font-mono text-gray-900 dark:text-white overflow-x-auto">
                          {props.children}
                        </code>
                      );
                    },
                    h1: (props: any) => (
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {props.children}
                      </h1>
                    ),
                    h2: (props: any) => (
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {props.children}
                      </h2>
                    ),
                    h3: (props: any) => (
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                        {props.children}
                      </h3>
                    ),
                    ul: (props: any) => (
                      <ul className="list-disc list-inside space-y-1 text-gray-900 dark:text-white">
                        {props.children}
                      </ul>
                    ),
                    ol: (props: any) => (
                      <ol className="list-decimal list-inside space-y-1 text-gray-900 dark:text-white">
                        {props.children}
                      </ol>
                    ),
                    li: (props: any) => (
                      <li className="text-gray-900 dark:text-white">
                        {props.children}
                      </li>
                    ),
                    p: (props: any) => (
                      <p className="text-gray-900 dark:text-white mb-2 leading-relaxed">
                        {props.children}
                      </p>
                    ),
                    strong: (props: any) => (
                      <strong className="font-semibold text-gray-900 dark:text-white">
                        {props.children}
                      </strong>
                    ),
                    em: (props: any) => (
                      <em className="italic text-gray-900 dark:text-white">
                        {props.children}
                      </em>
                    ),
                    blockquote: (props: any) => (
                      <blockquote className="border-l-4 border-gray-300 dark:border-neutral-600 pl-4 italic text-gray-700 dark:text-gray-300">
                        {props.children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
          )}

          {/* For streaming messages, render with animation */}
          {message.id === streamingMessageId && (
            <div className="inline">
              {streamingWords.map((word) => (
                <span
                  key={word.id}
                  className="animate-fade-in inline text-gray-900 dark:text-white"
                >
                  {word.text}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Message actions */}
        {message.type === "system" && message.completed && (
          <div className="flex items-center gap-2 px-4 mt-1 mb-2">
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              <RefreshCcw className="h-4 w-4" />
            </button>
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              <Copy className="h-4 w-4" />
            </button>
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Determine if a section should have fixed height (only for sections after the first)
  const shouldApplyHeight = (sectionIndex: number) => {
    return sectionIndex > 0;
  };

  return (
    <div
      ref={mainContainerRef}
      className="bg-gray-50 dark:bg-neutral-900 flex flex-col overflow-hidden"
      style={{ height: isMobile ? `${viewportHeight}px` : "100svh" }}
    >
      <div
        ref={chatContainerRef}
        className="flex-grow pb-32 pt-12 px-4 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {messageSections.map((section, sectionIndex) => (
            <div
              key={section.id}
              ref={
                sectionIndex === messageSections.length - 1 &&
                section.isNewSection
                  ? newSectionRef
                  : null
              }
            >
              {section.isNewSection && (
                <div
                  style={
                    section.isActive && shouldApplyHeight(section.sectionIndex)
                      ? { height: `${getContentHeight()}px` }
                      : {}
                  }
                  className="pt-4 flex flex-col justify-start"
                >
                  {section.messages.map((message) => renderMessage(message))}
                </div>
              )}

              {!section.isNewSection && (
                <div>
                  {section.messages.map((message) => renderMessage(message))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-neutral-900">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="w-full py-4">
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1.5 pt-4">
              <div className="flex items-center gap-2 mb-2.5 mx-2">
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-3.5 w-3.5 text-black dark:text-white">
                    <svg
                      fill="currentColor"
                      fillRule="evenodd"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
                    </svg>
                  </div>
                  <h3 className="text-black dark:text-white/90 text-xs tracking-tighter">
                    is free this weekend!
                  </h3>
                </div>
                <p className="text-black dark:text-white/90 text-xs tracking-tighter">
                  Ship Now!
                </p>
              </div>
              <div className="relative">
                <div className="relative flex flex-col">
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "400px" }}
                  >
                    <Textarea
                      ref={textareaRef}
                      value={inputValue}
                      placeholder="What can I do for you?"
                      className={cn(
                        "w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                        "min-h-[72px]"
                      )}
                      onKeyDown={handleKeyDown}
                      onChange={handleInputChange}
                      disabled={isStreaming}
                    />
                  </div>
                  <div className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center">
                    <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md dark:text-white hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                            >
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={selectedModel}
                                  initial={{
                                    opacity: 0,
                                    y: -5,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    y: 0,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    y: 5,
                                  }}
                                  transition={{
                                    duration: 0.15,
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  {MODEL_ICONS[selectedModel]}
                                  {selectedModel}
                                  <ChevronDown className="w-3 h-3 opacity-50" />
                                </motion.div>
                              </AnimatePresence>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className={cn(
                              "min-w-[10rem]",
                              "border-black/10 dark:border-white/10",
                              "bg-gradient-to-b from-white via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800"
                            )}
                          >
                            {AI_MODELS.map((model) => (
                              <DropdownMenuItem
                                key={model}
                                onSelect={() => setSelectedModel(model)}
                                className="flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  {MODEL_ICONS[model] || (
                                    <Bot className="w-4 h-4 opacity-50" />
                                  )}
                                  <span>{model}</span>
                                </div>
                                {selectedModel === model && (
                                  <Check className="w-4 h-4 text-blue-500" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />
                        <label
                          className={cn(
                            "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
                            "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                            "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                          )}
                          aria-label="Attach file"
                        >
                          <input type="file" className="hidden" />
                          <Paperclip className="w-4 h-4 transition-colors" />
                        </label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-lg p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                          onClick={clearConversation}
                        >
                          <Trash className="h-4 w-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white" />
                          <span className="sr-only">Clear Conversation</span>
                        </Button>
                      </div>
                      <button
                        type="submit"
                        className={cn(
                          "rounded-lg p-2 bg-black/5 dark:bg-white/5",
                          "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                        )}
                        aria-label="Send message"
                        disabled={!inputValue.trim() || isStreaming}
                      >
                        <ArrowRight
                          className={cn(
                            "w-4 h-4 dark:text-white transition-opacity duration-200",
                            inputValue.trim() ? "opacity-100" : "opacity-30"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
