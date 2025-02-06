import SelectionPlan from "../../Components/PlanSection";
import SubscribeHero from "../../Components/SubscribeHero";
import SubscriptionFAQ from "../../Components/SubscriptionFAQ/SubscriptionFAQ";
import { subscribeData } from "../../data/subscribePageData";
import StepsExplanation from "../components/StepsExplanation/StepsExplanation";

const Subscribe = () => {
  return (
    <div>
      <SubscribeHero />
      <StepsExplanation textArray={subscribeData} />
      <SelectionPlan />
      <SubscriptionFAQ />
    </div>
  );
};

export default Subscribe;
