"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { defaultSiteContent, PageKey, PageSection, SiteContent } from "../lib/siteContent";

type Mode = "editor" | "leads" | "pixels" | "settings";
type SectionKey = string;

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  details?: Record<string, unknown>;
  created_at: string;
};

const cloudName = "dd9j6cxtw";
const uploadPreset = "ml_default";

const defaultCdnImages = {
  card: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01537.jpg?v=1782328742",
  trainer: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01550.jpg?v=1782328742",
  feature: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01652.jpg?v=1782328734",
  process: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01679.jpg?v=1782328742",
  split: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01537.jpg?v=1782328742",
  intake: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01652.jpg?v=1782328734",
};

function defaultSectionImage(type: PageSection["type"]) {
  if (type === "process") return defaultCdnImages.process;
  if (type === "features") return defaultCdnImages.feature;
  if (type === "intake") return defaultCdnImages.intake;
  return defaultCdnImages.split;
}

const sections: { key: SectionKey; label: string; hint: string }[] = [
  { key: "business", label: "Business", hint: "Phone, address, footer name" },
  { key: "hero", label: "Hero", hint: "Headline, badges, buttons" },
  { key: "media", label: "Media", hint: "Logo, hero, contact assets" },
  { key: "nav", label: "Menus", hint: "Header and footer links" },
  { key: "problems", label: "Problem Cards", hint: "Why training is not working" },
  { key: "steps", label: "Steps", hint: "3-step process section" },
  { key: "difference", label: "Difference", hint: "Feature image cards" },
  { key: "trainers", label: "Trainers", hint: "Names, roles, photos" },
  { key: "benefits", label: "Benefits", hint: "Small value cards" },
  { key: "testimonials", label: "Testimonials", hint: "Client quotes" },
  { key: "contact", label: "Intake Messages", hint: "Form button and success copy" },
  { key: "footer", label: "Footer", hint: "Newsletter and footer links" },
];

const pageKeys: PageKey[] = ["about", "personalTraining", "facility", "trainersPage", "getStarted"];

function editorSections(content: SiteContent) {
  return [
    ...sections,
    ...pageKeys.map((key) => ({
      key: `page:${key}`,
      label: content.pages[key].navLabel,
      hint: `Edit ${content.pages[key].path}`,
    })),
  ];
}

function pageKeyFromSection(section: SectionKey): PageKey | null {
  if (!section.startsWith("page:")) {
    return null;
  }

  const key = section.replace("page:", "") as PageKey;
  return pageKeys.includes(key) ? key : null;
}

const mainTabs: { key: Mode; label: string; hint: string }[] = [
  { key: "editor", label: "Store Editor", hint: "Visual site editing" },
  { key: "leads", label: "Leads", hint: "Contact submissions" },
  { key: "pixels", label: "Pixels", hint: "Google and Facebook" },
  { key: "settings", label: "Settings", hint: "Admin account" },
];

type EditorPageKey = "home" | PageKey;

function pageLabel(content: SiteContent, pageKey: EditorPageKey) {
  return pageKey === "home" ? "Homepage" : content.pages[pageKey].navLabel;
}

function pagePath(content: SiteContent, pageKey: EditorPageKey) {
  return pageKey === "home" ? "/" : content.pages[pageKey].path;
}

function pageSectionTargets(content: SiteContent, pageKey: EditorPageKey) {
  if (pageKey === "home") {
    return sections;
  }

  return [
    { key: "hero", label: "Hero", hint: "Page headline, media, buttons" },
    { key: "nav", label: "Menus", hint: "Header links, CTA, footer links" },
    ...content.pages[pageKey].sections.map((section, index) => ({
      key: section.id,
      label: section.title || `Section ${index + 1}`,
      hint: `${section.type} section`,
    })),
  ];
}

