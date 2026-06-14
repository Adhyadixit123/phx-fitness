import ContactForm from "./ContactForm";
import { EditablePage, PageSection, SiteContent } from "../lib/siteContent";

export function SiteHeader({
  content,
  menuOpen = false,
  onMenuToggle,
}: {
  content: SiteContent;
  menuOpen?: boolean;
  onMenuToggle?: () => void;
}) {
  const navLinks = [
    { label: "Home", href: "/" },
    ...(["about", "personalTraining", "facility", "trainersPage", "getStarted"] as const).map((key) => ({
      label: content.pages[key].navLabel,
      href: content.pages[key].path,
    })),
  ];

  return (
    <>
      <div className="topbar">
        <span>{content.business.phone}</span>
        <span>{content.business.address}</span>
      </div>
      <nav className="nav pageNav" aria-label="Primary navigation">
        <a href="/" className="brand" aria-label="Phoenix Fitness home">
          <img src={content.assets.logo} alt="Phoenix Fitness" />
        </a>
        <button
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          className="menuToggle"
          type="button"
          onClick={onMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`navLinks ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <a href={link.href} key={link.href}>{link.label}</a>
          ))}
          <a className="navButton" href="/get-started#intake">Start Intake</a>
        </div>
      </nav>
    </>
  );
}

export function SiteFooter({ content }: { content: SiteContent }) {
  const navLinks = [
    { label: "Home", href: "/" },
    ...(["about", "personalTraining", "facility", "trainersPage", "getStarted"] as const).map((key) => ({
      label: content.pages[key].navLabel,
      href: content.pages[key].path,
    })),
  ];

  return (
    <footer className="footer">
      <div>
        <img src={content.assets.logo} alt="Phoenix Fitness" />
        <p>{content.business.footerName}</p>
        <a className="primaryButton" href="/get-started#intake">Start My Intake</a>
      </div>
      <div>
        <h3>Explore</h3>
        {navLinks.map((link) => (
          <a href={link.href} key={link.href}>{link.label}</a>
        ))}
      </div>
      <div>
        <h3>Important Links</h3>
        {content.footer.importantLinks.map((link) => (
          <a href={link.href} key={`${link.href}-${link.label}`}>{link.label}</a>
        ))}
      </div>
      <div>
        <h3>{content.footer.newsletterTitle}</h3>
        <p>{content.footer.newsletterText}</p>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
}) {
  return (
    <section className="pageHero">
      <img src={image} alt="" />
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{text}</span>
        <a className="primaryButton" href="/get-started#intake">Start My Intake</a>
      </div>
    </section>
  );
}

export function SplitStory({
  eyebrow,
  title,
  text,
  image,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  reverse?: boolean;
}) {
  return (
    <section className={`splitStory ${reverse ? "reverse" : ""}`}>
      <img src={image} alt="" />
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        <span>{text}</span>
      </div>
    </section>
  );
}

export function FeatureBand({
  eyebrow = "Phoenix Fitness",
  title,
  text = "",
  items,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  items: { title: string; text?: string; image: string }[];
}) {
  return (
    <section className="featureBand">
      <div className="sectionHeader">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        {text ? <span>{text}</span> : null}
      </div>
      <div className="featureGrid">
        {items.map((item) => (
          <article key={item.title}>
            <img src={item.image} alt="" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ContentPage({ content, page }: { content: SiteContent; page: EditablePage }) {
  return (
    <main>
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        text={page.hero.text}
        image={page.hero.image}
      />
      {page.sections.map((section) => (
        <PageSectionRenderer content={content} section={section} key={section.id} />
      ))}
      <SiteFooter content={content} />
    </main>
  );
}

export function PageSectionRenderer({ content, section }: { content: SiteContent; section: PageSection }) {
  if (section.type === "split") {
    return (
      <SplitStory
        eyebrow={section.eyebrow}
        title={section.title}
        text={section.text}
        image={section.image}
        reverse={section.reverse}
      />
    );
  }

  if (section.type === "features") {
    return <FeatureBand eyebrow={section.eyebrow} title={section.title} text={section.text} items={section.items || []} />;
  }

  if (section.type === "process") {
    return (
      <section className="processTimeline">
        {(section.items || []).map((item, index) => (
          <article key={`${item.title}-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    );
  }

  if (section.type === "trainers") {
    return (
      <section className="trainerDetailGrid">
        {content.trainers.items.map((trainer) => (
          <article key={trainer.name}>
            <img src={trainer.image} alt={trainer.name} />
            <div>
              <p>{section.eyebrow}</p>
              <h2>{trainer.name}</h2>
              <span>{trainer.role}</span>
            </div>
          </article>
        ))}
      </section>
    );
  }

  if (section.type === "intake") {
    return (
      <section className="intakeSection" id="intake">
        <div className="intakeIntro">
          <p>{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <span>{section.text}</span>
        </div>
        <ContactForm buttonLabel="Send My Intake" successMessage={content.contact.success} />
      </section>
    );
  }

  return null;
}
