import { useEffect } from "react";

export function useScrollReveal(dependencies: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const elementsToObserve = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            entry.target.classList.remove("reveal-hidden");
            observer.unobserve(entry.target);
            elementsToObserve.delete(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.08
      }
    );

    const observeNewElements = () => {
      const candidates = document.querySelectorAll(
        ".reveal-on-scroll, .reveal-fade-up, .reveal-scale, .reveal-stagger, .reveal-scroll, section[id]"
      );

      candidates.forEach((el) => {
        if (!el.classList.contains("is-revealed") && !elementsToObserve.has(el)) {
          // Check if already in viewport
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add("is-revealed");
            el.classList.remove("reveal-hidden");
          } else {
            el.classList.add("reveal-on-scroll");
            observer.observe(el);
            elementsToObserve.add(el);
          }
        }
      });
    };

    observeNewElements();

    // Observe future DOM insertions (e.g. async API data)
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      elementsToObserve.clear();
    };
  }, dependencies);
}
