import FlowerImage from "./../../../../assets/flower-subscription.jpg";
import TextContent from "./TextContent";

const FlowerSubscription = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="left-part border border-[#121212]">
        <img src={FlowerImage} alt="woman with flowers" className="w-full" />
      </div>
      <div className="right-part flex justify-center border-y border-black">
        <TextContent
          subTitle="service"
          title="Flower Subcriptions"
          text="Experience the convenience and savings of regular flower deliveries with our flexible subscription service - up to 30% more profitable than one-time purchases."
          button="Subscribe Now"
        />
      </div>
    </div>
  );
};

export default FlowerSubscription;
