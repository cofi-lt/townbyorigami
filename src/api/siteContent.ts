import { API_BASE_URL, PLATFORM_SLUG } from "../config";
import type { Language } from "../i18n";
import type {
  AboutSectionResponse,
  AboutUsApiItem,
  AboutUsResponse,
  BiohackingApiItem,
  BiohackingSectionResponse,
  ChooseApiItem,
  ChooseSectionResponse,
  CompanyProjectApiItem,
  CompanyProjectsSectionResponse,
  FinanceApiItem,
  FinanceSectionResponse,
  InfrastructureApiItem,
  InfrastructureSectionResponse,
  OrigamiHoldingApiItem,
  OrigamiHoldingSectionResponse,
  SectionGridCardItem,
  TownGalleryItem,
  TownGalleryResponse
} from "../types";

export type BiohackingContent = {
  description: string;
  background_image: string;
  items: BiohackingApiItem[];
};

export type OrigamiHoldingContent = {
  title: string;
  background_image: string;
  items: OrigamiHoldingApiItem[];
};

export type ChooseContent = { title: string; items: ChooseApiItem[] };
export type FinanceContent = { title: string; description: string; items: FinanceApiItem[] };
export type CompanyProjectsContent = { title: string; items: CompanyProjectApiItem[] };

async function fetchApi<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`${path} request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchInfrastructure(language: Language, signal: AbortSignal) {
  const payload = await fetchApi<InfrastructureSectionResponse>(`/sections/infrastructure?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return payload.data.items
    .filter((item) => item.status)
    .sort((a, b) => a.rank - b.rank) as InfrastructureApiItem[];
}

export async function fetchBiohacking(language: Language, signal: AbortSignal): Promise<BiohackingContent> {
  const payload = await fetchApi<BiohackingSectionResponse>(`/sections/biohacking?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return {
    description: payload.data.description,
    background_image: payload.data.background_image,
    items: payload.data.items.filter((item) => item.status).sort((a, b) => a.rank - b.rank)
  };
}

export async function fetchOrigamiHolding(language: Language, signal: AbortSignal): Promise<OrigamiHoldingContent> {
  const payload = await fetchApi<OrigamiHoldingSectionResponse>(`/sections/origami-holding?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return {
    title: payload.data.title,
    background_image: payload.data.background_image,
    items: payload.data.items.filter((item) => item.status).sort((a, b) => a.rank - b.rank)
  };
}

export async function fetchChoose(language: Language, signal: AbortSignal): Promise<ChooseContent> {
  const payload = await fetchApi<ChooseSectionResponse>(`/sections/choose?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return {
    title: payload.data.title,
    items: (payload.data.items || []).filter((item) => item.status !== false).sort((a, b) => a.rank - b.rank)
  };
}

export async function fetchFinance(language: Language, signal: AbortSignal): Promise<FinanceContent> {
  const payload = await fetchApi<FinanceSectionResponse>(`/sections/finances?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return {
    title: payload.data.title,
    description: payload.data.description,
    items: payload.data.items.filter((item) => item.status).sort((a, b) => a.rank - b.rank)
  };
}

export async function fetchCompanyProjects(language: Language, signal: AbortSignal): Promise<CompanyProjectsContent> {
  const payload = await fetchApi<CompanyProjectsSectionResponse>(`/sections/projects?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return {
    title: payload.data.title,
    items: payload.data.items.filter((item) => item.status && item.image).sort((a, b) => a.rank - b.rank)
  };
}

export async function fetchAbout(language: Language, signal: AbortSignal): Promise<AboutUsApiItem | null> {
  const payload = await fetchApi<AboutUsResponse>(`/about-us?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  const items = Array.isArray(payload.data) ? payload.data : [];
  return items
    .filter((item) => item.status && (item.platform_identifier?.toLowerCase() === PLATFORM_SLUG || !item.platform_identifier))
    .sort((a, b) => a.rank - b.rank)[0] || items[0] || null;
}

export async function fetchAboutInfo(language: Language, signal: AbortSignal): Promise<SectionGridCardItem[]> {
  const payload = await fetchApi<AboutSectionResponse>(`/sections/about?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return payload.data.items.filter((item) => item.status).sort((a, b) => a.rank - b.rank);
}

export async function fetchAboutTownGallery(language: Language, signal: AbortSignal): Promise<TownGalleryItem[]> {
  const payload = await fetchApi<TownGalleryResponse>(`/sections/about-town-gallery/compact?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return (payload.data?.items || []).sort((a, b) => a.rank - b.rank);
}

