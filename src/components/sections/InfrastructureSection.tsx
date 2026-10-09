import { useEffect, useRef, useState, type RefObject } from "react";
import type { Language, TranslationKey } from "../../i18n";
import type { InfrastructureContent } from "../../api/siteContent";
import type { InfrastructureApiItem } from "../../types";
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from "../../utils/media";

const INFRASTRUCTURE_METADATA: Record<
  string,
  {
    image: string;
    subtitleEn: string;
    subtitleKa: string;
    titleKaFallback: string;
  }
> = {
  "15-metre-swimming-pool": {
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85",
    subtitleEn: "15m Heated Lap Pool",
    subtitleKa: "15მ ღია საცურაო აუზი",
    titleKaFallback: "15 მეტრიანი საცურაო აუზი"
  },
  "fitness-centre": {
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    subtitleEn: "Modern Gym & Studio",
    subtitleKa: "თანამედროვე სავარჯიშო დარბაზი",
    titleKaFallback: "ფიტნეს ცენტრი"
  },
  "spa-1": {
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
    subtitleEn: "Thermal Suite & Wellness",
    subtitleKa: "სპა და გამაჯანსაღებელი ზონა",
    titleKaFallback: "სპა"
  },
  "parking-1": {
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=85",
    subtitleEn: "Secure Underground Parking",
    subtitleKa: "მიწისქვეშა დაცული პარკინგი",
    titleKaFallback: "პარკინგი"
  },
  "playground": {
    image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&w=1200&q=85",
    subtitleEn: "Eco Children's Play Space",
    subtitleKa: "ეკო სათამაშო სივრცე ბავშვებისთვის",
    titleKaFallback: "სათამაშო მოედანი"
  },
  "paddle-court": {
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=85",
    subtitleEn: "Professional Outdoor Court",
    subtitleKa: "პროფესიონალური ღია კორტი",
    titleKaFallback: "პადლის კორტი"
  },
  "recreational-areas": {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    subtitleEn: "Green Courtyards & Gardens",
    subtitleKa: "მწვანე ეზოები და ბაღები",
    titleKaFallback: "რეკრეაციული ზონები"
  },
  "commercial-spaces": {
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
    subtitleEn: "Boutiques & Cafe Promenade",
    subtitleKa: "ბუტიკები და კაფეების პრომენადი",
    titleKaFallback: "კომერციული ფართები"
  }
};

export type InfrastructureSectionProps = {
  data?: InfrastructureContent | null;
  items?: InfrastructureApiItem[];
  language?: Language;
  sectionRef?: RefObject<HTMLElement>;
  t?: (key: TranslationKey) => string;
  onCtaClick?: () => void;
};

