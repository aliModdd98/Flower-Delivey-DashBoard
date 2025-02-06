import SectionTitle from "../SectionTitle/SectionTitle";
import TextDetail from "../textDetail";

const HomeAboutUs = () => {
  return (
    <div className="aj-story">
      <div className="flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="w-full md:w-1/2 border md:border-b-0 border-t-0 md:border-t md:border-t-[#121212] border-[#121212] px-4 py-10 md:p-[80px]">
          <SectionTitle title="About us" />
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 flex flex-col">
          <TextDetail
            subTitle="out story"
            title="Kyiv LuxeBouquets"
            text="We are a modern local floral studio, which specializes in the design and
              delivery of unique bouquets. We have the best florists who carefully
              select each look, our studio cooperates directly with farms for growing
              different flowers, so we always have fresh flowers, which are collected
              by our florists in exquisite bouquets. We have a collection of fresh
              bouquets, collections of dried bouquets, house plants, as well as
              fragrant candles from luxury brands to create the perfect atmosphere.
              Make someone's day amazing by sending flowers, plants and gifts the same
              or next day. Ordering flowers online has never been easier."
            button="learn more"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeAboutUs;
