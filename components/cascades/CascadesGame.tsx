'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Board, ColorType } from '@/lib/cascades/board';
import { generateSparks, Spark } from '@/app/utils/sparks';
import styles from './CascadesGame.module.css';

const COLORS: ColorType[] = ['1', '2', '3', '4', '5', '6', '7'];
const WIDTH = 8;
const HEIGHT = 8;

export default function CascadesGame() {
  const board = useRef(new Board(WIDTH, HEIGHT, COLORS));
  const tileRefs = useRef<(HTMLDivElement | null)[]>(Array(WIDTH * HEIGHT).fill(null));
  const draggedId = useRef<number | null>(null);
  const draggedType = useRef<ColorType | null>(null);
  const replacedId = useRef<number | null>(null);
  const replacedType = useRef<ColorType | null>(null);

  const [grid, setGrid] = useState<ColorType[]>(() => {
    board.current.initialize();
    return [...board.current.grid];
  });
  const [score, setScore] = useState(0);
  const [dropSpeed, setDropSpeed] = useState(200);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [showNoMovesModal, setShowNoMovesModal] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSparks(generateSparks(20));
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // dropSpeed ref so async moveDown closures always read the latest value
  const dropSpeedRef = useRef(dropSpeed);

  function handleSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const slider = e.currentTarget;
    const speed = Number(slider.max) - (Number(slider.value) - Number(slider.min));
    dropSpeedRef.current = speed;
    setDropSpeed(speed);
  }

  function resetDragState() {
    draggedId.current = null;
    draggedType.current = null;
    replacedId.current = null;
    replacedType.current = null;
  }

  function animateFill(index: number, color: ColorType): Promise<void> {
    return new Promise((resolve) => {
      const el = tileRefs.current[index];
      if (!el) { resolve(); return; }
      el.classList.add(styles.fill);
      el.dataset.type = color;
      board.current.grid[index] = color;
      setTimeout(() => {
        el.classList.remove(styles.fill);
        resolve();
      }, dropSpeedRef.current);
    });
  }

  function syncAllTiles() {
    board.current.grid.forEach((color, i) => {
      const el = tileRefs.current[i];
      if (el) el.dataset.type = color;
    });
  }

  async function moveDown() {
    const { grid: g, width } = board.current;
    const totalTiles = WIDTH * HEIGHT;
    const bottomLeft = totalTiles - width;

    for (let i = totalTiles - 1; i >= bottomLeft; i--) {
      const emptyIndexes: number[] = [];
      let current = i;

      while (current >= 0) {
        if (g[current] === 'null') {
          emptyIndexes.push(current);
        } else if (emptyIndexes.length > 0) {
          const color = g[current];
          const nextUp = emptyIndexes.shift()!;
          g[current] = 'null';
          emptyIndexes.push(current);
          await animateFill(nextUp, color);
        }
        current -= width;
      }

      while (emptyIndexes.length > 0) {
        const nextUp = emptyIndexes.shift()!;
        const newColor = board.current.getRandomColor();
        await animateFill(nextUp, newColor);
      }
    }

    const matched = board.current.findCascadeMatches();
    if (matched.size > 0) {
      syncAllTiles();
      setScore(s => s + matched.size * 10);
      moveDown();
      return;
    }

    setGrid([...board.current.grid]);

    if (board.current.anyAvailableMoves().length < 3) {
      setTimeout(() => setShowNoMovesModal(true), 500);
    }
  }

  function onDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    draggedType.current = board.current.grid[index];
    draggedId.current = index;
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    if (draggedId.current === null) return;
    const dType = draggedType.current!;
    replacedType.current = board.current.grid[index];
    replacedId.current = index;

    if (
      board.current.isValidMove(draggedId.current, index) &&
      board.current.makesThreeInARow(index, dType)
    ) {
      e.preventDefault();
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, index: number) {
    if (draggedId.current === null) return;
    const dId = draggedId.current;
    const dType = draggedType.current!;
    const rType = board.current.grid[index];
    replacedId.current = index;
    replacedType.current = rType;

    if (
      board.current.isValidMove(dId, index) &&
      board.current.makesThreeInARow(index, dType)
    ) {
      board.current.grid[dId] = rType;
      board.current.grid[index] = dType;

      const el1 = tileRefs.current[dId];
      const el2 = tileRefs.current[index];
      if (el1) el1.dataset.type = rType;
      if (el2) el2.dataset.type = dType;

      const horz1 = board.current.removeMatchingHorzTiles(index, dType);
      const horz2 = board.current.removeMatchingHorzTiles(dId, rType);
      const vert1 = board.current.removeMatchingVertTiles(index, dType);
      const vert2 = board.current.removeMatchingVertTiles(dId, rType);
      syncAllTiles();

      const matched = new Set([...horz1, ...horz2, ...vert1, ...vert2]);
      setScore(s => s + matched.size * 10);
      moveDown();
    }
    resetDragState();
  }

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>, index: number) {
    draggedType.current = board.current.grid[index];
    draggedId.current = index;
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && (element as HTMLElement).dataset.index !== undefined) {
      const idx = parseInt((element as HTMLElement).dataset.index!);
      if (!isNaN(idx)) {
        replacedType.current = board.current.grid[idx];
        replacedId.current = idx;
      }
    }
  }

  async function onTouchEnd() {
    if (draggedId.current === null) return;
    const dId = draggedId.current;
    const dType = draggedType.current!;
    const rId = replacedId.current;
    const rType = replacedType.current;

    if (
      rId !== null &&
      rType !== null &&
      board.current.isValidMove(dId, rId) &&
      board.current.makesThreeInARow(rId, dType)
    ) {
      board.current.grid[dId] = rType;
      const el1 = tileRefs.current[dId];
      if (el1) el1.dataset.type = rType;

      await animateFill(rId, dType);
      board.current.grid[rId] = dType;

      const horz1 = board.current.removeMatchingHorzTiles(rId, dType);
      const horz2 = board.current.removeMatchingHorzTiles(dId, rType);
      const vert1 = board.current.removeMatchingVertTiles(rId, dType);
      const vert2 = board.current.removeMatchingVertTiles(dId, rType);
      syncAllTiles();

      const matched = new Set([...horz1, ...horz2, ...vert1, ...vert2]);
      setScore(s => s + matched.size * 10);
      moveDown();
    }
    resetDragState();
  }

  function resetGame() {
    board.current = new Board(WIDTH, HEIGHT, COLORS);
    board.current.initialize();
    tileRefs.current = Array(WIDTH * HEIGHT).fill(null);
    setGrid([...board.current.grid]);
    setScore(0);
    setShowNoMovesModal(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.mesh} />
      <div className={styles.orb} style={{ width: 320, height: 320, background: 'var(--plum-mid)', top: '5%', left: '-8%', animationDuration: '22s' }} />
      <div className={styles.orb} style={{ width: 220, height: 220, background: 'var(--amber-deep)', bottom: '10%', right: '-5%', animationDuration: '17s', animationDelay: '-8s' }} />
      <div className={styles.orb} style={{ width: 180, height: 180, background: 'var(--plum-mid)', top: '55%', left: '60%', animationDuration: '25s', animationDelay: '-12s' }} />
      {sparks.map((s, i) => (
        <div key={i} className={styles.spark} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }} />
      ))}

      <Link href="/" className={styles.backLink}>← Home</Link>

      <div className={`${styles.gameContainer} ${visible ? styles.visible : ''}`}>
      <h1>Cascades</h1>

      <div className={styles.scoreBoard}>
        <div className={styles.scoreBox}>
          Score:&nbsp;<span>{score}</span>
        </div>
      </div>

      <div className={styles.controlsBox}>
        <div className={styles.resetBox}>
          <button className={styles.button} onClick={resetGame}>Reset Board</button>
        </div>
        <div className={styles.speedControlBox}>
          <div>Cascade Speed</div>
          <input
            type="range"
            min="100"
            max="300"
            defaultValue="200"
            onChange={handleSpeedChange}
          />
        </div>
      </div>

      <div className={styles.gameBoard}>
        {grid.map((color, i) => (
          <div
            key={i}
            ref={el => { tileRefs.current[i] = el; }}
            className={styles.tile}
            data-type={color}
            data-index={i}
            draggable
            onDragStart={e => onDragStart(e, i)}
            onDragEnter={e => e.preventDefault()}
            onDragOver={e => onDragOver(e, i)}
            onDrop={e => onDrop(e, i)}
            onTouchStart={e => onTouchStart(e, i)}
            onTouchMove={e => onTouchMove(e)}
            onTouchEnd={onTouchEnd}
            onTouchCancel={resetDragState}
          />
        ))}
      </div>

      <div className={styles.creditsBox}>
        <div className={styles.linkBox}>
          <a href="https://github.com/ck4adventure/cascades">Github</a>
        </div>
        <div className={styles.versionBox}>v0.6</div>
        <div className={styles.howToButtonBox}>
          <button className={styles.button} onClick={() => setShowHowToModal(true)}>
            How to Play
          </button>
        </div>
      </div>

      {showHowToModal && (
        <div className={styles.modal} onClick={() => setShowHowToModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.xButtonRow}>
              <button className={styles.xButton} onClick={() => setShowHowToModal(false)}>X</button>
            </div>
            <div className={styles.modalText}>
              <h2>How to Play</h2>
              <p>
                Match 3 in a row horizontally or vertically by dragging squares. Squares can only
                move 1 unit in each direction, and only if it makes a match of 3 or more.
              </p>
              <p>
                Once a match is formed, tiles will move downwards in a cascade. If a new 3 in a row
                is formed, tiles will continue cascading.
              </p>
            </div>
            <div>
              <button className={styles.button} onClick={() => setShowHowToModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showNoMovesModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalText}>
              <h2>No More Moves</h2>
            </div>
            <div className={styles.buttonRow}>
              <div className={styles.buttonRowItem} />
              <button
                className={`${styles.button} ${styles.buttonRowItem}`}
                onClick={() => { setShowNoMovesModal(false); resetGame(); }}
              >
                Start New Game
              </button>
              <button
                className={`${styles.button} ${styles.buttonRowItem}`}
                onClick={() => setShowNoMovesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
