import { FC } from "react";
import type { AboutUsApiItem } from "../../types";
import { getOptimizedImageUrl, normalizeApiImageUrl } from "../../utils/media";

interface TownAboutSectionProps {
  data?: AboutUsApiItem | null;
  image?: string;
  onLearnMore?: () => void;
  buttonText?: string;
}

export const TownAboutSection: FC<TownAboutSectionProps> = ({
  data,
  image,
  onLearnMore,
  buttonText = "LEARN MORE"
}) => {
  const fallbackImage = "/assets/hero_bg_2.png";
  const rawImage = data?.image || image || fallbackImage;
  const displayImage = normalizeApiImageUrl(rawImage);

  const renderTitle = () => {
    if (!data?.title) {
      return (
        <>
          Crafting Spaces<br />
          That Reflect <span className="town-italic-accent">You</span>
        </>
      );
    }

    const words = data.title.trim().split(" ");
    if (words.length > 1) {
      const mainWords = words.slice(0, -1).join(" ");
      const lastWord = words[words.length - 1];
      return (
        <>
          {mainWords} <span className="town-italic-accent">{lastWord}</span>
        </>
      );
    }

    return <>{data.title}</>;
  };

  return (
    <section id="about" className="town-about-section reveal-on-scroll">
      <div className="container">
        <div className="town-about-grid">
          {/* Left Column: Text & CTA */}
          <div className="town-about-content reveal-fade-up">
            <div className="town-kicker-wrapper">
              <span className="town-kicker">ABOUT TOWN</span>
              <span className="town-kicker-line" aria-hidden="true" />
            </div>

            <h2 className="town-heading-serif">
              {renderTitle()}
            </h2>

            <div className="town-about-desc">
              {data?.body ? (
                <div dangerouslySetInnerHTML={{ __html: data.body }} />
              ) : (
                <p>
                  At Town, modern living meets a calmer rhythm. Thoughtful architecture, green surroundings, and a complete living environment come together to create a place where life feels balanced.
                </p>
              )}
            </div>

            <div className="town-about-action">
              <button
                type="button"
                className="town-btn-forest"
                onClick={onLearnMore}
              >
                <span>{buttonText}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Image with Framing */}
          <div className="town-about-visual-wrapper reveal-scale">
            <div className="town-about-frame">
              <div className="town-about-image-card">
                <img
                  src={getOptimizedImageUrl(displayImage, { width: 1200, height: 900, crop: "fill", gravity: "auto" })}
                  alt={data?.title || "Town by Origami"}
                  className="town-about-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="town-about-frame-border" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
