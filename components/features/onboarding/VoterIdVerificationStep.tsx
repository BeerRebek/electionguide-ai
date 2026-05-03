"use client";

import { useState, useRef } from "react";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { OnboardingNavigation } from "./OnboardingNavigation";
import { useUploadAttachment } from "@/lib/hooks/use-upload-attachment";
import { useTranslations } from "next-intl";

export function VoterIdVerificationStep() {
  const t = useTranslations("onboarding");
  const { profile, setProfile, complete } = useOnboardingStore();
  const { upload, isUploading, error: uploadError } = useUploadAttachment();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const attachment = await upload(file);
    if (attachment) {
      setProfile({ voterIdImage: attachment.url });
      startMockScan();
    }
  };

  const startMockScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate OCR processing
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      // Mock data extraction
      setProfile({ voterIdNumber: "ABC" + Math.floor(1000000 + Math.random() * 9000000) });
    }, 3000);
  };

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-bold text-primary mb-4">
          {t("voterIdVerificationTitle")}
        </h1>
        <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl mx-auto">
          {t("voterIdVerificationSubtitle")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-surface p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col items-center">
          
          {!profile.voterIdImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[1.6/1] border-2 border-dashed border-outline rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-colors group"
            >
              <span className="material-symbols-outlined text-6xl text-outline group-hover:text-primary transition-colors mb-4">
                add_a_photo
              </span>
              <p className="text-on-surface-variant font-medium text-center px-4">
                {t("voterIdUploadPlaceholder")}
              </p>
              <p className="text-outline text-sm mt-1">{t("voterIdSupports")}</p>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <div className="relative aspect-[1.6/1] rounded-xl overflow-hidden border border-outline-variant shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={profile.voterIdImage} 
                  alt="Voter ID" 
                  className="w-full h-full object-cover"
                />
                
                {isScanning && (
                  <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-primary/80 absolute top-0 animate-scan-line shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]" />
                    <div className="bg-white/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold text-primary">{t("voterIdScanning")}</span>
                    </div>
                  </div>
                )}

                {scanComplete && (
                  <div className="absolute top-4 right-4 bg-success-container text-on-success-container px-3 py-1 rounded-full flex items-center gap-1 shadow-sm animate-in fade-in zoom-in">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span className="text-xs font-bold">{t("voterIdVerified")}</span>
                  </div>
                )}
              </div>

              {scanComplete && (
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant animate-in slide-in-from-bottom-2">
                  <h3 className="text-sm font-bold text-outline uppercase tracking-wider mb-3">
                    {t("voterIdExtractedDetails")}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-on-surface-variant mb-1">{t("voterIdNumberLabel")}</p>
                      <p className="font-mono font-bold text-lg text-on-surface">{profile.voterIdNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant mb-1">{t("voterIdStatusLabel")}</p>
                      <p className="text-primary font-bold">{t("voterIdActive")}</p>
                    </div>
                  </div>
                </div>
              )}

              {!isScanning && (
                <button 
                  onClick={() => {
                    setProfile({ voterIdImage: undefined, voterIdNumber: undefined });
                    setScanComplete(false);
                  }}
                  className="w-full py-2 text-error font-medium hover:bg-error-container/10 rounded-lg transition-colors"
                >
                  {t("voterIdRemove")}
                </button>
              )}
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />

          {uploadError && (
            <p className="mt-4 text-error text-sm font-medium">{t("voterIdError")}: {uploadError}</p>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3 p-4 bg-primary-container/10 rounded-xl border border-primary/10">
          <span className="material-symbols-outlined text-primary">shield_lock</span>
          <p className="text-xs text-on-surface-variant">
            {t("voterIdPrivacySecure")}
          </p>
        </div>
      </div>

      <OnboardingNavigation 
        onNext={complete} 
        nextDisabled={isUploading || isScanning}
        nextLabel={t("completeOnboarding")}
      />

      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite alternate;
        }
      `}</style>
    </>
  );
}
