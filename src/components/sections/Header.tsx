import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { Language, TranslationKey } from "../../i18n";
import { CloseIcon } from "../Icons";

type HeaderProps = {
  headerShrunk: boolean;
  variant?: "default" | "units" | "surface";
  darkThemeLogoSrc?: string;
  lightThemeLogoSrc?: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  primaryNavItems: Array<{ href: string; label: string; isModalAction?: boolean }>;
  callRequestLabel?: string;
  t: (key: TranslationKey) => string;
  openModal?: (style?: "consultation" | "request_call") => void;
  isLanguageModalOpen?: boolean;
  setIsLanguageModalOpen?: Dispatch<SetStateAction<boolean>>;
  language: Language;
  languageOptions: Array<{ code: Language; label: string; shortLabel: string; flag?: string }>;
  handleLanguageSelect: (nextLanguage: Language) => void;
};

export function Header({
  headerShrunk,
  variant = "default",
  mobileMenuOpen,
  setMobileMenuOpen,
  primaryNavItems,
  callRequestLabel,
  t,
  openModal,
  language,
  languageOptions,
  handleLanguageSelect
}: HeaderProps) {
  const isUnitsVariant = variant === "units";
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  const currentLanguageOption = languageOptions.find((opt) => opt.code === language) || languageOptions[0];
  const callRequestItem = primaryNavItems.find((item) => item.isModalAction);
  const resolvedCallRequestLabel =
    callRequestLabel?.trim() ||
    callRequestItem?.label?.trim() ||
    t("request_call_title") ||
    "REGISTER INTEREST";

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleNavItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className={`town-header ${headerShrunk ? "town-header--shrunk" : ""} ${isUnitsVariant ? "header-units" : ""}`}>
      <div className="town-header-container">
        {/* Brand Logo */}
        <a href="/" className="town-brand-logo" aria-label="Town by Origami">
          <div className="town-logo-mark">
            <span className="town-logo-main">TOWN</span>
            <span className="town-logo-sub">BY ORIGAMI</span>
          </div>
        </a>

        {/* Navigation Menu */}
        {!isUnitsVariant ? (
          <>
            <nav id="nav-menu" className={`town-nav-menu ${mobileMenuOpen ? "active" : ""}`}>
              <div className="town-mobile-nav-header">
                <div className="town-logo-mark">
                  <span className="town-logo-main">TOWN</span>
                  <span className="town-logo-sub">BY ORIGAMI</span>
                </div>
                <button
                  className="mobile-menu-close"
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>

              {primaryNavItems.filter((item) => !item.isModalAction).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="town-nav-link"
                  onClick={handleNavItemClick}
                >
                  {item.label}
                </a>
              ))}

              <div className="town-mobile-nav-actions">
                {openModal && (
                  <button
                    type="button"
                    className="town-btn-forest town-mobile-cta"
                    onClick={() => {
                      handleNavItemClick();
                      openModal("request_call");
                    }}
                  >
                    <span>{resolvedCallRequestLabel}</span>
                  </button>
                )}
              </div>
            </nav>

            <button
              className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            />
          </>
        ) : (
          <div className="header-spacer" aria-hidden="true" />
        )}

        {/* Right Header Actions */}
        <div className="town-header-right">
          {/* Language Minimal Dropdown */}
          <div className="town-lang-wrapper" ref={langRef}>
            <button
              type="button"
              className="town-lang-trigger"
              aria-expanded={langDropdownOpen}
              onClick={() => setLangDropdownOpen((prev) => !prev)}
            >
              <span>{currentLanguageOption.shortLabel}</span>
              <svg className={`town-lang-chevron ${langDropdownOpen ? "is-open" : ""}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="town-lang-dropdown">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    className={`town-lang-option ${language === opt.code ? "is-active" : ""}`}
                    onClick={() => {
                      handleLanguageSelect(opt.code);
                      setLangDropdownOpen(false);
                    }}
                  >
                    {opt.flag && <span className="town-lang-flag">{opt.flag}</span>}
                    <span>{opt.label}</span>
                    <span className="town-lang-code">({opt.shortLabel})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="town-header-divider" aria-hidden="true" />

          {/* Register Interest CTA Button */}
          {openModal ? (
            <button
              type="button"
              className="town-btn-forest town-header-cta"
              onClick={() => openModal("request_call")}
            >
              <span>{resolvedCallRequestLabel}</span>
            </button>
          ) : null}

          {/* Mobile Menu Toggle */}
          {!isUnitsVariant && (
            <button
              id="mobile-menu-toggle"
              className={`town-mobile-toggle ${mobileMenuOpen ? "active" : ""}`}
              aria-label="Toggle Navigation Menu"
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
