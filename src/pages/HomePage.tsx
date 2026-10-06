import { FC, Dispatch, SetStateAction } from "react";
import { HeroSection } from "../components/sections/HeroSection";
import { AboutSection } from "../components/sections/AboutSection";
import { ChooseSection } from "../components/sections/ChooseSection";
import { BiohackingSection } from "../components/sections/BiohackingSection";
import { InfrastructureSection } from "../components/sections/InfrastructureSection";
import { FinanceSection } from "../components/sections/FinanceSection";
import { OrigamiHoldingSection } from "../components/sections/OrigamiHoldingSection";
import { NewsSection } from "../components/sections/NewsSection";
import { ArrowIcon } from "../components/Icons";
import { DEFAULT_BUILDING_SLUG, formatArea, getUnitDisplayTitle, mapUnitStatusLabel, mapUnitTypeLabel } from "../unitCatalog";
import type { TranslationKey } from "../i18n";

export interface HomePageProps {
  t: (key: TranslationKey) => string;
  language: any;
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
  apiAboutData: any;
  apiAboutInfoItems: any;
  conceptImage: any;
  hasAboutContent: boolean;
  isAboutLoading: boolean;
  isAboutInfoLoading: boolean;
  origamiInfoIcons: any;
  navigateTo: (path: string) => void;
  apiChooseData: any;
  renderSectionTitle: any;
  renderSectionImage: any;
  renderSectionImageAlt: any;
  buildingVisualFloors: any;
  isBuildingVisualLoading: boolean;
  getFloorPolygonPoints: any;
  getFloorLabel: any;
  getFloorTooltip: any;
  getFloorUnitsRoute: any;
  SHOW_FEATURED_UNITS_SECTION: boolean;
  featuredUnitsFilter: any;
  setFeaturedUnitsFilter: Dispatch<SetStateAction<any>>;
  featuredUnitsCopy: any;
  getPlanningUnitsRoute: any;
  isFeaturedUnitsLoading: boolean;
  filteredFeaturedUnits: any[];
  getFeaturedMetricLabel: any;
  getFeaturedUnitPriceText: any;
  apiBiohackingData: any;
  hasBiohackingContent: boolean;
  getBiohackingIcon: any;
  apiInfrastructureItems: any;
  hasInfrastructureContent: boolean;
  infrastructureSectionRef: any;
  apiFinanceData: any;
  hasFinanceContent: boolean;
  openModal: (type: any, payload?: any) => void;
  apiOrigamiHoldingData: any;
  apiCompanyProjectsData: any;
  isCompanyProjectsLoading: boolean;
  hasOrigamiHoldingContent: boolean;
  getOrigamiHoldingIcon: any;
  getOrigamiHoldingOrder: any;
  newsItems: any[];
}

