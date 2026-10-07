import { FC, useState } from "react";
import type { AboutGridCardItem, AboutTownTextContent, AboutUsApiItem, TownGalleryItem } from "../../types";
import { getOptimizedImageUrl, normalizeApiImageUrl } from "../../utils/media";

interface TownStat {
  value: string;
  label: string;
}

interface TownAboutSectionProps {
  data?: AboutUsApiItem | null;
  galleryItems?: TownGalleryItem[];
  gridCards?: AboutGridCardItem[];
  aboutTownText?: AboutTownTextContent | null;
  image?: string;
  stats?: TownStat[];
  summaryText?: string;
  onLearnMore?: () => void;
}

const DEFAULT_SLIDES = [
  {
    tag: "EXTERIOR",
    image: "https://res.cloudinary.com/dju7d2yys/image/upload/v1791354753/foodly/about-us/pljdlvlasg08ykeywt6j.jpg",
    alt: "Town Exterior Architecture & Pool"
  },
  {
    tag: "COURTYARD",
    image: "/assets/3d/7.jpg",
    alt: "Town Courtyard & Green Spaces"
  },
  {
    tag: "RESIDENCE",
    image: "https://res.cloudinary.com/dju7d2yys/image/upload/v1791354753/foodly/about-us/pljdlvlasg08ykeywt6j.jpg",
    alt: "Town Multifunctional Complex"
  },
  {
    tag: "LIFESTYLE",
    image: "/assets/3d/7.jpg",
    alt: "Town Living Environment"
  }
];

const DEFAULT_STATS: TownStat[] = [
  { value: "760", label: "APARTMENTS" },
  { value: "X%", label: "DOWN PAYMENT" },
  { value: "$X", label: "PER SQ.M" },
  { value: "X%", label: "INSTALLMENT" }
];

const VALUE_BY_SLUG: Record<string, string> = {
  "apartments": "760",
  "down-payment": "X%",
  "sqm": "$X",
  "sq-m": "$X",
  "installment": "X%"
};

const DEFAULT_TAGS = ["EXTERIOR", "COURTYARD", "ARCHITECTURE", "LIFESTYLE"];

export const TownAboutSection: FC<TownAboutSectionProps> = ({
  data,
  galleryItems,
  gridCards,
  aboutTownText,
  image,
  stats = DEFAULT_STATS,
  summaryText
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const resolvedStats: TownStat[] = (gridCards && gridCards.length > 0)
    ? gridCards.map((card, idx) => ({
        value: card.description?.trim() || VALUE_BY_SLUG[card.slug] || DEFAULT_STATS[idx]?.value || "X",
        label: card.title?.trim() || DEFAULT_STATS[idx]?.label || ""
      }))
    : stats;

  // Use galleryItems from API endpoint (/api/sections/about-town-gallery/compact) if provided
  const slides = (galleryItems && galleryItems.length > 0)
    ? galleryItems.map((item, idx) => ({
        tag: item.title?.trim() || item.tag || DEFAULT_TAGS[idx % DEFAULT_TAGS.length],
        image: normalizeApiImageUrl(item.image_preview),
        alt: item.title || `Town by Origami - Slide ${idx + 1}`
      }))
    : (data?.image || image)
      ? [
          {
            tag: data?.title?.trim() || "EXTERIOR",
            image: normalizeApiImageUrl(data?.image || image || DEFAULT_SLIDES[0].image),
            alt: data?.title || "Town by Origami"
          },
          ...DEFAULT_SLIDES.slice(1)
        ]
      : DEFAULT_SLIDES;

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const padNumber = (num: number) => String(num).padStart(2, "0");

  const kickerContent =
    aboutTownText?.button_text?.trim() ||
    aboutTownText?.eyebrow?.trim() ||
    "ABOUT TOWN";
  const titleContent = aboutTownText?.title?.trim();

  const renderTitle = () => {
    if (!titleContent) {
      return (
        <>
          Town within<br />
          a <span className="town-italic-accent">Town</span>
        </>
      );
    }

    const words = titleContent.split(" ");
    if (words.length > 1) {
      const lastWord = words.pop();
      return (
        <>
          {words.join(" ")} <span className="town-italic-accent">{lastWord}</span>
        </>
      );
    }

    return titleContent;
  };

  const descriptionContent =
    aboutTownText?.description?.trim() ||
    summaryText ||
    "At Town, modern living meets a calmer rhythm. Thoughtful architecture, green surroundings, and a complete living environment come together to create a place where life feels balanced.";

  return (
    <section id="about" className="town-about-section reveal-on-scroll">
      <div className="container">
        <div className="town-about-grid">
          {/* Left Column: Kicker, Heading, Description & Stats Grid */}
          <div className="town-about-content reveal-fade-up">
            <div className="town-kicker-wrapper">
              <span className="town-kicker">{kickerContent}</span>
              <span className="town-kicker-line" aria-hidden="true" />
            </div>

            <h2 className="town-heading-serif town-about-title">
              {renderTitle()}
            </h2>

            <p className="town-about-summary">
              {descriptionContent}
            </p>

            {/* 2x2 Architectural Stats Grid */}
            <div className="town-stats-grid">
              {resolvedStats.map((stat, index) => (
                <div key={index} className="town-stat-card">
                  <div className="town-stat-value">{stat.value}</div>
                  <div className="town-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Image Slider with Blueprint Frame */}
          <div className="town-about-visual-wrapper reveal-scale">
            <div className="town-about-frame">
              {/* Architectural Extension Lines */}
              <div className="town-blueprint-line-h" aria-hidden="true" />
              <div className="town-blueprint-line-v" aria-hidden="true" />

              <div className="town-about-image-card">
                <img
                  src={getOptimizedImageUrl(currentSlide.image, { width: 1200, height: 900, crop: "fill", gravity: "auto" })}
                  alt={currentSlide.alt}
                  className="town-about-image"
                  loading="lazy"
                  decoding="async"
                />

                {/* Top-Left Category Badge */}
                <div className="town-slide-badge">
                  <span>{currentSlide.tag}</span>
                </div>

                {/* Bottom-Right Slider Navigation Controls */}
                <div className="town-slider-nav">
                  <span className="town-slider-counter">
                    {padNumber(currentSlideIndex + 1)} / {padNumber(slides.length)}
                  </span>
                  <div className="town-slider-arrows">
                    <button
                      type="button"
                      className="town-slider-btn town-slider-btn--prev"
                      onClick={handlePrevSlide}
                      aria-label="Previous slide"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="town-slider-btn town-slider-btn--next"
                      onClick={handleNextSlide}
                      aria-label="Next slide"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Blueprint Axis Line Underneath */}
        <div className="town-about-axis-line" aria-hidden="true" />
      </div>
    </section>
  );
};
