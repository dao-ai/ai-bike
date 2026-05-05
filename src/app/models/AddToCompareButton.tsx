"use client";

import { useRouter } from "next/navigation";
import {
  buildCompareHref,
  MAX_COMPARE_MODELS,
  parseCompareSlugParam,
} from "@/lib/compareUtils";

const STORAGE_KEY = "ai-bike-compare-models";

function mergeSlugs(prev: string[], slug: string): string[] {
  const without = prev.filter((x) => x !== slug);
  const merged = [...without, slug];
  return merged.slice(-MAX_COMPARE_MODELS);
}

export function AddToCompareButton({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={() => {
        let prev: string[] = [];
        try {
          prev = parseCompareSlugParam(sessionStorage.getItem(STORAGE_KEY));
        } catch {
          prev = [];
        }
        const next = mergeSlugs(prev, slug);
        try {
          sessionStorage.setItem(STORAGE_KEY, next.join(","));
        } catch {
          /* ignore */
        }
        router.push(buildCompareHref(next));
      }}
    >
      加入对比
    </button>
  );
}
