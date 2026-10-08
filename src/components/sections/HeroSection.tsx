import { BuildingIcon, CurrencyIcon, LocationIcon, SearchIcon } from "../Icons";
import type { TranslationKey } from "../../i18n";

export function HeroSection({ t }: { t: (key: TranslationKey) => string }) {
  return (
    <section className="town-hero-section">
      <div className="town-hero-media">
        <video
          className="town-hero-video"
          src="https://origam.ge/video/origami.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Town by Origami"
        />
      </div>
      <div className="town-static-filter" aria-label="Property search filters">
        <div className="town-static-filter-field">
          <LocationIcon />
          <span>{t("filter_room_all")}</span>
          <span className="town-static-filter-chevron" aria-hidden="true" />
        </div>
        <div className="town-static-filter-field">
          <BuildingIcon />
          <span>{t("filter_kind_all")}</span>
          <span className="town-static-filter-chevron" aria-hidden="true" />
        </div>
        <div className="town-static-filter-field">
          <CurrencyIcon />
          <span>{t("filter_condition_all")}</span>
          <span className="town-static-filter-chevron" aria-hidden="true" />
        </div>
        <div className="town-static-filter-search" aria-hidden="true">
          <SearchIcon />
          <span>{t("filter_search")}</span>
        </div>
      </div>
    </section>
  );
}
