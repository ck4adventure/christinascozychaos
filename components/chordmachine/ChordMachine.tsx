'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import * as Tone from 'tone';
import styles from './ChordMachine.module.css';

type TimbreKey = 'piano' | 'synth';

interface TimbreConfig {
  oscillator: Partial<Tone.OmniOscillatorOptions>;
  envelope: Partial<Tone.EnvelopeOptions>;
  filterFreq: number;
  reverbWet: number;
  volume: number;
}

// Two timbre presets: a soft plucked "piano" feel, and a warm filtered synth pad.
const TIMBRES: Record<TimbreKey, TimbreConfig> = {
  piano: {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.004, decay: 0.9, sustain: 0.05, release: 0.9 },
    filterFreq: 3200,
    reverbWet: 0.12,
    volume: -6,
  },
  synth: {
    oscillator: { type: 'fatsawtooth', count: 3, spread: 18 },
    envelope: { attack: 0.03, decay: 0.4, sustain: 0.45, release: 1.6 },
    filterFreq: 1600,
    reverbWet: 0.2,
    volume: -10,
  },
};

// ---------- Theory core ----------

const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
type Letter = (typeof NOTE_LETTERS)[number];
const LETTER_PITCH: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

interface Root {
  name: string;
  letter: Letter;
  acc: number;
  pitchClass: number;
}

const ROOTS: Root[] = (
  [
    { name: 'C', letter: 'C', acc: 0 },
    { name: 'C#', letter: 'C', acc: 1 },
    { name: 'D', letter: 'D', acc: 0 },
    { name: 'Eb', letter: 'E', acc: -1 },
    { name: 'E', letter: 'E', acc: 0 },
    { name: 'F', letter: 'F', acc: 0 },
    { name: 'F#', letter: 'F', acc: 1 },
    { name: 'G', letter: 'G', acc: 0 },
    { name: 'Ab', letter: 'A', acc: -1 },
    { name: 'A', letter: 'A', acc: 0 },
    { name: 'Bb', letter: 'B', acc: -1 },
    { name: 'B', letter: 'B', acc: 0 },
  ] as Omit<Root, 'pitchClass'>[]
).map((r) => ({ ...r, pitchClass: (((LETTER_PITCH[r.letter] + r.acc) % 12) + 12) % 12 }));

type ModeKey = 'major' | 'minor' | 'phrygian';

