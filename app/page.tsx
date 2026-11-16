import { getSiteContent } from "./lib/db";

export const dynamic = "force-dynamic";

function shopifyImage(src: string, width: number) {
  if (!src.includes("cdn.shopify.com") || !src.includes("/files/")) {
    return src;
  }

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}width=${width}`;
}

function ResponsiveHomeImage({
  alt = "",
  image,
  imageMobile,
  width,
}: {
  alt?: string;
  image: string;
  imageMobile?: string;
  width: number;
}) {
  return (
    <picture>
      {imageMobile ? <source media="(max-width: 700px)" srcSet={shopifyImage(imageMobile, Math.min(width, 560))} /> : null}
      <img src={shopifyImage(image, width)} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
}

export default async function Home() {
  const content = await getSiteContent();
  const footerLinks = [
    { label: "Home", href: "/" },
    ...(["about", "personalTraining", "facility", "trainersPage", "getStarted"] as const).map((key) => ({
      label: content.pages[key].navLabel,
      href: content.pages[key].path,
    })),
  ];

  return (
    <main>
      <section className="hero" id="home">
        <div className="heroImage" aria-hidden="true">
          <video autoPlay loop muted playsInline preload="auto">
            <source src={content.assets.heroVideo} type="video/mp4" />
          </video>
        </div>
        <div className="heroOverlay">
          <div className="heroCopy">
            <h1>
              {content.hero.title}
              <span>{content.hero.accent}</span>
            </h1>
            <p>{content.hero.text}</p>
            <div className="badges">
              {content.hero.badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          </div>
          <div className="heroActions">
            <a className="primaryButton" href={content.menuButton.href}>{content.hero.primaryButton}</a>
            <a className="secondaryButton" href="/personal-training">{content.hero.secondaryButton}</a>
          </div>
        </div>
      </section>

      <section className="stats" aria-label="Credentials">
        {content.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <div><span>{stat.icon}</span><strong>{stat.value}</strong></div>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="darkSection" id="why">
        <div className="sectionHeader inverse">
          <p>{content.problems.eyebrow}</p>
          <h2>{content.problems.title}</h2>
        </div>
        <div className="problemGrid">
          {content.problems.items.map((item) => (
            <article className="imageCard" key={item.title}>
              <ResponsiveHomeImage image={item.image} imageMobile={item.imageMobile} width={760} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="steps" id="about">
        <div className="sectionHeader">
          <p>{content.steps.eyebrow}</p>
          <h2>{content.steps.title}</h2>
        </div>
        <div className="stepGrid">
          {content.steps.items.map((item, index) => (
            <article className="stepCard" key={item.title}>
              <ResponsiveHomeImage image={item.image} imageMobile={item.imageMobile} width={760} />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <a className="centerButton" href={content.menuButton.href}>{content.steps.button}</a>
      </section>

      <section className="darkSection difference">
        <div className="sectionHeader inverse">
          <p>{content.difference.eyebrow}</p>
          <h2>{content.difference.title}</h2>
        </div>
        <div className="differenceGrid">
          {content.difference.items.map((item) => (
            <article key={item.title}>
              <ResponsiveHomeImage image={item.image} imageMobile={item.imageMobile} width={720} />
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="trainers" id="trainers">
        <div className="sectionHeader">
          <p>{content.trainers.eyebrow}</p>
          <h2>{content.trainers.title}</h2>
        </div>
        <div className="trainerGrid">
          {content.trainers.items.map((trainer) => (
            <article className="trainerCard" key={trainer.name}>
              <ResponsiveHomeImage alt={trainer.name} image={trainer.image} imageMobile={trainer.imageMobile} width={720} />
              <h3>{trainer.name}</h3>
              <p>{trainer.role}</p>
              {trainer.bio ? <small>{trainer.bio}</small> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="benefits">
        {content.benefits.map((benefit) => (
          <article key={benefit.title}>
            <strong>{benefit.title}</strong>
            <p>{benefit.text}</p>
          </article>
        ))}
      </section>

      <section className="testimonials">
        <div className="sectionHeader inverse">
          <p>{content.testimonials.eyebrow}</p>
          <h2>{content.testimonials.title}</h2>
        </div>
        <div className="testimonialGrid">
          {content.testimonials.items.map((testimonial) => (
            <article key={testimonial.name}>
              <span>“</span>
              <p>{testimonial.text}</p>
              <strong>{testimonial.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <img src={shopifyImage(content.assets.logo, 260)} alt="Phoenix Fitness" />
          <p>{content.business.footerName}</p>
          <a className="primaryButton" href={content.menuButton.href}>{content.menuButton.label}</a>
        </div>
        <div>
          <h3>Important Links</h3>
          {content.footer.importantLinks.map((link) => (
            <a href={link.href} key={`${link.href}-${link.label}`}>{link.label}</a>
          ))}
        </div>
        <div>
          <h3>Quick Links</h3>
          {footerLinks.map((link) => (
            <a href={link.href} key={`${link.href}-${link.label}`}>{link.label}</a>
          ))}
        </div>
        <div>
          <h3>{content.footer.newsletterTitle}</h3>
          <p>{content.footer.newsletterText}</p>
        </div>
      </footer>
    </main>
  );
}
