import MainBanner from "../assets/components/MainBanner/MainBanner";
import HomeCategories from "../assets/components/Categories/HomeCategories";
import PromoBanner from "../assets/components/PromotionsSection/PromoBanner";
import ProductSections from "../assets/components/ProductSections/ProductSections";
import BackToTopButton from "../assets/components/BackToTopButton/BackToTopButton";


function Home() {
  return (
    <>
      <MainBanner />
      <HomeCategories/>
      <PromoBanner />
      <ProductSections />
      <BackToTopButton />
     
    </>
  );
}

export default Home;