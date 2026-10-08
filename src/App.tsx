import { FormEvent, InvalidEvent, useEffect, useRef, useState } from "react";
import GA4React from "react-ga4";
import "react-medium-image-zoom/dist/styles.css";
import { translations, type Language, type TranslationKey } from "./i18n";
import { API_BASE_URL, PLATFORM_SLUG } from "./config";
import { normalizeApiImageUrl } from "./utils/media";
import { getUtmParams } from "./utils/utm";

import { PropertiesPage } from "./components/sections/PropertiesPage";
import { UnitCatalogPage } from "./components/sections/UnitCatalogPage";
import { AboutUsPage } from "./components/sections/AboutUsPage";
import { HomePage } from "./pages/HomePage";
import { AppLayout } from "./components/layout/AppLayout";
import { ConsultationModal } from "./components/sections/ConsultationModal";
import { RequestCallModal } from "./components/sections/RequestCallModal";
import { UnitsPreferencesModal } from "./components/sections/UnitsPreferencesModal";
import { FloatingCallWidget } from "./components/sections/FloatingCallWidget";
import { ArrowIcon } from "./components/Icons";
import {
  type BrandingSettings,
  type FooterSection,
  type GalleryItem,
  type GalleryApiItem,
  type GallerySectionResponse,
  type ChooseApiItem
} from "./types";
import {
  fetchCurrencyRates,
  navigateTo,
  type CurrencyRates,
  type SupportedCurrency
} from "./unitCatalog";
import { useHomepageContent } from "./hooks/useHomepageContent";
import { useSiteChrome } from "./hooks/useSiteChrome";
import { useAppRoute } from "./hooks/useAppRoute";
import { usePreferences } from "./hooks/usePreferences";
import { useNews } from "./hooks/useNews";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { formatNewsDate, formatNewsFallbackTitle } from "./api/news";


const languageOptions: Array<{ code: Language; label: string; shortLabel: string; flag: string }> = [
  { code: "en", label: "English", shortLabel: "EN", flag: "🇺🇸" },
  { code: "ka", label: "ქართული", shortLabel: "KA", flag: "🇬🇪" },
  { code: "ru", label: "Русский", shortLabel: "RU", flag: "🇷🇺" },
  { code: "zh", label: "中文", shortLabel: "ZH", flag: "🇨🇳" },
  { code: "he", label: "עברית", shortLabel: "HE", flag: "🇮🇱" },
  { code: "it", label: "Italiano", shortLabel: "IT", flag: "🇮🇹" },
  { code: "de", label: "Deutsch", shortLabel: "DE", flag: "🇩🇪" },
  { code: "ar", label: "العربية", shortLabel: "AR", flag: "🇸🇦" }
];

const brandingLogoFallbacks = {
  logo_en_url: "https://res.cloudinary.com/dju7d2yys/image/upload/v1777893298/origami/settings/logos/t58mnagh77bstwwmvpkg.png",
  logo_ka_url: "https://res.cloudinary.com/dju7d2yys/image/upload/v1777893299/origami/settings/logos/t9yu4mfpn9wteurraqqt.png",
  logo_dark_en_url: "https://res.cloudinary.com/dju7d2yys/image/upload/v1777893359/origami/settings/logos/uhlwllbfg89wynhjgcul.png",
  logo_dark_ka_url: "https://res.cloudinary.com/dju7d2yys/image/upload/v1777893360/origami/settings/logos/ia00pcubsclzataowqsu.png"
} as const;

const bitrixSiteButtonLoaders: Record<"ka" | "en" | "ru", string> = {
  ka: "https://cdn.bitrix24.com/b38005393/crm/site_button/loader_1_xzpdqz.js",
  en: "https://cdn.bitrix24.com/b38005393/crm/site_button/loader_3_jjn8zy.js",
  ru: "https://cdn.bitrix24.com/b38005393/crm/site_button/loader_5_gcualk.js"
};

type PhoneCountryCodeOption = {
  code: string;
  dialCode: string;
  label: string;
};

type CountryCodeApiItem = {
  code?: string;
  flag?: string;
  iso?: string;
  dial_code?: string;
  label?: string;
};

type CountryCodesResponse = {
  success?: boolean;
  data?: CountryCodeApiItem[] | string;
  message?: string;
};

