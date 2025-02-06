const subscribeFeatures = [
  {
    title: "For Yourself",
    pargraph:
      "The perfect way to keep your home fresh and beautiful. Get a regular delivery of stunning bouquets straight to your doorstep without lifting a finger. Enjoy the beauty and fragrance of fresh flowers hassle-free!",
  },
  {
    title: "As a Gift",
    pargraph:
      "Simply provide us with their address and let us take care of the rest, delivering beautiful blooms straight to their doorstep at the frequency and duration of your choosing.",
  },
  {
    title: "For Business",
    pargraph:
      "Is a great way to create a pleasant atmosphere and leave a good impression on your guests and customers. Fresh floral arrangements will improve the aesthetic image of your business, and our service guarantees timely replacement without extra care or effort on your part.",
  },
];

const SubscribeHero = () => {
  return (
    <>
      <header className="md:flex">
        <div className="md:w-1/2">
          <img
            src="/assets/images/image (2).jpg"
            className="h-[500px] md:h-full w-full object-cover"
          />
        </div>
        <div className="md:w-1/2 min-h-[720px] p-20">
          <h1 className="font-semibold text-[50px] pb-6 leading-[60px] text-[#121212] ">
            Flower Subscription
          </h1>
          <div className="flex flex-col	gap-6 pb-[71px]">
            {subscribeFeatures.map((el, index) => {
              return (
                <div key={index}>
                  <h3 className="font-medium text-[16px] leading-[19.2px] text-[#121212] pb-2 relative right-7">
                    {el.title}
                  </h3>
                  <ul className="list-disc">
                    <li className="leading-[22.4px] text-[#121212E5] marker:text-[11px]">
                      {el.pargraph}
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
          <button className="py-[18px] px-6 border border-[#121212] font-medium leading-[19.2px] text-[#121212]">
            EXPLORE PLANS
          </button>
        </div>
      </header>
    </>
  );
};

export default SubscribeHero;
