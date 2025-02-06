import { FaqItem } from "../FaqItem/FaqItem";

const SubscriptionFAQ = () => {
  const faqData = [
    {
      question: "How often will I get a new bouquet?",
      answer:
        "Our subscriptions allow you to select a delivery frequency that best suits your needs - either weekly, bi-weekly, or monthly. You can also choose the number of deliveries for your subscription. Choose any combination that works for you!",
    },
    {
      question: "Can i send subscription like as a gift ?",
      answer:
        "Yes! Our flower subscriptions make perfect gifts. You can specify a different delivery address and include a gift message with your subscription order.",
    },
    {
      question: "Can I choose which bouquet I get ?",
      answer:
        "While our expert florists curate each bouquet based on the season's freshest flowers, you can specify your color preferences and flower types when setting up your subscription.",
    },
    {
      question: "Can I change the shipping address ?",
      answer:
        "Yes, you can update your shipping address at any time through your account settings. Changes must be made at least 48 hours before your next scheduled delivery.",
    },
    {
      question: "What day will the subscription bouquet come?",
      answer:
        "During checkout, you can select your preferred delivery day. We deliver Tuesday through Saturday, and you can modify your delivery day through your account settings.",
    },
    {
      question: "Can I suspend my subscription to flowers ?",
      answer:
        "Yes, you can pause your subscription at any time through your account. The pause can be temporary (like for a vacation) or indefinite until you're ready to resume.",
    },
  ];

  return (
    <div className="py-20 bg-extraLight">
      <div className="w-full md:w-[688px] lg:w-[864px] bg-white p-10 lg:p-20  border border-textPrimaryColor mx-auto">
        <h2 className="text-[50px] font-semibold text-center mb-10">
          Subscription FAQ
        </h2>
        <div className="">
          {faqData.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default SubscriptionFAQ;