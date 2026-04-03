/** Tab icon + defaults for CloudFish flows (login, purchase, signup, thank-you). */
export const metadata = {
  title: {
    default: 'CloudFish',
    template: '%s | CloudFish',
  },
  icons: {
    icon: [{ url: '/cloudfish-button-logo.png', type: 'image/png' }],
    shortcut: '/cloudfish-button-logo.png',
    apple: '/cloudfish-button-logo.png',
  },
};

export default function CloudFishSectionLayout({ children }) {
  return children;
}
