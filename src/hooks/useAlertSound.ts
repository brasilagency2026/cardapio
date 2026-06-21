"use client";

import { useEffect, useRef } from "react";

/**
 * Hook que toca um som de alerta quando o count aumenta.
 * Usa Web Audio API (sem fichier mp3 nécessaire).
 */
export function useAlertSound(count: number, enabled: boolean = true) {
  const prevCount = useRef(count);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (count > prevCount.current) {
      playAlertSound();
    }
    prevCount.current = count;
  }, [count, enabled]);

  function playAlertSound() {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      // Son de cloche / notification (deux tons)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.value = 880; // La5
      osc2.type = "sine";
      osc2.frequency.value = 1100; // Do#6

      gain.gain.value = 0.3;
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime + 0.15);
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.6);
    } catch {
      // Silencieux si Web Audio non disponible
    }
  }
}
