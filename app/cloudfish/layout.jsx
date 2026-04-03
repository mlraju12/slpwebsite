/** Title defaults for CloudFish flows; tab icon uses site-wide /logo.png from root layout. */
export const metadata = {
  title: {
    default: 'CloudFish',
    template: '%s | CloudFish',
  },
};

export default function CloudFishSectionLayout({ children }) {
  return children;
}
