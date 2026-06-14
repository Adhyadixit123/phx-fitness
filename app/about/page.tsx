import { ContentPage } from "../components/SiteShell";
import { getSiteContent } from "../lib/db";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();
  return <ContentPage content={content} page={content.pages.about} />;
}
