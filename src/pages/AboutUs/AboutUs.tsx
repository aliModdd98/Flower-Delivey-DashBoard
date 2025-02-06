import AboutUsHero from "./components/AboutUsHero";
import BouquetsPromoSection from "./components/BouquetsPromoSection";
import BusinessOverview from "./components/BusinessOverview";
import OurStorySection from "./components/OurStorySection";

const businessOverviewData = [
  {
    title: "Expertly Crafted Bouquets",
    pargraph:
      "At Kyiv LuxeBouquets, we take pride in our team of talented and experienced florists who carefully select each bloom, ensuring that only the freshest and most stunning flowers make it into our bouquets. We work directly with farms to source the highest quality flowers, and our skilled florists expertly craft each bouquet to perfection.",
    imgPath: "/assets/images/Rectangle 74.jpg",
  },
  {
    title: "Bouquets, Gifts & Ambiance",
    pargraph:
      "In addition to our stunning bouquets, we also offer a collection of dried bouquets, house plants, and fragrant candles from luxury brands to create the perfect ambiance. We believe that sending flowers, plants, and gifts should be easy and stress-free, which is why we offer same or next-day delivery throughout Kyiv.",
    imgPath: "/assets/images/Rectangle 75.jpg",
    reverse: true,
  },
  {
    title: "Making Every Day Special",
    pargraph:
      "Our mission is simple: to make every day special and memorable for our customers. We are dedicated to providing the highest quality flowers, exceptional customer service, and a seamless online experience that will make you feel confident and satisfied with your purchase.Thank you for choosing Kyiv LuxeBouquets. We look forward to bringing joy and happiness to your life with our beautiful bouquets and gifts.",
    imgPath: "/assets/images/Rectangle 76.jpg",
  },
];

const AboutUsPage = () => {
  return (
    <>
      <AboutUsHero />

      <OurStorySection />

      {businessOverviewData.map((el, index) => {
        return <BusinessOverview key={index} {...el} />;
      })}

      <BouquetsPromoSection />
    </>
  );
};

export default AboutUsPage;