function updateAt<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function isVideoUrl(value: string) {
  return /\.(mp4|mov|webm|m4v)(\?|#|$)/i.test(value);
}

export default function AdminPage() {
  const [admin, setAdmin] = useState<{ email: string } | null>(null);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [activeEditorPage, setActiveEditorPage] = useState<EditorPageKey>("home");
  const [activePageSection, setActivePageSection] = useState<SectionKey>("hero");
  const [editorPanelCollapsed, setEditorPanelCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>("editor");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState("Checking session...");
  const [settingsStatus, setSettingsStatus] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const hydrated = useRef(false);
  const skipAutosave = useRef(true);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (admin) {
      loadContent();
      loadLeads();
    }
  }, [admin]);

  useEffect(() => {
    if (!admin || skipAutosave.current) {
      skipAutosave.current = false;
      return;
    }

    setSaveState("saving");
    const timer = window.setTimeout(() => {
      saveContent(content, true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [content, admin]);

  async function checkSession() {
    const response = await fetch("/api/admin/me");
    if (response.ok) {
      const body = await response.json();
      setAdmin(body.admin);
      setStatus("");
    } else {
      setStatus("");
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Signing in...");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus(body?.error || "Could not sign in.");
      return;
    }

    setAdmin(body.admin);
    setStatus("");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAdmin(null);
    setStatus("");
  }

  async function loadContent() {
    const response = await fetch("/api/admin/content");
    if (!response.ok) {
      setStatus("Could not load editable content.");
      return;
    }

    const body = await response.json();
    skipAutosave.current = true;
    hydrated.current = true;
    setContent(body.content);
    setSaveState("saved");
  }

  async function loadLeads() {
    const response = await fetch("/api/admin/leads");
    if (response.ok) {
      const body = await response.json();
      setLeads(body.leads);
    }
  }

  async function saveContent(nextContent = content, quiet = false) {
    setSaveState("saving");
    if (!quiet) {
      setStatus("Saving changes...");
    }

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: nextContent }),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setSaveState("error");
      setStatus(body?.error || "Could not save changes.");
      return;
    }

    skipAutosave.current = true;
    setContent(body.content);
    setSaveState("saved");
    setStatus(quiet ? "" : "Saved.");
  }

  async function uploadImage(file: File, onUploaded: (url: string) => void) {
    setStatus("Uploading to Cloudinary...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });

    const body = await response.json();
    if (!response.ok) {
      setStatus(body?.error?.message || "Cloudinary upload failed.");
      return;
    }

    onUploaded(body.secure_url);
    setStatus("Uploaded. Autosave will store it.");
  }

  function updateContent(updater: (current: SiteContent) => SiteContent) {
    setContent((current) => updater(current));
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSettingsStatus("Updating password...");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setSettingsStatus("Passwords do not match.");
      return;
    }

    const response = await fetch("/api/admin/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setSettingsStatus(body?.error || "Could not update password.");
      return;
    }

    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setSettingsStatus("Password updated.");
  }

  if (!admin) {
    return (
      <main className="adminLogin">
        <form onSubmit={handleLogin} className="adminLoginPanel">
          <img src={content.assets.logo} alt="Phoenix Fitness" />
          <h1>Admin Panel</h1>
          <p>Sign in to visually edit the website, upload media, and manage leads.</p>
          <input
            aria-label="Email"
            placeholder="Admin email"
            type="email"
            value={login.email}
            onChange={(event) => setLogin({ ...login, email: event.target.value })}
            required
          />
          <input
            aria-label="Password"
            placeholder="Admin password"
            type="password"
            value={login.password}
            onChange={(event) => setLogin({ ...login, password: event.target.value })}
            required
          />
          <button type="submit">Sign In</button>
          {status ? <p className="adminStatus">{status}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className={`visualAdmin ${mode === "editor" ? "editorLayout" : ""} ${editorPanelCollapsed ? "editorCollapsed" : ""}`}>
      <aside className="adminPrimarySidebar">
        <div className="visualBrand">
          <img src={content.assets.logo} alt="Phoenix Fitness" />
          <p>{admin.email}</p>
        </div>

        <nav className="mainTabList" aria-label="Admin areas">
          {mainTabs.map((tab) => (
            <button
              className={mode === tab.key ? "active" : ""}
              key={tab.key}
              type="button"
              onClick={() => setMode(tab.key)}
            >
              <span>{tab.label}</span>
              <small>{tab.hint}</small>
            </button>
          ))}
        </nav>

        <button className="logoutButton" type="button" onClick={logout}>Logout</button>
      </aside>

      {mode === "editor" ? (
        <aside className="visualSidebar editorControlPanel">
          <div className="sidebarTitle">
            <div>
              <p>Store Editor</p>
              <h2>{editorPanelCollapsed ? "Edit" : "Visual Editor"}</h2>
            </div>
            <button
              aria-label={editorPanelCollapsed ? "Expand editor sidebar" : "Collapse editor sidebar"}
              className="collapsePanelButton"
              type="button"
              onClick={() => setEditorPanelCollapsed((collapsed) => !collapsed)}
            >
              {editorPanelCollapsed ? "›" : "‹"}
            </button>
          </div>

          {!editorPanelCollapsed ? (
            <>
              <div className="editorPanelGroup">
                <p className="editorPanelLabel">Pages</p>
                <div className="pagePills" role="tablist" aria-label="Editable pages">
                  {(["home", ...pageKeys] as EditorPageKey[]).map((pageKey) => (
                    <button
                      className={activeEditorPage === pageKey ? "active" : ""}
                      key={pageKey}
                      type="button"
                      onClick={() => {
                        setActiveEditorPage(pageKey);
                        if (pageKey === "home") {
                          setActiveSection("hero");
                        } else {
                          setActivePageSection("hero");
                        }
                      }}
                    >
                      {pageLabel(content, pageKey)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="editorPanelGroup">
                <p className="editorPanelLabel">Sections</p>
                <nav className="sectionList compact" aria-label="Editable sections">
                  {pageSectionTargets(content, activeEditorPage).map((section) => {
                    const active = activeEditorPage === "home" ? activeSection === section.key : activePageSection === section.key;
                    return (
                      <button
                        className={active ? "active" : ""}
                        key={section.key}
                        type="button"
                        onClick={() => {
                          if (activeEditorPage === "home") {
                            setActiveSection(section.key);
                          } else {
                            setActivePageSection(section.key);
                          }
                        }}
                      >
                        <span>{section.label}</span>
                        <small>{section.hint}</small>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <SettingsPanel
                activeSection={activeSection}
                activeEditorPage={activeEditorPage}
                activePageSection={activePageSection}
                content={content}
                updateContent={updateContent}
                uploadImage={uploadImage}
              />
            </>
          ) : null}
        </aside>
      ) : null}

      {mode === "leads" ? (
        <aside className="visualSidebar">
          <div className="sidebarTitle">
            <p>Leads</p>
            <h2>Overview</h2>
          </div>
          <div className="leadSummary">
            <strong>{leads.length}</strong>
            <span>Total leads captured</span>
          </div>
        </aside>
      ) : null}

      {mode === "pixels" ? (
        <aside className="visualSidebar">
          <div className="sidebarTitle">
            <p>Tracking</p>
            <h2>Pixels</h2>
          </div>
          <p className="sidebarHelp">Add IDs only. The site generates the script tags automatically.</p>
        </aside>
      ) : null}

      {mode === "settings" ? (
        <aside className="visualSidebar">
          <div className="sidebarTitle">
            <p>Account</p>
            <h2>Settings</h2>
          </div>
          <p className="sidebarHelp">Change the admin password used for this panel.</p>
        </aside>
      ) : null}

      {mode === "editor" ? (
        <section className="previewPane">
          <header className="editorTopbar">
            <div>
              <p>Visual Editor</p>
              <h1>{pageLabel(content, activeEditorPage)}</h1>
            </div>
            <div className="editorActions">
              <SavePill state={saveState} hydrated={hydrated.current} />
              <a href={pagePath(content, activeEditorPage)} target="_blank">Open Page</a>
              <button type="button" onClick={() => saveContent(content, false)}>
                Save Now
              </button>
            </div>
          </header>
          {status ? <p className="adminNotice">{status}</p> : null}
          {activeEditorPage === "home" ? (
            <SitePreview content={content} activeSection={activeSection} onSelect={setActiveSection} />
          ) : (
            <EditablePagePreview
              activeSection={activePageSection}
              content={content}
              onSelect={setActivePageSection}
              pageKey={activeEditorPage}
            />
          )}
        </section>
      ) : null}

      {mode === "leads" ? (
        <section className="adminWorkspace">
          <header className="editorTopbar">
            <div>
              <p>Lead Capture</p>
              <h1>Contact Form Leads</h1>
            </div>
            <div className="editorActions">
              <button type="button" onClick={loadLeads}>Refresh</button>
              <a href="/" target="_blank">Open Site</a>
            </div>
          </header>
          <LeadTable leads={leads} />
        </section>
      ) : null}

      {mode === "pixels" ? (
        <section className="adminWorkspace">
          <header className="editorTopbar">
            <div>
              <p>Tracking</p>
              <h1>Google and Facebook Pixels</h1>
            </div>
            <div className="editorActions">
              <SavePill state={saveState} hydrated={hydrated.current} />
              <button type="button" onClick={() => saveContent(content, false)}>Save Now</button>
            </div>
          </header>
          <div className="simpleSettingsGrid">
            <section className="settingsCard">
              <h2>Google tag</h2>
              <p>Use a Google tag ID like G-XXXXXXXXXX, GT-XXXXXXX, or AW-XXXXXXXXX.</p>
              <TextInput
                label="Google tag ID"
                value={content.tracking.googleTagId}
                onChange={(value) => updateContent((current) => ({ ...current, tracking: { ...current.tracking, googleTagId: value } }))}
              />
            </section>
            <section className="settingsCard">
              <h2>Facebook Pixel</h2>
              <p>Paste the numeric Meta/Facebook Pixel ID. The PageView event is added automatically.</p>
              <TextInput
                label="Facebook Pixel ID"
                value={content.tracking.facebookPixelId}
                onChange={(value) => updateContent((current) => ({ ...current, tracking: { ...current.tracking, facebookPixelId: value } }))}
              />
            </section>
          </div>
        </section>
      ) : null}

      {mode === "settings" ? (
        <section className="adminWorkspace">
          <header className="editorTopbar">
            <div>
              <p>Settings</p>
              <h1>Admin Account</h1>
            </div>
          </header>
          <div className="simpleSettingsGrid">
            <form className="settingsCard" onSubmit={changePassword}>
              <h2>Change password</h2>
              <p>Enter the current password first, then choose a new password with at least 8 characters.</p>
              <label className="adminField">
                <span>Current password</span>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })}
                />
              </label>
              <label className="adminField">
                <span>New password</span>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })}
                />
              </label>
              <label className="adminField">
                <span>Confirm password</span>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })}
                />
              </label>
              <button className="settingsSubmit" type="submit">Update Password</button>
              {settingsStatus ? <p className="adminNotice">{settingsStatus}</p> : null}
            </form>
          </div>
        </section>
      ) : null}

    </main>
  );
}

function SavePill({ state, hydrated }: { state: "idle" | "saving" | "saved" | "error"; hydrated: boolean }) {
  const text = !hydrated ? "Loading" : state === "saving" ? "Autosaving" : state === "error" ? "Save failed" : "Saved";
  return <span className={`savePill ${state}`}>{text}</span>;
}

function SitePreview({
  content,
  activeSection,
  onSelect,
}: {
  content: SiteContent;
  activeSection: SectionKey;
  onSelect: (section: SectionKey) => void;
}) {
  return (
    <div className="sitePreviewFrame">
      <div className="sitePreviewCanvas">
        <PreviewSection id="hero" active={activeSection === "hero"} label="Hero" onSelect={onSelect}>
          <section className="hero miniHero">
            <div className="topbar">
              <span>{content.business.phone}</span>
              <span>{content.business.address}</span>
            </div>
            <nav className="nav">
              <img src={content.assets.logo} alt="" />
              <div className="navLinks">
                {content.nav.slice(0, 4).map((link) => <span key={link.label}>{link.label}</span>)}
                <span>{content.menuButton.label}</span>
              </div>
            </nav>
            <div className="heroImage">
              <video autoPlay loop muted playsInline preload="auto">
                <source src={content.assets.heroVideo} type="video/mp4" />
              </video>
            </div>
            <div className="heroOverlay">
              <div className="heroCopy">
                <h1>{content.hero.title}<span>{content.hero.accent}</span></h1>
                <p>{content.hero.text}</p>
                <div className="badges">
                  {content.hero.badges.map((badge) => <span key={badge}>{badge}</span>)}
                </div>
              </div>
            </div>
          </section>
        </PreviewSection>

        <PreviewSection id="business" active={activeSection === "business"} label="Business Info" onSelect={onSelect}>
          <section className="stats">
            {content.stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div><span>{stat.icon}</span><strong>{stat.value}</strong></div>
                <p>{stat.label}</p>
              </div>
            ))}
          </section>
        </PreviewSection>

        <PreviewSection id="problems" active={activeSection === "problems"} label="Problem Cards" onSelect={onSelect}>
          <section className="darkSection">
            <PreviewHeader eyebrow={content.problems.eyebrow} title={content.problems.title} inverse />
            <div className="problemGrid">
              {content.problems.items.map((item) => <PreviewCard key={item.title} item={item} />)}
            </div>
          </section>
        </PreviewSection>

        <PreviewSection id="steps" active={activeSection === "steps"} label="Steps" onSelect={onSelect}>
          <section className="steps">
            <PreviewHeader eyebrow={content.steps.eyebrow} title={content.steps.title} />
            <div className="stepGrid">
              {content.steps.items.map((item, index) => (
                <article className="stepCard" key={item.title}>
                  <img src={item.image} alt="" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        </PreviewSection>

        <PreviewSection id="difference" active={activeSection === "difference"} label="Difference" onSelect={onSelect}>
          <section className="darkSection">
            <PreviewHeader eyebrow={content.difference.eyebrow} title={content.difference.title} inverse />
            <div className="differenceGrid">
              {content.difference.items.map((item) => (
                <article key={item.title}>
                  <img src={item.image} alt="" />
                  <h3>{item.title}</h3>
                </article>
              ))}
            </div>
          </section>
        </PreviewSection>

        <PreviewSection id="trainers" active={activeSection === "trainers"} label="Trainers" onSelect={onSelect}>
          <section className="trainers">
            <PreviewHeader eyebrow={content.trainers.eyebrow} title={content.trainers.title} />
            <div className="trainerGrid">
              {content.trainers.items.map((trainer) => (
                <article className="trainerCard" key={trainer.name}>
                  <img src={trainer.image} alt="" />
                  <h3>{trainer.name}</h3>
                  <p>{trainer.role}</p>
                </article>
              ))}
            </div>
          </section>
        </PreviewSection>

        <PreviewSection id="benefits" active={activeSection === "benefits"} label="Benefits" onSelect={onSelect}>
          <section className="benefits">
            {content.benefits.map((benefit) => (
              <article key={benefit.title}>
                <strong>{benefit.title}</strong>
                <p>{benefit.text}</p>
              </article>
            ))}
          </section>
        </PreviewSection>

        <PreviewSection id="testimonials" active={activeSection === "testimonials"} label="Testimonials" onSelect={onSelect}>
          <section className="testimonials">
            <PreviewHeader eyebrow={content.testimonials.eyebrow} title={content.testimonials.title} inverse />
            <div className="testimonialGrid">
              {content.testimonials.items.map((testimonial) => (
                <article key={testimonial.name}>
                  <span>"</span>
                  <p>{testimonial.text}</p>
                  <strong>{testimonial.name}</strong>
                </article>
              ))}
            </div>
          </section>
        </PreviewSection>

        <PreviewSection id="contact" active={activeSection === "contact"} label="Intake Messages" onSelect={onSelect}>
          <section className="adminIntakeMessagePreview">
            <p>Intake form copy</p>
            <h2>{content.contact.title}</h2>
            <span>{content.contact.text}</span>
            <button type="button">{content.contact.button}</button>
            <small>{content.contact.success}</small>
          </section>
        </PreviewSection>

        <PreviewSection id="footer" active={activeSection === "footer"} label="Footer" onSelect={onSelect}>
          <footer className="footer">
            <div><img src={content.assets.logo} alt="" /><p>{content.business.footerName}</p></div>
            <div><h3>{content.footer.newsletterTitle}</h3><p>{content.footer.newsletterText}</p></div>
          </footer>
        </PreviewSection>
      </div>
    </div>
  );
}

function PreviewSection({
  id,
  active,
  label,
  children,
  onSelect,
}: {
  id: SectionKey;
  active: boolean;
  label: string;
  children: ReactNode;
  onSelect: (section: SectionKey) => void;
}) {
  return (
    <div className={`previewSection ${active ? "active" : ""}`} onClick={() => onSelect(id)}>
      <span className="previewTag">{label}</span>
      {children}
    </div>
  );
}

function PreviewHeader({ eyebrow, title, inverse = false }: { eyebrow: string; title: string; inverse?: boolean }) {
  return (
    <div className={`sectionHeader ${inverse ? "inverse" : ""}`}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function PreviewCard({ item }: { item: { title: string; text?: string; image: string } }) {
  return (
    <article className="imageCard">
      <img src={item.image} alt="" />
      <div>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </article>
  );
}

function EditablePagePreview({
  activeSection,
  content,
  onSelect,
  pageKey,
}: {
  activeSection: SectionKey;
  content: SiteContent;
  onSelect: (section: SectionKey) => void;
  pageKey: PageKey;
}) {
  const page = content.pages[pageKey];
  const primaryButton = page.hero.primaryButton || "Start My Intake";
  const primaryHref = page.hero.primaryHref || "/get-started#intake";

  return (
    <div className="sitePreviewFrame">
      <div className="sitePreviewCanvas">
        <div className={`previewSection ${activeSection === "hero" ? "active" : ""}`} onClick={() => onSelect("hero")}>
          <span className="previewTag">Hero</span>
          <section className="pageHero">
            {page.hero.video ? (
              <video src={page.hero.video} poster={page.hero.image} autoPlay muted loop playsInline />
            ) : (
              <img src={page.hero.image} alt="" />
            )}
            <div>
              <p>{page.hero.eyebrow}</p>
              <h1>{page.hero.title}</h1>
              <span>{page.hero.text}</span>
              <div className="pageHeroActions">
                {primaryButton ? <a className="primaryButton" href={primaryHref}>{primaryButton}</a> : null}
                {page.hero.secondaryButton ? <a className="secondaryButton" href={page.hero.secondaryHref || "#"}>{page.hero.secondaryButton}</a> : null}
              </div>
            </div>
          </section>
        </div>
        {page.sections.map((section, index) => (
          <div
            className={`previewSection ${activeSection === section.id ? "active" : ""}`}
            key={section.id}
            onClick={() => onSelect(section.id)}
          >
            <span className="previewTag">Section {index + 1}: {section.type} - {section.title}</span>
            <PageSectionPreview content={content} section={section} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PageSectionPreview({ content, section }: { content: SiteContent; section: PageSection }) {
  if (section.type === "split") {
    return (
      <section className={`splitStory ${section.reverse ? "reverse" : ""}`}>
        {section.video ? <video src={section.video} poster={section.image} controls playsInline /> : <img src={section.image} alt="" />}
        <div>
          <p>{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <span>{section.text}</span>
          {section.buttonLabel ? <a className="primaryButton sectionCta" href={section.buttonHref || "/get-started#intake"}>{section.buttonLabel}</a> : null}
        </div>
      </section>
    );
  }

  if (section.type === "features") {
    return (
      <section className="featureBand">
        <div className="sectionHeader">
          <p>{section.eyebrow || "Phoenix Fitness"}</p>
          <h2>{section.title}</h2>
          {section.text ? <span>{section.text}</span> : null}
        </div>
        <div className="featureGrid">
          {(section.items || []).map((item) => (
            <article key={item.title}>
              {item.image ? <img src={item.image} alt="" /> : null}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        {section.buttonLabel ? <a className="primaryButton sectionCta centered" href={section.buttonHref || "/get-started#intake"}>{section.buttonLabel}</a> : null}
      </section>
    );
  }

  if (section.type === "process") {
    return (
      <section className="processTimeline">
        <div className="sectionHeader">
          <p>{section.eyebrow}</p>
          <h2>{section.title}</h2>
          {section.text ? <span>{section.text}</span> : null}
        </div>
        <div className="processGrid">
          {(section.items || []).map((item, index) => (
            <article key={`${item.title}-${index}`}>
              {item.image ? <img src={item.image} alt="" /> : null}
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        {section.buttonLabel ? <a className="primaryButton sectionCta centered" href={section.buttonHref || "/get-started#intake"}>{section.buttonLabel}</a> : null}
      </section>
    );
  }

  if (section.type === "trainers") {
    return (
      <section className="trainerDetailGrid">
        <div className="sectionHeader">
          <p>{section.eyebrow}</p>
          <h2>{section.title}</h2>
          {section.text ? <span>{section.text}</span> : null}
        </div>
        {content.trainers.items.map((trainer) => (
          <article key={trainer.name}>
            <img src={trainer.image} alt="" />
            <div>
              <p>{section.eyebrow}</p>
              <h2>{trainer.name}</h2>
              <span>{trainer.role}</span>
            </div>
          </article>
        ))}
        {section.buttonLabel ? <a className="primaryButton sectionCta centered" href={section.buttonHref || "/get-started#intake"}>{section.buttonLabel}</a> : null}
      </section>
    );
  }

  if (section.type === "intake") {
    return (
      <section className="intakeSection">
        <div className="intakeIntro">
          <p>{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <span>{section.text}</span>
          {section.buttonLabel ? <a className="primaryButton sectionCta" href={section.buttonHref || "/get-started#intake"}>{section.buttonLabel}</a> : null}
        </div>
      </section>
    );
  }

  return null;
}

function SettingsPanel({
  activeSection,
  activeEditorPage,
  activePageSection,
  content,
  updateContent,
  uploadImage,
}: {
  activeSection: SectionKey;
  activeEditorPage: EditorPageKey;
  activePageSection: SectionKey;
  content: SiteContent;
  updateContent: (updater: (current: SiteContent) => SiteContent) => void;
  uploadImage: (file: File, onUploaded: (url: string) => void) => void;
}) {
  if (activeEditorPage !== "home") {
    if (activePageSection === "nav") {
      return <GlobalMenuSettings content={content} updateContent={updateContent} />;
    }

    return (
      <PageSettings
        activePageSection={activePageSection}
        content={content}
        pageKey={activeEditorPage}
        updateContent={updateContent}
        uploadImage={uploadImage}
      />
    );
  }

  if (activeSection === "nav") {
    return <GlobalMenuSettings content={content} updateContent={updateContent} />;
  }

  return (
    <div className="settingsPanel">
      <div className="settingsHeader">
        <p>Settings</p>
        <h2>{sections.find((section) => section.key === activeSection)?.label}</h2>
      </div>
      {activeSection === "business" ? (
        <>
          <TextInput label="Phone" value={content.business.phone} onChange={(value) => updateContent((current) => ({ ...current, business: { ...current.business, phone: value } }))} />
          <TextInput label="Address" value={content.business.address} onChange={(value) => updateContent((current) => ({ ...current, business: { ...current.business, address: value } }))} />
          <TextInput label="Footer name" value={content.business.footerName} onChange={(value) => updateContent((current) => ({ ...current, business: { ...current.business, footerName: value } }))} />
          <Repeater
            title="Stats"
            items={content.stats}
            onAdd={() => updateContent((current) => ({ ...current, stats: [...current.stats, { icon: "✓", value: "New", label: "Stat" }] }))}
            onRemove={(index) => updateContent((current) => ({ ...current, stats: current.stats.filter((_, itemIndex) => itemIndex !== index) }))}
            render={(item, index) => (
              <>
                <TextInput label="Icon" value={item.icon} onChange={(value) => updateContent((current) => ({ ...current, stats: updateAt(current.stats, index, { ...item, icon: value }) }))} />
                <TextInput label="Value" value={item.value} onChange={(value) => updateContent((current) => ({ ...current, stats: updateAt(current.stats, index, { ...item, value }) }))} />
                <TextInput label="Label" value={item.label} onChange={(value) => updateContent((current) => ({ ...current, stats: updateAt(current.stats, index, { ...item, label: value }) }))} />
              </>
            )}
          />
        </>
      ) : null}

      {activeSection === "hero" ? (
        <>
          <TextInput label="Title" value={content.hero.title} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, title: value } }))} />
          <TextInput label="Accent line" value={content.hero.accent} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, accent: value } }))} />
          <TextArea label="Intro text" value={content.hero.text} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, text: value } }))} />
          <TextArea label="Badges, one per line" value={content.hero.badges.join("\n")} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, badges: value.split("\n").filter(Boolean) } }))} />
          <TextInput label="Primary button" value={content.hero.primaryButton} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, primaryButton: value } }))} />
          <TextInput label="Secondary button" value={content.hero.secondaryButton} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, secondaryButton: value } }))} />
        </>
      ) : null}

      {activeSection === "media" ? (
        <>
          <UploadInput label="Logo" value={content.assets.logo} onChange={(value) => updateContent((current) => ({ ...current, assets: { ...current.assets, logo: value } }))} onUpload={uploadImage} />
          <UploadInput label="Hero video URL" value={content.assets.heroVideo} onChange={(value) => updateContent((current) => ({ ...current, assets: { ...current.assets, heroVideo: value } }))} onUpload={uploadImage} />
          <UploadInput label="Contact image" value={content.assets.contact} onChange={(value) => updateContent((current) => ({ ...current, assets: { ...current.assets, contact: value } }))} onUpload={uploadImage} />
        </>
      ) : null}

      {activeSection === "problems" ? (
        <ImageTextSettings
          eyebrow={content.problems.eyebrow}
          title={content.problems.title}
          items={content.problems.items}
          onHeaderChange={(eyebrow, title) => updateContent((current) => ({ ...current, problems: { ...current.problems, eyebrow, title } }))}
          onItemsChange={(items) => updateContent((current) => ({ ...current, problems: { ...current.problems, items } }))}
          uploadImage={uploadImage}
        />
      ) : null}

      {activeSection === "steps" ? (
        <ImageTextSettings
          eyebrow={content.steps.eyebrow}
          title={content.steps.title}
          items={content.steps.items}
          onHeaderChange={(eyebrow, title) => updateContent((current) => ({ ...current, steps: { ...current.steps, eyebrow, title } }))}
          onItemsChange={(items) => updateContent((current) => ({ ...current, steps: { ...current.steps, items } }))}
          uploadImage={uploadImage}
        >
          <TextInput label="Section button" value={content.steps.button} onChange={(value) => updateContent((current) => ({ ...current, steps: { ...current.steps, button: value } }))} />
        </ImageTextSettings>
      ) : null}

      {activeSection === "difference" ? (
        <ImageTextSettings
          eyebrow={content.difference.eyebrow}
          title={content.difference.title}
          items={content.difference.items}
          onHeaderChange={(eyebrow, title) => updateContent((current) => ({ ...current, difference: { ...current.difference, eyebrow, title } }))}
          onItemsChange={(items) => updateContent((current) => ({ ...current, difference: { ...current.difference, items } }))}
          uploadImage={uploadImage}
        />
      ) : null}

      {activeSection === "trainers" ? (
        <>
          <TextInput label="Eyebrow" value={content.trainers.eyebrow} onChange={(value) => updateContent((current) => ({ ...current, trainers: { ...current.trainers, eyebrow: value } }))} />
          <TextInput label="Title" value={content.trainers.title} onChange={(value) => updateContent((current) => ({ ...current, trainers: { ...current.trainers, title: value } }))} />
          <Repeater
            title="Trainers"
            items={content.trainers.items}
            onAdd={() => updateContent((current) => ({ ...current, trainers: { ...current.trainers, items: [...current.trainers.items, { name: "New Trainer", role: "Personal Trainer", image: defaultCdnImages.trainer }] } }))}
            onRemove={(index) => updateContent((current) => ({ ...current, trainers: { ...current.trainers, items: current.trainers.items.filter((_, itemIndex) => itemIndex !== index) } }))}
            render={(item, index) => (
              <>
                <TextInput label="Name" value={item.name} onChange={(value) => updateContent((current) => ({ ...current, trainers: { ...current.trainers, items: updateAt(current.trainers.items, index, { ...item, name: value }) } }))} />
                <TextInput label="Role" value={item.role} onChange={(value) => updateContent((current) => ({ ...current, trainers: { ...current.trainers, items: updateAt(current.trainers.items, index, { ...item, role: value }) } }))} />
                <UploadInput label="Photo" value={item.image} onChange={(value) => updateContent((current) => ({ ...current, trainers: { ...current.trainers, items: updateAt(current.trainers.items, index, { ...item, image: value }) } }))} onUpload={uploadImage} />
              </>
            )}
          />
        </>
      ) : null}

      {activeSection === "benefits" ? (
        <Repeater
          title="Benefits"
          items={content.benefits}
          onAdd={() => updateContent((current) => ({ ...current, benefits: [...current.benefits, { title: "New Benefit", text: "Benefit text." }] }))}
          onRemove={(index) => updateContent((current) => ({ ...current, benefits: current.benefits.filter((_, itemIndex) => itemIndex !== index) }))}
          render={(item, index) => (
            <>
              <TextInput label="Title" value={item.title} onChange={(value) => updateContent((current) => ({ ...current, benefits: updateAt(current.benefits, index, { ...item, title: value }) }))} />
              <TextArea label="Text" value={item.text} onChange={(value) => updateContent((current) => ({ ...current, benefits: updateAt(current.benefits, index, { ...item, text: value }) }))} />
            </>
          )}
        />
      ) : null}

      {activeSection === "testimonials" ? (
        <>
          <TextInput label="Eyebrow" value={content.testimonials.eyebrow} onChange={(value) => updateContent((current) => ({ ...current, testimonials: { ...current.testimonials, eyebrow: value } }))} />
          <TextInput label="Title" value={content.testimonials.title} onChange={(value) => updateContent((current) => ({ ...current, testimonials: { ...current.testimonials, title: value } }))} />
          <Repeater
            title="Testimonials"
            items={content.testimonials.items}
            onAdd={() => updateContent((current) => ({ ...current, testimonials: { ...current.testimonials, items: [...current.testimonials.items, { name: "New Client", text: "Client quote." }] } }))}
            onRemove={(index) => updateContent((current) => ({ ...current, testimonials: { ...current.testimonials, items: current.testimonials.items.filter((_, itemIndex) => itemIndex !== index) } }))}
            render={(item, index) => (
              <>
                <TextInput label="Name" value={item.name} onChange={(value) => updateContent((current) => ({ ...current, testimonials: { ...current.testimonials, items: updateAt(current.testimonials.items, index, { ...item, name: value }) } }))} />
                <TextArea label="Quote" value={item.text} onChange={(value) => updateContent((current) => ({ ...current, testimonials: { ...current.testimonials, items: updateAt(current.testimonials.items, index, { ...item, text: value }) } }))} />
              </>
            )}
          />
        </>
      ) : null}

      {activeSection === "contact" ? (
        <>
          <TextInput label="Heading" value={content.contact.title} onChange={(value) => updateContent((current) => ({ ...current, contact: { ...current.contact, title: value } }))} />
          <TextArea label="Text" value={content.contact.text} onChange={(value) => updateContent((current) => ({ ...current, contact: { ...current.contact, text: value } }))} />
          <TextInput label="Button" value={content.contact.button} onChange={(value) => updateContent((current) => ({ ...current, contact: { ...current.contact, button: value } }))} />
          <TextInput label="Success message" value={content.contact.success} onChange={(value) => updateContent((current) => ({ ...current, contact: { ...current.contact, success: value } }))} />
          <UploadInput label="Contact image" value={content.assets.contact} onChange={(value) => updateContent((current) => ({ ...current, assets: { ...current.assets, contact: value } }))} onUpload={uploadImage} />
        </>
      ) : null}

      {activeSection === "footer" ? (
        <>
          <TextInput label="Footer name" value={content.business.footerName} onChange={(value) => updateContent((current) => ({ ...current, business: { ...current.business, footerName: value } }))} />
          <TextInput label="Newsletter title" value={content.footer.newsletterTitle} onChange={(value) => updateContent((current) => ({ ...current, footer: { ...current.footer, newsletterTitle: value } }))} />
          <TextArea label="Newsletter text" value={content.footer.newsletterText} onChange={(value) => updateContent((current) => ({ ...current, footer: { ...current.footer, newsletterText: value } }))} />
        </>
      ) : null}
    </div>
  );
}

