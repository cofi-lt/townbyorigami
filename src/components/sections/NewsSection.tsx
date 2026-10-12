import { useEffect, useState, useCallback, useRef } from "react";
import type { Language, TranslationKey } from "../../i18n";
import type { NewsCard } from "../../types";
import { fetchNews } from "../../api/news";
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from "../../utils/media";
import { ArrowIcon, LocationIcon } from "../Icons";

export type NewsSectionProps = {
  items?: NewsCard[];
  language?: Language;
  t: (key: TranslationKey) => string;
  navigateTo: (path: string) => void;
};

const NEWS_DESCRIPTIONS: Record<string, string> = {
  ka: "გაეცანით Origami Holding-ისა და Town-ის უახლეს მოვლენებს, განვითარების ეტაპებსა და არქიტექტურულ სიახლეებს.",
  en: "A curated selection of news, updates, and milestones from Town by Origami. Stay informed with our latest architectural progress.",
  ru: "Эксклюзивная подборка ключевых новостей, этапов развития и архитектурных решений Town by Origami.",
  de: "Eine kuratierte Auswahl an Neuigkeiten, Meilensteinen und architektonischen Einblicken von Town by Origami.",
  it: "Una selezione curata di notizie, aggiornamenti e traguardi di Town by Origami.",
  zh: "精选 Origami Holding 与 Town by Origami 的最新动态、里程碑和建筑进展。",
  he: "מבחר חדשות, עדכונים וציוני דרך מבית Town by Origami.",
  ar: "مجموعة مختارة من الأخبار وآخر التطورات والإنجازات المعمارية من تاონ باي أوريغامي."
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

const EXPLORE_LABELS: Record<string, string> = {
  ka: "სრულად ნახვა",
  en: "EXPLORE OPTIONS",
  ru: "ЧИТАТЬ ДАЛЕЕ",
  de: "MEHR ERFAHREN",
  it: "SCOPRI DI PIÙ",
  zh: "查看详情",
  he: "לפרטים נוספים",
  ar: "اكتشف المزيد"
};

export function NewsSection({ items: propItems, language = "ka", t, navigateTo }: NewsSectionProps) {
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

  const handleExploreClick = () => {
    if (newsList[activeIndex]) {
      navigateTo(`/news/${newsList[activeIndex].slug}`);
    }
  };

  const descriptionText =
    NEWS_DESCRIPTIONS[language] || NEWS_DESCRIPTIONS.en;
  const viewAllText =
    VIEW_ALL_LABELS[language] || VIEW_ALL_LABELS.en;
  const exploreBtnText =
    EXPLORE_LABELS[language] || EXPLORE_LABELS.en;

  if (!isLoading && totalItems === 0) {
    return null;
  }

  const activeItem = newsList[activeIndex] || newsList[0];

  return (
    <section id="news" className="town-news-section reveal-on-scroll">
      <div className="town-news-container">
        {/* Top Header Row matching reference */}
        <div className="town-news-header reveal-fade-up">
          <div className="town-news-header-left">
            <p className="town-news-description">{descriptionText}</p>
          </div>
          <div className="town-news-header-right">
            <button
              type="button"
              className="town-news-view-all-link"
              onClick={() => {
                if (activeItem) {
                  navigateTo(`/news/${activeItem.slug}`);
                }
              }}
              aria-label={viewAllText}
            >
              <span className="town-news-view-all-line" aria-hidden="true" />
              <span className="town-news-view-all-text">{viewAllText}</span>
              <span className="town-news-view-all-arrow" aria-hidden="true">
                <ArrowIcon direction="right" />
              </span>
            </button>
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
                          <div className="town-news-active-location">
                            <span className="town-news-location-icon" aria-hidden="true">
                              <LocationIcon />
                            </span>
                            <span className="town-news-location-text">
                              Batumi, Georgia
                              {item.category && item.category !== "Corporate" ? ` · ${item.category}` : ""}
                            </span>
                          </div>
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

          {/* Right CTA Pill Button matching reference */}
          <div className="town-news-controls-right">
            <button
              type="button"
              className="town-news-explore-pill-btn"
              onClick={handleExploreClick}
              aria-label={exploreBtnText}
            >
              <span>{exploreBtnText}</span>
              <span className="town-news-explore-arrow" aria-hidden="true">
                <ArrowIcon direction="right" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
