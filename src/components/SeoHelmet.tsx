import { Helmet } from '@dr.pogodin/react-helmet';
import { CONTACT_INFO, COPY, type Lang } from '../data/portfolioData';

interface SeoHelmetProps {
  lang: Lang;
  isNotFound?: boolean;
}

export function SeoHelmet({ lang, isNotFound = false }: SeoHelmetProps) {
  const seo = COPY[lang].seo;
  const notFoundSeo = COPY[lang].notFound;
  const htmlLang = lang === 'en' ? 'en' : 'pt-BR';
  const pageTitle = isNotFound ? notFoundSeo.seoTitle : seo.title;

  const canonicalUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${isNotFound ? '/' : window.location.pathname}`
      : CONTACT_INFO.githubUrl;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: CONTACT_INFO.name,
      alternateName: CONTACT_INFO.handle,
      jobTitle: seo.jobTitle,
      description: seo.description,
      image: CONTACT_INFO.avatarUrl,
      email: `mailto:${CONTACT_INFO.email}`,
      telephone: CONTACT_INFO.whatsappIntl,
      url: canonicalUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'São José do Rio Preto',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
      sameAs: [CONTACT_INFO.githubUrl, CONTACT_INFO.linkedinUrl],
      knowsAbout: [
        'Multi-Tenant API Architecture',
        'Delphi Horse & FMX/VCL',
        'C# .NET',
        'React Native & Expo',
        'TypeScript & React',
        'Firebird SQL',
        'Python & Bash Automation',
      ],
    },
  };

  return (
    <Helmet prioritizeSeoTags>
      <html lang={htmlLang} />
      <title>{pageTitle}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={CONTACT_INFO.name} />
      <meta name="robots" content={isNotFound ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="profile" />
      <meta property="og:site_name" content={seo.siteName} />
      <meta property="og:locale" content={seo.locale} />
      <meta property="og:locale:alternate" content={seo.alternateLocale} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={CONTACT_INFO.avatarUrl} />
      <meta property="og:image:alt" content={seo.imageAlt} />
      <meta property="profile:first_name" content="Andrey" />
      <meta property="profile:last_name" content="Ramos" />
      <meta property="profile:username" content="dreyranos" />

      {/* Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={CONTACT_INFO.avatarUrl} />
      <meta name="twitter:image:alt" content={seo.imageAlt} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
