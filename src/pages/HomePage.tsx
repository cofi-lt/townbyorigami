import { FC, Dispatch, SetStateAction } from "react";
import { HeroSection } from "../components/sections/HeroSection";
import { TownAboutSection } from "../components/sections/TownAboutSection";
import { TownFeaturesStrip } from "../components/sections/TownFeaturesStrip";
import type { TranslationKey } from "../i18n";
import type { AboutGridCardItem, AboutTownTextContent, TownGalleryItem } from "../types";

export interface HomePageProps {
  t: (key: TranslationKey) => string;
  heroUnitFilters: any;
  selectedRoomType: string;
  setSelectedRoomType: Dispatch<SetStateAction<string>>;
  selectedPropertyType: string;
  setSelectedPropertyType: Dispatch<SetStateAction<string>>;
  selectedCondition: string;
  setSelectedCondition: Dispatch<SetStateAction<string>>;
  mobileFilterOpen: boolean;
  setMobileFilterOpen: Dispatch<SetStateAction<boolean>>;
  handleSearch: () => void;
  apiAboutData?: any;
  aboutTownGalleryItems?: TownGalleryItem[];
  aboutGridCards?: AboutGridCardItem[];
  aboutTownText?: AboutTownTextContent | null;
  navigateTo?: (path: string) => void;
  openModal?: (type: any, payload?: any) => void;
}

export const HomePage: FC<HomePageProps> = ({
  t,
  heroUnitFilters,
  selectedRoomType,
  setSelectedRoomType,
  selectedPropertyType,
  setSelectedPropertyType,
  selectedCondition,
  setSelectedCondition,
  mobileFilterOpen,
  setMobileFilterOpen,
  handleSearch,
  apiAboutData,
  aboutTownGalleryItems,
  aboutGridCards,
  aboutTownText,
  navigateTo,
}) => {
  return (
    <main className="town-main-layout">
      <HeroSection
        t={t}
        unitFilters={heroUnitFilters}
        selectedRoomType={selectedRoomType}
        setSelectedRoomType={setSelectedRoomType}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        selectedCondition={selectedCondition}
        setSelectedCondition={setSelectedCondition}
        mobileFilterOpen={mobileFilterOpen}
        setMobileFilterOpen={setMobileFilterOpen}
        handleSearch={handleSearch}
      />

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
