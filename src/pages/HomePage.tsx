import { FC, Dispatch, SetStateAction } from "react";
import { HeroSection } from "../components/sections/HeroSection";
import type { TranslationKey } from "../i18n";

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
  handleSearch
}) => {
  return (
    <main>
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
    </main>
  );
};
