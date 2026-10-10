import type { FC, RefObject } from "react";
import type { Language, TranslationKey } from "../../i18n";
import type { LocationContent } from "../../types";

export interface LocationSectionProps {
  data?: LocationContent | null;
  mapData?: LocationContent | null;
  language?: Language;
  sectionRef?: RefObject<HTMLElement>;
  t?: (key: TranslationKey) => string;
}

function renderAmenityIcon(iconType?: string) {
  switch (iconType) {
    case "office":
    case "building":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z" />
        </svg>
      );
    case "cafe":
    case "coffee":
    case "restaurant":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      );
    case "medical":
    case "hospital":
    case "health":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "school":
    case "education":
    case "kindergarten":
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
        </svg>
      );
  }
}

export const LocationSection: FC<LocationSectionProps> = ({
  data,
  mapData,
  language = "en",
  sectionRef,
  t: _t
}) => {
  const eyebrow = data?.eyebrow?.trim() || "";
  const title = (data?.title?.trim() || "").replace(/\s+,/g, ",");
  const description = data?.description?.trim() || "";
  const buildingImage = data?.background_image?.trim() || data?.image?.trim() || "";
  const mapEmbedUrl = mapData?.description?.trim() || "";
  const localizedMapEmbedUrl = (() => {
    if (!mapEmbedUrl) return "";
    try {
      const url = new URL(mapEmbedUrl);
      url.searchParams.set("hl", language);
      const embeddedMapParameters = url.searchParams.get("pb");
      if (embeddedMapParameters) {
        url.searchParams.set(
          "pb",
          embeddedMapParameters.replace(/!1s[a-z]{2,3}(?=!|$)/i, `!1s${language}`)
        );
      }
      return url.toString();
    } catch {
      return mapEmbedUrl;
    }
  })();
  const amenities = (data?.items || []).filter((item) => (item as any).status !== false && Boolean(item.title?.trim()));
  const mapItems = (mapData?.items || []).filter((item) => (item as any).status !== false && Boolean(item.title?.trim()));

  if (!data && !mapData) return null;

  return (
    <section
      id="location"
      className="town-location-section reveal-on-scroll"
      ref={sectionRef}
      aria-label={title}
    >
      <div className="container town-location-container">
        {data && <>
        {/* Top Part: Editorial Content & Complex Preview */}
        <div className="town-location-top">
          {/* Left Column: Heading, Description, Amenity Cards */}
          <div className="town-location-content reveal-fade-up">
            {eyebrow && <div className="town-location-eyebrow-wrap">
              <span className="town-location-eyebrow-line" aria-hidden="true" />
              <span className="town-location-eyebrow">{eyebrow}</span>
            </div>}

            {title && <h2 className="town-location-title">{title}</h2>}

            {description && <p className="town-location-description">{description}</p>}

            <div className="town-location-amenities" role="list">
              {amenities.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="town-location-amenity-card"
                  role="listitem"
                >
                  <div className="town-location-amenity-icon">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="town-location-amenity-img-icon"
                      />
                    ) : (
                      (item.icon ? renderAmenityIcon(item.icon) : null)
                    )}
                  </div>
                  <span className="town-location-amenity-title">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Photo */}
          {buildingImage && <div className="town-location-media reveal-fade-up">
            <div className="town-location-media-frame">
              <img
                src={buildingImage}
                alt={title}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>}
        </div>
        </>}

        {/* Bottom Part: Stylized Map Graphic with Interactive Overlays */}
        {localizedMapEmbedUrl && <div className="town-location-map-wrap reveal-fade-up">
          <div className="town-location-map-frame">
            <iframe
              title={mapData?.title || title}
              src={localizedMapEmbedUrl}
              className="town-location-map-iframe"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            {mapItems.length > 0 && <div className="town-location-map-info">
              {mapItems.map((item, index) => (
                <div className="town-location-map-info-item" key={item.id ?? item.slug ?? index}>
                  {item.badge && <img className="town-location-map-info-icon" src={item.badge} alt="" aria-hidden="true" />}
                  <span>{item.title}</span>
                </div>
              ))}
            </div>}
          </div>
        </div>}
      </div>
    </section>
  );
};
