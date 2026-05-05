"use client";

import { useId, useMemo, useState } from "react";
import type { GeometryColumn, ParsedGeometry } from "@/lib/parseGeometryTable";

/** 侧视示意世界坐标：毫米 → 像素（须与车架、标尺一致）。 */
const GEOMETRY_PX_PER_MM = 0.168;
/** 竖直标尺总高 1 m（贴地 0 → 顶）。 */
const RULER_HEIGHT_MM = 1000;
/** 离地 200、400、600、800 mm 处的横刻度与数字。 */
const RULER_MARK_MM = [200, 400, 600, 800] as const;

function defaultSizeId(columns: GeometryColumn[]): string {
  const m = columns.find((c) => /^m$/i.test(c.sizeId));
  if (m) return m.sizeId;
  const mid = columns[Math.floor(columns.length / 2)];
  return mid?.sizeId ?? columns[0]?.sizeId ?? "M";
}

function wheelNote(col: GeometryColumn): string | undefined {
  for (const [k, v] of Object.entries(col.byMetricLabel)) {
    if (/车轮|轮径|wheel/i.test(k)) return v;
  }
  return undefined;
}

type Pt = { x: number; y: number };

function shiftPt(p: Pt, dy: number): Pt {
  return { x: p.x, y: p.y + dy };
}

type SideViewGeo = {
  bb: Pt;
  rearAxle: Pt;
  seat: Pt;
  htLower: Pt;
  htUpper: Pt;
  frontAxle: Pt;
  saddle: Pt;
  stemTip: Pt;
  barLeft: Pt;
  barRight: Pt;
  barMid: Pt;
  groundY: number;
  wheelR: number;
};

/** Reach/stack/HTA/STA/CS-driven side view in arbitrary px space; Y is SVG-down. */
function computeSideViewGeometry(col: GeometryColumn): SideViewGeo {
  const reachMm = col.reachMm ?? 440;
  const stackMm = col.stackMm ?? 600;
  const staDeg = col.staDeg ?? 76;
  const htaDeg = col.htaDeg ?? 66;
  const csMm = col.chainstayMm ?? 435;

  const reachPx = reachMm * GEOMETRY_PX_PER_MM;
  const stackPx = stackMm * GEOMETRY_PX_PER_MM;
  const csPx = csMm * GEOMETRY_PX_PER_MM;
  const sta = (staDeg * Math.PI) / 180;
  const hta = (htaDeg * Math.PI) / 180;
  const wheelR = 332 * GEOMETRY_PX_PER_MM;
  const groundTarget = 300;

  const csTilt = 0.05;
  const bb0: Pt = { x: 200, y: 248 };
  const rearAxle0: Pt = {
    x: bb0.x - csPx * Math.cos(csTilt),
    y: bb0.y + csPx * Math.sin(csTilt),
  };

  const seatLen = Math.min(118, 470 * GEOMETRY_PX_PER_MM);
  const seat0: Pt = {
    x: bb0.x + Math.cos(Math.PI - sta) * seatLen,
    y: bb0.y - Math.sin(Math.PI - sta) * seatLen,
  };
  const htLower0: Pt = { x: bb0.x + reachPx, y: bb0.y - stackPx * 0.96 };
  const htLen = 88 * GEOMETRY_PX_PER_MM;
  const htUpper0: Pt = {
    x: htLower0.x + Math.cos(Math.PI - hta) * htLen,
    y: htLower0.y - Math.sin(Math.PI - hta) * htLen,
  };
  /** 前叉方向（下碗 → 前轮轴），与 HTA 一致；前轴须与后轴同高（平地、等径轮）。 */
  const cosFork = Math.cos(hta);
  const sinFork = Math.sin(hta);
  const forkLenDefault = 108 * GEOMETRY_PX_PER_MM;
  let tFork: number;
  if (Math.abs(sinFork) < 0.06) {
    tFork = forkLenDefault;
  } else {
    tFork = (rearAxle0.y - htLower0.y) / sinFork;
  }
  if (!Number.isFinite(tFork)) tFork = forkLenDefault;
  else tFork = Math.max(tFork, 2);
  const frontAxle0: Pt = {
    x: htLower0.x + cosFork * tFork,
    y: htLower0.y + sinFork * tFork,
  };

  const tireBottom = rearAxle0.y + wheelR;
  const dy = groundTarget - tireBottom;

  const bb = shiftPt(bb0, dy);
  const rearAxle = shiftPt(rearAxle0, dy);
  const seat = shiftPt(seat0, dy);
  const htLower = shiftPt(htLower0, dy);
  const htUpper = shiftPt(htUpper0, dy);
  const frontAxle = shiftPt(frontAxle0, dy);
  const groundY = groundTarget;

  const seatPostLen = 28;
  const saddle: Pt = {
    x: seat.x + Math.cos(Math.PI - sta) * seatPostLen,
    y: seat.y - Math.sin(Math.PI - sta) * seatPostLen,
  };
  /** 头管方向（下碗 → 上碗），把立沿此方向延伸；车把在侧视里为略后掠的弧。 */
  const sdx = htUpper.x - htLower.x;
  const sdy = htUpper.y - htLower.y;
  const slen = Math.max(Math.hypot(sdx, sdy), 1e-6);
  const sux = sdx / slen;
  const suy = sdy / slen;
  const stemLen = 24;
  const stemTip: Pt = { x: htUpper.x + sux * stemLen, y: htUpper.y + suy * stemLen };
  const px = -suy;
  const py = sux;
  const plen = Math.max(Math.hypot(px, py), 1e-6);
  const bx = px / plen;
  const by = py / plen;
  const halfBar = 36;
  const barLeft: Pt = { x: stemTip.x - bx * halfBar, y: stemTip.y - by * halfBar };
  const barRight: Pt = { x: stemTip.x + bx * halfBar, y: stemTip.y + by * halfBar };
  const barMid: Pt = {
    x: (barLeft.x + barRight.x) / 2 - sux * 8 - bx * 3,
    y: (barLeft.y + barRight.y) / 2 - suy * 8 - 5,
  };

  return {
    bb,
    rearAxle,
    seat,
    htLower,
    htUpper,
    frontAxle,
    saddle,
    stemTip,
    barLeft,
    barRight,
    barMid,
    groundY,
    wheelR,
  };
}

