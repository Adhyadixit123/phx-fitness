"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import type { SiteContent } from "../lib/siteContent";

type Offer = SiteContent["introOffer"];
const storageKey = "phx-intro-offer-v2-seen";

export function OfferContents({ offer, dismiss }: { offer: Offer; dismiss: () => void }) {
  const [failedImage, setFailedImage] = useState("");
  const imageKey = `${offer.image}|${offer.imageMobile}`;
  const hasImage = Boolean(offer.image) && failedImage !== imageKey;
  const href = /^(\/(?!\/)|https?:\/\/|#)/i.test(offer.buttonHref) ? offer.buttonHref : "/get-started#intake";
  return (
    <div className={`offerContent ${hasImage ? "hasImage" : ""}`}>
      {hasImage ? <picture className="offerImage">
        {offer.imageMobile ? <source media="(max-width: 600px)" srcSet={offer.imageMobile} /> : null}
        <img src={offer.image} alt={offer.imageAlt} onError={() => setFailedImage(imageKey)} />
      </picture> : null}
      <button type="button" className="offerClose" aria-label="Close intro offer" onClick={dismiss}>&times;</button>
      <div className="offerCopy">
        <p className="offerEyebrow">{offer.eyebrow}</p>
        <h2 id="intro-offer-title">{offer.title.split(/\s+/).map((word, index) => <span className={word.toLowerCase() === "for" ? "offerConnector" : undefined} key={index}>{word}{" "}</span>)}</h2>
        <p className="offerSubtitle">{offer.subtitle}</p>
        <p className="offerDescription">{offer.description}</p>
        {offer.buttonLabel ? <a className="offerCta" href={href} onClick={dismiss}>{offer.buttonLabel}</a> : null}
        {offer.terms ? <p className="offerTerms">{offer.terms}</p> : null}
        <button type="button" className="offerDismiss" onClick={dismiss}>{offer.dismissLabel || "Close"}</button>
      </div>
    </div>
  );
}

export function offerStyles(offer: Offer): CSSProperties {
  return {
    "--offer-bg": offer.backgroundColor,
    "--offer-text": offer.textColor,
    "--offer-accent": offer.accentColor,
    "--offer-button-text": offer.buttonTextColor,
    "--offer-width": `${Math.max(360, Math.min(1000, offer.desktopWidth || 760))}px`,
    "--offer-mobile-width": `${Math.max(75, Math.min(96, offer.mobileWidth || 94))}vw`,
  } as CSSProperties;
}

export default function IntroOffer({ offer, preview = false, onClose }: { offer: Offer; preview?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!preview && (!offer.enabled || pathname.startsWith("/admin") || pathname.startsWith("/get-started") || (offer.homeOnly && pathname !== "/"))) return;
    try { if (!preview && offer.oncePerSession && sessionStorage.getItem(storageKey)) return; } catch { /* Storage may be blocked. */ }
    const timer = window.setTimeout(() => setOpen(true), preview ? 0 : Math.max(0, Math.min(60, offer.delaySeconds || 0)) * 1000);
    return () => { clearTimeout(timer); setOpen(false); };
  }, [offer.enabled, offer.homeOnly, offer.oncePerSession, offer.delaySeconds, pathname, preview]);

  useEffect(() => {
    if (!open || !dialog.current) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    if (!preview && offer.oncePerSession) {
      try { sessionStorage.setItem(storageKey, "1"); } catch { /* Popup still works without storage. */ }
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, preview, offer.oncePerSession]);

  function dismiss() { dialog.current?.close(); setOpen(false); onClose?.(); }
  if (!open) return null;
  return <dialog ref={dialog} className="introOffer" style={offerStyles(offer)} aria-labelledby="intro-offer-title" onCancel={dismiss} onClick={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
    <OfferContents offer={offer} dismiss={dismiss} />
  </dialog>;
}