const phoneCountryCodeFallbackOptions: PhoneCountryCodeOption[] = [
  { code: "+995", dialCode: "+995", label: "🇬🇪 GE (+995)" },
  { code: "+1", dialCode: "+1", label: "🇺🇸 US (+1)" },
  { code: "+44", dialCode: "+44", label: "🇬🇧 UK (+44)" },
  { code: "+971", dialCode: "+971", label: "🇦🇪 AE (+971)" },
  { code: "+90", dialCode: "+90", label: "🇹🇷 TR (+90)" },
  { code: "+48", dialCode: "+48", label: "🇵🇱 PL (+48)" }
];

const defaultPhoneCountryCode = phoneCountryCodeFallbackOptions[0].dialCode;

function getNewsLocale(language: Language) {
  return language;
}


function stripHtmlContent(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function resolveBrandingLogo(
  branding: BrandingSettings | null,
  language: Language,
  variant: "default" | "dark"
) {
  const localizedDefault = language === "ka" ? branding?.logo_ka_url : branding?.logo_en_url;
  const localizedDark = language === "ka" ? branding?.logo_dark_ka_url : branding?.logo_dark_en_url;

  if (variant === "dark") {
    return localizedDefault || branding?.logo_url || brandingLogoFallbacks[language === "ka" ? "logo_ka_url" : "logo_en_url"];
  }

  return localizedDark || localizedDefault || branding?.logo_dark_url || branding?.logo_url || brandingLogoFallbacks[language === "ka" ? "logo_dark_ka_url" : "logo_dark_en_url"];
}

function App() {
  const routeState = useAppRoute();
  const { language, setLanguage, theme, setTheme, currency, setCurrency } = usePreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFooterSection, setOpenFooterSection] = useState<FooterSection | null>(null);
  const [headerShrunk, setHeaderShrunk] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates | null>(null);
  const [apiGalleryItems, setApiGalleryItems] = useState<GalleryApiItem[]>([]);
  const [, setIsGalleryLoading] = useState(true);
  const [selectedChooseItem, setSelectedChooseItem] = useState<ChooseApiItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessState, setShowSuccessState] = useState(false);

  const [submitError, setSubmitError] = useState("");
  const [modalStyle, setModalStyle] = useState<"consultation" | "request_call">("request_call");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [countryCodeOptions, setCountryCodeOptions] = useState<PhoneCountryCodeOption[]>(phoneCountryCodeFallbackOptions);
  const [formCountryCode, setFormCountryCode] = useState(defaultPhoneCountryCode);
  const [formPhone, setFormPhone] = useState("");
  const [formCountry, setFormCountry] = useState(defaultPhoneCountryCode);
  const [formPreferredLanguage, setFormPreferredLanguage] = useState<string>("");
  const [formPreferredChannel, setFormPreferredChannel] = useState<string>("");
  const [, setGalleryPageCount] = useState(1);
  const [, setGalleryCurrentPage] = useState(0);
  const galleryTrackRef = useRef<HTMLDivElement | null>(null);
  const t = (key: TranslationKey) => translations[language][key];
  const {
    detail: newsDetail,
    isDetailLoading: isNewsDetailLoading,
    detailError: newsDetailError
  } = useNews(language, routeState.name === "newsDetail" ? routeState.slug : null, t("news_category"));
  const {
    companyProjectsData: apiCompanyProjectsData,
    aboutData: apiAboutData,
    aboutTownGalleryItems: apiAboutTownGalleryItems,
    aboutGridCards: apiAboutGridCards,
    aboutTownText: apiAboutTownText,
    isAboutLoading
  } = useHomepageContent(language);
  const {
    branding,
    contactSettings: apiContactSettings,
    socialNetworks: apiSocialNetworks,
    footerDescription: apiFooterDescription,
    footerMenuItems: apiFooterMenuItems,
    headerNavItems: apiHeaderNavItems,
    requestCallTitle,
    requestCallDescription,
    footerLegalItems: apiFooterLegalItems
  } = useSiteChrome(language);
  const navSourceItems: Array<{ slug?: string; title?: string; link?: string }> =
    apiHeaderNavItems && apiHeaderNavItems.length > 0
      ? apiHeaderNavItems
      : apiFooterMenuItems;

  const primaryNavItems = navSourceItems.map((item) => {
    const normalizedSlug = (item.slug || "").toLowerCase();
    const sectionBySlug: Record<string, string> = {
      "project": "about-us",
      "about-town": "about-us",
      "available-properties": "properties",
      "infrastructure": "infrastructure",
      "infrastructure-1": "infrastructure",
      "investment": "finances",
      "contact": "contact"
    };
    const isModalAction =
      normalizedSlug === "consultation" ||
      normalizedSlug === "request-a-call" ||
      normalizedSlug === "request-call" ||
      normalizedSlug === "call-request" ||
      normalizedSlug === "zaris-motkhovna";

    let href = item.link || `#${sectionBySlug[normalizedSlug] || normalizedSlug}`;
    if (!href.startsWith("#") && !href.startsWith("/") && !href.startsWith("http")) {
      href = `#${href}`;
    }

    return {
      href,
      label: item.title || "",
      isModalAction
    };
  });
  const callRequestItem = primaryNavItems.find((item) => item.isModalAction);
  const callRequestLabel =
    callRequestItem?.label?.trim() ||
    requestCallTitle?.trim() ||
    t("request_call_title") ||
    "ზარის მოთხოვნა";
  const modalDescription =
    selectedChooseItem?.description ||
    requestCallDescription ||
    "";
  const resolvedGalleryItems: GalleryItem[] = apiGalleryItems.map((item, index) => ({
    id: item.id,
    title: item.title?.trim() || "",
    subtitle: item.subtitle?.trim() || "",
    description: item.description?.trim() || "",
    image: normalizeApiImageUrl(item.image),
    badge: String(index + 1).padStart(2, "0")
  }));
  const darkThemeLogoSrc = resolveBrandingLogo(branding, language, "dark");
  const lightThemeLogoSrc = resolveBrandingLogo(branding, language, "default");

  useEffect(() => {
    GA4React.initialize("G-QYSDYT7YGN");
    getUtmParams();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://cdn.bitrix24.com/b38005393/crm/tag/call.tracker.js?${Date.now() / 60000 | 0}`;

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    if (!firstScript?.parentNode) {
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const loaderUrl = language === "ka"
      ? bitrixSiteButtonLoaders.ka
      : language === "ru"
        ? bitrixSiteButtonLoaders.ru
        : bitrixSiteButtonLoaders.en;
    const script = document.createElement("script");
    script.id = "origami-bitrix-site-button";
    script.async = true;
    script.src = `${loaderUrl}?${Date.now() / 60000 | 0}`;

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    if (!firstScript?.parentNode) {
      document.body.appendChild(script);
    }
  }, [language]);

  useEffect(() => {
    let cancelled = false;

    fetchCurrencyRates()
      .then((rates) => {
        if (!cancelled) {
          setCurrencyRates(rates);
        }
      })
      .catch((error) => {
        console.error("Failed to load currency rates:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setHeaderShrunk(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen || isLanguageModalOpen || mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isLanguageModalOpen, mobileMenuOpen]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCountryCodes = async () => {
      try {
        const response = await fetch("https://api.foodlyapp.ge/api/settings/country_codes", {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Country code request failed with status ${response.status}`);
        }

        const result = (await response.json()) as CountryCodesResponse;
        const nextOptions = (Array.isArray(result.data) ? result.data : [])
          .flatMap<PhoneCountryCodeOption>((item) => {
            const dialCode = item.dial_code?.trim() || item.code?.trim();
            const label = item.label?.trim();
            const code = item.iso?.trim() || dialCode;

            if (!dialCode || !label || !code) {
              return [];
            }

            return [{
              code,
              dialCode,
              label
            }];
          })
          .sort((left, right) => left.label.localeCompare(right.label))
          .filter((option, index, options) => options.findIndex((candidate) => candidate.code === option.code && candidate.dialCode === option.dialCode) === index);

        if (nextOptions.length > 0) {
          setCountryCodeOptions(nextOptions);

          setFormCountryCode((currentValue) => {
            if (nextOptions.some((option) => option.dialCode === currentValue)) {
              return currentValue;
            }

            if (nextOptions.some((option) => option.dialCode === defaultPhoneCountryCode)) {
              return defaultPhoneCountryCode;
            }

            return nextOptions[0].dialCode;
          });
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to load country codes:", error);
        }
      }
    };

    void loadCountryCodes();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const track = galleryTrackRef.current;
    if (!track) {
      return;
    }

    const syncGalleryPagination = () => {
      const viewportWidth = track.clientWidth;
      if (!viewportWidth) {
        setGalleryPageCount(1);
        setGalleryCurrentPage(0);
        return;
      }

      const totalPages = Math.max(1, Math.ceil(track.scrollWidth / viewportWidth));
      const nextPage = Math.min(totalPages - 1, Math.round(track.scrollLeft / viewportWidth));
      setGalleryPageCount(totalPages);
      setGalleryCurrentPage(nextPage);
    };

    syncGalleryPagination();
    track.addEventListener("scroll", syncGalleryPagination, { passive: true });
    window.addEventListener("resize", syncGalleryPagination);

    return () => {
      track.removeEventListener("scroll", syncGalleryPagination);
      window.removeEventListener("resize", syncGalleryPagination);
    };
  }, [resolvedGalleryItems.length]);

  useEffect(() => {
    const controller = new AbortController();

    const loadGallery = async () => {
      setIsGalleryLoading(true);
      try {
        const locale = getNewsLocale(language);
        const response = await fetch(`${API_BASE_URL}/sections/gallery?locale=${locale}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Gallery request failed: ${response.status}`);
        }

        const payload: GallerySectionResponse = await response.json();
        setApiGalleryItems(
          payload.data.items
            .filter((item) => item.status && item.image)
            .sort((a, b) => a.rank - b.rank)
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Failed to load gallery data:", error);
        setApiGalleryItems([]);
      } finally {
        setIsGalleryLoading(false);
      }
    };

    loadGallery();
    return () => controller.abort();
  }, [language]);

  useScrollReveal([routeState.name, language, isAboutLoading]);

  const footerContactAddress = apiContactSettings?.address?.trim() || "";
  const footerContactEmail = apiContactSettings?.email?.trim() || "";
  const footerContactPhone = apiContactSettings?.phone?.trim() || "";
  const footerContactSecondaryPhone = apiContactSettings?.secondary_phone;
  const openModal = (style: "consultation" | "request_call" = "request_call") => {
    setModalStyle(style);
    setSelectedChooseItem(null);
    setShowSuccessState(false);
    setSubmitError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChooseItem(null);
    setShowSuccessState(false);
    setSubmitError("");
    setIsSubmitting(false);
  };

  const renderActiveModal = () => {
    if (modalStyle === "request_call") {
      return (
        <RequestCallModal
          active={isModalOpen}
          modalDescription={modalDescription}
          showSuccessState={showSuccessState}
          isSubmitting={isSubmitting}
          submitError={submitError}
          formName={formName}
          formEmail={formEmail}
          formPhone={formPhone}
          formPreferredLanguage={formPreferredLanguage}
          formPreferredChannel={formPreferredChannel}
          formCountry={formCountry}
          countryCodeOptions={countryCodeOptions}
          language={language}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          handleFieldInvalid={handleFieldInvalid}
          clearFieldValidity={clearFieldValidity}
          setFormName={setFormName}
          setFormEmail={setFormEmail}
          setFormPhone={setFormPhone}
          setFormPreferredLanguage={setFormPreferredLanguage}
          setFormPreferredChannel={setFormPreferredChannel}
          setFormCountry={setFormCountry}
          onSwitchModalStyle={(style) => setModalStyle(style)}
          t={t}
        />
      );
    }

    return (
      <ConsultationModal
        active={isModalOpen}
        selectedChooseItem={selectedChooseItem}
        modalDescription={modalDescription}
        showSuccessState={showSuccessState}
        isSubmitting={isSubmitting}
        submitError={submitError}
        formName={formName}
        formEmail={formEmail}
        formCountryCode={formCountryCode}
        formPhone={formPhone}
        formPreferredLanguage={formPreferredLanguage}
        formPreferredChannel={formPreferredChannel}
        countryCodeOptions={countryCodeOptions}
        language={language}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        handleFieldInvalid={handleFieldInvalid}
        clearFieldValidity={clearFieldValidity}
        setFormName={setFormName}
        setFormEmail={setFormEmail}
        setFormCountryCode={setFormCountryCode}
        setFormPhone={setFormPhone}
        setFormPreferredLanguage={setFormPreferredLanguage}
        setFormPreferredChannel={setFormPreferredChannel}
        onSwitchModalStyle={(style) => setModalStyle(style)}
        t={t}
      />
    );
  };

  const closeLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  const handleLanguageSelect = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setIsLanguageModalOpen(false);
  };

  const closeCurrencyModal = () => {
    setIsCurrencyModalOpen(false);
  };

  const handleUnitsLanguageSelect = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setIsLanguageModalOpen(false);
  };

  const handleCurrencySelect = (nextCurrency: SupportedCurrency) => {
    setCurrency(nextCurrency);
    setIsCurrencyModalOpen(false);
  };

  const formatTelHref = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/[^\d+]/g, "");
    return cleaned ? `tel:${cleaned}` : "#";
  };


  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const toggleFooterSection = (section: FooterSection) => {
    setOpenFooterSection((currentSection) => (currentSection === section ? null : section));
  };

  const getValidationMessage = (field: "name" | "email" | "phone", validity: ValidityState) => {
    const messages = language === "en"
      ? {
          nameRequired: "Please enter your name.",
          emailRequired: "Please enter your email.",
          emailInvalid: "Please enter a valid email address.",
          phoneRequired: "Please enter your phone number."
        }
      : {
          nameRequired: "შეავსეთ სახელი.",
          emailRequired: "შეიყვანეთ ელ.ფოსტა.",
          emailInvalid: "შეიყვანეთ სწორი ელ.ფოსტა.",
          phoneRequired: "შეიყვანეთ ტელეფონის ნომერი."
        };

    if (validity.valueMissing) {
      if (field === "name") return messages.nameRequired;
      if (field === "email") return messages.emailRequired;
      return messages.phoneRequired;
    }

    if (field === "email" && validity.typeMismatch) {
      return messages.emailInvalid;
    }

    return "";
  };

  const handleFieldInvalid = (field: "name" | "email" | "phone") => (event: InvalidEvent<HTMLInputElement>) => {
    event.target.setCustomValidity(getValidationMessage(field, event.target.validity));
  };

  const clearFieldValidity = (event: FormEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity("");
  };

  const getSubmitErrorMessage = () =>
    language === "en"
      ? "We could not send your request right now. Please try again in a moment."
      : "ამ ეტაპზე მოთხოვნის გაგზავნა ვერ მოხერხდა. გთხოვთ, რამდენიმე წუთში სცადოთ თავიდან.";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const activeCountryCode = modalStyle === "request_call" ? (formCountry || defaultPhoneCountryCode) : formCountryCode;
    const fullPhoneNumber = `${activeCountryCode} ${formPhone}`.trim();

    try {
      const utmParams = getUtmParams();
      const response = await fetch(`${API_BASE_URL}/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim() || undefined,
          phone: fullPhoneNumber,
          preferred_language: formPreferredLanguage,
          preferred_channel: formPreferredChannel,
          subject: selectedChooseItem?.title || (modalStyle === "request_call" ? "Request a Call" : "Consultation"),
          message: modalStyle === "request_call"
            ? `Request a Call Submission:\nName: ${formName.trim()}\nPhone: ${fullPhoneNumber}\nPreferred Language: ${formPreferredLanguage}\nCountry: ${formCountry}`
            : `${selectedChooseItem?.description || "Town by Origami consultation request"}\nPreferred Language: ${formPreferredLanguage}\nPreferred Channel: ${formPreferredChannel}`,
          platform_slug: PLATFORM_SLUG,
          source_page: window.location.href,
          ...utmParams
        })
      });

      if (!response.ok) {
        throw new Error(`Consultation request failed with status ${response.status}`);
      }

      setShowSuccessState(true);
      setFormName("");
      setFormEmail("");
      setFormCountryCode(defaultPhoneCountryCode);
      setFormPhone("");
      setFormPreferredLanguage("");
      setFormPreferredChannel("");
    } catch (error) {
      console.error("Consultation submission error:", error);
      setSubmitError(getSubmitErrorMessage());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (routeState.name === "unknown") {
    navigateTo("/");
    return null;
  }

  const isUnitsRoute = routeState.name === "unitList" || routeState.name === "unitDetail";
  const isPropertiesRoute = routeState.name === "properties" || routeState.name === "property" || routeState.name === "floor";

  const commonHeaderProps = {
    headerShrunk,
    variant: (routeState.name === "aboutUs" || routeState.name === "newsDetail" ? "surface" : "default") as "default" | "surface",
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
    handleLanguageSelect
  };

  const commonFooterProps = {
    darkThemeLogoSrc,
    lightThemeLogoSrc,
    socialNetworks: apiSocialNetworks,
    footerDescription: apiFooterDescription || t("footer_desc"),
    primaryNavItems,
    companyProjectsData: apiCompanyProjectsData,
    legalItems: apiFooterLegalItems,
    contact: {
      address: footerContactAddress,
      email: footerContactEmail,
      phone: footerContactPhone,
      secondaryPhone: footerContactSecondaryPhone,
      mapLink: apiContactSettings?.map_link
    },
    openFooterSection,
    toggleFooterSection,
    openModal,
    formatTelHref,
    t
  };

  const commonLanguageModalProps = {
    active: isLanguageModalOpen,
    language,
    languageOptions,
    currency,
    currencyRates,
    closeModal: closeLanguageModal,
    handleLanguageSelect,
    handleCurrencySelect,
    t
  };

  if (isUnitsRoute) {
    return (
      <>
        <UnitCatalogPage
          language={language}
          darkThemeLogoSrc={darkThemeLogoSrc}
          lightThemeLogoSrc={lightThemeLogoSrc}
          isLanguageModalOpen={isLanguageModalOpen}
          setIsLanguageModalOpen={setIsLanguageModalOpen}
          theme={theme}
          handleThemeToggle={handleThemeToggle}
          openModal={openModal}
          propertySlug={routeState.propertySlug}
          unitSlug={routeState.name === "unitDetail" ? routeState.unitSlug : undefined}
          currency={currency}
          currencyRates={currencyRates}
        />
        <FloatingCallWidget openModal={() => openModal("request_call")} t={t} label={callRequestLabel} />
        {renderActiveModal()}
        <UnitsPreferencesModal
          active={isLanguageModalOpen || isCurrencyModalOpen}
          language={language}
          languageOptions={languageOptions}
          currency={currency}
          currencyRates={currencyRates}
          closeModal={() => { closeLanguageModal(); closeCurrencyModal(); }}
          handleLanguageSelect={handleUnitsLanguageSelect}
          handleCurrencySelect={handleCurrencySelect}
          t={t}
        />
      </>
    );
  }

  let pageContent = null;

  if (routeState.name === "newsDetail") {
    const detailTitle = newsDetail?.title?.trim() || (isNewsDetailLoading ? "" : formatNewsFallbackTitle(routeState.slug));
    const detailCategory = newsDetail?.category?.name || t("news_category");
    const detailDate = newsDetail?.published_at ? formatNewsDate(newsDetail.published_at, language) : "";
    const detailBody = stripHtmlContent(newsDetail?.content || newsDetail?.excerpt || "");

    pageContent = (
      <main className="news-detail-page">
        <article className="container news-detail-container">
          {isNewsDetailLoading ? (
            <div className="news-detail-state">{language === "ka" ? "იტვირთება..." : "Loading..."}</div>
          ) : newsDetailError ? (
            <div className="news-detail-state">{newsDetailError}</div>
          ) : (
            <>
              <div className="news-detail-hero">
                <div className="news-detail-copy">
                  <div className="news-detail-kicker">
                    <button className="news-detail-back" type="button" onClick={() => navigateTo("/")}>
                      <ArrowIcon direction="left" />
                      <span>{language === "ka" ? "უკან" : "Back"}</span>
                    </button>
                    <div className="news-detail-meta">
                      <span className="news-detail-category">{detailCategory}</span>
                      {detailDate ? (
                        <span className="news-detail-meta-item">
                          <span className="news-detail-meta-label">{language === "ka" ? "თარიღი" : "Date"}</span>
                          <span>{detailDate}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <h1>{detailTitle}</h1>
                  {newsDetail?.excerpt ? <p className="news-detail-excerpt">{newsDetail.excerpt}</p> : null}
                </div>
                {newsDetail?.image_url ? (
                  <img src={newsDetail.image_url} alt={detailTitle} />
                ) : null}
              </div>

              {detailBody ? (
                <div className="news-detail-body">
                  {detailBody.split("\n").filter(Boolean).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </article>
      </main>
    );
  } else if (routeState.name === "aboutUs") {
    pageContent = (
      <AboutUsPage
        data={apiAboutData}
        loading={isAboutLoading}
        language={language}
        navigateTo={navigateTo}
      />
    );
  } else if (isPropertiesRoute) {
    pageContent = (
      <PropertiesPage
        propertySlug={routeState.name === "property" || routeState.name === "floor" ? routeState.propertySlug : undefined}
        floorSlug={routeState.name === "floor" ? routeState.floorSlug : undefined}
      />
    );
  } else {
    pageContent = (
      <HomePage
        t={t}
        apiAboutData={apiAboutData}
        aboutTownGalleryItems={apiAboutTownGalleryItems}
        aboutGridCards={apiAboutGridCards}
        aboutTownText={apiAboutTownText}
        navigateTo={navigateTo}
        openModal={openModal}
      />
    );
  }

  return (
    <AppLayout
      headerProps={commonHeaderProps}
      footerProps={commonFooterProps}
      languageModalProps={commonLanguageModalProps}
      callRequestLabel={callRequestLabel}
      openModal={openModal}
      activeModalElement={renderActiveModal()}
    >
      {pageContent}
    </AppLayout>
  );
}

export default App;
