import { useEffect, useState } from "react";
import type { Language } from "../i18n";
import type { NewsApiItem, NewsCard } from "../types";
import { fetchNews, fetchNewsDetail } from "../api/news";

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function useNews(language: Language, detailSlug: string | null, categoryFallback: string) {
  const [items, setItems] = useState<NewsCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetail] = useState<NewsApiItem | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setItems([]);
    fetchNews(language, categoryFallback, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setItems(data);
      })
      .catch((error) => {
        if (!isAbortError(error)) {
          console.error("Failed to load news:", error);
          setItems([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [categoryFallback, language]);

  useEffect(() => {
    if (!detailSlug) {
      setDetail(null);
      setDetailError("");
      setIsDetailLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsDetailLoading(true);
    setDetailError("");

    fetchNewsDetail(detailSlug, language, controller.signal)
      .then(setDetail)
      .catch((error) => {
        if (!isAbortError(error)) {
          console.error("Failed to load news detail:", error);
          setDetail(null);
          setDetailError(language === "ka" ? "სიახლე ვერ მოიძებნა" : "News article was not found");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsDetailLoading(false);
        }
      });

    return () => controller.abort();
  }, [detailSlug, language]);

  return { items, isLoading, detail, isDetailLoading, detailError };
}