function sideViewFitTransform(g: SideViewGeo): { s: number; ox: number; oy: number } {
  const padL = 10;
  const padR = 10;
  const padT = 44;
  const padB = 12;
  const availW = 280 - padL - padR;
  const availH = 200 - padT - padB;

  const rulerSpineX = Math.max(g.rearAxle.x + g.wheelR, g.frontAxle.x + g.wheelR) + 16;
  const rulerTopY = g.groundY - RULER_HEIGHT_MM * GEOMETRY_PX_PER_MM;

  const xs = [
    g.rearAxle.x - g.wheelR,
    g.frontAxle.x + g.wheelR,
    g.bb.x,
    g.seat.x,
    g.htLower.x,
    g.htUpper.x,
    g.saddle.x - 12,
    g.saddle.x + 12,
    g.barLeft.x - 4,
    g.barRight.x + 4,
    g.stemTip.x,
    rulerSpineX + 28,
    rulerSpineX - 12,
  ];
  const ys = [
    g.rearAxle.y - g.wheelR,
    g.frontAxle.y - g.wheelR,
    g.bb.y,
    g.seat.y,
    g.htLower.y,
    g.htUpper.y,
    g.saddle.y - 10,
    g.groundY,
    g.stemTip.y,
    g.barMid.y - 4,
    rulerTopY - 8,
  ];
  const minX = Math.min(...xs) - 6;
  const maxX = Math.max(...xs) + 6;
  const minY = Math.min(...ys) - 8;
  const maxY = Math.max(...ys) + 6;
  const bw = Math.max(maxX - minX, 1);
  const bh = Math.max(maxY - minY, 1);
  const s = Math.min(availW / bw, availH / bh) * 0.97;
  const ox = padL + (availW - bw * s) / 2 - minX * s;
  const oy = padT + (availH - bh * s) / 2 - minY * s;
  return { s, ox, oy };
}

