import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { Language } from "../../i18n";
import { MobileMenu } from "../layout/MobileMenu";

type HeaderProps = {
  headerShrunk: boolean;
  variant?: "default" | "units" | "surface";
  darkThemeLogoSrc?: string;
  lightThemeLogoSrc?: string;
  primaryNavItems: Array<{ href: string; label: string; isModalAction?: boolean; scrollTargetId?: string }>;
  callRequestLabel?: string;
  openModal?: (style?: "consultation" | "request_call") => void;
  isLanguageModalOpen?: boolean;
  setIsLanguageModalOpen?: Dispatch<SetStateAction<boolean>>;
  language: Language;
  languageOptions: Array<{ code: Language; label: string; shortLabel: string; flag?: string }>;
  handleLanguageSelect: (nextLanguage: Language) => void;
  theme?: "light" | "dark";
  handleThemeToggle?: () => void;
  phone?: string;
};

export function Header({
  headerShrunk,
  variant = "default",
  primaryNavItems,
  callRequestLabel,
  openModal,
  language,
  languageOptions,
  handleLanguageSelect,
  theme: _theme = "light",
  handleThemeToggle: _handleThemeToggle,
  phone
}: HeaderProps) {
  const isUnitsVariant = variant === "units";
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const desktopLangRef = useRef<HTMLDivElement | null>(null);

  const currentLanguageOption = languageOptions.find((opt) => opt.code === language) || languageOptions[0];
  const callRequestItem = primaryNavItems.find((item) => item.isModalAction);
  const resolvedCallRequestLabel =
    callRequestLabel?.trim() ||
    callRequestItem?.label?.trim() ||
    "";

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !langRef.current?.contains(e.target as Node) &&
        !desktopLangRef.current?.contains(e.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleNavItemClick = (event: React.MouseEvent<HTMLAnchorElement>, item: (typeof primaryNavItems)[number]) => {
    if (!item.scrollTargetId) return;

    const target = document.getElementById(item.scrollTargetId);
    if (!target) return;

    event.preventDefault();
    const hash = `#${item.scrollTargetId}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    const headerHeight = document.getElementById("main-header")?.getBoundingClientRect().height || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);

  const handleOpenMobileMenu = () => {
    setIsMenuClosing(false);
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMenuClosing(false);
    }, 650);
  };

  return (
    <>
      <header id="main-header" className={`town-header ${headerShrunk ? "town-header--shrunk" : ""} ${isUnitsVariant ? "header-units" : ""} ${isMobileMenuOpen ? "is-menu-open" : ""}`}>
        <div className="town-header-container">
          {/* Brand Logo */}
          <a href="/" className="town-brand-logo" aria-label="Town by Origami">
            <div className="town-logo-mark">
              <span className="town-logo-main">TOWN</span>
              <span className="town-logo-sub">BY ORIGAMI</span>
            </div>
          </a>

          {!isUnitsVariant && (
            <nav id="nav-menu" className="town-nav-menu" aria-label="Main navigation">
              {primaryNavItems.filter((item) => !item.isModalAction).map((item) => (
                <a
                  key={item.href}
                  href={item.scrollTargetId ? `#${item.scrollTargetId}` : item.href}
                  className="town-nav-link"
                  onClick={(event) => handleNavItemClick(event, item)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="town-header-right">
            {/* Language Minimal Dropdown */}
            <div className="town-lang-wrapper" ref={desktopLangRef}>
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
            {openModal && resolvedCallRequestLabel ? (
              <button
                type="button"
                className="town-btn-forest town-header-cta"
                onClick={() => openModal("request_call")}
              >
                <span>{resolvedCallRequestLabel}</span>
              </button>
            ) : null}

            {/* Mobile Menu Trigger (Angled 3-bar kinetic hamburger from reference) */}
            <button
              type="button"
              className={`town-menu-trigger ${isMobileMenuOpen && !isMenuClosing ? "is-active" : ""}`}
              aria-label="მენიუს გახსნა"
              aria-expanded={isMobileMenuOpen}
              onClick={() => {
                if (isMobileMenuOpen) {
                  handleCloseMobileMenu();
                } else {
                  handleOpenMobileMenu();
                }
              }}
            >
              <div className="town-menu-trigger-bars">
                <span className="town-menu-trigger-bar top" />
                <span className="town-menu-trigger-bar middle" />
                <span className="town-menu-trigger-bar bottom" />
              </div>
            </button>

          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        isClosing={isMenuClosing}
        onClose={handleCloseMobileMenu}
        primaryNavItems={primaryNavItems}
        onNavItemClick={(event, item) => {
          handleNavItemClick(event, item);
          handleCloseMobileMenu();
        }}
        callRequestLabel={resolvedCallRequestLabel}
        openModal={openModal}
        language={language}
        languageOptions={languageOptions}
        handleLanguageSelect={handleLanguageSelect}
        phone={phone}
      />
    </>
  );
}
