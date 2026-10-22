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
  language: import("../../i18n").Language;
  languageOptions: Array<{ code: Language; label: string; shortLabel: string; flag?: string }>;
  handleLanguageSelect: (nextLanguage: Language) => void;
}

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
  handleLanguageSelect
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

  const itemsToRender = primaryNavItems.filter(
    (item) => !item.isModalAction && item.label?.trim().length > 0
  );

  const overlayElement = (
    <div
      className={`town-mobile-menu-overlay ${isOpen && !isClosing ? "is-open" : ""} ${isClosing ? "is-closing" : ""} is-visible`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Content Layer */}
      <div className="town-mobile-menu-content">
        {/* Top Header Row with Brand & Close Button */}
        <div className="town-mobile-menu-header">
          <a href="/" className="town-brand-logo" onClick={onClose} aria-label="Town by Origami">
            <img
              src="https://origam.ge/image/logo_Green_ENG.svg"
              alt="Town by Origami"
              className="town-logo-img"
            />
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
                <span className="town-mobile-lang-name">{opt.label}</span>
                <span className="town-mobile-lang-code">({opt.shortLabel})</span>
              </button>
            ))}
          </div>

        </div>
      </div>

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
                  <span className="town-mobile-nav-text">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
    </div>
  );

  return createPortal(overlayElement, document.body);
};
