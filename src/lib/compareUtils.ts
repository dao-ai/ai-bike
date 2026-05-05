/** 对比页 URL 查询参数名 */
export const COMPARE_MODELS_PARAM = "models";

/** 并排对比最多车款数（避免表格过宽） */
export const MAX_COMPARE_MODELS = 3;

/** 从 ?models=a,b,c 解析 slug 列表（去重、截断） */
export function parseCompareSlugParam(param: string | null | undefined): string[] {
  if (param == null || !String(param).trim()) return [];
  const parts = String(param)
    .split(/[,+]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set(parts)].slice(0, MAX_COMPARE_MODELS);
}

export function buildCompareHref(slugs: string[]): string {
  const clean = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))].slice(0, MAX_COMPARE_MODELS);
  if (clean.length === 0) return "/compare/";
  const q = new URLSearchParams();
  q.set(COMPARE_MODELS_PARAM, clean.join(","));
  return `/compare/?${q.toString()}`;
}
