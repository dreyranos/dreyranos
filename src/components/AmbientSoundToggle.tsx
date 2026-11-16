import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { COPY, type Lang } from '../data/portfolioData';

interface AmbientSoundToggleProps {
  lang: Lang;
}

interface DroneEngine {
  ctx: AudioContext;
  masterGain: GainNode;
}

const TARGET_GAIN = 0.045;

export function AmbientSoundToggle({ lang }: AmbientSoundToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const engineRef = useRef<DroneEngine | null>(null);
  const suspendTimerRef = useRef<number | null>(null);
  const t = COPY[lang].controls;

  useEffect(() => {
    return () => {
      if (suspendTimerRef.current !== null) {
        window.clearTimeout(suspendTimerRef.current);
      }
      if (engineRef.current) {
        engineRef.current.ctx.close().catch(() => {});
        engineRef.current = null;
      }
    };
  }, []);

  const createEngine = (): DroneEngine | null => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(190, ctx.currentTime);
    filter.Q.setValueAtTime(0.8, ctx.currentTime);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Warm harmonic architectural drone: A1 (55Hz) + E2 (82.41Hz) + soft detuned A2 (110.25Hz)
    const layers: Array<{ type: OscillatorType; freq: number; gain: number }> = [
      { type: 'sine', freq: 55, gain: 0.55 },
      { type: 'sine', freq: 82.41, gain: 0.3 },
      { type: 'triangle', freq: 110.25, gain: 0.15 },
    ];

    for (const layer of layers) {
      const osc = ctx.createOscillator();
      const layerGain = ctx.createGain();
      osc.type = layer.type;
      osc.frequency.setValueAtTime(layer.freq, ctx.currentTime);
      layerGain.gain.setValueAtTime(layer.gain, ctx.currentTime);
      osc.connect(layerGain);
      layerGain.connect(filter);
      osc.start();
    }

    // Slow ~14s LFO breathing on the low-pass cutoff
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.07, ctx.currentTime);
    lfoGain.gain.setValueAtTime(45, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    return { ctx, masterGain };
  };

  const handleToggle = async () => {
    if (suspendTimerRef.current !== null) {
      window.clearTimeout(suspendTimerRef.current);
      suspendTimerRef.current = null;
    }

    if (!enabled) {
      try {
        if (!engineRef.current) {
          engineRef.current = createEngine();
        }
        const engine = engineRef.current;
        if (!engine) return;

        if (engine.ctx.state === 'suspended') {
          await engine.ctx.resume();
        }

        const now = engine.ctx.currentTime;
        engine.masterGain.gain.cancelScheduledValues(now);
        engine.masterGain.gain.setValueAtTime(
          Math.max(engine.masterGain.gain.value, 0.0001),
          now
        );
        engine.masterGain.gain.linearRampToValueAtTime(TARGET_GAIN, now + 1.1);
        setEnabled(true);
      } catch {
        setEnabled(false);
      }
    } else {
      const engine = engineRef.current;
      if (engine) {
        const now = engine.ctx.currentTime;
        engine.masterGain.gain.cancelScheduledValues(now);
        engine.masterGain.gain.setValueAtTime(
          Math.max(engine.masterGain.gain.value, 0.0001),
          now
        );
        engine.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.55);

        suspendTimerRef.current = window.setTimeout(() => {
          engine.ctx.suspend().catch(() => {});
        }, 600);
      }
      setEnabled(false);
    }
  };

  const label = enabled ? t.ambientOn : t.ambientOff;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={enabled}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors duration-150 active:scale-[0.97] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
        enabled
          ? 'border-blue-600/40 dark:border-blue-400/40 bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400'
          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
      }`}
    >
      {enabled ? (
        <Volume2 className="w-4 h-4" aria-hidden="true" />
      ) : (
        <VolumeX className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}
