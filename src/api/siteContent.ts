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
  TownGalleryResponse,
  AboutGridCardItem,
  AboutGridCardsResponse,
  AboutTownTextContent,
  WebsiteSectionResponse
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

export type InfrastructureContent = {
  eyebrow?: string;
  title?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  background_image?: string;
  items: InfrastructureApiItem[];
};

export async function fetchInfrastructure(language: Language, signal: AbortSignal): Promise<InfrastructureContent> {
  const payload = await fetchApi<InfrastructureSectionResponse>(
    `/sections/infrastructure-1?locale=${language}&platform=${PLATFORM_SLUG}`,
    signal
  );
  return {
    eyebrow: payload.data?.eyebrow,
    title: payload.data?.title,
    description: payload.data?.description,
    button_text: payload.data?.button_text,
    button_link: payload.data?.button_link,
    background_image: payload.data?.background_image,
    items: (payload.data?.items || [])
      .filter((item) => item.status)
      .sort((a, b) => a.rank - b.rank)
  };
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
  try {
    const payload = await fetchApi<TownGalleryResponse>(`/sections/about-town-gallery/compact?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
    if (payload.data?.status === false) {
      return [];
    }
    return (payload.data?.items || [])
      .filter((item) => item.status !== false)
      .sort((a, b) => a.rank - b.rank);
  } catch {
    return [];
  }
}

export async function fetchAboutGridCards(language: Language, signal: AbortSignal): Promise<AboutGridCardItem[]> {
  try {
    const payload = await fetchApi<AboutGridCardsResponse>(`/sections/about-town-cards/compact?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
    if (payload.data?.status === false) {
      return [];
    }
    return (payload.data?.items || [])
      .filter((item) => item.status !== false)
      .sort((a, b) => a.rank - b.rank);
  } catch {
    try {
      const fallbackPayload = await fetchApi<AboutGridCardsResponse>(`/sections/about-grid-cards/compact?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
      if (fallbackPayload.data?.status === false) {
        return [];
      }
      return (fallbackPayload.data?.items || [])
        .filter((item) => item.status !== false)
        .sort((a, b) => a.rank - b.rank);
    } catch {
      return [];
    }
  }
}

export async function fetchAboutTownText(language: Language, signal: AbortSignal): Promise<AboutTownTextContent | null> {
  try {
    const payload = await fetchApi<WebsiteSectionResponse>(`/sections/town-within-a-town?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
    return {
      status: payload.data?.status !== undefined ? Boolean(payload.data.status) : true,
      eyebrow: payload.data?.eyebrow || undefined,
      title: payload.data?.title || undefined,
      description: payload.data?.description || undefined,
      button_text: payload.data?.button_text || undefined,
      button_link: payload.data?.button_link || undefined
    };
  } catch {
    try {
      const fallbackPayload = await fetchApi<WebsiteSectionResponse>(`/sections/about-town-text?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
      return {
        status: fallbackPayload.data?.status !== undefined ? Boolean(fallbackPayload.data.status) : true,
        eyebrow: fallbackPayload.data?.eyebrow || undefined,
        title: fallbackPayload.data?.title || undefined,
        description: fallbackPayload.data?.description || undefined,
        button_text: fallbackPayload.data?.button_text || undefined,
        button_link: fallbackPayload.data?.button_link || undefined
      };
    } catch {
      return null;
    }
  }
}



