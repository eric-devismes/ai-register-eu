export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BrowseByIndustry from "@/components/home/BrowseByIndustry";
import StatsBar from "@/components/home/StatsBar";
import FeaturedSystems from "@/components/home/FeaturedSystems";
import RegulatoryFrameworks from "@/components/home/RegulatoryFrameworks";
import HowItWorks from "@/components/home/HowItWorks";
import CtaSection from "@/components/home/CtaSection";
import NewsFeed from "@/components/home/NewsFeed";
import { getPageMetadata, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "home");
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <NewsFeed />
        <BrowseByIndustry locale={locale} />
        <StatsBar />
        <FeaturedSystems locale={locale} />
        <RegulatoryFrameworks locale={locale} />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
