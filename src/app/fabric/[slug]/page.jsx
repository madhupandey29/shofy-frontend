import Wrapper       from '@/layout/wrapper';
import HeaderTwo     from '@/layout/headers/header-2';
import Footer        from '@/layout/footers/footer';
import ProductClient from './ProductDetailsClient';

export const revalidate = 600;

function apiHeaders() {
  return {
    'x-api-key'    : process.env.NEXT_PUBLIC_API_KEY,
    'Content-Type' : 'application/json',
    'x-admin-email': process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  };
}

const firstNonEmpty = (...v) => v.find(x => x != null && x !== '');

export async function generateMetadata({ params }) {
  // ✅ Next.js 15: params is async
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${slug}`,
    { headers: apiHeaders(), next: { revalidate } }
  );

  if (!res.ok) {
    return { title: 'Product not found', description: '' };
  }

  const payload = await res.json();
  const product = Array.isArray(payload.data) ? payload.data[0] : payload.data;

  const siteURL   = process.env.NEXT_PUBLIC_SITE_URL || '';
  const canonical = `${siteURL}/fabric/${slug}`;

  const title = firstNonEmpty(
    product.seoTitle,
    product.name,
    product.title,
    slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  );

  const description = firstNonEmpty(
    product.seoDescription,
    product.productdescription,
    ''
  );

  const image = firstNonEmpty(
    product.seoImage,
    product.img,
    product.image1,
    product.image2
  );

  const keywords = firstNonEmpty(
    product.seoKeywords,
    product.tags?.join(', '),
    product.category?.name
  );

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: image ? [{ url: image }] : [],
      locale: 'en_US',
      siteName: 'AGE Fabrics',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    other: {
      robots: 'index,follow',
      'theme-color': '#ffffff',
    },
  };
}

export default async function Page({ params }) {
  // ✅ Next.js 15: params is async
  const { slug } = await params;

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <ProductClient slug={slug} />
      <Footer primary_style />
    </Wrapper>
  );
}
