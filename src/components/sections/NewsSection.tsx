import { useEffect, useState, useCallback, useRef } from "react";
import type { Language, TranslationKey } from "../../i18n";
import type { NewsCard } from "../../types";
import { fetchNews } from "../../api/news";
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from "../../utils/media";
import { ArrowIcon } from "../Icons";

export type NewsSectionProps = {
  items?: NewsCard[];
  language?: Language;
  title?: string;
  t: (key: TranslationKey) => string;
  navigateTo: (path: string) => void;
};

const NEWS_TITLE_LABELS: Record<string, string> = {
  ka: "სიახლეები",
  en: "Latest from Origami",
  ru: "Последние новости Origami",
  de: "Neues von Origami",
  it: "Le novità di Origami",
  zh: "来自 Origami 的最新动态",
  he: "חדשות אחרונות מ-Origami",
  ar: "آخر الأخبار من أوريغامي"
};

const VIEW_ALL_LABELS: Record<string, string> = {
  ka: "ყველა სიახლე",
  en: "VIEW ALL NEWS",
  ru: "ВСЕ НОВОСТИ",
  de: "ALLE NEUIGKEITEN",
  it: "TUTTE LE NOTIZIE",
  zh: "查看全部新闻",
  he: "כל החדשות",
  ar: "جميع الأخبار"
};

export function NewsSection({
  items: propItems,
  language = "ka",
  title,
  t,
  navigateTo
}: NewsSectionProps) {
  const [newsList, setNewsList] = useState<NewsCard[]>(propItems || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!propItems?.length);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  // Sync propItems or fetch if empty
  useEffect(() => {
    if (propItems && propItems.length > 0) {
      setNewsList(propItems);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    fetchNews(language, t("news_category") || "Corporate", controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setNewsList(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error("NewsSection: Failed to load news", err);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [propItems, language, t]);

  const totalItems = newsList.length;

  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    if (totalItems <= 1) return;
    setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
  }, [totalItems]);

  const handleCardClick = (index: number, slug: string) => {
    if (index === activeIndex) {
      // If already active, clicking navigates directly into the news detail page
      navigateTo(`/news/${slug}`);
    } else {
      setActiveIndex(index);
    }
  };

  const viewAllText =
    VIEW_ALL_LABELS[language] || VIEW_ALL_LABELS.en;

  if (!isLoading && totalItems === 0) {
    return null;
  }

  const activeItem = newsList[activeIndex] || newsList[0];
  const sectionTitle =
    title || NEWS_TITLE_LABELS[language] || NEWS_TITLE_LABELS.en;

  return (
    <section id="news" className="town-news-section reveal-on-scroll">
      <div className="town-news-container">
        {/* Top Header Row */}
        <div className="town-news-header reveal-fade-up">
          <div className="town-news-header-left">
            <h2 className="town-news-title">{sectionTitle}</h2>
          </div>
        </div>

        {/* Central Gallery: Expanding Accordion Cards matching reference */}
        <div className="town-news-gallery reveal-scale" ref={galleryRef}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`town-news-card town-news-skeleton ${idx === 0 ? "is-active" : "is-collapsed"}`}
                >
                  <div className="town-news-skeleton-shimmer" />
                </div>
              ))
            : newsList.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <article
                    key={item.id}
                    className={`town-news-card ${isActive ? "is-active" : "is-collapsed"}`}
                    onClick={() => handleCardClick(index, item.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick(index, item.slug);
                      }
                    }}
                    aria-label={item.title}
                    aria-expanded={isActive}
                  >
                    {/* Media Layer */}
                    <div className="town-news-card-media">
                      <img
                        src={getOptimizedImageUrl(item.image, {
                          width: isActive ? 1080 : 420,
                          height: 720,
                          crop: "fill",
                          gravity: "auto"
                        })}
                        srcSet={getResponsiveImageSrcSet(item.image, [380, 600, 900, 1200], {
                          crop: "limit"
                        })}
                        sizes={isActive ? "(max-width: 900px) 92vw, 55vw" : "(max-width: 900px) 45vw, 16vw"}
                        alt={item.title}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                        className="town-news-card-img"
                      />
                      <div className="town-news-card-overlay" />
                    </div>

                    {/* Content Layer for Active Card */}
                    {isActive ? (
                      <div className="town-news-active-content">
                        <div className="town-news-active-main">
                          <h3 className="town-news-active-title">{item.title}</h3>
                        </div>

                        {/* Right Meta Column (divider + date/category) */}
                        <div className="town-news-active-meta">
                          <div className="town-news-active-date">{item.date}</div>
                        </div>
                      </div>
                    ) : (
                      /* Content Layer for Collapsed Cards */
                      <div className="town-news-collapsed-content">
                        <h4 className="town-news-collapsed-title">{item.title}</h4>
                        <div className="town-news-collapsed-indicator" aria-hidden="true" />
                      </div>
                    )}
                  </article>
                );
              })}
        </div>

        {/* Bottom Control Bar matching reference */}
        <div className="town-news-bottom-bar reveal-fade-up">
          <div className="town-news-controls-left">
            {/* Prev Circle Button */}
            <button
              type="button"
              className="town-news-circle-btn"
              onClick={handlePrev}
              aria-label="Previous article"
              disabled={totalItems <= 1}
            >
              <ArrowIcon direction="left" />
            </button>

            {/* Next Circle Button */}
            <button
              type="button"
              className="town-news-circle-btn"
              onClick={handleNext}
              aria-label="Next article"
              disabled={totalItems <= 1}
            >
              <ArrowIcon direction="right" />
            </button>

            {/* Progress Slider Track + Fill */}
            <div className="town-news-progress-track" aria-hidden="true">
              <div
                className="town-news-progress-fill"
                style={{
                  width: `${totalItems > 0 ? (1 / totalItems) * 100 : 25}%`,
                  left: `${totalItems > 0 ? (activeIndex / totalItems) * 100 : 0}%`
                }}
              />
            </div>

            {/* Step Counter (e.g. 01 / 05) */}
            <div className="town-news-counter">
              <span className="town-news-counter-current">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="town-news-counter-divider"> / </span>
              <span className="town-news-counter-total">
                {String(totalItems).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