const MODES: Record<ModeKey, { label: string; intervals: number[] }> = {
  major: { label: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { label: 'Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  phrygian: { label: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10] },
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

interface Progression {
  id: string;
  name: string;
  degrees: number[];
  desc: string;
}

// A handful of recurring minor-key progressions from techno / DnB / psychill —
// degree indices into the 7 diatonic chords (0 = i, 5 = VI, etc).
const PROGRESSIONS: Progression[] = [
  { id: 'vi-iii-vii', name: 'i – VI – III – VII', degrees: [0, 5, 2, 6], desc: 'Looping minor anthem — trance/DnB build engine.' },
  { id: 'vii-vi-v', name: 'i – VII – VI – V', degrees: [0, 6, 5, 4], desc: 'Descending tension — psytrance / dark-techno staple.' },
  { id: 'iv-v', name: 'i – iv – v', degrees: [0, 3, 4], desc: 'Sparse and cold — rolling, drum-forward tracks.' },
  { id: 'bII', name: 'i – ♭II', degrees: [0, 1], desc: 'Half-step dread — try this with Phrygian mode.' },
];

interface ScaleEntry {
  letter: Letter;
  accidental: number;
  octave: number;
  midi: number;
}

// Builds 15 diatonic scale steps (2 octaves + 1) with correct letter-spelling,
// so triads/7ths built by stacking thirds never need re-spelling.
function buildExtendedScale(root: Root, intervals: number[], baseOctave: number): ScaleEntry[] {
  const startLetterIdx = NOTE_LETTERS.indexOf(root.letter);
  const out: ScaleEntry[] = [];
  for (let i = 0; i < 15; i++) {
    const letter = NOTE_LETTERS[(startLetterIdx + i) % 7];
    const octave = baseOctave + Math.floor((startLetterIdx + i) / 7);
    const natural = LETTER_PITCH[letter];
    const target = root.pitchClass + intervals[i % 7] + 12 * Math.floor(i / 7);
    let diff = target - natural;
    while (diff > 6) diff -= 12;
    while (diff < -6) diff += 12;
    const midi = (octave + 1) * 12 + natural + diff;
    out.push({ letter, accidental: diff, octave, midi });
  }
  return out;
}

function noteLabel(entry: ScaleEntry): string {
  const acc = entry.accidental === 1 ? '♯' : entry.accidental === -1 ? '♭' : '';
  return `${entry.letter}${acc}`;
}

function qualityFromIntervals(third: number, fifth: number): { upper: boolean; symbol: string; label: string } {
  if (third === 4 && fifth === 7) return { upper: true, symbol: '', label: '' };
  if (third === 3 && fifth === 7) return { upper: false, symbol: '', label: 'm' };
  if (third === 3 && fifth === 6) return { upper: false, symbol: '°', label: 'dim' };
  if (third === 4 && fifth === 8) return { upper: true, symbol: '+', label: 'aug' };
  return { upper: true, symbol: '', label: '' };
}

function seventhLabel(base: string, seventh: number): string {
  if (seventh === 11) return base === '' ? 'maj7' : base === 'm' ? 'm(maj7)' : `${base}(maj7)`;
  if (seventh === 10) return base === '' ? '7' : base === 'm' ? 'm7' : base === 'dim' ? 'm7♭5' : `${base}7`;
  if (seventh === 9) return base === 'dim' ? 'dim7' : `${base}7`;
  return `${base}7`;
}

interface Chord {
  degree: number;
  tones: ScaleEntry[];
  label: string;
  roman: string;
}

function buildChord(scale: ScaleEntry[], degree: number, extended: boolean): Chord {
  const idx = [degree, degree + 2, degree + 4].concat(extended ? [degree + 6] : []);
  const tones = idx.map((i) => scale[i]);
  const third = tones[1].midi - tones[0].midi;
  const fifth = tones[2].midi - tones[0].midi;
  const q = qualityFromIntervals(third, fifth);
  let label = noteLabel(tones[0]) + q.label;
  let roman = q.upper ? ROMAN[degree] : ROMAN[degree].toLowerCase();
  roman += q.symbol;
  if (extended) {
    const seventh = tones[3].midi - tones[0].midi;
    label = noteLabel(tones[0]) + seventhLabel(q.label, seventh);
    roman += '7';
  }
  return { degree, tones, label, roman };
}

function freqFromMidi(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ---------- Staff notation ----------

function diatonicIndex(letter: Letter, octave: number): number {
  return octave * 7 + NOTE_LETTERS.indexOf(letter);
}

type Clef = 'treble' | 'bass';

const CLEF_REF: Record<Clef, number> = {
  treble: diatonicIndex('E', 4),
  bass: diatonicIndex('G', 2),
};

function Staff({ notes, clef, width = 260, label }: { notes: ScaleEntry[]; clef: Clef; width?: number; label?: string }) {
  const spacing = 11;
  const bottomY = 96;
  const lines = [0, 2, 4, 6, 8].map((p) => bottomY - p * (spacing / 2));

  const noteData = notes.map((n) => {
    const idx = diatonicIndex(n.letter, n.octave);
    const pos = idx - CLEF_REF[clef];
    const y = bottomY - pos * (spacing / 2);
    return { ...n, pos, y };
  });

  const ledgers: number[] = [];
  noteData.forEach((n) => {
    if (n.pos > 8) {
      for (let p = 10; p <= n.pos; p += 2) ledgers.push(bottomY - p * (spacing / 2));
    } else if (n.pos < 0) {
      for (let p = -2; p >= n.pos; p -= 2) ledgers.push(bottomY - p * (spacing / 2));
    }
  });

  return (
    <svg width={width} height="140" viewBox={`0 0 ${width} 140`} className={styles.staffSvg}>
      {label && <text x="8" y="14" className={styles.staffLabel}>{label}</text>}
      {lines.map((y, i) => (
        <line key={i} x1="30" x2={width - 20} y1={y} y2={y} className={styles.staffLine} />
      ))}
      <text
        x="34"
        y={clef === 'treble' ? bottomY - 2 * (spacing / 2) + 6 : bottomY - 4 * (spacing / 2) + 6}
        className={styles.clefGlyph}
      >
        {clef === 'treble' ? '𝄞' : '𝄢'}
      </text>
      {ledgers.map((y, i) => (
        <line key={i} x1="53" x2="71" y1={y} y2={y} className={styles.ledgerLine} />
      ))}
      {noteData.map((n, i) => (
        <g key={i}>
          {n.accidental !== 0 && (
            <text x="46" y={n.y + 4} className={styles.accidental}>
              {n.accidental === 1 ? '♯' : '♭'}
            </text>
          )}
          <ellipse cx="62" cy={n.y} rx="7" ry="5.5" className={styles.notehead} />
        </g>
      ))}
    </svg>
  );
}

// ---------- Keyboard ----------

function Keyboard({ highlighted, lowMidi = 36, highMidi = 84 }: { highlighted: number[]; lowMidi?: number; highMidi?: number }) {
  const whiteW = 22, whiteH = 100, blackW = 13, blackH = 62;
  const whitePc = [0, 2, 4, 5, 7, 9, 11];
  let x = 0;
  const whiteKeys: { midi: number; x: number }[] = [];
  const xByMidi: Record<number, number> = {};
  for (let m = lowMidi; m <= highMidi; m++) {
    if (whitePc.includes(m % 12)) {
      xByMidi[m] = x;
      whiteKeys.push({ midi: m, x });
      x += whiteW;
    }
  }
  const blackKeys: { midi: number; x: number }[] = [];
  for (let m = lowMidi; m <= highMidi; m++) {
    if (!whitePc.includes(m % 12)) {
      const refX = xByMidi[m - 1];
      if (refX !== undefined) blackKeys.push({ midi: m, x: refX + whiteW - blackW / 2 });
    }
  }
  const hi = new Set(highlighted);
  return (
    <svg width={x} height={whiteH + 4} viewBox={`0 0 ${x} ${whiteH + 4}`} className={styles.keyboardSvg}>
      {whiteKeys.map((k) => (
        <rect
          key={k.midi}
          x={k.x}
          y="0"
          width={whiteW - 1}
          height={whiteH}
          className={hi.has(k.midi) ? `${styles.whiteKey} ${styles.active}` : styles.whiteKey}
        />
      ))}
      {blackKeys.map((k) => (
        <rect
          key={k.midi}
          x={k.x}
          y="0"
          width={blackW}
          height={blackH}
          className={hi.has(k.midi) ? `${styles.blackKey} ${styles.active}` : styles.blackKey}
        />
      ))}
    </svg>
  );
}

// ---------- Main ----------

interface SynthChain {
  synth: Tone.PolySynth;
  filter: Tone.Filter;
  reverb: Tone.Reverb;
}

export default function ChordMachine() {
  const [rootIdx, setRootIdx] = useState(9); // A
  const [modeKey, setModeKey] = useState<ModeKey>('minor');
  const [extended, setExtended] = useState(false);
  const [voicing, setVoicing] = useState<'plain' | 'stab'>('plain');
  const [clef, setClef] = useState<Clef>('bass');
  const [activeDegree, setActiveDegree] = useState<number | null>(null);

  const [timbre, setTimbre] = useState<TimbreKey>('piano');
  const [duration, setDuration] = useState(1.3);
  const [progId, setProgId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [bassMode, setBassMode] = useState<'pedal' | 'moving'>('pedal');
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const startedRef = useRef(false);
  const playTokenRef = useRef(0);

  const buildChain = useCallback((t: TimbreKey): SynthChain => {
    const cfg = TIMBRES[t];
    const filter = new Tone.Filter(cfg.filterFreq, 'lowpass').toDestination();
    const reverb = new Tone.Reverb({ decay: 1.8, wet: cfg.reverbWet }).connect(filter);
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: cfg.oscillator,
      envelope: cfg.envelope,
    }).connect(reverb);
    synth.volume.value = cfg.volume;
    return { synth, filter, reverb };
  }, []);

  const root = ROOTS[rootIdx];
  const mode = MODES[modeKey];
  const baseOctave = clef === 'treble' ? 4 : 2;

  const scalePlain = useMemo(() => buildExtendedScale(root, mode.intervals, baseOctave), [root, mode, baseOctave]);
  const scaleUpper = useMemo(() => buildExtendedScale(root, mode.intervals, 4), [root, mode]);
  const scaleLow = useMemo(() => buildExtendedScale(root, mode.intervals, 2), [root, mode]);

  const chords = useMemo(() => {
    const scaleForBuild = voicing === 'plain' ? scalePlain : scaleUpper;
    return [0, 1, 2, 3, 4, 5, 6].map((d) => buildChord(scaleForBuild, d, extended));
  }, [scalePlain, scaleUpper, voicing, extended]);

  // One synth chain, created lazily on first user gesture, reused forever after
  // (except when the timbre toggle rebuilds it — see the effect below).
  const ensureAudio = useCallback(async () => {
    if (!startedRef.current) {
      await Tone.start();
      startedRef.current = true;
    }
    if (!synthRef.current) {
      const chain = buildChain(timbre);
      synthRef.current = chain.synth;
      filterRef.current = chain.filter;
      reverbRef.current = chain.reverb;
    }
    return synthRef.current;
  }, [buildChain, timbre]);

  // Rebuild the chain when the timbre changes, but only once audio has actually
  // started — otherwise this would spin up Tone nodes before the first gesture.
  useEffect(() => {
    if (!synthRef.current) return;
    synthRef.current.dispose();
    filterRef.current?.dispose();
    reverbRef.current?.dispose();
    const chain = buildChain(timbre);
    synthRef.current = chain.synth;
    filterRef.current = chain.filter;
    reverbRef.current = chain.reverb;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timbre]);

  // Dispose the audio chain on unmount — this is a client-side-routed page now,
  // not a permanently-mounted artifact, so leaving Web Audio nodes around on
  // navigate-away would leak.
  useEffect(() => {
    return () => {
      synthRef.current?.dispose();
      filterRef.current?.dispose();
      reverbRef.current?.dispose();
    };
  }, []);

  const playChord = useCallback(
    async (chord: Chord) => {
      playTokenRef.current++; // cancel any running progression
      setIsPlaying(false);
      setProgId(null);
      const synth = await ensureAudio();
      let tones = chord.tones;
      if (voicing === 'stab') {
        const bassTone = scaleLow[chord.degree];
        tones = [bassTone, ...chord.tones.slice(1)];
      }
      const freqs = tones.map((t) => freqFromMidi(t.midi));
      synth.triggerAttackRelease(freqs, duration);
      setActiveDegree(chord.degree);
    },
    [ensureAudio, voicing, scaleLow, duration]
  );

  const stopAll = useCallback(() => {
    playTokenRef.current++;
    setIsPlaying(false);
    synthRef.current?.releaseAll();
  }, []);

  // Steps through a progression's degrees, holding the tonic as a pedal bass
  // (or letting the bass follow each chord's own root, via bassMode).
  const playProgression = useCallback(
    async (prog: Progression) => {
      const synth = await ensureAudio();
      const token = ++playTokenRef.current;
      setProgId(prog.id);
      setIsPlaying(true);
      const stepMs = duration * 1000;

      const runStep = (i: number) => {
        if (token !== playTokenRef.current) return;
        const degree = prog.degrees[i];
        const chord = chords[degree];
        setActiveDegree(degree);

        let tones = chord.tones;
        if (voicing === 'stab') {
          const bassDegree = bassMode === 'pedal' ? 0 : chord.degree;
          const bassTone = scaleLow[bassDegree];
          tones = [bassTone, ...chord.tones.slice(1)];
        }
        synth.triggerAttackRelease(tones.map((t) => freqFromMidi(t.midi)), duration);

        const next = i + 1;
        if (next < prog.degrees.length) {
          setTimeout(() => runStep(next), stepMs);
        } else if (loop) {
          setTimeout(() => runStep(0), stepMs);
        } else {
          setTimeout(() => {
            if (token === playTokenRef.current) {
              setIsPlaying(false);
            }
          }, stepMs);
        }
      };
      runStep(0);
    },
    [ensureAudio, chords, voicing, bassMode, scaleLow, duration, loop]
  );

  const activeChord = chords.find((c) => c.degree === activeDegree) || chords[0];

  let displayTones = activeChord.tones;
  let staffBlocks;
  if (voicing === 'stab') {
    const bassTone = scaleLow[activeChord.degree];
    const upperTones = activeChord.tones.slice(1);
    displayTones = [bassTone, ...upperTones];
    staffBlocks = (
      <div className={styles.grandStaff}>
        <Staff notes={upperTones} clef="treble" label="treble" />
        <Staff notes={[bassTone]} clef="bass" label="bass" />
      </div>
    );
  } else {
    staffBlocks = <Staff notes={activeChord.tones} clef={clef} label={clef} />;
  }

  const highlightedMidis = displayTones.map((t) => t.midi);

  return (
    <div className={styles.cmRoot}>
      <Link href="/" className={`btn btn--link mobile-nav-link ${styles.backLink}`}>← Home</Link>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Chord Machine</h1>
          <span className={styles.panelSub}>{root.name} {mode.label}</span>
        </div>

        <div className={styles.controls}>
          <div className={styles.control}>
            <label className={styles.controlLabel}>Root</label>
            <select className={styles.rootSelect} value={rootIdx} onChange={(e) => setRootIdx(Number(e.target.value))}>
              {ROOTS.map((r, i) => (
                <option key={r.name} value={i}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.control}>
            <label className={styles.controlLabel}>Mode</label>
            <div className={styles.seg}>
              {(Object.entries(MODES) as [ModeKey, typeof MODES[ModeKey]][]).map(([k, m]) => (
                <button key={k} type="button" className={modeKey === k ? styles.on : ''} onClick={() => setModeKey(k)}>{m.label}</button>
              ))}
            </div>
          </div>
          <div className={styles.control}>
            <label className={styles.controlLabel}>Chords</label>
            <div className={styles.seg}>
              <button type="button" className={!extended ? styles.on : ''} onClick={() => setExtended(false)}>Triads</button>
              <button type="button" className={extended ? styles.on : ''} onClick={() => setExtended(true)}>7ths</button>
            </div>
          </div>
          <div className={styles.control}>
            <label className={styles.controlLabel}>Voicing</label>
            <div className={styles.seg}>
              <button type="button" className={voicing === 'plain' ? styles.on : ''} onClick={() => setVoicing('plain')}>Plain</button>
              <button type="button" className={voicing === 'stab' ? styles.on : ''} onClick={() => setVoicing('stab')}>Stab</button>
            </div>
          </div>
          <div className={styles.control}>
            <label className={styles.controlLabel}>Tone</label>
            <div className={styles.seg}>
              <button type="button" className={timbre === 'piano' ? styles.on : ''} onClick={() => setTimbre('piano')}>Piano</button>
              <button type="button" className={timbre === 'synth' ? styles.on : ''} onClick={() => setTimbre('synth')}>Synth</button>
            </div>
          </div>
          <div className={styles.control}>
            <label className={styles.controlLabel}>Clef {voicing === 'stab' ? '(grand, auto)' : ''}</label>
            <div className={styles.seg}>
              <button type="button" disabled={voicing === 'stab'} className={clef === 'treble' ? styles.on : ''} onClick={() => setClef('treble')}>Treble</button>
              <button type="button" disabled={voicing === 'stab'} className={clef === 'bass' ? styles.on : ''} onClick={() => setClef('bass')}>Bass</button>
            </div>
          </div>
        </div>

        <div className={styles.transport}>
          <label className={styles.controlLabel}>Duration <span className={styles.durationVal}>{duration.toFixed(1)}s</span></label>
          <div className={styles.transportRow}>
            <input
              type="range"
              min="1"
              max="8"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={styles.durationSlider}
            />
            <button type="button" className={styles.stopBtn} onClick={stopAll}>Stop</button>
          </div>
        </div>

        <div className={styles.pads}>
          {chords.map((c) => (
            <button
              type="button"
              key={c.degree}
              className={c.degree === activeChord.degree ? `${styles.pad} ${styles.padActive}` : styles.pad}
              onClick={() => playChord(c)}
            >
              <span className={styles.padRoman}>{c.roman}</span>
              <span className={styles.padName}>{c.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.progressions}>
          <div className={styles.progHeader}>
            <p className={styles.readoutTitle}>Progressions</p>
            <div className={styles.progToggles}>
              <label className={styles.check}>
                <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
                Loop
              </label>
              <div className={`${styles.seg} ${styles.segSmall}`}>
                <button type="button" disabled={voicing !== 'stab'} className={bassMode === 'pedal' ? styles.on : ''} onClick={() => setBassMode('pedal')}>Pedal bass</button>
                <button type="button" disabled={voicing !== 'stab'} className={bassMode === 'moving' ? styles.on : ''} onClick={() => setBassMode('moving')}>Moving bass</button>
              </div>
            </div>
          </div>
          {voicing !== 'stab' && <p className={styles.progHint}>Switch Voicing to Stab above to hear a held bass under these.</p>}
          <div className={styles.progList}>
            {PROGRESSIONS.map((p) => (
              <div key={p.id} className={progId === p.id && isPlaying ? `${styles.progRow} ${styles.progRowActive}` : styles.progRow}>
                <div className={styles.progInfo}>
                  <span className={styles.progName}>{p.name}</span>
                  <span className={styles.progDesc}>{p.desc}</span>
                </div>
                <button type="button" className={styles.progPlay} onClick={() => playProgression(p)}>
                  {progId === p.id && isPlaying ? '▶ Playing' : '▶ Play'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.readout}>
          <p className={styles.readoutTitle}>Notation — {activeChord.label}</p>
          <div className={styles.staffWrap}>{staffBlocks}</div>
          <div className={styles.kbWrap}>
            <Keyboard highlighted={highlightedMidis} />
          </div>
        </div>
      </div>
    </div>
  );
}
