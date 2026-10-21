import { useRef, useState } from "react";
import type { CompanyProjectsContent } from "../../api/siteContent";
import { getOptimizedImageUrl } from "../../utils/media";

export function ProjectsSection({ data, t }: { data: CompanyProjectsContent | null; t: (key: import("../../i18n").TranslationKey) => string }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const projects = data?.items || [];

  if (!projects.length) return null;

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    const card = track?.children.item(index) as HTMLElement | null;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <section className="town-projects-section reveal-on-scroll" aria-labelledby="town-projects-title">
      <div className="container">
        <div className="town-projects-heading">
          <h2 id="town-projects-title" className="town-location-title">{data?.title || "Projects"}</h2>
        </div>
        <div
          className="town-projects-track"
          ref={trackRef}
          onScroll={(event) => {
            const track = event.currentTarget;
            const cardWidth = (track.firstElementChild as HTMLElement | null)?.offsetWidth || 1;
            setActiveIndex(Math.round(track.scrollLeft / (cardWidth + 20)));
          }}
        >
          {projects.map((project) => (
            <article className="town-project-card" key={project.id}>
              <img
                src={getOptimizedImageUrl(project.image, { width: 1000, height: 560, crop: "fill", gravity: "auto" })}
                alt={project.title}
                loading="lazy"
                decoding="async"
              />
              <div className="town-project-card-shade" />
              {project.link?.trim() ? (
                <a
                  className="town-project-website-link"
                  href={project.link.trim()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  {t("project_website")}
                  <svg
                    className="town-project-website-icon"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M6.25 3.25H3.5a1 1 0 0 0-1 1v8.25a1 1 0 0 0 1 1h8.25a1 1 0 0 0 1-1v-2.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 2.5h5.5V8M13.25 2.75 7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : null}
              <div className="town-project-card-copy">
                <h3>{project.title}</h3>
              </div>
            </article>
          ))}
        </div>
        <div className="town-projects-controls">
          <span className="town-projects-count">{String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          <div className="town-projects-progress" aria-hidden="true">
            <span style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }} />
          </div>
          <div className="town-projects-arrows">
            <button type="button" onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))} disabled={activeIndex <= 0} aria-label="Previous project">‹</button>
            <button type="button" onClick={() => scrollToIndex(Math.min(projects.length - 1, activeIndex + 1))} disabled={activeIndex >= projects.length - 1} aria-label="Next project">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}
