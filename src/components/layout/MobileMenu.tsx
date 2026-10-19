import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Language } from "../../i18n";

export interface MobileNavItem {
  href: string;
  label: string;
  isModalAction?: boolean;
  scrollTargetId?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  primaryNavItems: MobileNavItem[];
  onNavItemClick: (event: React.MouseEvent<HTMLAnchorElement>, item: MobileNavItem) => void;
  callRequestLabel?: string;
  openModal?: (style?: "consultation" | "request_call") => void;
  language: Language;
  languageOptions: Array<{ code: Language; label: string; shortLabel: string; flag?: string }>;
  handleLanguageSelect: (nextLanguage: Language) => void;
  phone?: string;
}

const fallbackNavItemsByLang: Record<Language, Array<{ href: string; label: string; scrollTargetId?: string }>> = {
  ka: [
    { href: "#about", label: "პროექტის შესახებ", scrollTargetId: "about" },
    { href: "#properties", label: "ბინები", scrollTargetId: "properties" },
    { href: "#infrastructure", label: "ინფრასტრუქტურა", scrollTargetId: "infrastructure" },
    { href: "#location", label: "ლოკაცია", scrollTargetId: "location" },
    { href: "#about-origami", label: "Origami Holding", scrollTargetId: "about-origami" },
    { href: "#news", label: "სიახლეები", scrollTargetId: "news" },
    { href: "#contact", label: "კონტაქტი", scrollTargetId: "contact" }
  ],
  en: [
    { href: "#about", label: "About Project", scrollTargetId: "about" },
    { href: "#properties", label: "Properties", scrollTargetId: "properties" },
    { href: "#infrastructure", label: "Infrastructure", scrollTargetId: "infrastructure" },
    { href: "#location", label: "Location", scrollTargetId: "location" },
    { href: "#about-origami", label: "Origami Holding", scrollTargetId: "about-origami" },
    { href: "#news", label: "News", scrollTargetId: "news" },
    { href: "#contact", label: "Contact", scrollTargetId: "contact" }
  ],
  ru: [
    { href: "#about", label: "О проекте", scrollTargetId: "about" },
    { href: "#properties", label: "Квартиры", scrollTargetId: "properties" },
    { href: "#infrastructure", label: "Инфраструктура", scrollTargetId: "infrastructure" },
    { href: "#location", label: "Локация", scrollTargetId: "location" },
    { href: "#about-origami", label: "Origami Holding", scrollTargetId: "about-origami" },
    { href: "#news", label: "Новости", scrollTargetId: "news" },
    { href: "#contact", label: "Контакты", scrollTargetId: "contact" }
  ],
  zh: [
    { href: "#about", label: "关于项目", scrollTargetId: "about" },
    { href: "#properties", label: "房源户型", scrollTargetId: "properties" },
    { href: "#infrastructure", label: "配套设施", scrollTargetId: "infrastructure" },
    { href: "#location", label: "地理位置", scrollTargetId: "location" },
    { href: "#about-origami", label: "Origami Holding", scrollTargetId: "about-origami" },
    { href: "#news", label: "新闻动态", scrollTargetId: "news" },
    { href: "#contact", label: "联系我们", scrollTargetId: "contact" }
  ],
  he: [
    { href: "#about", label: "אודות הפרויקט", scrollTargetId: "about" },
    { href: "#properties", label: "דירות", scrollTargetId: "properties" },
    { href: "#infrastructure", label: "תשתיות", scrollTargetId: "infrastructure" },
    { href: "#location", label: "מיקום", scrollTargetId: "location" },
    { href: "#about-origami", label: "Origami Holding", scrollTargetId: "about-origami" },
    { href: "#news", label: "חדשות", scrollTargetId: "news" },
    { href: "#contact", label: "צור קשר", scrollTargetId: "contact" }
  ],
  it: [
    { href: "#about", label: "Sul Progetto", scrollTargetId: "about" },
    { href: "#properties", label: "Appartamenti", scrollTargetId: "properties" },
    { href: "#infrastructure", label: "Infrastruttura", scrollTargetId: "infrastructure" },
    { href: "#location", label: "Posizione", scrollTargetId: "location" },
    { href: "#about-origami", label: "Origami Holding", scrollTargetId: "about-origami" },
    { href: "#news", label: "Notizie", scrollTargetId: "news" },
    { href: "#contact", label: "Contatti", scrollTargetId: "contact" }
  ],
  de: [
    { href: "#about", label: "Über das Projekt", scrollTargetId: "about" },
    { href: "#properties", label: "Wohnungen", scrollTargetId: "properties" },
    { href: "#infrastructure", label: "Infrastruktur", scrollTargetId: "infrastructure" },
    { href: "#location", label: "Standort", scrollTargetId: "location" },
    { href: "#about-origami", label: "Origami Holding", scrollTargetId: "about-origami" },
    { href: "#news", label: "Neuigkeiten", scrollTargetId: "news" },
    { href: "#contact", label: "Kontakt", scrollTargetId: "contact" }
  ],
  ar: [
    { href: "#about", label: "عن المشروع", scrollTargetId: "about" },
    { href: "#properties", label: "الشقق", scrollTargetId: "properties" },
    { href: "#infrastructure", label: "البنية التحتية", scrollTargetId: "infrastructure" },
    { href: "#location", label: "الموقع", scrollTargetId: "location" },
    { href: "#about-origami", label: "Origami Holding", scrollTargetId: "about-origami" },
    { href: "#news", label: "الأخبار", scrollTargetId: "news" },
    { href: "#contact", label: "اتصل بنا", scrollTargetId: "contact" }
  ]
};

