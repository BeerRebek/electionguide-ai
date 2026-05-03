"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

type SimState = "ready" | "activated" | "voted" | "printing" | "confirmed";

const CANDIDATES = [
  { name: "Candidate A", party: "Party Alpha", symbol: "🌸" },
  { name: "Candidate B", party: "Party Beta", symbol: "🔔" },
  { name: "Candidate C", party: "Party Gamma", symbol: "🏹" },
  { name: "Candidate D", party: "Party Delta", symbol: "✋" },
];

export function EVMSimulator() {
  const [state, setState] = useState<SimState>("ready");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [showSlip, setShowSlip] = useState(false);
  const [slipTimer, setSlipTimer] = useState(7);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const ballotBtnRef = useRef<HTMLButtonElement>(null);
  const candidateBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Announce state changes to screen readers
  const [announcement, setAnnouncement] = useState("");

  const playBeep = useCallback(() => {
    // Check reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio not supported
    }
  }, []);

  // Keyboard navigation: arrow keys through candidates, Enter to select
  useEffect(() => {
    if (state !== "activated") return;

    function handleKeyDown(e: KeyboardEvent) {
      const active = document.activeElement;
      const idx = candidateBtnRefs.current.indexOf(active as HTMLButtonElement);

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = idx < CANDIDATES.length - 1 ? idx + 1 : 0;
        candidateBtnRefs.current[next]?.focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = idx > 0 ? idx - 1 : CANDIDATES.length - 1;
        candidateBtnRefs.current[prev]?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state]);

  function handleActivate() {
    setState("activated");
    setAnnouncement("Ballot activated. Use arrow keys to navigate candidates. Press Enter or Space to vote.");
    // Focus the first candidate button
    setTimeout(() => candidateBtnRefs.current[0]?.focus(), 200);
  }

  function handleVote(index: number) {
    if (state !== "activated") return;
    setSelectedCandidate(index);
    setState("voted");
    setAnnouncement(`Vote being recorded for ${CANDIDATES[index].name} of ${CANDIDATES[index].party}.`);

    // Show VVPAT slip after brief delay
    setTimeout(() => {
      setState("printing");
      setShowSlip(true);
      setSlipTimer(7);
      setAnnouncement(`VVPAT slip printing. Showing ${CANDIDATES[index].name} for 7 seconds.`);

      timerRef.current = setInterval(() => {
        setSlipTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setShowSlip(false);
            setState("confirmed");
            playBeep();
            setAnnouncement("Vote confirmed. Paper slip has dropped into sealed box. You may now exit.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 500);
  }

  function handleReset() {
    setState("ready");
    setSelectedCandidate(null);
    setShowSlip(false);
    setSlipTimer(7);
    if (timerRef.current) clearInterval(timerRef.current);
    setAnnouncement("Simulator reset. Press the Ballot button to begin.");
    setTimeout(() => ballotBtnRef.current?.focus(), 100);
  }

  return (
    <div role="region" aria-label="Interactive EVM Simulator">
      {/* Screen reader live region for state announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-on-surface">Interactive EVM Simulator</h2>
        {state !== "ready" && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-container/10 rounded-lg transition-colors"
            aria-label="Reset simulator to initial state"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">restart_alt</span>
            Reset
          </button>
        )}
      </div>
      <p className="text-sm text-on-surface-variant mb-8">
        Experience the voting process interactively. This is a simulation for educational purposes only.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTROL UNIT */}
        <div
          className="bg-surface-container-lowest border-2 border-primary rounded-2xl overflow-hidden shadow-md"
          role="group"
          aria-label="Control Unit"
        >
          <div className="bg-primary px-4 py-2">
            <p className="text-xs font-bold text-on-primary uppercase tracking-wider text-center">Control Unit (CU)</p>
          </div>
          <div className="p-5 space-y-4">
            {/* Status Display */}
            <div className="bg-black rounded-lg p-3 text-center font-mono" aria-live="polite">
              <p className="text-[10px] text-green-400/60 mb-1">ECI – M3 EVM</p>
              <p className={`text-lg font-bold ${
                state === "ready" ? "text-yellow-400" :
                state === "activated" ? "text-green-400" :
                state === "confirmed" ? "text-green-400" :
                "text-orange-400"
              }`}>
                {state === "ready" ? "READY" :
                 state === "activated" ? "BALLOT ACTIVE" :
                 state === "voted" ? "RECORDING..." :
                 state === "printing" ? "VVPAT PRINTING" :
                 "VOTE RECORDED ✓"}
              </p>
            </div>

            {/* Ballot Button */}
            <button
              ref={ballotBtnRef}
              onClick={handleActivate}
              disabled={state !== "ready"}
              aria-label={state === "ready" ? "Press Ballot to activate voting" : "Ballot already activated"}
              className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 min-h-[48px] transition-all ${
                state === "ready"
                  ? "bg-tertiary text-on-tertiary hover:bg-tertiary-container shadow-sm cursor-pointer focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
                  : "bg-surface-container text-on-surface-variant cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">power_settings_new</span>
              {state === "ready" ? "Press BALLOT" : "Ballot Activated"}
            </button>

            {/* Status light */}
            <div className="flex items-center justify-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${state === "activated" ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-surface-container-high"}`}
                role="status"
                aria-label={state === "activated" ? "Ready light: ON" : "Ready light: OFF"}
              />
              <span className="text-xs text-on-surface-variant">Ready Light</span>
            </div>

            {/* Tooltip */}
            <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant">
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                {state === "ready" && "The Presiding Officer presses BALLOT to allow one vote."}
                {state === "activated" && "Green light is ON. Voter may now press a button on the Ballot Unit."}
                {state === "voted" && "Vote is being electronically recorded in the CU memory."}
                {state === "printing" && "VVPAT is printing the paper slip for verification."}
                {state === "confirmed" && "Vote successfully recorded! The beep confirms the vote."}
              </p>
            </div>
          </div>
        </div>

        {/* BALLOT UNIT */}
        <div
          className="bg-surface-container-lowest border-2 border-secondary rounded-2xl overflow-hidden shadow-md"
          role="group"
          aria-label="Ballot Unit"
        >
          <div className="bg-secondary px-4 py-2">
            <p className="text-xs font-bold text-on-secondary uppercase tracking-wider text-center">Ballot Unit (BU)</p>
          </div>
          <div className="p-5 space-y-3" role="radiogroup" aria-label="Candidate selection">
            {CANDIDATES.map((c, i) => (
              <button
                key={c.name}
                ref={(el) => { candidateBtnRefs.current[i] = el; }}
                onClick={() => handleVote(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleVote(i);
                  }
                }}
                disabled={state !== "activated"}
                role="radio"
                aria-checked={selectedCandidate === i}
                aria-label={`Vote for ${c.name} of ${c.party}`}
                tabIndex={state === "activated" ? 0 : -1}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all min-h-[56px] ${
                  state !== "activated"
                    ? "border-outline-variant bg-surface-container cursor-not-allowed opacity-60"
                    : selectedCandidate === i
                    ? "border-secondary bg-secondary-container/20"
                    : "border-outline-variant bg-surface-container-lowest hover:border-secondary cursor-pointer focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                }`}
              >
                {/* Blue button */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  state === "activated" ? "bg-blue-500 hover:bg-blue-600 shadow-sm" : "bg-surface-container-high"
                }`} aria-hidden="true">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>

                {/* Candidate info */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-on-surface">{c.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{c.party}</p>
                </div>

                {/* Symbol */}
                <span className="text-lg" aria-hidden="true">{c.symbol}</span>

                {/* Red light */}
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    selectedCandidate === i && state !== "ready"
                      ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      : "bg-surface-container-high"
                  }`}
                  aria-label={selectedCandidate === i && state !== "ready" ? "Vote indicator: ON" : "Vote indicator: OFF"}
                  role="status"
                />
              </button>
            ))}
          </div>
        </div>

        {/* VVPAT */}
        <div
          className="bg-surface-container-lowest border-2 border-tertiary rounded-2xl overflow-hidden shadow-md"
          role="group"
          aria-label="VVPAT Printer Unit"
        >
          <div className="bg-tertiary px-4 py-2">
            <p className="text-xs font-bold text-on-tertiary uppercase tracking-wider text-center">VVPAT Printer</p>
          </div>
          <div className="p-5">
            {/* Display window */}
            <div className="bg-surface-container-high border-2 border-dashed border-outline-variant rounded-lg p-4 min-h-[200px] flex items-center justify-center">
              {showSlip && selectedCandidate !== null ? (
                <div
                  className="bg-white border border-outline rounded-lg p-4 w-full shadow-md animate-in slide-in-from-top-4 duration-300"
                  role="alert"
                  aria-label={`VVPAT verification slip showing ${CANDIDATES[selectedCandidate].name} of ${CANDIDATES[selectedCandidate].party}. ${slipTimer} seconds remaining.`}
                >
                  <p className="text-[10px] text-gray-400 text-center mb-2 font-mono">— VVPAT SLIP —</p>
                  <div className="text-center space-y-1">
                    <p className="text-xs text-gray-500">Sr. No. {selectedCandidate + 1}</p>
                    <p className="text-lg font-bold text-gray-900">{CANDIDATES[selectedCandidate].name}</p>
                    <p className="text-sm text-gray-600">{CANDIDATES[selectedCandidate].party}</p>
                    <p className="text-2xl" aria-hidden="true">{CANDIDATES[selectedCandidate].symbol}</p>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                      <span className="material-symbols-outlined text-amber-600 text-[14px]" aria-hidden="true">timer</span>
                      <span className="text-xs font-mono font-bold text-amber-700" aria-live="polite">{slipTimer}s</span>
                    </div>
                  </div>
                </div>
              ) : state === "confirmed" ? (
                <div className="text-center" role="status">
                  <span
                    className="material-symbols-outlined text-tertiary text-[48px] mb-2 block"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    inventory_2
                  </span>
                  <p className="text-sm font-medium text-on-surface-variant">Slip dropped into sealed box</p>
                  <p className="text-xs text-on-surface-variant mt-1">Paper trail preserved ✓</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-outline text-[48px] mb-2 block" aria-hidden="true">print</span>
                  <p className="text-sm text-on-surface-variant">Waiting for vote...</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-4 bg-surface-container-low rounded-lg p-3 border border-outline-variant">
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                The VVPAT slip shows your candidate&apos;s name, serial number, and party symbol for exactly 7 seconds through a transparent window, then drops into a sealed container.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal reference link */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/chat?q=Explain%20the%20legal%20framework%20for%20EVMs%20under%20Section%2061A%20and%20Rule%2049MA"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">gavel</span>
          Legal: Section 61A, Rule 49MA RP Act
        </Link>
        <Link
          href="/timeline#polling"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">timeline</span>
          See in Election Timeline → Polling Phase
        </Link>
      </div>
    </div>
  );
}
