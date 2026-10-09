import { useEffect, useRef, useState, type FC, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { Language, TranslationKey } from "../../i18n";
import type { LocationContent, LocationAmenityItem } from "../../types";

export interface LocationSectionProps {
  data?: LocationContent | null;
  language?: Language;
  sectionRef?: RefObject<HTMLElement>;
  t?: (key: TranslationKey) => string;
}

const DEFAULT_AMENITIES_BY_LANG: Record<string, LocationAmenityItem[]> = {
  ka: [
    {
      id: "admin",
      slug: "admin",
      icon: "office",
      title: "ადმინისტრაციული დაწესებულებები"
    },
    {
      id: "cafes",
      slug: "cafes",
      icon: "cafe",
      title: "კაფეები და რესტორნები"
    },
    {
      id: "medical",
      slug: "medical",
      icon: "medical",
      title: "სამედიცინო დაწესებულებები"
    },
    {
      id: "schools",
      slug: "schools",
      icon: "school",
      title: "საბავშვო ბაღები და სკოლები"
    }
  ],
  en: [
    {
      id: "admin",
      slug: "admin",
      icon: "office",
      title: "Administrative Offices"
    },
    {
      id: "cafes",
      slug: "cafes",
      icon: "cafe",
      title: "Cafes & Restaurants"
    },
    {
      id: "medical",
      slug: "medical",
      icon: "medical",
      title: "Medical Facilities"
    },
    {
      id: "schools",
      slug: "schools",
      icon: "school",
      title: "Kindergartens & Schools"
    }
  ],
  ru: [
    {
      id: "admin",
      slug: "admin",
      icon: "office",
      title: "Административные офисы"
    },
    {
      id: "cafes",
      slug: "cafes",
      icon: "cafe",
      title: "Кафе и рестораны"
    },
    {
      id: "medical",
      slug: "medical",
      icon: "medical",
      title: "Медицинские учреждения"
    },
    {
      id: "schools",
      slug: "schools",
      icon: "school",
      title: "Детские сады и школы"
    }
  ]
};

const I18N_FALLBACKS: Record<
  string,
  {
    eyebrow: string;
    title: string;
    description: string;
    badge: string;
    legendTown: string;
    legendCenter: string;
    legendParks: string;
    cityMarker: string;
    townPinTitle: string;
    townPinAddress: string;
    expandBtn: string;
    modalTitle: string;
    openInGoogleMaps: string;
    close: string;
  }
> = {
  ka: {
    eyebrow: "LOCATION",
    title: "Everything Within Reach",
    description:
      "Origami Town is surrounded by educational, sports, medical and everyday amenities, making it easy to stay connected to the places you need throughout the day.",
    badge: "Origami Town · ბათუმი",
    legendTown: "Origami Town",
    legendCenter: "ქალაქის ცენტრი",
    legendParks: "პარკები და მწვანე ზონა",
    cityMarker: "ქალაქი ბათუმი",
    townPinTitle: "Origami Town",
    townPinAddress: "[მისამართი], ბათუმი",
    expandBtn: "დააჭირეთ რუკას გასადიდებლად",
    modalTitle: "Origami Town — მდებარეობა ბათუმში",
    openInGoogleMaps: "Google Maps-ში გახსნა",
    close: "დახურვა"
  },
  en: {
    eyebrow: "LOCATION",
    title: "Everything Within Reach",
    description:
      "Origami Town is surrounded by educational, sports, medical and everyday amenities, making it easy to stay connected to the places you need throughout the day.",
    badge: "Origami Town · Batumi",
    legendTown: "Origami Town",
    legendCenter: "City Center",
    legendParks: "Parks & Green Zones",
    cityMarker: "Batumi City",
    townPinTitle: "Origami Town",
    townPinAddress: "Batumi, Georgia",
    expandBtn: "Click map to expand",
    modalTitle: "Origami Town — Location in Batumi",
    openInGoogleMaps: "Open in Google Maps",
    close: "Close"
  },
  ru: {
    eyebrow: "ЛОКАЦИЯ",
    title: "Всё в шаговой доступности",
    description:
      "Origami Town окружен образовательными, спортивными, медицинскими и бытовыми объектами, обеспечивая легкий доступ ко всему необходимому в течение дня.",
    badge: "Origami Town · Батуми",
    legendTown: "Origami Town",
    legendCenter: "Центр города",
    legendParks: "Парки и зеленая зона",
    cityMarker: "Город Батуми",
    townPinTitle: "Origami Town",
    townPinAddress: "Батуми, Грузия",
    expandBtn: "Нажмите для увеличения карты",
    modalTitle: "Origami Town — Локация в Батуми",
    openInGoogleMaps: "Открыть в Google Maps",
    close: "Закрыть"
  }
};

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

function getAmenityIconType(slug?: string, icon?: string): string {
  const key = `${slug || ""} ${icon || ""}`.toLowerCase();
  if (
    key.includes("admin") ||
    key.includes("office") ||
    key.includes("building") ||
    key.includes("ოფის") ||
    key.includes("ადმინ")
  ) {
    return "office";
  }
  if (
    key.includes("cafe") ||
    key.includes("restaurant") ||
    key.includes("food") ||
    key.includes("coffee") ||
    key.includes("კაფე") ||
    key.includes("რესტორ")
  ) {
    return "cafe";
  }
  if (
    key.includes("medic") ||
    key.includes("hospital") ||
    key.includes("health") ||
    key.includes("clinic") ||
    key.includes("სამედიცინო")
  ) {
    return "medical";
  }
  if (
    key.includes("school") ||
    key.includes("kindergarten") ||
    key.includes("edu") ||
    key.includes("სკოლ") ||
    key.includes("ბაღ")
  ) {
    return "school";
  }
  return "office";
}

export const LocationSection: FC<LocationSectionProps> = ({
  data,
  language = "en",
  sectionRef,
  t: _t
}) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const startOffsetRef = useRef({ x: 0, y: 0 });

  const fallback = I18N_FALLBACKS[language] || I18N_FALLBACKS.en;
  const defaultAmenities = DEFAULT_AMENITIES_BY_LANG[language] || DEFAULT_AMENITIES_BY_LANG.en;

  const eyebrow = data?.eyebrow?.trim() || fallback.eyebrow;
  const rawTitle = data?.title?.trim() || fallback.title;
  const title = rawTitle.replace(/\s+,/g, ",");
  const description = data?.description?.trim() || fallback.description;
  const buildingImage =
    data?.background_image?.trim() ||
    data?.image?.trim() ||
    "/assets/location_building.png";
  const badgeText = data?.image_badge?.trim() || fallback.badge;
  const mapImage = data?.map_image?.trim() || "/assets/location_map_batumi.png";

  const amenities: LocationAmenityItem[] =
    data?.items && data.items.length > 0
      ? data.items
          .filter((item) => (item as any).status !== false)
          .map((item, idx) => ({
            id: item.id || idx,
            slug: item.slug || `amenity-${idx}`,
            title: item.title?.trim() || defaultAmenities[idx]?.title || "",
            image: item.image || (item as any).logo || "",
            icon: item.icon || getAmenityIconType(item.slug, item.icon || defaultAmenities[idx]?.icon)
          }))
      : defaultAmenities;

  // Zoom controls for the interactive preview map
  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale((prev) => Math.min(2.2, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale((prev) => {
      const next = Math.max(1, +(prev - 0.25).toFixed(2));
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag-to-pan handlers when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
    startOffsetRef.current = { ...panOffset };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || zoomScale <= 1) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setPanOffset({
      x: startOffsetRef.current.x + dx,
      y: startOffsetRef.current.y + dy
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Modal keyboard & body scroll lock
  useEffect(() => {
    if (!isMapModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMapModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMapModalOpen]);

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=41.6168,41.6367";

  return (
    <section
      id="location"
      className="town-location-section reveal-on-scroll"
      ref={sectionRef}
      aria-label="Location"
    >
      <div className="container town-location-container">
        {/* Top Part: Editorial Content & Complex Preview */}
        <div className="town-location-top">
          {/* Left Column: Heading, Description, Amenity Cards */}
          <div className="town-location-content reveal-fade-up">
            <div className="town-location-eyebrow-wrap">
              <span className="town-location-eyebrow-line" aria-hidden="true" />
              <span className="town-location-eyebrow">{eyebrow}</span>
            </div>

            <h2 className="town-location-title">{title}</h2>

            <p className="town-location-description">{description}</p>

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
                      renderAmenityIcon(item.icon)
                    )}
                  </div>
                  <span className="town-location-amenity-title">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Photo with Floating Badge */}
          <div className="town-location-media reveal-fade-up">
            <div className="town-location-media-frame">
              <img
                src={buildingImage}
                alt={title}
                loading="lazy"
                decoding="async"
              />
              <div className="town-location-media-badge" aria-label="Location label">
                <span className="town-location-media-dot" aria-hidden="true" />
                <span className="town-location-media-text">{badgeText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Part: Stylized Map Graphic with Interactive Overlays */}
        <div className="town-location-map-wrap reveal-fade-up">
          <div
            className={`town-location-map-viewport ${zoomScale > 1 ? "is-zoomed" : ""} ${isPanning ? "is-panning" : ""}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* The Stylized Batumi Map Graphic */}
            <div
              className="town-location-map-canvas"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`
              }}
            >
              <img
                src={mapImage}
                alt="Batumi Origami Town Map"
                className="town-location-map-img"
                draggable={false}
              />
            </div>

            {/* Top-Right Zoom Controls */}
            <div className="town-location-map-controls" aria-label="Map zoom controls">
              <button
                type="button"
                className="town-location-map-ctrl-btn"
                onClick={handleZoomIn}
                title="Zoom In"
                aria-label="Zoom in map"
              >
                +
              </button>
              <button
                type="button"
                className="town-location-map-ctrl-btn"
                onClick={handleZoomOut}
                title="Zoom Out"
                aria-label="Zoom out map"
              >
                −
              </button>
              <button
                type="button"
                className="town-location-map-ctrl-btn town-location-map-ctrl-reset"
                onClick={handleResetZoom}
                title="Reset Position"
                aria-label="Reset map view"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="22" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="12" x2="2" y2="12" />
                  <line x1="12" y1="6" x2="12" y2="2" />
                  <line x1="12" y1="22" x2="12" y2="18" />
                </svg>
              </button>
            </div>

            {/* Bottom-Center Interactive Expand Button */}
            <button
              type="button"
              className="town-location-map-expand-btn"
              onClick={() => setIsMapModalOpen(true)}
              aria-label={fallback.expandBtn}
            >
              <span>{fallback.expandBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Interactive Map Modal */}
      {isMapModalOpen &&
        createPortal(
          <div
            className="town-location-modal-backdrop"
            onClick={() => setIsMapModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={fallback.modalTitle}
          >
            <div
              className="town-location-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="town-location-modal-header">
                <div className="town-location-modal-header-info">
                  <div className="town-location-modal-badge">
                    <span className="town-location-media-dot" />
                    <span>Origami Town</span>
                  </div>
                  <h3 className="town-location-modal-title">{fallback.modalTitle}</h3>
                </div>

                <div className="town-location-modal-actions">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="town-location-modal-gmaps-link"
                  >
                    <span>{fallback.openInGoogleMaps}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    className="town-location-modal-close"
                    onClick={() => setIsMapModalOpen(false)}
                    aria-label={fallback.close}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="town-location-modal-body">
                <iframe
                  title="Origami Town Batumi Interactive Map"
                  src="https://maps.google.com/maps?q=41.6168,41.6367&z=15&output=embed"
                  className="town-location-modal-iframe"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
