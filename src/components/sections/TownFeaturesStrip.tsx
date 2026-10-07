import { FC } from "react";
import { TownLeafIcon, TownWavesIcon, TownCommunityIcon, TownDiamondIcon } from "../Icons";

interface TownFeaturesStripProps {
  items?: Array<{
    icon: string;
    title: string;
  }>;
}

export const TownFeaturesStrip: FC<TownFeaturesStripProps> = () => {
  const features = [
    {
      icon: <TownLeafIcon />,
      title: "MORE GREEN"
    },
    {
      icon: <TownWavesIcon />,
      title: "A CALMER LIFESTYLE"
    },
    {
      icon: <TownCommunityIcon />,
      title: "A COMPLETE ENVIRONMENT"
    },
    {
      icon: <TownDiamondIcon />,
      title: "A BRIGHTER TOMORROW"
    }
  ];

  return (
    <section className="town-features-strip reveal-on-scroll">
      <div className="container">
        <div className="town-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="town-feature-item reveal-fade-up">
              <div className="town-feature-icon">{feature.icon}</div>
              <h3 className="town-feature-title">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
