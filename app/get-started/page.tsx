import ContactForm from "../components/ContactForm";
import { getSiteContent } from "../lib/db";

export const dynamic = "force-dynamic";

export default async function GetStartedPage() {
  const content = await getSiteContent();
  const page = content.pages.getStarted;

  return (
    <main className="intakePage">
      <section className="intakeExperience" id="intake">
        <div className="intakeBackdrop">
          <img src={page.hero.image} alt="" />
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
    </main>
  );
}