export function InfrastructureSection({
  data,
  items: directItems,
  language = "en",
  sectionRef,
  t: _t,
  onCtaClick
}: InfrastructureSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);

  const items = data?.items && data.items.length > 0 ? data.items : directItems || [];

  const eyebrow =
    data?.eyebrow?.trim() ||
    (language === "ka" ? "ინფრასტრუქტურა" : "INFRASTRUCTURE");

  const title =
    data?.title?.trim() ||
    (language === "ka"
      ? "თქვენი კეთილდღეობისთვის შექმნილი გარემო"
      : "Spaces for Everyday Wellbeing");

  const description = data?.description?.trim() || "";

  const buttonText =
    data?.button_text?.trim() ||
    (language === "ka" ? "ყველა სივრცე" : "VIEW ALL SPACES");

  const buttonLink = data?.button_link?.trim() || "#contact";

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateScrollMetrics = () => {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);

      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < maxScroll - 4);

      const ratio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setProgress(ratio);

      const cards = track.querySelectorAll<HTMLElement>(".town-infra-card");
      if (cards.length > 0) {
        const firstCard = cards[0];
        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(window.getComputedStyle(track).gap || "24") || 24;
        const itemStep = cardWidth + gap;
        const idx = Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / itemStep)));
        setActiveIndex(idx);
      }
    };

    updateScrollMetrics();

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollMetrics);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  const scrollCarousel = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>(".town-infra-card");
    const gap = parseFloat(window.getComputedStyle(track).gap || "24") || 24;
    const step = firstCard ? firstCard.offsetWidth + gap : track.clientWidth * 0.75;

    track.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth"
    });
  };

  // Mouse Drag Scrolling
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    dragStartXRef.current = e.pageX - track.offsetLeft;
    dragScrollLeftRef.current = track.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.5;
    track.scrollLeft = dragScrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const totalCountFormatted = String(items.length).padStart(2, "0");
  const currentIndexFormatted = String(Math.min(items.length, activeIndex + 1)).padStart(2, "0");

  return (
    <section
      id="infrastructure"
      className="town-infra-section reveal-on-scroll"
      ref={sectionRef}
    >
      <div className="container town-infra-container">
        <div className="town-infra-layout">
          {/* Left Column / Header block */}
          <aside className="town-infra-sidebar reveal-fade-up">
            <div className="town-infra-sidebar-top">
              <span className="town-infra-eyebrow">{eyebrow}</span>
              <h2 className="town-infra-title">{title}</h2>
              {description ? (
                <p className="town-infra-description">{description}</p>
              ) : null}
            </div>

            <div className="town-infra-sidebar-bottom">
              <a
                href={buttonLink}
                className="town-infra-cta"
                onClick={(e) => {
                  if (onCtaClick) {
                    e.preventDefault();
                    onCtaClick();
                  } else if (buttonLink.startsWith("#")) {
                    e.preventDefault();
                    const target = document.querySelector(buttonLink);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                <span>{buttonText}</span>
                <span className="town-infra-cta-line" />
              </a>
            </div>
          </aside>

          {/* Right Column / Cards Slider */}
          <div className="town-infra-carousel reveal-scale">
            <div
              className={`town-infra-track ${isDragging ? "is-dragging" : ""}`}
              ref={trackRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {items.map((item, index) => {
                const meta = INFRASTRUCTURE_METADATA[item.slug];
                const resolvedImage =
                  item.image?.trim() || meta?.image || "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85";

                const resolvedTitle =
                  item.title?.trim() ||
                  (language === "ka" ? meta?.titleKaFallback : undefined) ||
                  item.slug.replace(/-/g, " ");

                const resolvedSubtitle =
                  item.subtitle?.trim() ||
                  (language === "ka" ? meta?.subtitleKa : meta?.subtitleEn) ||
                  "Town by Origami";

                return (
                  <article
                    key={item.id || item.slug || index}
                    className="town-infra-card"
                  >
                    <div className="town-infra-card-media">
                      <img
                        src={getOptimizedImageUrl(resolvedImage, {
                          width: 720,
                          height: 960,
                          crop: "fill",
                          gravity: "auto"
                        })}
                        srcSet={getResponsiveImageSrcSet(resolvedImage, [360, 520, 720, 960], { crop: "limit" })}
                        sizes="(max-width: 640px) 75vw, (max-width: 1024px) 42vw, 24vw"
                        alt={resolvedTitle}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      {item.badge ? (
                        <span className="town-infra-card-badge">{item.badge}</span>
                      ) : null}
                    </div>

                    <div className="town-infra-card-info">
                      <h3 className="town-infra-card-title">{resolvedTitle}</h3>
                      <span className="town-infra-card-subtitle">{resolvedSubtitle}</span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Slider Controls moved to bottom right under cards */}
            <div className="town-infra-carousel-footer">
              <div className="town-infra-controls-box">
                <div className="town-infra-controls">
                  <div className="town-infra-nav-btns">
                    <button
                      type="button"
                      className="town-infra-nav-btn"
                      onClick={() => scrollCarousel("left")}
                      disabled={!canScrollLeft}
                      aria-label="Previous spaces"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="town-infra-nav-btn"
                      onClick={() => scrollCarousel("right")}
                      disabled={!canScrollRight}
                      aria-label="Next spaces"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>

                  <div className="town-infra-counter">
                    <span className="current">{currentIndexFormatted}</span>
                    <span className="sep"> / </span>
                    <span className="total">{totalCountFormatted}</span>
                  </div>
                </div>

                {/* Progress Line */}
                <div
                  className="town-infra-progress-track"
                  role="progressbar"
                  aria-valuenow={Math.round(progress * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="town-infra-progress-fill"
                    style={{
                      width: `${Math.max(16, 20 + progress * 80)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
