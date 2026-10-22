export function HeroSection() {
  return (
    <section className="town-hero-section">
      <div className="town-hero-media">
        <video
          className="town-hero-video"
          src="https://origam.ge/video/town.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Town by Origami"
        />
      </div>
    </section>
  );
}
