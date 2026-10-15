import { useEffect, useState } from "react";
import type { Language } from "../i18n";
import type {
  BrandingSettings,
  ContactSettings,
  FooterMenuApiItem,
  HeaderMenuSection,
  SectionGridCardItem,
  SocialNetworkItem,
  WebsiteSectionNavigation
} from "../types";
import {
  fetchBranding,
  fetchContactSettings,
  fetchFooterDescription,
  fetchFooterLegalItems,
  fetchFooterMenu,
  fetchHeaderMenu,
  fetchPrimaryNavMenu,
  fetchRequestCallItem,
  fetchSocialNetworks
} from "../api/siteChrome";
import { fetchWebsiteSectionNavigation } from "../api/siteContent";

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

async function loadResource<T>(
  request: Promise<T>,
  setData: (value: T) => void,
  fallback: T,
  label: string
) {
  try {
    setData(await request);
  } catch (error) {
    if (!isAbortError(error)) {
      console.error(`Failed to load ${label}:`, error);
      setData(fallback);
    }
  }
}

export function useSiteChrome(language: Language) {
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkItem[]>([]);
  const [footerDescription, setFooterDescription] = useState("");
  const [footerMenuItems, setFooterMenuItems] = useState<FooterMenuApiItem[]>([]);
  const [headerNavItems, setHeaderNavItems] = useState<SectionGridCardItem[]>([]);
  const [headerMenu, setHeaderMenu] = useState<HeaderMenuSection | null>(null);
  const [requestCallTitle, setRequestCallTitle] = useState("");
  const [requestCallDescription, setRequestCallDescription] = useState("");
  const [footerLegalItems, setFooterLegalItems] = useState<SectionGridCardItem[]>([]);
  const [navigationSections, setNavigationSections] = useState<WebsiteSectionNavigation[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    void loadResource(fetchBranding(signal), setBranding, null, "branding settings");
    void loadResource(fetchContactSettings(signal), setContactSettings, null, "contact settings");
    void loadResource(fetchSocialNetworks(signal), setSocialNetworks, [], "social networks");

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    void loadResource(fetchFooterDescription(language, signal), setFooterDescription, "", "footer content");
    void loadResource(fetchFooterMenu(language, signal), setFooterMenuItems, [], "footer menu");
    void loadResource(fetchPrimaryNavMenu(language, signal), setHeaderNavItems, [], "primary header nav");
    const sectionSlugs = ["about-town-gallery", "about-town-cards", "town-within-a-town", "infrastructure-1", "location", "map-location", "origami-holding", "projects", "finances", "choose", "biohacking"];
    void Promise.all(sectionSlugs.map((slug) => fetchWebsiteSectionNavigation(slug, language, signal)
      .catch((error) => {
        if (!isAbortError(error)) console.error(`Failed to load navigation data for ${slug}:`, error);
        return null;
      })))
      .then((sections) => {
        if (!signal.aborted) {
          setNavigationSections(sections.filter((section): section is WebsiteSectionNavigation => section !== null));
        }
      });
    void loadResource(fetchHeaderMenu(language, signal), setHeaderMenu, null, "header dropdown menu");
    
    const requestCallPromise = fetchRequestCallItem(language, signal);
    void loadResource(
      requestCallPromise.then((res) => res.title),
      setRequestCallTitle,
      "",
      "request-a-call title"
    );
    void loadResource(
      requestCallPromise.then((res) => res.description),
      setRequestCallDescription,
      "",
      "request-a-call description"
    );
    void loadResource(fetchFooterLegalItems(language, signal), setFooterLegalItems, [], "footer legal menu");

    return () => controller.abort();
  }, [language]);

  return {
    branding,
    contactSettings,
    socialNetworks,
    footerDescription,
    footerMenuItems,
    headerNavItems,
    headerMenu,
    requestCallTitle,
    requestCallDescription,
    footerLegalItems,
    navigationSections
  };
}
