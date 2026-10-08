import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { TranslationKey } from "../../i18n";
import { UnitFilterOptions } from "../../types";
import { LocationIcon, SearchIcon, BuildingIcon, CurrencyIcon, CloseIcon } from "../Icons";

type HeroSectionProps = {
  t: (key: TranslationKey) => string;
  unitFilters: UnitFilterOptions | null;
  selectedRoomType: string;
  setSelectedRoomType: Dispatch<SetStateAction<string>>;
  selectedPropertyType: string;
  setSelectedPropertyType: Dispatch<SetStateAction<string>>;
  selectedCondition: string;
  setSelectedCondition: Dispatch<SetStateAction<string>>;
  mobileFilterOpen?: boolean;
  setMobileFilterOpen?: Dispatch<SetStateAction<boolean>>;
  handleSearch: () => void;
};

type FilterKey = "room" | "property" | "condition";

type FilterOption = {
  value: string;
  label: string;
};

export function HeroSection({
  t,
  unitFilters,
  selectedRoomType,
  setSelectedRoomType,
  selectedPropertyType,
  setSelectedPropertyType,
  selectedCondition,
  setSelectedCondition,
  handleSearch
}: HeroSectionProps) {
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const roomTypeOptions = (unitFilters?.room_types || []).map((option) => ({ value: String(option.value), label: option.label }));
  const propertyTypeOptions = (unitFilters?.property_types || []).map((option) => ({ value: String(option.value), label: option.label }));
  const conditionOptions = (unitFilters?.conditions || []).map((option) => ({ value: String(option.value), label: option.label }));
  const hasFilterOptions = roomTypeOptions.length > 0 || propertyTypeOptions.length > 0 || conditionOptions.length > 0;
  const hasActiveFilters = Boolean(selectedRoomType || selectedPropertyType || selectedCondition);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target as Element | null)?.closest(".filter-dropdown")) {
        setOpenFilter(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenFilter(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleResetFilters = () => {
    setSelectedRoomType("");
    setSelectedPropertyType("");
    setSelectedCondition("");
    setOpenFilter(null);
  };

  if (!hasFilterOptions) {
    return null;
  }

  return (
    <section className="town-hero-section">
      <div className="town-hero-media">
        <img
          src="/assets/hero_bg_2.png"
          alt="Town by Origami"
          className="town-hero-image"
        />
        <div className="town-hero-overlay" />
      </div>

      {/* Floating Filter Bar */}
      <div className="town-filter-wrapper">
        <div className="town-filter-card">
          <FilterDropdown
            id="room"
            icon={<LocationIcon />}
            value={selectedRoomType}
            fallbackLabel={t("filter_room_all") || "Room Type"}
            options={roomTypeOptions}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            onChange={setSelectedRoomType}
          />

          <FilterDropdown
            id="property"
            icon={<BuildingIcon />}
            value={selectedPropertyType}
            fallbackLabel={t("filter_kind_all") || "Property type"}
            options={propertyTypeOptions}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            onChange={setSelectedPropertyType}
          />

          <FilterDropdown
            id="condition"
            icon={<CurrencyIcon />}
            value={selectedCondition}
            fallbackLabel={t("filter_condition_all") || "Condition"}
            options={conditionOptions}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            onChange={setSelectedCondition}
          />

          <button
            id="search-filter-btn"
            className="town-btn-forest town-filter-search-btn"
            type="button"
            onClick={handleSearch}
          >
            <SearchIcon />
            <span>{t("filter_search") || "SEARCH"}</span>
          </button>

          {hasActiveFilters ? (
            <button
              className="town-filter-reset-btn"
              type="button"
              aria-label={t("filter_reset")}
              title={t("filter_reset")}
              onClick={handleResetFilters}
            >
              <CloseIcon />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FilterDropdown({
  id,
  icon,
  value,
  fallbackLabel,
  options,
  openFilter,
  setOpenFilter,
  onChange
}: {
  id: FilterKey;
  icon: ReactNode;
  value: string;
  fallbackLabel: string;
  options: FilterOption[];
  openFilter: FilterKey | null;
  setOpenFilter: Dispatch<SetStateAction<FilterKey | null>>;
  onChange: Dispatch<SetStateAction<string>>;
}) {
  const isOpen = openFilter === id;
  const allOptions = [{ value: "", label: fallbackLabel }, ...options];
  const selectedLabel = allOptions.find((option) => option.value === value)?.label || fallbackLabel;

  return (
    <div className={`filter-group filter-dropdown ${isOpen ? "is-open" : ""}`}>
      <span className="filter-icon">
        {icon}
      </span>
      <button
        className="filter-select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setOpenFilter((current) => (current === id ? null : id))}
      >
        <span>{selectedLabel}</span>
        <span className="filter-select-chevron" aria-hidden="true"></span>
      </button>
      {isOpen ? (
        <div className="filter-dropdown-menu" role="listbox">
          {allOptions.map((option) => (
            <button
              key={option.value || "all"}
              className={`filter-dropdown-option ${option.value === value ? "is-selected" : ""}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpenFilter(null);
              }}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