export const HomePage: FC<HomePageProps> = ({
  t,
  language,
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
  apiAboutInfoItems,
  conceptImage,
  hasAboutContent,
  isAboutLoading,
  isAboutInfoLoading,
  origamiInfoIcons,
  navigateTo,
  apiChooseData,
  renderSectionTitle,
  renderSectionImage,
  renderSectionImageAlt,
  buildingVisualFloors,
  isBuildingVisualLoading,
  getFloorPolygonPoints,
  getFloorLabel,
  getFloorTooltip,
  getFloorUnitsRoute,
  SHOW_FEATURED_UNITS_SECTION,
  featuredUnitsFilter,
  setFeaturedUnitsFilter,
  featuredUnitsCopy,
  getPlanningUnitsRoute,
  isFeaturedUnitsLoading,
  filteredFeaturedUnits,
  getFeaturedMetricLabel,
  getFeaturedUnitPriceText,
  apiBiohackingData,
  hasBiohackingContent,
  getBiohackingIcon,
  apiInfrastructureItems,
  hasInfrastructureContent,
  infrastructureSectionRef,
  apiFinanceData,
  hasFinanceContent,
  openModal,
  apiOrigamiHoldingData,
  apiCompanyProjectsData,
  isCompanyProjectsLoading,
  hasOrigamiHoldingContent,
  getOrigamiHoldingIcon,
  getOrigamiHoldingOrder,
  newsItems
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

      <AboutSection
        data={apiAboutData}
        infoItems={apiAboutInfoItems}
        image={conceptImage}
        hasContent={hasAboutContent}
        loading={isAboutLoading || isAboutInfoLoading}
        icons={origamiInfoIcons}
        buttonText={t("news_read_more")}
        onSeeMore={() => navigateTo("/about-us")}
      />

      <ChooseSection
        chooseData={apiChooseData}
        renderTitle={renderSectionTitle}
        renderImage={renderSectionImage}
        renderImageAlt={renderSectionImageAlt}
        floors={buildingVisualFloors}
        loadingFloors={isBuildingVisualLoading}
        getFloorPolygonPoints={getFloorPolygonPoints}
        getFloorLabel={getFloorLabel}
        getFloorTooltip={getFloorTooltip}
        getFloorUnitsRoute={getFloorUnitsRoute}
        navigateTo={navigateTo}
        t={t}
      />

      {SHOW_FEATURED_UNITS_SECTION && (
        <section className="planning-units-section reveal-on-scroll">
          <div className="container">
            <div className="planning-units-toolbar reveal-fade-up">
              <div className="planning-units-links">
                <button
                  type="button"
                  className={`planning-units-link${featuredUnitsFilter === "hotel_room" ? " is-active" : ""}`}
                  onClick={() => setFeaturedUnitsFilter("hotel_room")}
                >
                  {featuredUnitsCopy.hotelRooms}
                </button>
                <button
                  type="button"
                  className={`planning-units-link${featuredUnitsFilter === "apartment" ? " is-active" : ""}`}
                  onClick={() => setFeaturedUnitsFilter("apartment")}
                >
                  {featuredUnitsCopy.apartments}
                </button>
              </div>

              <button
                type="button"
                className="planning-units-link planning-units-link-all"
                onClick={() => navigateTo(getPlanningUnitsRoute())}
              >
                <span>{featuredUnitsCopy.all}</span>
                <ArrowIcon direction="right" />
              </button>
            </div>

            {isFeaturedUnitsLoading ? (
              <div className="units-state">{featuredUnitsCopy.loading}</div>
            ) : filteredFeaturedUnits.length > 0 ? (
              <div className="planning-units-carousel">
                <div className="planning-units-grid reveal-stagger">
                  {filteredFeaturedUnits.map((unit) => (
                    <article
                      key={unit.id}
                      className="unit-card planning-unit-card"
                      onClick={() => navigateTo(`/properties/${DEFAULT_BUILDING_SLUG}/units/${unit.slug}`)}
                    >
                      <div className="unit-card-topline">
                        <span className={`unit-card-badge unit-card-badge--${unit.status}`}>
                          {mapUnitStatusLabel(unit.status, language)}
                        </span>
                        <span className="unit-card-floor">
                          {featuredUnitsCopy.floor} {unit.floor?.number ?? "-"}
                        </span>
                      </div>

                      <div className="unit-card-image">
                        {unit.image ? (
                          <img src={unit.image} alt={getUnitDisplayTitle(unit, language)} />
                        ) : (
                          <div className="units-image-placeholder" />
                        )}
                      </div>

                      <div className="unit-card-body">
                        <p className="unit-card-number">{getUnitDisplayTitle(unit, language)}</p>
                        <h3>{mapUnitTypeLabel(unit.type, language)}</h3>
                        <strong>{formatArea(unit.area)}</strong>

                        <div className="planning-unit-metrics">
                          <span>{getFeaturedMetricLabel(unit.bedrooms_count, featuredUnitsCopy.bedrooms)}</span>
                          <span>{getFeaturedMetricLabel(unit.rooms_count, featuredUnitsCopy.rooms)}</span>
                          <span>{getFeaturedMetricLabel(unit.bathrooms_count, featuredUnitsCopy.bathrooms)}</span>
                        </div>

                        <div className="planning-unit-footer">
                          <button
                            type="button"
                            className="planning-unit-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigateTo(`/properties/${DEFAULT_BUILDING_SLUG}/units/${unit.slug}`);
                            }}
                          >
                            <span>{featuredUnitsCopy.cta}</span>
                            <ArrowIcon direction="right" />
                          </button>

                          <div className="planning-unit-price-block">
                            <span>{featuredUnitsCopy.priceFrom}</span>
                            <strong>{getFeaturedUnitPriceText(unit)}</strong>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="units-state">{featuredUnitsCopy.empty}</div>
            )}
          </div>
        </section>
      )}

      <BiohackingSection
        data={apiBiohackingData}
        hasContent={hasBiohackingContent}
        t={t}
        getIcon={getBiohackingIcon}
      />

      <InfrastructureSection
        items={apiInfrastructureItems}
        hasContent={hasInfrastructureContent}
        sectionRef={infrastructureSectionRef}
        t={t}
      />

      <FinanceSection
        data={apiFinanceData}
        hasContent={hasFinanceContent}
        t={t}
        openModal={openModal}
      />

      <OrigamiHoldingSection
        holdingData={apiOrigamiHoldingData}
        projectsData={apiCompanyProjectsData}
        loadingProjects={isCompanyProjectsLoading}
        hasContent={hasOrigamiHoldingContent}
        getIcon={getOrigamiHoldingIcon}
        getOrder={getOrigamiHoldingOrder}
        openModal={openModal}
        navigateTo={navigateTo}
        t={t}
      />

      <NewsSection
        items={newsItems}
        t={t}
        navigateTo={navigateTo}
      />
    </main>
  );
};
