import { FC } from "react";
import type { OrigamiHoldingCompactItem } from "../../types";
import type { OrigamiHoldingContent } from "../../api/siteContent";

interface TownFeaturesStripProps {
  items?: OrigamiHoldingCompactItem[];
  holdingData?: OrigamiHoldingContent | null;
}

export const TownFeaturesStrip: FC<TownFeaturesStripProps> = ({ items = [], holdingData }) => {
  const features = items.slice(0, 4).map((item) => ({
    ...item,
    holdingItem: holdingData?.items.find((holdingItem) => holdingItem.slug === item.slug)
      || holdingData?.items.find((holdingItem) => holdingItem.rank === item.rank),
  }));

  return (
    <section className="town-features-strip reveal-on-scroll">
      <div className="container">
        <div className="town-features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="town-feature-item reveal-fade-up">
              {(feature.holdingItem?.logo || feature.holdingItem?.badge || feature.image_preview) && (
                <span className="town-feature-icon" aria-hidden="true">
                  <img
                    src={feature.holdingItem?.logo || feature.holdingItem?.badge || feature.image_preview}
                    alt=""
                    loading="lazy"
                  />
                </span>
              )}
              <h3 className="town-feature-title">{feature.title}</h3>
              {feature.holdingItem?.description?.trim() && (
                <p className="town-feature-description">{feature.holdingItem.description.trim()}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