function ImageTextSettings({
  eyebrow,
  title,
  items,
  onHeaderChange,
  onItemsChange,
  uploadImage,
  children,
}: {
  eyebrow: string;
  title: string;
  items: SiteContent["problems"]["items"];
  onHeaderChange: (eyebrow: string, title: string) => void;
  onItemsChange: (items: SiteContent["problems"]["items"]) => void;
  uploadImage: (file: File, onUploaded: (url: string) => void) => void;
  children?: ReactNode;
}) {
  return (
    <>
      <TextInput label="Eyebrow" value={eyebrow} onChange={(value) => onHeaderChange(value, title)} />
      <TextInput label="Title" value={title} onChange={(value) => onHeaderChange(eyebrow, value)} />
      {children}
      <Repeater
        title="Cards"
        items={items}
        onAdd={() => onItemsChange([...items, { title: "New Card", text: "", image: defaultCdnImages.card }])}
        onRemove={(index) => onItemsChange(items.filter((_, itemIndex) => itemIndex !== index))}
        render={(item, index) => (
          <>
            <TextInput label="Title" value={item.title} onChange={(value) => onItemsChange(updateAt(items, index, { ...item, title: value }))} />
            <TextArea label="Text" value={item.text || ""} onChange={(value) => onItemsChange(updateAt(items, index, { ...item, text: value }))} />
            <UploadInput label="Image" value={item.image} onChange={(value) => onItemsChange(updateAt(items, index, { ...item, image: value }))} onUpload={uploadImage} />
          </>
        )}
      />
    </>
  );
}

