import { whyChooseUsData } from "../../data/whyChooseUsData";
import ContactUs from "../components/ContactUs/ContactUs";
import Hero from "../components/Hero/Hero";
import HomeAboutUs from "../components/HomeAboutUs/HomeAboutUs";
import OurClientsSay from "../components/OurClientsSay/OurClientsSay";
import OurService from "../components/OurService/OurService";
import StepsExplanation from "../components/StepsExplanation/StepsExplanation";

const Home = () => {
  return (
    <div className=" w-screen">
      <Hero />
      <HomeAboutUs />
      <StepsExplanation textArray={whyChooseUsData} />
      <ContactUs />
      <OurService />
      <OurClientsSay />
    </div>
  );
};

export default Home;
