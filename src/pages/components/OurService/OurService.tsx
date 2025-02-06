import SectionTitle from "../SectionTitle/SectionTitle";
import FlowerSubscription from "./components/FlowerSubscription";
import Wedding from "./components/Wedding";

const OurService = () => {
  return (
    <div className="our-service">
      <div className="border md:border-b-0 border-t-0 md:border-t border-[#121212] px-4 py-10 md:p-[80px]">
        <SectionTitle title="Our Service" />
      </div>
      <FlowerSubscription />
      <Wedding />
    </div>
  );
};

export default OurService;
