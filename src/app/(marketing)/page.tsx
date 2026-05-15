import { Hero } from '@/components/marketing/Hero';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { ServiceList } from '@/components/marketing/ServiceList';
import { CallToAction } from '@/components/marketing/CallToAction';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { listFeaturedServices, listFaqs } from '@/server/services/catalog';

export const revalidate = 600;

export default async function HomePage() {
  const [services, faqs] = await Promise.all([listFeaturedServices(), listFaqs()]);

  return (
    <>
      <Hero />
      <FeatureGrid />
      <ServiceList
        services={services.map((s) => ({
          id: s.id,
          slug: s.slug,
          nameVi: s.nameVi,
          shortVi: s.shortVi,
          basePriceVnd: s.basePriceVnd,
          isFeatured: s.isFeatured,
        }))}
      />
      <FaqAccordion items={faqs.map((f) => ({ id: f.id, questionVi: f.questionVi, answerVi: f.answerVi }))} />
      <CallToAction />
    </>
  );
}
