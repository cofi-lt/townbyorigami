import { API_BASE_URL, PLATFORM_SLUG } from "../config";
import type { Language } from "../i18n";
import type {
  BrandingSettings,
  BrandingSettingsResponse,
  ContactSettings,
  ContactSettingsResponse,
  FooterMenuApiItem,
  FooterMenuSectionResponse,
  HeaderMenuSection,
  HeaderMenuSectionResponse,
  SectionGridCardItem,
  SocialNetworkItem,
  SocialNetworksResponse,
  WebsiteSectionResponse
} from "../types";

async function fetchApi<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`${path} request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchBranding(signal: AbortSignal): Promise<BrandingSettings | null> {
  const payload = await fetchApi<BrandingSettingsResponse>(`/settings/branding?platform=${PLATFORM_SLUG}`, signal);
  return payload.data || null;
}

export async function fetchContactSettings(signal: AbortSignal): Promise<ContactSettings | null> {
  const payload = await fetchApi<ContactSettingsResponse>(`/settings/contact?platform=${PLATFORM_SLUG}`, signal);
  return payload.data || null;
}

export async function fetchSocialNetworks(signal: AbortSignal): Promise<SocialNetworkItem[]> {
  const payload = await fetchApi<SocialNetworksResponse>(`/social-networks?platform=${PLATFORM_SLUG}`, signal);
  return payload.data.filter((item) => item.status).sort((a, b) => a.rank - b.rank);
}

export async function fetchFooterDescription(language: Language, signal: AbortSignal): Promise<string> {
  const payload = await fetchApi<WebsiteSectionResponse>(`/sections/footer?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  const item = payload.data.items.filter((entry) => entry.status).sort((a, b) => a.rank - b.rank)[0];
  const title = item?.title?.trim() || "";
  const subtitle = item?.subtitle?.trim() || "";
  return title && subtitle && title !== subtitle ? `${title}- ${subtitle}` : title || subtitle;
}

export async function fetchFooterMenu(language: Language, signal: AbortSignal): Promise<FooterMenuApiItem[]> {
  const payload = await fetchApi<FooterMenuSectionResponse>(`/sections/menu/compact?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return (payload.data?.items || []).sort((a, b) => a.rank - b.rank);
}

export async function fetchPrimaryNavMenu(language: Language, signal: AbortSignal): Promise<SectionGridCardItem[]> {
  try {
    const payload = await fetchApi<WebsiteSectionResponse>(`/sections/header-menu-1?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
    if (payload.data?.items && payload.data.items.length > 0) {
      return payload.data.items.filter((item) => item.status).sort((a, b) => a.rank - b.rank);
    }
  } catch {
    // Fallback if header-menu-1 is not found
  }

  try {
    const fallbackPayload = await fetchApi<WebsiteSectionResponse>(`/sections/menu?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
    if (fallbackPayload.data?.items && fallbackPayload.data.items.length > 0) {
      return fallbackPayload.data.items.filter((item) => item.status).sort((a, b) => a.rank - b.rank);
    }
  } catch {
    // Fallback if menu is not found
  }

  return [];
}

export async function fetchHeaderMenu(language: Language, signal: AbortSignal): Promise<HeaderMenuSection> {
  const payload = await fetchApi<HeaderMenuSectionResponse>(`/sections/header-menu?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return {
    ...payload.data,
    items: (payload.data?.items || []).filter((item) => item.status).sort((a, b) => a.rank - b.rank)
  };
}

export async function fetchRequestCallItem(
  language: Language,
  signal: AbortSignal
): Promise<{ title: string; description: string }> {
  const payload = await fetchApi<{ data: { title?: string; description?: string } }>(
    `/sections/menu/item/request-a-call?locale=${language}&platform=${PLATFORM_SLUG}`,
    signal
  );
  return {
    title: payload.data?.title?.trim() || "",
    description: payload.data?.description?.trim() || ""
  };
}

export async function fetchRequestCallDescription(language: Language, signal: AbortSignal): Promise<string> {
  const item = await fetchRequestCallItem(language, signal);
  return item.description;
}

export async function fetchFooterLegalItems(language: Language, signal: AbortSignal): Promise<SectionGridCardItem[]> {
  const payload = await fetchApi<WebsiteSectionResponse>(`/sections/footer-menu?locale=${language}&platform=${PLATFORM_SLUG}`, signal);
  return payload.data.items.filter((item) => item.status).sort((a, b) => a.rank - b.rank);
}
