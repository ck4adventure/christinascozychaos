import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import * as Tone from 'tone';

// Two timbre presets: a soft plucked "piano" feel, and a warm filtered synth pad.
const TIMBRES = {
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

const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PITCH = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const ROOTS = [
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
].map((r) => ({ ...r, pitchClass: ((LETTER_PITCH[r.letter] + r.acc) % 12 + 12) % 12 }));

const MODES = {
  major: { label: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { label: 'Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  phrygian: { label: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10] },
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// A handful of recurring minor-key progressions from techno / DnB / psychill —
// degree indices into the 7 diatonic chords (0 = i, 5 = VI, etc).
const PROGRESSIONS = [
  { id: 'vi-iii-vii', name: 'i \u2013 VI \u2013 III \u2013 VII', degrees: [0, 5, 2, 6], desc: 'Looping minor anthem \u2014 trance/DnB build engine.' },
  { id: 'vii-vi-v', name: 'i \u2013 VII \u2013 VI \u2013 V', degrees: [0, 6, 5, 4], desc: 'Descending tension \u2014 psytrance / dark-techno staple.' },
  { id: 'iv-v', name: 'i \u2013 iv \u2013 v', degrees: [0, 3, 4], desc: 'Sparse and cold \u2014 rolling, drum-forward tracks.' },
  { id: 'bII', name: 'i \u2013 \u266DII', degrees: [0, 1], desc: 'Half-step dread \u2014 try this with Phrygian mode.' },
];

// Builds 15 diatonic scale steps (2 octaves + 1) with correct letter-spelling,
// so triads/7ths built by stacking thirds never need re-spelling.
function buildExtendedScale(root, intervals, baseOctave) {
  const startLetterIdx = NOTE_LETTERS.indexOf(root.letter);
  const out = [];
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

function noteLabel(entry) {
  const acc = entry.accidental === 1 ? '\u266F' : entry.accidental === -1 ? '\u266D' : '';
  return `${entry.letter}${acc}`;
}

function qualityFromIntervals(third, fifth) {
  if (third === 4 && fifth === 7) return { upper: true, symbol: '', label: '' };
  if (third === 3 && fifth === 7) return { upper: false, symbol: '', label: 'm' };
  if (third === 3 && fifth === 6) return { upper: false, symbol: '\u00B0', label: 'dim' };
  if (third === 4 && fifth === 8) return { upper: true, symbol: '+', label: 'aug' };
  return { upper: true, symbol: '', label: '' };
}

function seventhLabel(base, seventh) {
  if (seventh === 11) return base === '' ? 'maj7' : base === 'm' ? 'm(maj7)' : `${base}(maj7)`;
  if (seventh === 10) return base === '' ? '7' : base === 'm' ? 'm7' : base === 'dim' ? 'm7\u266D5' : `${base}7`;
  if (seventh === 9) return base === 'dim' ? 'dim7' : `${base}7`;
  return `${base}7`;
}

function buildChord(scale, degree, extended) {
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

function freqFromMidi(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ---------- Staff notation ----------

function diatonicIndex(letter, octave) {
  return octave * 7 + NOTE_LETTERS.indexOf(letter);
}

const CLEF_REF = {
  treble: diatonicIndex('E', 4),
  bass: diatonicIndex('G', 2),
};

function Staff({ notes, clef, width = 260, label }) {
  const spacing = 11;
  const bottomY = 96;
  const lines = [0, 2, 4, 6, 8].map((p) => bottomY - p * (spacing / 2));

  const noteData = notes.map((n) => {
    const idx = diatonicIndex(n.letter, n.octave);
    const pos = idx - CLEF_REF[clef];
    const y = bottomY - pos * (spacing / 2);
    return { ...n, pos, y };
  });

  const ledgers = [];
  noteData.forEach((n) => {
    if (n.pos > 8) {
      for (let p = 10; p <= n.pos; p += 2) ledgers.push(bottomY - p * (spacing / 2));
    } else if (n.pos < 0) {
      for (let p = -2; p >= n.pos; p -= 2) ledgers.push(bottomY - p * (spacing / 2));
    }
  });

  return (
    <svg width={width} height="140" viewBox={`0 0 ${width} 140`} className="staff-svg">
      {label && <text x="8" y="14" className="staff-label">{label}</text>}
      {lines.map((y, i) => (
        <line key={i} x1="30" x2={width - 20} y1={y} y2={y} className="staff-line" />
      ))}
      <text
        x="34"
        y={clef === 'treble' ? bottomY - 2 * (spacing / 2) + 6 : bottomY - 4 * (spacing / 2) + 6}
        className="clef-glyph"
      >
        {clef === 'treble' ? '\uD834\uDD1E' : '\uD834\uDD22'}
      </text>
      {ledgers.map((y, i) => (
        <line key={i} x1="53" x2="71" y1={y} y2={y} className="ledger-line" />
      ))}
      {noteData.map((n, i) => (
        <g key={i}>
          {n.accidental !== 0 && (
            <text x="46" y={n.y + 4} className="accidental">
              {n.accidental === 1 ? '\u266F' : '\u266D'}
            </text>
          )}
          <ellipse cx="62" cy={n.y} rx="7" ry="5.5" className="notehead" />
        </g>
      ))}
    </svg>
  );
}

// ---------- Keyboard ----------

function Keyboard({ highlighted, lowMidi = 36, highMidi = 84 }) {
  const whiteW = 22, whiteH = 100, blackW = 13, blackH = 62;
  const whitePc = [0, 2, 4, 5, 7, 9, 11];
  let x = 0;
  const whiteKeys = [];
  const xByMidi = {};
  for (let m = lowMidi; m <= highMidi; m++) {
    if (whitePc.includes(m % 12)) {
      xByMidi[m] = x;
      whiteKeys.push({ midi: m, x });
      x += whiteW;
    }
  }
  const blackKeys = [];
  for (let m = lowMidi; m <= highMidi; m++) {
    if (!whitePc.includes(m % 12)) {
      const refX = xByMidi[m - 1];
      if (refX !== undefined) blackKeys.push({ midi: m, x: refX + whiteW - blackW / 2 });
    }
  }
  const hi = new Set(highlighted);
  return (
    <svg width={x} height={whiteH + 4} viewBox={`0 0 ${x} ${whiteH + 4}`} className="keyboard-svg">
      {whiteKeys.map((k) => (
        <rect
          key={k.midi}
          x={k.x}
          y="0"
          width={whiteW - 1}
          height={whiteH}
          className={hi.has(k.midi) ? 'white-key active' : 'white-key'}
        />
      ))}
      {blackKeys.map((k) => (
        <rect
          key={k.midi}
          x={k.x}
          y="0"
          width={blackW}
          height={blackH}
          className={hi.has(k.midi) ? 'black-key active' : 'black-key'}
        />
      ))}
    </svg>
  );
}

// ---------- Main ----------

export default function ChordMachine() {
  const [rootIdx, setRootIdx] = useState(9); // A
  const [modeKey, setModeKey] = useState('minor');
  const [extended, setExtended] = useState(false);
  const [voicing, setVoicing] = useState('plain');
  const [clef, setClef] = useState('bass');
  const [activeDegree, setActiveDegree] = useState(null);

  const [timbre, setTimbre] = useState('piano');
  const [duration, setDuration] = useState(1.3);
  const [progId, setProgId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [loop, setLoop] = useState(true);
  const [bassMode, setBassMode] = useState('pedal');
  const synthRef = useRef(null);
  const filterRef = useRef(null);
  const reverbRef = useRef(null);
  const startedRef = useRef(false);
  const playTokenRef = useRef(0);

  const buildChain = useCallback((t) => {
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
    filterRef.current.dispose();
    reverbRef.current.dispose();
    const chain = buildChain(timbre);
    synthRef.current = chain.synth;
    filterRef.current = chain.filter;
    reverbRef.current = chain.reverb;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timbre]);

  const playChord = useCallback(
    async (chord) => {
      playTokenRef.current++; // cancel any running progression
      setIsPlaying(false);
      setStepIndex(-1);
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
    setStepIndex(-1);
    if (synthRef.current) synthRef.current.releaseAll();
  }, []);

  // Steps through a progression's degrees, holding the tonic as a pedal bass
  // (or letting the bass follow each chord's own root, via bassMode).
  const playProgression = useCallback(
    async (prog) => {
      const synth = await ensureAudio();
      const token = ++playTokenRef.current;
      setProgId(prog.id);
      setIsPlaying(true);
      const stepMs = duration * 1000;

      const runStep = (i) => {
        if (token !== playTokenRef.current) return;
        const degree = prog.degrees[i];
        const chord = chords[degree];
        setStepIndex(i);
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
              setStepIndex(-1);
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
      <div className="grand-staff">
        <Staff notes={upperTones} clef="treble" label="treble" />
        <Staff notes={[bassTone]} clef="bass" label="bass" />
      </div>
    );
  } else {
    staffBlocks = <Staff notes={activeChord.tones} clef={clef} label={clef} />;
  }

  const highlightedMidis = displayTones.map((t) => t.midi);

  return (
    <div className="cm-root">
      <style>{`
        .cm-root { background:#0f0e0d; min-height:640px; padding:32px 16px; display:flex; justify-content:center; font-family:'Segoe UI', Inter, system-ui, sans-serif; }
        .panel { width:100%; max-width:720px; background:#1c1b1a; border:1px solid #3a3733; border-radius:6px; box-shadow:0 20px 40px rgba(0,0,0,0.5); }
        .panel-header { padding:18px 22px 14px; border-bottom:1px solid #3a3733; display:flex; align-items:baseline; justify-content:space-between; }
        .panel-title { font-family:Georgia, serif; font-size:19px; letter-spacing:0.02em; color:#e8e3d8; margin:0; }
        .panel-sub { font-size:11px; color:#8a857b; font-family:'Courier New', monospace; }
        .controls { display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1px; background:#3a3733; border-bottom:1px solid #3a3733; }
        .control { background:#1c1b1a; padding:10px 14px 12px; }
        .control-label { font-family:'Courier New', monospace; font-size:10px; letter-spacing:0.08em; color:#8a857b; text-transform:uppercase; display:block; margin-bottom:6px; }
        .seg { display:flex; border:1px solid #4a463f; border-radius:3px; overflow:hidden; }
        .seg button { flex:1; background:#131211; color:#b3ada0; border:none; font-size:11px; padding:6px 4px; cursor:pointer; font-family:'Courier New', monospace; border-right:1px solid #3a3733; }
        .seg button:last-child { border-right:none; }
        .seg button.on { background:#ff5a36; color:#1c1b1a; font-weight:600; }
        .seg button:disabled { opacity:0.35; cursor:not-allowed; }
        select.root-select { width:100%; background:#131211; color:#e8e3d8; border:1px solid #4a463f; border-radius:3px; padding:6px 6px; font-family:'Courier New', monospace; font-size:12px; }
        .transport { padding:12px 20px; border-bottom:1px solid #3a3733; }
        .duration-val { color:#ff5a36; font-family:'Courier New', monospace; text-transform:none; letter-spacing:0; margin-left:4px; }
        .transport-row { display:flex; align-items:center; gap:12px; margin-top:6px; }
        .duration-slider { flex:1; accent-color:#ff5a36; height:4px; cursor:pointer; }
        .stop-btn { background:#131211; color:#b3ada0; border:1px solid #4a463f; border-radius:3px; padding:6px 16px; font-family:'Courier New', monospace; font-size:11px; letter-spacing:0.05em; text-transform:uppercase; cursor:pointer; }
        .stop-btn:hover { border-color:#ff5a36; color:#ff5a36; }
        .progressions { padding:14px 20px 18px; border-bottom:1px solid #3a3733; }
        .prog-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }
        .prog-toggles { display:flex; align-items:center; gap:14px; }
        .check { display:flex; align-items:center; gap:6px; font-family:'Courier New', monospace; font-size:11px; color:#b3ada0; cursor:pointer; }
        .check input { accent-color:#ff5a36; }
        .seg.small button { padding:5px 10px; font-size:10px; }
        .prog-hint { font-size:11px; color:#6a6459; margin:8px 0 0; }
        .prog-list { display:flex; flex-direction:column; gap:6px; margin-top:12px; }
        .prog-row { display:flex; align-items:center; justify-content:space-between; gap:12px; background:#131211; border:1px solid #3a3733; border-radius:4px; padding:8px 12px; }
        .prog-row.active { border-color:#ff5a36; background:#241a15; }
        .prog-info { display:flex; flex-direction:column; gap:2px; }
        .prog-name { font-family:Georgia, serif; font-size:13px; color:#e8e3d8; }
        .prog-desc { font-family:'Courier New', monospace; font-size:10px; color:#8a857b; }
        .prog-play { background:#131211; color:#b3ada0; border:1px solid #4a463f; border-radius:3px; padding:6px 12px; font-family:'Courier New', monospace; font-size:10px; letter-spacing:0.04em; cursor:pointer; white-space:nowrap; }
        .prog-play:hover { border-color:#ff5a36; color:#ff5a36; }
        .prog-row.active .prog-play { border-color:#ff5a36; color:#ff5a36; }
        .pads { display:grid; grid-template-columns:repeat(7, 1fr); gap:6px; padding:18px 20px; }
        .pad { background:#131211; border:1px solid #3a3733; border-radius:4px; padding:10px 4px 8px; text-align:center; cursor:pointer; color:#b3ada0; }
        .pad:hover { border-color:#6a6459; }
        .pad.active { border-color:#ff5a36; background:#241a15; }
        .pad-roman { font-family:Georgia, serif; font-size:15px; color:#e8e3d8; display:block; }
        .pad.active .pad-roman { color:#ff5a36; }
        .pad-name { font-family:'Courier New', monospace; font-size:10px; color:#8a857b; display:block; margin-top:4px; }
        .readout { padding:16px 20px 22px; border-top:1px solid #3a3733; }
        .readout-title { font-family:'Courier New', monospace; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:#8a857b; margin:0 0 10px; }
        .staff-wrap { background:#131211; border:1px solid #3a3733; border-radius:4px; padding:10px; overflow-x:auto; }
        .grand-staff { display:flex; flex-direction:column; }
        .staff-svg { display:block; }
        .staff-line { stroke:#6a6459; stroke-width:1; }
        .ledger-line { stroke:#8fe3c0; stroke-width:1.2; }
        .notehead { fill:#ff5a36; }
        .accidental { fill:#ff5a36; font-size:13px; }
        .clef-glyph { fill:#8a857b; font-size:28px; }
        .staff-label { fill:#6a6459; font-size:9px; font-family:'Courier New', monospace; text-transform:uppercase; }
        .kb-wrap { margin-top:12px; background:#131211; border:1px solid #3a3733; border-radius:4px; padding:10px; overflow-x:auto; }
        .keyboard-svg { display:block; }
        .white-key { fill:#e8e3d8; stroke:#3a3733; stroke-width:0.5; }
        .white-key.active { fill:#8fe3c0; }
        .black-key { fill:#131211; stroke:#0f0e0d; }
        .black-key.active { fill:#ff5a36; }
      `}</style>

      <div className="panel">
        <div className="panel-header">
          <h1 className="panel-title">Chord Machine</h1>
          <span className="panel-sub">{root.name} {mode.label}</span>
        </div>

        <div className="controls">
          <div className="control">
            <label className="control-label">Root</label>
            <select className="root-select" value={rootIdx} onChange={(e) => setRootIdx(Number(e.target.value))}>
              {ROOTS.map((r, i) => (
                <option key={r.name} value={i}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="control">
            <label className="control-label">Mode</label>
            <div className="seg">
              {Object.entries(MODES).map(([k, m]) => (
                <button key={k} className={modeKey === k ? 'on' : ''} onClick={() => setModeKey(k)}>{m.label}</button>
              ))}
            </div>
          </div>
          <div className="control">
            <label className="control-label">Chords</label>
            <div className="seg">
              <button className={!extended ? 'on' : ''} onClick={() => setExtended(false)}>Triads</button>
              <button className={extended ? 'on' : ''} onClick={() => setExtended(true)}>7ths</button>
            </div>
          </div>
          <div className="control">
            <label className="control-label">Voicing</label>
            <div className="seg">
              <button className={voicing === 'plain' ? 'on' : ''} onClick={() => setVoicing('plain')}>Plain</button>
              <button className={voicing === 'stab' ? 'on' : ''} onClick={() => setVoicing('stab')}>Stab</button>
            </div>
          </div>
          <div className="control">
            <label className="control-label">Tone</label>
            <div className="seg">
              <button className={timbre === 'piano' ? 'on' : ''} onClick={() => setTimbre('piano')}>Piano</button>
              <button className={timbre === 'synth' ? 'on' : ''} onClick={() => setTimbre('synth')}>Synth</button>
            </div>
          </div>
          <div className="control">
            <label className="control-label">Clef {voicing === 'stab' ? '(grand, auto)' : ''}</label>
            <div className="seg">
              <button disabled={voicing === 'stab'} className={clef === 'treble' ? 'on' : ''} onClick={() => setClef('treble')}>Treble</button>
              <button disabled={voicing === 'stab'} className={clef === 'bass' ? 'on' : ''} onClick={() => setClef('bass')}>Bass</button>
            </div>
          </div>
        </div>

        <div className="transport">
          <label className="control-label">Duration <span className="duration-val">{duration.toFixed(1)}s</span></label>
          <div className="transport-row">
            <input
              type="range"
              min="1"
              max="8"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="duration-slider"
            />
            <button className="stop-btn" onClick={stopAll}>Stop</button>
          </div>
        </div>

        <div className="pads">
          {chords.map((c) => (
            <div
              key={c.degree}
              className={'pad' + (c.degree === activeChord.degree ? ' active' : '')}
              onClick={() => playChord(c)}
            >
              <span className="pad-roman">{c.roman}</span>
              <span className="pad-name">{c.label}</span>
            </div>
          ))}
        </div>

        <div className="progressions">
          <div className="prog-header">
            <p className="readout-title">Progressions</p>
            <div className="prog-toggles">
              <label className="check">
                <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
                Loop
              </label>
              <div className="seg small">
                <button disabled={voicing !== 'stab'} className={bassMode === 'pedal' ? 'on' : ''} onClick={() => setBassMode('pedal')}>Pedal bass</button>
                <button disabled={voicing !== 'stab'} className={bassMode === 'moving' ? 'on' : ''} onClick={() => setBassMode('moving')}>Moving bass</button>
              </div>
            </div>
          </div>
          {voicing !== 'stab' && <p className="prog-hint">Switch Voicing to Stab above to hear a held bass under these.</p>}
          <div className="prog-list">
            {PROGRESSIONS.map((p) => (
              <div key={p.id} className={'prog-row' + (progId === p.id && isPlaying ? ' active' : '')}>
                <div className="prog-info">
                  <span className="prog-name">{p.name}</span>
                  <span className="prog-desc">{p.desc}</span>
                </div>
                <button className="prog-play" onClick={() => playProgression(p)}>
                  {progId === p.id && isPlaying ? '\u25B6 Playing' : '\u25B6 Play'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="readout">
          <p className="readout-title">Notation — {activeChord.label}</p>
          <div className="staff-wrap">{staffBlocks}</div>
          <div className="kb-wrap">
            <Keyboard highlighted={highlightedMidis} />
          </div>
        </div>
      </div>
    </div>
  );
}
