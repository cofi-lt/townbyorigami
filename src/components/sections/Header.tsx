import { Dispatch, SetStateAction, useState } from "react";
import { Theme } from "../../types";
import { Language, TranslationKey } from "../../i18n";
import { CloseIcon, GlobeOutlineIcon, MoonIcon, PhoneIcon, SunIcon } from "../Icons";

type HeaderProps = {
  headerShrunk: boolean;
  variant?: "default" | "units" | "surface";
  darkThemeLogoSrc: string;
  lightThemeLogoSrc: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  primaryNavItems: Array<{ href: string; label: string; isModalAction?: boolean }>;
  callRequestLabel?: string;
  t: (key: TranslationKey) => string;
  openModal?: (style?: "consultation" | "request_call") => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: Dispatch<SetStateAction<boolean>>;
  language: Language;
  languageOptions: Array<{ code: Language; label: string; shortLabel: string; flag?: string }>;
  handleLanguageSelect: (nextLanguage: Language) => void;
  theme: Theme;
  handleThemeToggle: () => void;
};

export function Header({
  headerShrunk,
  variant = "default",
  darkThemeLogoSrc,
  lightThemeLogoSrc,
  mobileMenuOpen,
  setMobileMenuOpen,
  primaryNavItems,
  callRequestLabel,
  t,
  openModal,
  isLanguageModalOpen,
  setIsLanguageModalOpen,
  language,
  languageOptions,
  handleLanguageSelect,
  theme,
  handleThemeToggle
}: HeaderProps) {
  const isUnitsVariant = variant === "units";
  const isSurfaceVariant = variant === "surface";
  const [mobileLanguageDropdownOpen, setMobileLanguageDropdownOpen] = useState(false);
  const currentLanguageOption = languageOptions.find((opt) => opt.code === language) || languageOptions[0];
  const callRequestItem = primaryNavItems.find((item) => item.isModalAction);
  const resolvedCallRequestLabel =
    callRequestLabel?.trim() ||
    callRequestItem?.label?.trim() ||
    t("request_call_title") ||
    "ზარის მოთხოვნა";

  const handleNavItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className={`${headerShrunk ? "header-shrunk" : ""} ${isUnitsVariant ? "header-units" : ""} ${isSurfaceVariant ? "header-surface" : ""}`.trim()}>
      <div className="container">
        <a href={isUnitsVariant || isSurfaceVariant ? "/" : "#"} className="logo-container">
          <img
            src={darkThemeLogoSrc}
            alt="ORIGAMI"
            className="logo-img logo-dark"
          />
          <img
            src={lightThemeLogoSrc}
            alt="ORIGAMI"
            className="logo-img logo-light"
          />
        </a>

        {!isUnitsVariant ? (
          <>
            <nav id="nav-menu" className={mobileMenuOpen ? "active" : ""}>
              <div className="mobile-nav-logo theme-aware-logo">
                <img src={darkThemeLogoSrc} alt="ORIGAMI" className="logo-img logo-dark" />
                <img src={lightThemeLogoSrc} alt="ORIGAMI" className="logo-img logo-light" />
              </div>
              <button
                className="mobile-menu-close"
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CloseIcon />
              </button>
              {primaryNavItems.filter((item) => !item.isModalAction).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    handleNavItemClick();
                  }}
                >
                  <span>{item.label}</span>
                </a>
              ))}
              {openModal ? (
                <button
                  type="button"
                  className="nav-link-call-request"
                  aria-label={resolvedCallRequestLabel}
                  onClick={() => {
                    handleNavItemClick();
                    openModal("request_call");
                  }}
                >
                  <PhoneIcon />
                  <span>{resolvedCallRequestLabel}</span>
                </button>
              ) : null}
              <div className={`mobile-nav-lang-dropdown ${mobileLanguageDropdownOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="mobile-nav-lang-toggle"
                  aria-expanded={mobileLanguageDropdownOpen}
                  aria-label={t("language_modal_title")}
                  onClick={() => setMobileLanguageDropdownOpen((open) => !open)}
                >
                  <span className="mobile-nav-lang-current">
                    <GlobeOutlineIcon />
                    <span>{currentLanguageOption.label}</span>
                    <span className="mobile-nav-lang-badge">{currentLanguageOption.shortLabel}</span>
                  </span>
                  <svg className="mobile-nav-lang-chevron" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {mobileLanguageDropdownOpen ? (
                  <div className="mobile-nav-lang-menu" role="menu">
                    {languageOptions.map((option) => {
                      const isSelected = language === option.code;
                      return (
                        <button
                          key={option.code}
                          type="button"
                          className={`mobile-nav-lang-option ${isSelected ? "is-active" : ""}`}
                          role="menuitem"
                          onClick={() => {
                            handleLanguageSelect(option.code);
                            setMobileLanguageDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <span className="mobile-nav-lang-option-main">
                            {option.flag ? <span className="mobile-nav-lang-flag">{option.flag}</span> : null}
                            <span className="mobile-nav-lang-label">{option.label}</span>
                          </span>
                          <span className="mobile-nav-lang-option-code">{option.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
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

        <div className="header-actions">
          <button
            className="nav-language-btn header-language-btn"
            type="button"
            aria-label={t("language_modal_title")}
            aria-haspopup="dialog"
            aria-expanded={isLanguageModalOpen}
            onClick={() => setIsLanguageModalOpen(true)}
          >
            <GlobeOutlineIcon />
          </button>
          <div className="controls-pill">
            <button
              id="theme-toggle-btn"
              className="theme-pill-btn"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-pressed={theme === "light"}
              data-theme-state={theme}
              type="button"
              onClick={handleThemeToggle}
            >
              <span className="theme-pill-option theme-pill-option-dark" aria-hidden="true">
                <MoonIcon />
              </span>
              <span className="theme-pill-option theme-pill-option-light" aria-hidden="true">
                <SunIcon />
              </span>
            </button>
          </div>
          {!isUnitsVariant ? (
            <button
              id="mobile-menu-toggle"
              className={`mobile-menu-btn ${mobileMenuOpen ? "active" : ""}`}
              aria-label="Toggle Navigation Menu"
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
