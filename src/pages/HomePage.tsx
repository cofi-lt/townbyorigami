import { FC } from "react";
import { HeroSection } from "../components/sections/HeroSection";
import { TownAboutSection } from "../components/sections/TownAboutSection";
import { TownFeaturesStrip } from "../components/sections/TownFeaturesStrip";
import type { TranslationKey } from "../i18n";
import type { AboutGridCardItem, AboutTownTextContent, TownGalleryItem } from "../types";

export interface HomePageProps {
  t: (key: TranslationKey) => string;
  apiAboutData?: any;
  aboutTownGalleryItems?: TownGalleryItem[];
  aboutGridCards?: AboutGridCardItem[];
  aboutTownText?: AboutTownTextContent | null;
  navigateTo?: (path: string) => void;
  openModal?: (type: any, payload?: any) => void;
}

export const HomePage: FC<HomePageProps> = ({
  t,
  apiAboutData,
  aboutTownGalleryItems,
  aboutGridCards,
  aboutTownText,
  navigateTo,
}) => {
  return (
    <main className="town-main-layout">
      <HeroSection t={t} />

      <TownAboutSection
        data={apiAboutData}
        galleryItems={aboutTownGalleryItems}
        gridCards={aboutGridCards}
        aboutTownText={aboutTownText}
        onLearnMore={() => (navigateTo ? navigateTo("/about-us") : null)}
      />

      <TownFeaturesStrip />
    </main>
  );
};
