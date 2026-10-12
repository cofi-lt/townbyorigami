import { FC } from "react";
import { HeroSection } from "../components/sections/HeroSection";
import { TownAboutSection } from "../components/sections/TownAboutSection";
import { TownFeaturesStrip } from "../components/sections/TownFeaturesStrip";
import { InfrastructureSection } from "../components/sections/InfrastructureSection";
import { LocationSection } from "../components/sections/LocationSection";
import { NewsSection } from "../components/sections/NewsSection";
import type { Language, TranslationKey } from "../i18n";
import type { InfrastructureContent, OrigamiHoldingCompactContent, OrigamiHoldingContent } from "../api/siteContent";
import type { AboutGridCardItem, AboutTownTextContent, LocationContent, NewsCard, TownGalleryItem } from "../types";

export interface HomePageProps {
  t: (key: TranslationKey) => string;
  language?: Language;
  newsItems?: NewsCard[];
  locationData?: LocationContent | null;
  mapLocationData?: LocationContent | null;
  infrastructureData?: InfrastructureContent | null;
  origamiHoldingCompactData?: OrigamiHoldingCompactContent | null;
  origamiHoldingData?: OrigamiHoldingContent | null;
  apiAboutData?: any;
  aboutTownGalleryItems?: TownGalleryItem[];
  aboutGridCards?: AboutGridCardItem[];
  aboutTownText?: AboutTownTextContent | null;
  navigateTo?: (path: string) => void;
  openModal?: (type: any, payload?: any) => void;
}

export const HomePage: FC<HomePageProps> = ({
  t,
  language = "en",
  newsItems,
  locationData,
  mapLocationData,
  infrastructureData,
  origamiHoldingCompactData,
  origamiHoldingData,
  apiAboutData,
  aboutTownGalleryItems,
  aboutGridCards,
  aboutTownText,
  navigateTo = () => {},
  openModal
}) => {
  return (
    <main className="town-main-layout">
      <HeroSection />

      <TownAboutSection
        data={apiAboutData}
        galleryItems={aboutTownGalleryItems}
        gridCards={aboutGridCards}
        aboutTownText={aboutTownText}
        onLearnMore={() => (navigateTo ? navigateTo("/about-us") : null)}
      />

      <InfrastructureSection
        data={infrastructureData}
        language={language}
        t={t}
        onCtaClick={() => (openModal ? openModal("consultation") : undefined)}
      />

      <LocationSection
        data={locationData}
        mapData={mapLocationData}
        language={language}
        t={t}
      />

      <TownFeaturesStrip items={origamiHoldingCompactData?.items} holdingData={origamiHoldingData} />

      <NewsSection
        items={newsItems}
        language={language}
        t={t}
        navigateTo={navigateTo}
      />
    </main>
  );
};