function GlobalMenuSettings({
  content,
  updateContent,
}: {
  content: SiteContent;
  updateContent: (updater: (current: SiteContent) => SiteContent) => void;
}) {
  return (
    <div className="settingsPanel">
      <div className="settingsHeader">
        <p>Global Navigation</p>
        <h2>Menus & Buttons</h2>
      </div>

      <section className="editorRepeater">
        <div className="repeaterTitle">
          <h3>Main site pages</h3>
        </div>
        {pageKeys.map((key) => {
          const page = content.pages[key];
          return (
            <div className="menuPageFields" key={key}>
              <TextInput
                label={`${page.navLabel || key} menu label`}
                value={page.navLabel}
                onChange={(value) => updateContent((current) => ({
                  ...current,
                  pages: {
                    ...current.pages,
                    [key]: { ...current.pages[key], navLabel: value },
                  },
                }))}
              />
              <TextInput
                label={`${page.navLabel || key} URL`}
                value={page.path}
                onChange={(value) => updateContent((current) => ({
                  ...current,
                  pages: {
                    ...current.pages,
                    [key]: { ...current.pages[key], path: value },
                  },
                }))}
              />
            </div>
          );
        })}
      </section>

      <section className="editorRepeater">
        <div className="repeaterTitle">
          <h3>Header / footer button</h3>
        </div>
        <TextInput
          label="Button label"
          value={content.menuButton.label}
          onChange={(value) => updateContent((current) => ({ ...current, menuButton: { ...current.menuButton, label: value } }))}
        />
        <TextInput
          label="Button link"
          value={content.menuButton.href}
          onChange={(value) => updateContent((current) => ({ ...current, menuButton: { ...current.menuButton, href: value } }))}
        />
      </section>

      <LinkRepeater title="Homepage section menu" items={content.nav} onChange={(items) => updateContent((current) => ({ ...current, nav: items }))} />
      <LinkRepeater title="Important footer links" items={content.footer.importantLinks} onChange={(items) => updateContent((current) => ({ ...current, footer: { ...current.footer, importantLinks: items } }))} />
      <LinkRepeater title="Quick footer links" items={content.footer.quickLinks} onChange={(items) => updateContent((current) => ({ ...current, footer: { ...current.footer, quickLinks: items } }))} />
    </div>
  );
}