/** Side-view outline driven by table reach/stack/HTA/STA/CS (illustration only). */
function FramePreview({ col }: { col: GeometryColumn }) {
  const gid = useId().replace(/:/g, "");
  const g = useMemo(
    () => computeSideViewGeometry(col),
    [col.reachMm, col.stackMm, col.staDeg, col.htaDeg, col.chainstayMm],
  );
  const { s, ox, oy } = useMemo(() => sideViewFitTransform(g), [g]);
  const tf = `translate(${ox},${oy}) scale(${s})`;
  const tireGradId = `bike-tire-${gid}`;

  const { bb, rearAxle, seat, htLower, htUpper, frontAxle, saddle, stemTip, barLeft, barRight, barMid, groundY, wheelR } =
    g;

  const sw = (w: number) => Math.max(w / s, w * 0.85);
  const rulerSpineX = Math.max(rearAxle.x + wheelR, frontAxle.x + wheelR) + 16;
  const rulerTopY = groundY - RULER_HEIGHT_MM * GEOMETRY_PX_PER_MM;
  const groundX1 = Math.min(rearAxle.x, frontAxle.x) - wheelR - 48;
  const groundX2 = Math.max(Math.max(rearAxle.x, frontAxle.x) + wheelR + 48, rulerSpineX + 32);
  const hubR = Math.min(6, Math.max(2.2, 4.5 / s));
  const rulerFont = Math.max(6.25, 8 / s);

  return (
    <svg
      viewBox="0 0 280 200"
      className="h-auto w-full max-w-md text-base-content"
      aria-hidden
    >
      <defs>
        <linearGradient id={tireGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
          <stop offset="50%" stopColor="currentColor" stopOpacity={0.38} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.22} />
        </linearGradient>
      </defs>
      <rect width="280" height="200" fill="currentColor" opacity={0.05} stroke="currentColor" strokeOpacity={0.1} />
      <text
        x="10"
        y="18"
        fill="currentColor"
        opacity={0.72}
        className="font-light"
        style={{ fontSize: 10, fontWeight: 300 }}
      >
        Reach {col.reachMm ?? "—"} mm · Stack {col.stackMm ?? "—"} mm
      </text>
      <text x="10" y="34" fill="currentColor" opacity={0.48} className="font-light" style={{ fontSize: 9, fontWeight: 300 }}>
        {col.htaDeg != null ? `HTA ${col.htaDeg}°` : ""}
        {col.htaDeg != null && col.staDeg != null ? " · " : ""}
        {col.staDeg != null ? `STA ${col.staDeg}°` : ""}
        {col.chainstayMm != null ? ` · CS ${col.chainstayMm} mm` : ""}
      </text>

      <g transform={tf} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <line
          x1={groundX1}
          y1={groundY}
          x2={groundX2}
          y2={groundY}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={sw(1.5)}
          vectorEffect="nonScalingStroke"
        />

        <g className="text-base-content" opacity={0.92}>
          <circle
            cx={rearAxle.x}
            cy={rearAxle.y}
            r={wheelR + 4}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={sw(10)}
          />
          <circle
            cx={frontAxle.x}
            cy={frontAxle.y}
            r={wheelR + 4}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={sw(10)}
          />
          <circle cx={rearAxle.x} cy={rearAxle.y} r={wheelR} stroke={`url(#${tireGradId})`} strokeWidth={sw(7)} />
          <circle cx={frontAxle.x} cy={frontAxle.y} r={wheelR} stroke={`url(#${tireGradId})`} strokeWidth={sw(7)} />
          <circle
            cx={rearAxle.x}
            cy={rearAxle.y}
            r={wheelR - 5}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={sw(1)}
          />
          <circle
            cx={frontAxle.x}
            cy={frontAxle.y}
            r={wheelR - 5}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={sw(1)}
          />
        </g>

        <g className="text-primary">
          <path d={`M ${bb.x} ${bb.y} L ${rearAxle.x} ${rearAxle.y}`} stroke="currentColor" strokeWidth={sw(2.6)} />
          <path d={`M ${bb.x} ${bb.y} L ${htLower.x} ${htLower.y}`} stroke="currentColor" strokeWidth={sw(2.6)} />
          <path d={`M ${seat.x} ${seat.y} L ${htUpper.x} ${htUpper.y}`} stroke="currentColor" strokeWidth={sw(2.4)} />
          <path d={`M ${bb.x} ${bb.y} L ${seat.x} ${seat.y}`} stroke="currentColor" strokeWidth={sw(2.4)} />
          <path d={`M ${htLower.x} ${htLower.y} L ${htUpper.x} ${htUpper.y}`} stroke="currentColor" strokeWidth={sw(3)} />
          <path
            d={`M ${htLower.x} ${htLower.y} L ${frontAxle.x} ${frontAxle.y}`}
            stroke="currentColor"
            strokeWidth={sw(2.8)}
          />
          <circle cx={bb.x} cy={bb.y} r={hubR} fill="currentColor" stroke="currentColor" strokeWidth={sw(1)} />
        </g>

        <g className="text-base-content" stroke="currentColor">
          <path
            d={`M ${rearAxle.x} ${rearAxle.y} L ${seat.x} ${seat.y}`}
            strokeOpacity={0.45}
            strokeWidth={sw(1.8)}
          />
          <path
            d={`M ${htLower.x - 5} ${htLower.y + 4} L ${frontAxle.x - 2} ${frontAxle.y + 10}`}
            strokeOpacity={0.35}
            strokeWidth={sw(1.2)}
          />
          <path
            d={`M ${htLower.x + 5} ${htLower.y + 2} L ${frontAxle.x + 8} ${frontAxle.y + 6}`}
            strokeOpacity={0.35}
            strokeWidth={sw(1.2)}
          />
          <path d={`M ${seat.x} ${seat.y} L ${saddle.x} ${saddle.y}`} strokeOpacity={0.55} strokeWidth={sw(2)} />
          <path
            d={`M ${saddle.x - 10} ${saddle.y - 2} Q ${saddle.x} ${saddle.y - 8} ${saddle.x + 10} ${saddle.y - 2}`}
            strokeOpacity={0.5}
            strokeWidth={sw(1.6)}
          />
          <path
            d={`M ${htUpper.x} ${htUpper.y} L ${stemTip.x} ${stemTip.y}`}
            strokeOpacity={0.55}
            strokeWidth={sw(2)}
          />
          <path
            d={`M ${barLeft.x} ${barLeft.y} Q ${barMid.x} ${barMid.y} ${barRight.x} ${barRight.y}`}
            strokeOpacity={0.58}
            strokeWidth={sw(2.2)}
          />
          <circle cx={barLeft.x} cy={barLeft.y} r={3} fill="currentColor" fillOpacity={0.38} stroke="none" />
          <circle cx={barRight.x} cy={barRight.y} r={3} fill="currentColor" fillOpacity={0.38} stroke="none" />
          <circle cx={rearAxle.x} cy={rearAxle.y} r={hubR * 0.55} fill="currentColor" fillOpacity={0.22} stroke="none" />
          <circle cx={frontAxle.x} cy={frontAxle.y} r={hubR * 0.55} fill="currentColor" fillOpacity={0.22} stroke="none" />
        </g>

        <g className="text-base-content" stroke="currentColor">
          <line
            x1={rulerSpineX}
            y1={groundY}
            x2={rulerSpineX}
            y2={rulerTopY}
            strokeOpacity={0.4}
            strokeWidth={sw(0.8)}
          />
          {RULER_MARK_MM.map((mm) => {
            const y = groundY - mm * GEOMETRY_PX_PER_MM;
            return (
              <g key={`ruler-mm-${mm}`}>
                <line
                  x1={rulerSpineX}
                  y1={y}
                  x2={rulerSpineX - 9}
                  y2={y}
                  strokeOpacity={0.45}
                  strokeWidth={sw(0.58)}
                />
                <text
                  x={rulerSpineX + 3}
                  y={y + rulerFont * 0.32}
                  fill="currentColor"
                  fillOpacity={0.68}
                  className="font-light"
                  stroke="none"
                  style={{ fontSize: rulerFont, fontWeight: 300 }}
                >
                  {mm}
                </text>
              </g>
            );
          })}
          <text
            x={rulerSpineX + 3}
            y={groundY - 1}
            fill="currentColor"
            fillOpacity={0.55}
            className="font-light"
            stroke="none"
            style={{ fontSize: rulerFont * 0.92, fontWeight: 300 }}
          >
            0
          </text>
          <text
            x={rulerSpineX + 3}
            y={rulerTopY + rulerFont * 0.85}
            fill="currentColor"
            fillOpacity={0.55}
            className="font-light"
            stroke="none"
            style={{ fontSize: rulerFont * 0.85, fontWeight: 300 }}
          >
            1000
          </text>
        </g>
      </g>
    </svg>
  );
}

