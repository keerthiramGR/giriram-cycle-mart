import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import BestSellers from '@/components/home/BestSellers';
import RepairCTA from '@/components/home/RepairCTA';

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <CategorySection />
      <BestSellers />
      <RepairCTA />
    </main>
  );
}
