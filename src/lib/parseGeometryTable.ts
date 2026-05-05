/**
 * 从车款 frontmatter 的 `geometry` Markdown 中解析「首列为指标名、其余列为各尺码」的表格，
 * 用于车款页交互示意（与「几何」Tab 中表格同源）。
 */

export type GeometryColumn = {
  sizeId: string;
  /** 各指标行原文，键为表格首列标签 */
  byMetricLabel: Record<string, string>;
  reachMm?: number;
  stackMm?: number;
  htaDeg?: number;
  staDeg?: number;
  chainstayMm?: number;
};

export type ParsedGeometry = {
  columns: GeometryColumn[];
};

function splitTableRow(line: string): string[] {
  let raw = line.trim();
  if (!raw.startsWith("|")) return [];
  if (!raw.endsWith("|")) raw = `${raw}|`;
  return raw
    .slice(1, -1)
    .split("|")
    .map((c) => c.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  if (cells.length === 0) return true;
  return cells.every((c) => /^:?-{3,}:?$/.test(c.replace(/\s/g, "")));
}

function parseLeadingNumber(s: string): number | undefined {
  const t = s.trim();
  const m = t.match(/^(\d+(?:\.\d+)?)/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

function inferMetrics(col: GeometryColumn): GeometryColumn {
  const next = { ...col };
  for (const [label, val] of Object.entries(col.byMetricLabel)) {
    const L = label.toLowerCase();
    const n = parseLeadingNumber(val);
    if (n == null) continue;
    if (/reach/i.test(label)) {
      next.reachMm = n;
    } else if (/stack/i.test(label)) {
      next.stackMm = n;
    } else if (/hta|头管角/i.test(label)) {
      next.htaDeg = n;
    } else if (/sta|立管角/i.test(label)) {
      next.staDeg = n;
    } else if (/后下叉|\bcs\b/i.test(label)) {
      next.chainstayMm = n;
    }
  }
  return next;
}

/** 若首行首列为「车架尺寸」类，则其余列为尺码；否则假定首行其余格均为尺码名 */
export function parseGeometryTable(geometryMd: string | undefined): ParsedGeometry | undefined {
  if (!geometryMd?.trim()) return undefined;

  const lines = geometryMd.split(/\r?\n/);
  const rows: string[][] = [];
  for (const line of lines) {
    const cells = splitTableRow(line);
    if (cells.length < 2) continue;
    if (isSeparatorRow(cells)) continue;
    rows.push(cells);
  }

  if (rows.length < 2) return undefined;

  const header = rows[0];
  const firstHead = header[0] ?? "";
  const sizeIds =
    /尺寸|尺码|size/i.test(firstHead) && header.length > 1
      ? header.slice(1)
      : header.slice(1);

  if (sizeIds.length === 0 || !sizeIds.every(Boolean)) return undefined;

  const dataRows = rows.slice(1);
  const columns: GeometryColumn[] = sizeIds.map((sizeId) => ({
    sizeId,
    byMetricLabel: {},
  }));

  for (const row of dataRows) {
    const label = row[0]?.trim() ?? "";
    if (!label) continue;
    for (let j = 1; j < row.length && j - 1 < columns.length; j++) {
      columns[j - 1].byMetricLabel[label] = row[j]?.trim() ?? "";
    }
  }

  const enriched = columns.map((c) => inferMetrics(c));
  if (enriched.length === 0) return undefined;
  return { columns: enriched };
}