function PageSettings({
  activePageSection,
  content,
  pageKey,
  updateContent,
  uploadImage,
}: {
  activePageSection: SectionKey;
  content: SiteContent;
  pageKey: PageKey;
  updateContent: (updater: (current: SiteContent) => SiteContent) => void;
  uploadImage: (file: File, onUploaded: (url: string) => void) => void;
}) {
  const page = content.pages[pageKey];
  const selectedSectionIndex = page.sections.findIndex((section) => section.id === activePageSection);
  const selectedSection = selectedSectionIndex >= 0 ? page.sections[selectedSectionIndex] : null;

  function updatePage(updater: (page: SiteContent["pages"][PageKey]) => SiteContent["pages"][PageKey]) {
    updateContent((current) => ({
      ...current,
      pages: {
        ...current.pages,
        [pageKey]: updater(current.pages[pageKey]),
      },
    }));
  }

  function addSection(type: PageSection["type"]) {
    const next: PageSection = {
      id: `${type}-${Date.now()}`,
      type,
      eyebrow: type === "features" ? "Phoenix Fitness" : "New Section",
      title: type === "intake" ? "Build your starting point" : "New section title",
      text: type === "intake" ? "Use this intake to help your trainer understand your goals." : "Section text goes here.",
      image: defaultSectionImage(type),
      items: type === "features" || type === "process"
        ? [{ title: "New item", text: "Item text goes here.", image: defaultSectionImage(type) }]
        : undefined,
    };

    updatePage((currentPage) => ({
      ...currentPage,
      sections: [...currentPage.sections, next],
    }));
  }

  function duplicateSection(index: number) {
    updatePage((currentPage) => {
      const section = currentPage.sections[index];
      if (!section) return currentPage;
      const copy: PageSection = {
        ...section,
        id: `${section.type}-${Date.now()}`,
        title: `${section.title} Copy`,
        items: section.items ? section.items.map((item) => ({ ...item })) : undefined,
      };
      return {
        ...currentPage,
        sections: [
          ...currentPage.sections.slice(0, index + 1),
          copy,
          ...currentPage.sections.slice(index + 1),
        ],
      };
    });
  }

  function moveSection(index: number, direction: -1 | 1) {
    updatePage((currentPage) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= currentPage.sections.length) return currentPage;
      const sections = [...currentPage.sections];
      const [section] = sections.splice(index, 1);
      sections.splice(nextIndex, 0, section);
      return { ...currentPage, sections };
    });
  }

  return (
    <div className="settingsPanel">
      <div className="settingsHeader">
        <p>Page Settings</p>
        <h2>{activePageSection === "hero" ? `${page.navLabel} Hero` : selectedSection?.title || page.navLabel}</h2>
      </div>

      <TextInput label="Navigation label" value={page.navLabel} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, navLabel: value }))} />
      <TextInput label="Path" value={page.path} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, path: value }))} />

      {activePageSection === "hero" ? (
        <section className="editorRepeater">
          <div className="repeaterTitle">
            <h3>Hero</h3>
          </div>
          <TextInput label="Eyebrow" value={page.hero.eyebrow} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, eyebrow: value } }))} />
          <TextInput label="Title" value={page.hero.title} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, title: value } }))} />
          <TextArea label="Text" value={page.hero.text} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, text: value } }))} />
          <UploadInput label="Hero image" value={page.hero.image} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, image: value } }))} onUpload={uploadImage} />
          <UploadInput label="Hero video URL" value={page.hero.video || ""} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, video: value } }))} onUpload={uploadImage} />
          <TextInput label="Primary button" value={page.hero.primaryButton || ""} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, primaryButton: value } }))} />
          <TextInput label="Primary button link" value={page.hero.primaryHref || ""} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, primaryHref: value } }))} />
          <TextInput label="Secondary button" value={page.hero.secondaryButton || ""} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, secondaryButton: value } }))} />
          <TextInput label="Secondary button link" value={page.hero.secondaryHref || ""} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, hero: { ...currentPage.hero, secondaryHref: value } }))} />
        </section>
      ) : null}

      <section className="editorRepeater">
        <div className="repeaterTitle">
          <h3>Add reusable section</h3>
        </div>
        <div className="sectionAddGrid">
          {(["split", "features", "process", "trainers", "intake"] as PageSection["type"][]).map((type) => (
            <button type="button" key={type} onClick={() => addSection(type)}>
              {type}
            </button>
          ))}
        </div>
      </section>

      {selectedSection ? (
        <section className="editorRepeater">
          <div className="repeaterTitle">
            <h3>Selected section</h3>
            <button
              type="button"
              onClick={() => updatePage((currentPage) => ({ ...currentPage, sections: currentPage.sections.filter((_, itemIndex) => itemIndex !== selectedSectionIndex) }))}
            >
              Remove
            </button>
          </div>
          <>
            <div className="sectionTools">
              <button type="button" onClick={() => moveSection(selectedSectionIndex, -1)} disabled={selectedSectionIndex === 0}>Move up</button>
              <button type="button" onClick={() => moveSection(selectedSectionIndex, 1)} disabled={selectedSectionIndex === page.sections.length - 1}>Move down</button>
              <button type="button" onClick={() => duplicateSection(selectedSectionIndex)}>Duplicate</button>
            </div>
            <TextInput label="Section ID" value={selectedSection.id} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, id: value }) }))} />
            <select
              aria-label="Section type"
              value={selectedSection.type}
              onChange={(event) => updatePage((currentPage) => ({
                ...currentPage,
                sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, type: event.target.value as PageSection["type"] }),
              }))}
            >
              <option value="split">Split image/text</option>
              <option value="features">Feature grid</option>
              <option value="process">Process steps</option>
              <option value="trainers">Trainer grid</option>
              <option value="intake">Intake form</option>
            </select>
            <TextInput label="Eyebrow" value={selectedSection.eyebrow} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, eyebrow: value }) }))} />
            <TextInput label="Title" value={selectedSection.title} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, title: value }) }))} />
            <TextArea label="Text" value={selectedSection.text} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, text: value }) }))} />
            {selectedSection.type === "split" || selectedSection.type === "intake" ? (
              <UploadInput label="Section image" value={selectedSection.image} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, image: value }) }))} onUpload={uploadImage} />
            ) : null}
            <UploadInput label="Section video URL" value={selectedSection.video || ""} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, video: value }) }))} onUpload={uploadImage} />
            <TextInput label="Button label" value={selectedSection.buttonLabel || ""} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, buttonLabel: value }) }))} />
            <TextInput label="Button link" value={selectedSection.buttonHref || ""} onChange={(value) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, buttonHref: value }) }))} />
            {selectedSection.type === "split" ? (
              <>
                <label className="toggleField">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedSection.reverse)}
                    onChange={(event) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, reverse: event.target.checked }) }))}
                  />
                  <span>Reverse image and text</span>
                </label>
              </>
            ) : null}
            {selectedSection.type === "features" || selectedSection.type === "process" ? (
              <ImageTextRepeaterInline
                items={selectedSection.items || []}
                onChange={(items) => updatePage((currentPage) => ({ ...currentPage, sections: updateAt(currentPage.sections, selectedSectionIndex, { ...selectedSection, items }) }))}
                uploadImage={uploadImage}
                showImages
              />
            ) : null}
          </>
        </section>
      ) : null}
    </div>
  );
}

