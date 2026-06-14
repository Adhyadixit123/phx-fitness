"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { SiteContent } from "../lib/siteContent";
import { SiteHeader } from "./SiteShell";

export default function GlobalHeader({ content }: { content: SiteContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <SiteHeader content={content} menuOpen={open} onMenuToggle={() => setOpen((current) => !current)} />;
}
