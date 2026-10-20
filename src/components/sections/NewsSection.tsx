import { useEffect, useState, useCallback, useRef } from "react";
import type { Language } from "../../i18n";
import type { NewsCard } from "../../types";
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from "../../utils/media";
import { ArrowIcon } from "../Icons";

export type NewsSectionProps = {
  items?: NewsCard[];
  loading?: boolean;
  language?: Language;
  title?: string;
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

export function NewsSection({
  items: propItems,
  loading = false,
  language = "ka",
  title,
  navigateTo
}: NewsSectionProps) {
  const [newsList, setNewsList] = useState<NewsCard[]>(propItems || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setNewsList(propItems || []);
    setActiveIndex(0);
  }, [propItems]);

  const totalItems = newsList.length;

  // On touch layouts, follow the card that the user brings into view with a swipe.
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || totalItems < 2) return;

    let frame = 0;
    const updateActiveCard = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.matchMedia("(min-width: 961px)").matches) return;

        const galleryRect = gallery.getBoundingClientRect();
        const center = galleryRect.left + galleryRect.width / 2;
        const cards = Array.from(gallery.querySelectorAll<HTMLElement>(".town-news-card"));
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - center);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });

        setActiveIndex((current) => current === nearestIndex ? current : nearestIndex);
      });
    };

    gallery.addEventListener("scroll", updateActiveCard, { passive: true });
    window.addEventListener("resize", updateActiveCard);
    updateActiveCard();

    return () => {
      cancelAnimationFrame(frame);
      gallery.removeEventListener("scroll", updateActiveCard);
      window.removeEventListener("resize", updateActiveCard);
    };
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return;
    const nextIndex = activeIndex > 0 ? activeIndex - 1 : totalItems - 1;
    setActiveIndex(nextIndex);
    if (window.matchMedia("(max-width: 960px)").matches) {
      galleryRef.current?.children.item(nextIndex)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  }, [activeIndex, totalItems]);

  const handleNext = useCallback(() => {
    if (totalItems <= 1) return;
    const nextIndex = activeIndex < totalItems - 1 ? activeIndex + 1 : 0;
    setActiveIndex(nextIndex);
    if (window.matchMedia("(max-width: 960px)").matches) {
      galleryRef.current?.children.item(nextIndex)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  }, [activeIndex, totalItems]);

  const handleCardClick = (index: number, slug: string) => {
    if (index === activeIndex) {
      // If already active, clicking navigates directly into the news detail page
      navigateTo(`/news/${slug}`);
    } else {
      setActiveIndex(index);
    }
  };

  if (!loading && totalItems === 0) {
    return null;
  }

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
          {loading ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`news-skeleton-${index}`}
              className={`town-news-card town-news-skeleton ${index === 0 ? "is-active" : "is-collapsed"}`}
              aria-hidden="true"
            >
              <div className="town-news-skeleton-shimmer" />
            </div>
          )) : newsList.map((item, index) => {
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
