import { useEffect, useState } from "react";
import type { Language } from "../i18n";
import type { AboutGridCardItem, AboutTownTextContent, AboutUsApiItem, SectionGridCardItem, TownGalleryItem } from "../types";
import {
  fetchAbout,
  fetchAboutGridCards,
  fetchAboutInfo,
  fetchAboutTownGallery,
  fetchAboutTownText,
  fetchBiohacking,
  fetchChoose,
  fetchCompanyProjects,
  fetchFinance,
  fetchInfrastructure,
  fetchLocation,
  fetchMapLocation,
  fetchOrigamiHolding,
  fetchOrigamiHoldingCompact,
  type BiohackingContent,
  type ChooseContent,
  type CompanyProjectsContent,
  type FinanceContent,
  type InfrastructureContent,
  type OrigamiHoldingContent,
  type OrigamiHoldingCompactContent
} from "../api/siteContent";
import type { LocationContent } from "../types";

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function useHomepageContent(language: Language) {
  const [locationData, setLocationData] = useState<LocationContent | null>(null);
  const [mapLocationData, setMapLocationData] = useState<LocationContent | null>(null);
  const [infrastructureData, setInfrastructureData] = useState<InfrastructureContent | null>(null);
  const [biohackingData, setBiohackingData] = useState<BiohackingContent | null>(null);
  const [origamiHoldingData, setOrigamiHoldingData] = useState<OrigamiHoldingContent | null>(null);
  const [origamiHoldingCompactData, setOrigamiHoldingCompactData] = useState<OrigamiHoldingCompactContent | null>(null);
  const [chooseData, setChooseData] = useState<ChooseContent | null>(null);
  const [financeData, setFinanceData] = useState<FinanceContent | null>(null);
  const [companyProjectsData, setCompanyProjectsData] = useState<CompanyProjectsContent | null>(null);
  const [aboutData, setAboutData] = useState<AboutUsApiItem | null>(null);
  const [aboutInfoItems, setAboutInfoItems] = useState<SectionGridCardItem[]>([]);
  const [aboutTownGalleryItems, setAboutTownGalleryItems] = useState<TownGalleryItem[]>([]);
  const [aboutGridCards, setAboutGridCards] = useState<AboutGridCardItem[]>([]);
  const [aboutTownText, setAboutTownText] = useState<AboutTownTextContent | null>(null);
  const [isCompanyProjectsLoading, setIsCompanyProjectsLoading] = useState(true);
  const [isAboutLoading, setIsAboutLoading] = useState(true);
  const [isAboutInfoLoading, setIsAboutInfoLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setIsCompanyProjectsLoading(true);
    setIsAboutLoading(true);
    setIsAboutInfoLoading(true);

    const load = async <T,>(
      request: Promise<T>,
      setData: (value: T) => void,
      clearData: () => void,
      label: string,
      finishLoading?: () => void
    ) => {
      try {
        setData(await request);
      } catch (error) {
        if (!isAbortError(error)) {
          console.error(`Failed to load ${label}:`, error);
          clearData();
        }
      } finally {
        if (!signal.aborted) {
          finishLoading?.();
        }
      }
    };

    void load(fetchInfrastructure(language, signal), setInfrastructureData, () => setInfrastructureData(null), "infrastructure");
    void load(fetchBiohacking(language, signal), setBiohackingData, () => setBiohackingData(null), "biohacking");
    void load(fetchOrigamiHolding(language, signal), setOrigamiHoldingData, () => setOrigamiHoldingData(null), "origami holding");
    void load(fetchOrigamiHoldingCompact(language, signal), setOrigamiHoldingCompactData, () => setOrigamiHoldingCompactData(null), "origami holding compact");
    void load(fetchChoose(language, signal), setChooseData, () => setChooseData(null), "choose section");
    void load(fetchFinance(language, signal), setFinanceData, () => setFinanceData(null), "finance section");
    void load(
      fetchCompanyProjects(language, signal),
      setCompanyProjectsData,
      () => setCompanyProjectsData(null),
      "company projects",
      () => setIsCompanyProjectsLoading(false)
    );
    void load(fetchAbout(language, signal), setAboutData, () => setAboutData(null), "about us", () => setIsAboutLoading(false));
    void load(
      fetchAboutTownGallery(language, signal),
      setAboutTownGalleryItems,
      () => setAboutTownGalleryItems([]),
      "about town gallery"
    );
    void load(
      fetchAboutGridCards(language, signal),
      setAboutGridCards,
      () => setAboutGridCards([]),
      "about grid cards"
    );
    void load(
      fetchAboutTownText(language, signal),
      setAboutTownText,
      () => setAboutTownText(null),
      "about town text"
    );
    void load(
      fetchAboutInfo(language, signal),
      setAboutInfoItems,
      () => setAboutInfoItems([]),
      "about section",
      () => setIsAboutInfoLoading(false)
    );
    void load(
      fetchLocation(language, signal),
      setLocationData,
      () => setLocationData(null),
      "location"
    );
    void load(fetchMapLocation(language, signal), setMapLocationData, () => setMapLocationData(null), "map location");

    return () => controller.abort();
  }, [language]);

  return {
    locationData,
    mapLocationData,
    infrastructureData,
    infrastructureItems: infrastructureData?.items || [],
    biohackingData,
    origamiHoldingData,
    origamiHoldingCompactData,
    chooseData,
    financeData,
    companyProjectsData,
    aboutData,
    aboutTownGalleryItems,
    aboutGridCards,
    aboutTownText,
    aboutInfoItems,
    isCompanyProjectsLoading,
    isAboutLoading,
    isAboutInfoLoading
  };
}