function ImageTextRepeaterInline({
  items,
  onChange,
  uploadImage,
  showImages,
}: {
  items: PageSection["items"];
  onChange: (items: NonNullable<PageSection["items"]>) => void;
  uploadImage: (file: File, onUploaded: (url: string) => void) => void;
  showImages: boolean;
}) {
  const safeItems = items || [];

  return (
    <Repeater
      title="Items"
      items={safeItems}
      getLabel={(item, index) => `${index + 1}. ${item.title}`}
      onAdd={() => onChange([...safeItems, { title: "New item", text: "Item text.", image: defaultCdnImages.card }])}
      onRemove={(index) => onChange(safeItems.filter((_, itemIndex) => itemIndex !== index))}
      render={(item, index) => (
        <>
          <TextInput label="Item title" value={item.title} onChange={(value) => onChange(updateAt(safeItems, index, { ...item, title: value }))} />
          <TextArea label="Item text" value={item.text || ""} onChange={(value) => onChange(updateAt(safeItems, index, { ...item, text: value }))} />
          {showImages ? (
            <UploadInput label="Item image" value={item.image} onChange={(value) => onChange(updateAt(safeItems, index, { ...item, image: value }))} onUpload={uploadImage} />
          ) : null}
        </>
      )}
    />
  );
}

