import ContactForm from "../components/ContactForm";
import { PageSectionRenderer, SiteFooter } from "../components/SiteShell";
import { getSiteContent } from "../lib/db";

export const dynamic = "force-dynamic";

export default async function GetStartedPage() {
  const content = await getSiteContent();
  const page = content.pages.getStarted;

  return (
    <main className="intakePage">
      <section className="intakeExperience" id="intake">
        <div className="intakeBackdrop">
          {page.hero.video ? (
            <video src={page.hero.video} poster={page.hero.image} autoPlay muted loop playsInline />
          ) : (
            <img src={page.hero.image} alt="" />
          )}
        </div>
        <div className="intakeShell">
          <div className="intakeHeroCopy">
            <p>{page.hero.eyebrow}</p>
            <h1>{page.hero.title}</h1>
            <span>{page.hero.text}</span>
          </div>
          <ContactForm buttonLabel="Send My Intake" successMessage={content.contact.success} />
        </div>
      </section>
      {page.sections.filter((section) => section.type !== "intake").map((section) => (
        <PageSectionRenderer content={content} section={section} key={section.id} />
      ))}
      <SiteFooter content={content} />
    </main>
  );
}
