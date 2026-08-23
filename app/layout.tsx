import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Ethiopic, Righteous } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Stand-in for TAN Nimbus on the hero word. It sits behind the licensed face in
// the --font-hero stack (see globals.css), so dropping the real file into
// public/fonts retires it without touching any component.
const righteous = Righteous({
  variable: '--font-righteous',
  subsets: ['latin'],
  weight: ['400'],
});

// Carries the Amharic greeting. Without it the browser falls back to whatever
// Ethiopic face the OS ships, which on Windows is noticeably heavier than the
// Latin type beside it.
const ethiopic = Noto_Sans_Ethiopic({
  variable: '--font-ethiopic',
  subsets: ['ethiopic'],
  weight: ['400', '600', '700'],
});

const TITLE = 'Zemenay | Melkam Addis Amet';
const DESCRIPTION =
  'A new year note from Zemenay to the partners we built alongside this year.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    siteName: 'Zemenay',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

// themeColor belongs on `viewport`. The metadata field of the same name has
// been deprecated since Next 14 and is ignored.
export const viewport: Viewport = {
  themeColor: '#001A47',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${righteous.variable} ${ethiopic.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