function LinkRepeater({
  title,
  items,
  onChange,
}: {
  title: string;
  items: SiteContent["nav"];
  onChange: (items: SiteContent["nav"]) => void;
}) {
  return (
    <Repeater
      title={title}
      items={items}
      onAdd={() => onChange([...items, { label: "New Link", href: "#" }])}
      onRemove={(index) => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
      render={(item, index) => (
        <>
          <TextInput label="Label" value={item.label} onChange={(value) => onChange(updateAt(items, index, { ...item, label: value }))} />
          <TextInput label="Href" value={item.href} onChange={(value) => onChange(updateAt(items, index, { ...item, href: value }))} />
        </>
      )}
    />
  );
}

function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="leadTable">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Message</th>
            <th>Intake Details</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{new Date(lead.created_at).toLocaleString()}</td>
              <td>{lead.name}</td>
              <td>{lead.phone}</td>
              <td><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
              <td>{lead.message}</td>
              <td>
                <LeadDetails details={lead.details} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!leads.length ? <p>No leads captured yet.</p> : null}
    </div>
  );
}

function LeadDetails({ details }: { details?: Record<string, unknown> }) {
  if (!details || !Object.keys(details).length) {
    return <span>No intake details</span>;
  }

  const labels: Record<string, string> = {
    goals: "Goals",
    motivation: "Goal outcome",
    trainingHistory: "Fitness background",
    healthHistory: "Health history",
    injuries: "Injuries or limitations",
    availability: "Availability",
    preferredStart: "Preferred start",
    weeklySessions: "Sessions per week",
    trainingPreference: "Training preference",
    nutritionSupport: "Nutrition support",
    supplements: "Supplements",
    biggestObstacle: "Consistency obstacle",
    readiness: "Readiness",
    trainerNotes: "Trainer notes",
    contactName: "Contact name",
    contactPhone: "Contact phone",
    contactEmail: "Contact email",
  };
  const order = [
    "goals",
    "motivation",
    "trainingHistory",
    "healthHistory",
    "injuries",
    "availability",
    "preferredStart",
    "weeklySessions",
    "trainingPreference",
    "nutritionSupport",
    "supplements",
    "biggestObstacle",
    "readiness",
    "trainerNotes",
    "contactName",
    "contactPhone",
    "contactEmail",
  ];
  const orderedEntries = [
    ...order.filter((key) => key in details).map((key) => [key, details[key]] as [string, unknown]),
    ...Object.entries(details).filter(([key]) => !order.includes(key)),
  ];

  return (
    <div className="leadDetails">
      {orderedEntries.map(([key, value]) => (
        <p key={key}>
          <strong>{labels[key] || key.replace(/([A-Z])/g, " $1")}: </strong>
          {Array.isArray(value) ? value.join(", ") : String(value || "Not answered")}
        </p>
      ))}
    </div>
  );
}

