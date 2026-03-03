// utils/sparks.ts

export type Spark = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

export function generateSparks(count: number): Spark[] {
  return Array.from({ length: count }, (_, i): Spark => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
  }));
}
