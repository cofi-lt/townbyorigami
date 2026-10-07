import { FC } from "react";
import type { TranslationKey } from "../../i18n";

interface TownBelongSectionProps {
  t?: (key: TranslationKey) => string;
  onCtaClick?: () => void;
}

export const TownBelongSection: FC<TownBelongSectionProps> = ({ t, onCtaClick }) => {
  const subtitle = t ? t("filter_kind_all") : undefined;

  return (
    <section className="town-belong-section reveal-on-scroll" onClick={onCtaClick}>
      <div className="container">
        <div className="town-belong-header reveal-fade-up">
          <div className="town-belong-left">
            <span className="town-kicker">{subtitle ? "A PLACE TO BELONG" : "A PLACE TO BELONG"}</span>
            <h2 className="town-heading-serif">
              More Than <span className="town-italic-accent">A Home</span>
            </h2>
          </div>
          <div className="town-belong-right">
            <p className="town-belong-desc">
              Town is a residential community designed for people who value comfort, connection and a better everyday life.
            </p>
          </div>
        </div>
        <div className="town-belong-divider" />
      </div>
    </section>
  );
};
