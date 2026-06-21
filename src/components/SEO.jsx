import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/siteConfig';

const BASE_URL = 'https://dema-stai-attahdzib.firebaseapp.com';

export default function SEO({ title, description, image, url }) {
  const siteName = siteConfig.demaName;
  const pageTitle = title ? `${title} | ${siteName}` : `${siteConfig.heroTitle} | ${siteName}`;
  const desc = description || siteConfig.heroSubtitle;
  const img = image || `${BASE_URL}/logo/logo_dema_126.webp`;
  const path = url || '/';

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={`${BASE_URL}${path}`} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
