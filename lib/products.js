/**
 * Product data for product detail pages.
 * Keys are URL slugs (e.g. cloudfish, tidesync).
 */
export const PRODUCT_PAGES = {
  cloudfish: {
    name: 'CloudFish',
    tagline: 'Streamline operations with intelligent cloud workflows.',
    logo: '/cloudfish/cloudfish-logo.png',
    description:
      'CloudFish is our prompt-powered, agentic query tool designed to eliminate the complexity of Oracle Cloud databases. Built with 30 years of Oracle DNA, CloudFish empowers your team to bypass complex SQL and manual data modeling through a natural language interface that talks directly to your HCM and ERP records. Whether you are analyzing workforce trends or financial metrics, our AI-driven digital coworkers execute end-to-end data tasks—delivering clear, actionable insights and instant exports with fewer clicks.',
    gradient: 'from-aqua to-aqua-light',
    heroSlides: [
      { title: 'Stop Writing SQL. Start Querying with REST API. Only on CloudFish', image: '/cloudfish/oracle-fusion-hcm-rest-apis.png' },
      { title: 'Oracle Cloud Workforce Reports and Analytics in one single place.', image: '/cloudfish/oracle-hcm-workforce.png' },
      { title: 'No Multi layer Technical Maze – No Table Hunting.', image: '/cloudfish/bi-publisher-easy-reporting-combined.png' },
      { title: 'REST, SQL & JSON with CloudFish', image: '/cloudfish/cloudfish-rest-sql-json-ords.png' },
      { title: 'Maximum Features. Minimal Cost. Run Direct Database Queries with Three Distinct Query Methods', image: '/cloudfish/cloudfish-all-in-one-platform-funky.png' },
    ],
    ctaLoginHref: 'https://cloudfish-frontend-5802cd04746c.herokuapp.com/login',
    ctaTrialHref: '/#contact',
    appPreview: {
      title: 'CloudFish For You',
      subtitle: 'Connections, DB Browser, worksheets, and query results—all in one place.',
      image: '/cloudfish/cloudfish-for-you.png',
      ctaLabel: 'Open CloudFish',
      ctaHref: 'https://cloudfish-frontend-5802cd04746c.herokuapp.com/',
    },
    features: {
      title: 'Features',
      subtitle: 'Everything you need to query Oracle Cloud without the hassle.',
      items: [
        { icon: '⚡', title: 'HCM REST Resource & SQL (ORDS / custom endpoint)', badge: 'Only in CloudFish', description: 'Run HCM REST resources and SQL together—including ORDS and custom endpoints—in one tool. No other tool offers this.', highlight: true },
        { icon: '🔐', title: 'Single Sign-On (SSO)', badge: 'Enterprise', description: 'Enterprise customers can use Single Sign-On—one login for your identity provider and CloudFish. Secure, seamless access for your team. Simply create an SSO connection in CloudFish, and when you connect, your organization\'s login window will handle authentication.', highlight: true },
        { icon: '☁️', title: 'Web-based, No Need To Download and install', description: 'Access from anywhere. No client extensions or downloads.' },
        { icon: '🔌', title: 'SQL in Oracle Cloud', description: 'Run SQL against Oracle Cloud data—HCM, ERP, SCM, PPM—with one tool.' },
        { icon: '🌐', title: 'Multiple connections', description: 'Connect to several cloud instances at once and switch between them easily. Create Multiple Connections and rename them as you wish.' },
        { icon: '📊', title: 'Export to Excel & CSV, DAT AND PDF formats', description: 'Export results to .xls and .csv for reports and analysis.' },
        { icon: '🔍', title: 'DB Browser – packages & code', description: 'See all packages in the database and open any package to view its code. Browse Fusion tables and build queries with full visibility.' },
        { icon: '📋', title: 'Search tables & columns, click to copy', description: 'Search all available tables with column names. Click a table name and it copies straight into the query editor.' },
        { icon: '🤖', title: 'AI Assistant to build query in natural language', description: 'Describe what you need in plain English and get SQL generated for Oracle Cloud tables—no syntax memorization required.', highlight: true },
        { icon: '✨', title: 'Intellisense & Formatting', description: 'Smart editor with auto-completion, SQL formatting, and code snippets.' },
        { icon: '📜', title: 'SQL History', description: 'CloudFish keeps all your queries for ready reference. Every query you run is automatically saved in your history, so you can always go back and find it.' },
        { icon: '💬', title: 'Clear Oracle error messages', description: 'Get clear, readable Oracle error messages so you can fix issues faster and code with less guesswork.' },
      ],
    },
  },
  tidesync: {
    name: 'TideSync',
    tagline: 'Unified data and workflows across your Oracle Cloud ecosystem.',
    logo: '/tidesync-product-logo.png',
    description:
      'TideSync unifies data and workflows across your Oracle Cloud ecosystem. Keep HCM, ERP, and analytics in sync with automated pipelines, consistent security, and a single pane of glass. Reduce integration overhead and get a unified view of your Oracle landscape so your team can focus on decisions, not data wrangling.',
    gradient: 'from-teal to-teal-sea',
  },
};

export function getProductBySlug(slug) {
  return PRODUCT_PAGES[slug] ?? null;
}

export function getAllProductSlugs() {
  return Object.keys(PRODUCT_PAGES);
}