function Repeater<T>({
  title,
  items,
  render,
  onAdd,
  onRemove,
  getLabel,
}: {
  title: string;
  items: T[];
  render: (item: T, index: number) => ReactNode;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  getLabel?: (item: T, index: number) => string;
}) {
  return (
    <section className="editorRepeater">
      <div className="repeaterTitle">
        <h3>{title}</h3>
        {onAdd ? <button type="button" onClick={onAdd}>Add</button> : null}
      </div>
      {items.map((item, index) => {
        const label = getLabel ? getLabel(item, index) : `Item ${index + 1}`;
        return (
        <details className="editorItem" data-item-label={label} key={index} open={index === 0}>
          <summary>
            <span>{label}</span>
            {onRemove ? (
              <button type="button" onClick={(event) => { event.preventDefault(); onRemove(index); }}>
                Remove
              </button>
            ) : null}
          </summary>
          {render(item, index)}
        </details>
        );
      })}
    </section>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="adminField" data-field-label={label}>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="adminField" data-field-label={label}>
      <span>{label}</span>
      <textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function UploadInput({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File, onUploaded: (url: string) => void) => void;
}) {
  return (
    <div className="adminUpload">
      <TextInput label={label} value={value} onChange={onChange} />
      {value && isVideoUrl(value) ? <video src={value} controls playsInline /> : null}
      {value && !isVideoUrl(value) ? <img src={value} alt="" /> : null}
      <input
        aria-label={`Upload ${label}`}
        type="file"
        accept="image/*,video/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onUpload(file, onChange);
          }
        }}
      />
    </div>
  );
}
