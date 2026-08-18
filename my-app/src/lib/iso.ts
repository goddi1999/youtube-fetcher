export const GRID = 32
const COS = Math.cos(Math.PI / 6)
const SIN = Math.sin(Math.PI / 6)

export type Point = { x: number; y: number }

export function project(x: number, y: number, z = 0): Point {
  return {
    x: (x - y) * COS * GRID,
    y: (x + y) * SIN * GRID - z * GRID,
  }
}

export function poly(points: Point[]): string {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")
}

export function prismFaces(
  x: number,
  y: number,
  w: number,
  d: number,
  h: number,
) {
  const top = [
    project(x, y, h),
    project(x + w, y, h),
    project(x + w, y + d, h),
    project(x, y + d, h),
  ]
  const left = [
    project(x, y + d, h),
    project(x + w, y + d, h),
    project(x + w, y + d, 0),
    project(x, y + d, 0),
  ]
  const right = [
    project(x + w, y, h),
    project(x + w, y + d, h),
    project(x + w, y + d, 0),
    project(x + w, y, 0),
  ]
  return { top, left, right }
}

export function platePoly(x: number, y: number, w: number, d: number) {
  return poly([
    project(x, y),
    project(x + w, y),
    project(x + w, y + d),
    project(x, y + d),
  ])
}

export function plateLabelAnchor(x: number, y: number) {
  return project(x, y)
}

export function blockTopCenter(x: number, y: number, w: number, d: number, h: number) {
  return project(x + w / 2, y + d / 2, h)
}

export function blockGroundCenter(x: number, y: number, w: number, d: number) {
  return project(x + w / 2, y + d / 2, 0)
}

export function heightFromCount(count: number, max: number) {
  if (max <= 0 || count <= 0) return 0.7
  return 0.55 + (count / max) ** 0.35 * 5.2
}

export function pathThrough(points: Point[]): string {
  if (points.length === 0) return ""
  const [first, ...rest] = points
  return `M ${first.x.toFixed(2)} ${first.y.toFixed(2)} ${rest
    .map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ")}`
}