export function ModelGeometryExplorer({
  modelName,
  parsed,
}: {
  modelName: string;
  parsed: ParsedGeometry;
}) {
  const [sizeId, setSizeId] = useState(() => defaultSizeId(parsed.columns));
  const [modalOpen, setModalOpen] = useState(false);

  const col = useMemo(
    () => parsed.columns.find((c) => c.sizeId === sizeId) ?? parsed.columns[0],
    [parsed.columns, sizeId],
  );

  if (!col) return null;

  const wheel = wheelNote(col);

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="card-title text-base text-base-content">几何交互示意</h2>
          <span className="text-xs text-base-content/50">数据与下方「几何」表格同源</span>
        </div>
        <p className="text-sm text-base-content/70">
          点选尺码查看侧视示意与关键数字；轮组、前叉与主三角比例受表中 Reach / Stack / HTA / STA /
          后下叉约束；右侧标尺与示意同比例（全高 1000 mm，0 与 200–800 mm 刻度旁有数字），仍为示意而非官方工程图。车型：
          {modelName}
        </p>

        <div className="flex flex-wrap gap-2">
          {parsed.columns.map((c) => (
            <button
              key={c.sizeId}
              type="button"
              className={`btn btn-sm ${c.sizeId === sizeId ? "btn-primary" : "btn-outline border-base-300"}`}
              onClick={() => setSizeId(c.sizeId)}
            >
              {c.sizeId}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-box border border-base-300 bg-base-200/50 px-3 py-2">
                <div className="text-xs text-base-content/60">Reach</div>
                <div className="font-semibold tabular-nums">{col.reachMm ?? "—"} mm</div>
              </div>
              <div className="rounded-box border border-base-300 bg-base-200/50 px-3 py-2">
                <div className="text-xs text-base-content/60">Stack</div>
                <div className="font-semibold tabular-nums">{col.stackMm ?? "—"} mm</div>
              </div>
              <div className="rounded-box border border-base-300 bg-base-200/50 px-3 py-2">
                <div className="text-xs text-base-content/60">头管角</div>
                <div className="font-semibold tabular-nums">{col.htaDeg ?? "—"}°</div>
              </div>
              <div className="rounded-box border border-base-300 bg-base-200/50 px-3 py-2">
                <div className="text-xs text-base-content/60">立管角</div>
                <div className="font-semibold tabular-nums">{col.staDeg ?? "—"}°</div>
              </div>
              <div className="rounded-box border border-base-300 bg-base-200/50 px-3 py-2">
                <div className="text-xs text-base-content/60">后下叉</div>
                <div className="font-semibold tabular-nums">{col.chainstayMm ?? "—"} mm</div>
              </div>
              {wheel ? (
                <div className="rounded-box border border-base-300 bg-base-200/50 px-3 py-2 sm:col-span-2">
                  <div className="text-xs text-base-content/60">车轮（表内）</div>
                  <div className="text-sm font-medium">{wheel}</div>
                </div>
              ) : null}
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalOpen(true)}>
              弹出大图
            </button>
          </div>
          <div className="rounded-box border border-base-300 bg-base-200/30 p-3">
            <FramePreview col={col} />
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="modal modal-open" role="presentation">
          <div className="modal-box relative max-w-2xl">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setModalOpen(false)}
              aria-label="关闭"
            >
              ×
            </button>
            <h3 className="text-lg font-bold">几何示意 · {col.sizeId}</h3>
            <p className="mb-4 text-sm text-base-content/70">与当前所选尺码联动；可在弹层内切换尺码。</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {parsed.columns.map((c) => (
                <button
                  key={`m-${c.sizeId}`}
                  type="button"
                  className={`btn btn-xs ${c.sizeId === sizeId ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setSizeId(c.sizeId)}
                >
                  {c.sizeId}
                </button>
              ))}
            </div>
            <div className="rounded-box border border-base-300 bg-base-200/30 p-4">
              <FramePreview col={parsed.columns.find((c) => c.sizeId === sizeId) ?? col} />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setModalOpen(false)}>
                关闭
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-base-content/30" onClick={() => setModalOpen(false)} />
        </div>
      ) : null}
    </section>
  );
}