export const MobileMenu: FC<MobileMenuProps> = ({
  isOpen,
  isClosing,
  onClose,
  primaryNavItems,
  onNavItemClick,
  callRequestLabel,
  openModal,
  language,
  languageOptions,
  handleLanguageSelect,
  phone
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle keyboard / resize events
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      const handleResize = () => {
        if (window.innerWidth > 991) {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", handleResize);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen, onClose]);

  if (!mounted) return null;
  if (!isOpen && !isClosing) return null;

  // Keep the mobile navigation in sync with the desktop header menu, including
  // endpoint items whose label may currently be empty while locale data loads.
  const validPrimaryItems = (primaryNavItems || []).filter((item) => !item.isModalAction);

  const itemsToRender =
    validPrimaryItems.length > 0
      ? validPrimaryItems
      : fallbackNavItemsByLang[language] || fallbackNavItemsByLang.ka;

  const formatIndex = (index: number) => {
    return index < 10 ? `0${index}` : `${index}`;
  };

  const overlayElement = (
    <div
      className={`town-mobile-menu-overlay ${isOpen && !isClosing ? "is-open" : ""} ${isClosing ? "is-closing" : ""} is-visible`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Multi-slice diagonal background from CodePen reference */}
      <div className="town-menu-bg-container" aria-hidden="true">
        <div className="town-menu-bg-accent" />
        <span className="town-menu-bg top" />
        <span className="town-menu-bg middle" />
        <span className="town-menu-bg bottom" />
      </div>

      {/* Content Layer */}
      <div className="town-mobile-menu-content">
        {/* Top Header Row with Brand & Close Button */}
        <div className="town-mobile-menu-header">
          <a href="/" className="town-brand-logo" onClick={onClose} aria-label="Town by Origami">
            <div className="town-logo-mark">
              <span className="town-logo-main">TOWN</span>
              <span className="town-logo-sub">BY ORIGAMI</span>
            </div>
          </a>

          <button
            type="button"
            className="town-close-trigger"
            aria-label="მენიუს დახურვა"
            onClick={onClose}
          >
            <div className="town-close-trigger-bars">
              <span className="town-close-trigger-bar left" />
              <span className="town-close-trigger-bar right" />
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="town-mobile-menu-nav" aria-label="Mobile main navigation">
          <ul className="town-mobile-menu-list">
            {itemsToRender.map((item, index) => (
              <li
                key={item.href || index}
                className="town-mobile-nav-item"
                style={{ "--item-idx": index } as React.CSSProperties}
              >
                <a
                  href={item.scrollTargetId ? `#${item.scrollTargetId}` : item.href}
                  className="town-mobile-nav-link"
                  onClick={(e) => onNavItemClick(e, item)}
                >
                  <span className="town-mobile-nav-index">{formatIndex(index + 1)}</span>
                  <span className="town-mobile-nav-text">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Utility Area: CTA, Languages & Contact */}
        <div className="town-mobile-menu-footer">
          {openModal && callRequestLabel ? (
            <button
              type="button"
              className="town-mobile-cta-btn"
              onClick={() => {
                onClose();
                openModal("request_call");
              }}
            >
              <span>{callRequestLabel}</span>
            </button>
          ) : null}

          <div className="town-mobile-lang-row" role="group" aria-label="Language selection">
            {languageOptions.map((opt) => (
              <button
                key={opt.code}
                type="button"
                className={`town-mobile-lang-pill ${language === opt.code ? "is-active" : ""}`}
                onClick={() => handleLanguageSelect(opt.code)}
              >
                {opt.flag && <span className="town-mobile-lang-flag">{opt.flag}</span>}
                <span>{opt.shortLabel}</span>
              </button>
            ))}
          </div>

          {phone ? (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="town-mobile-contact-link"
              aria-label={`Call ${phone}`}
            >
              <svg
                className="town-mobile-contact-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{phone}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );

  return createPortal(overlayElement, document.body);
};
