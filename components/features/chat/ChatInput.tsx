"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { useSendMessage } from "@/lib/hooks/use-send-message";
import { useUploadAttachment } from "@/lib/hooks/use-upload-attachment";

const LANGUAGES = [
  "English",
  "हिन्दी",
  "বাংলা",
  "తెలుగు",
  "मराठी",
  "தமிழ்",
  "ગુજરાતી",
  "ಕನ್ನಡ",
  "മലയാളം",
  "ਪੰਜਾਬੀ",
  "অসমীয়া",
  "ଓଡ଼ିଆ",
  "اردو",
  "मैथिली",
  "संस्कृतम्",
];

export function ChatInput() {
  const [input, setInput] = useState("");
  const { currentLanguage: language, setCurrentLanguage: setLanguage, isStreaming } = useChatStore();
  const [isRecording, setIsRecording] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<{ url: string; name: string; type: string; size: number; }[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { sendMessage } = useSendMessage();
  const { upload, isUploading, error: uploadError } = useUploadAttachment();

  const handleSend = async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || isStreaming) return;
    const text = input.trim();
    const attachments = [...pendingAttachments];
    
    setInput("");
    setPendingAttachments([]);
    
    await sendMessage(text, language, attachments);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be selected again
    e.target.value = "";

    const attachment = await upload(file);
    if (attachment) {
      setPendingAttachments((prev) => [...prev, attachment]);
    }
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice input
  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.interimResults = true;
    recognition.lang =
      language === "English"
        ? "en-IN"
        : language === "हिन्दी"
        ? "hi-IN"
        : language === "বাংলা"
        ? "bn-IN"
        : language === "తెలుగు"
        ? "te-IN"
        : language === "தமிழ்"
        ? "ta-IN"
        : "en-IN";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as ArrayLike<{ 0: { transcript: string } }>)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface via-surface to-transparent pt-10 pb-6 px-4 lg:px-8 z-20">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white border border-outline-variant rounded-2xl shadow-[0_4px_24px_rgba(0,35,111,0.08)] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
          
          {/* Pending Attachments */}
          {pendingAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 border-b border-outline-variant bg-surface-container/30">
              {pendingAttachments.map((file, i) => (
                <div key={i} className="group relative flex items-center gap-2 bg-white border border-outline-variant rounded-lg pl-2 pr-1 py-1 shadow-sm">
                  {file.type.startsWith("image/") ? (
                    <div className="w-8 h-8 rounded bg-surface-container overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-outline text-[20px]">
                      description
                    </span>
                  )}
                  <span className="text-[12px] font-medium text-on-surface truncate max-w-[120px]">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeAttachment(i)}
                    className="p-1 text-outline hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container/30 border-b border-outline-variant">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[12px] font-medium text-on-surface-variant">Uploading...</span>
            </div>
          )}

          {uploadError && (
            <div className="px-4 py-2 bg-error-container/30 border-b border-error/20 text-error text-[12px] font-medium">
              Error: {uploadError}
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="w-full bg-transparent border-none resize-none py-4 pl-4 pr-16 text-[16px] leading-[1.6] text-on-surface placeholder:text-outline focus:ring-0 max-h-40"
            placeholder="Ask anything about elections, voter registration, or candidates..."
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,.txt"
          />

          {/* Left icons */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
              title="Attach file"
              disabled={isUploading}
            >
              <span className="material-symbols-outlined text-[20px]">
                attach_file
              </span>
            </button>
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-full transition-colors ${
                isRecording
                  ? "text-error bg-error-container animate-pulse"
                  : "text-outline hover:text-on-surface hover:bg-surface-container"
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isRecording ? "stop_circle" : "mic"}
              </span>
            </button>
          </div>

          {/* Right side */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-surface-container text-on-surface text-[12px] rounded-lg border-none py-1.5 pl-2 pr-6 focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <button
              onClick={handleSend}
              disabled={(!input.trim() && pendingAttachments.length === 0) || isStreaming}
              className="bg-primary text-on-primary w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary-container transition-transform hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:hover:scale-100"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isStreaming ? "stop" : "send"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex flex-col items-center gap-1">
          <p className="text-[12px] leading-[1.4] text-outline text-center flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Powered by Gemini Pro
          </p>
          <p className="text-[10px] text-outline/60 text-center max-w-xl">
            ElectionGuide AI can make mistakes. Always verify voting deadlines
            and requirements with your local election official&apos;s office or
            official ECI website.
          </p>
        </div>
      </div>
    </div>
  );
}
