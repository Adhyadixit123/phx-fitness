import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSiteContent } from "./lib/db";
import GlobalHeader from "./components/GlobalHeader";

export const metadata: Metadata = {
  title: "Phoenix Fitness",
  description: "Private, certified 1-on-1 personal training in Milltown, NJ.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const googleTagId = content.tracking.googleTagId.trim();
  const facebookPixelId = content.tracking.facebookPixelId.trim();

  return (
    <html lang="en">
      <body>
        {googleTagId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} strategy="afterInteractive" />
            <Script id="google-tag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleTagId}');
              `}
            </Script>
          </>
        ) : null}
        {facebookPixelId ? (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        ) : null}
        <GlobalHeader content={content} />
        {children}
      </body>
    </html>
  );
}
