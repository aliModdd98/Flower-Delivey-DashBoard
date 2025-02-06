import instaSvg from "../../../../src/assets/svg-icons/insta.svg";
import pinterestSvg from "../../../../src/assets/svg-icons/pinterest.svg";
import facebookSvg from "../../../../src/assets/svg-icons/facebook.svg";
import twitterSvg from "../../../../src/assets/svg-icons/twitter.svg";
import telegramSvg from "../../../../src/assets/svg-icons/telegram.svg";

const socialIconsInfo = [
  { icon: instaSvg, link: "#" },
  { icon: pinterestSvg, link: "#" },
  { icon: facebookSvg, link: "#" },
  { icon: twitterSvg, link: "#" },
  { icon: telegramSvg, link: "#" },
];

const AboutUsHero = () => {
  return (
    <>
      <header className="md:flex text-center">
        <div className="md:w-1/2 h-[619px] md:h-[720px] pt-[117px] md:pt-[167.5px]">
          <h1>
            <span className="font-semibold text-[50px] block text-[#121212]">
              Our Story
            </span>
            <br />
            <div>
              <span className="italic text-[28px] font-[Zapfino] leading-[0px] text-[#121212]">About</span>
              <br />
            </div>
            <span className="font-semibold text-[50px] leading-[60px] text-center text-[#121212]">
              Kyiv LuxeBouquets
            </span>
          </h1>
          <p className="text-[18px] leading-[25.2px] max-w-[513px] mx-auto text-[#121212E5]">
            Discover Uniquely Crafted Bouquets and Gifts for Any Occasion:
            Spread Joy with Our Online Flower Delivery Service
          </p>
          <div className="flex gap-8 pt-16 w-fit mx-auto">
            {socialIconsInfo.map((el, index) => {
              return (
                <a
                  key={index}
                  className="border border-[#121212] rounded-full min-w-12 min-h-12 flex justify-center items-center bg-[bg-[#12121240]"
                  href={el.link}
                >
                  <img src={el.icon} />
                </a>
              );
            })}
          </div>
        </div>
        <div className="md:w-1/2">
          <img
            src="/assets/images/kaboompics_young-architect-woman-portrait-in-her-studio-27905.jpg"
            className="h-[500px] md:h-[720px] w-full object-cover"
          />
        </div>
      </header>
    </>
  );
};

export default AboutUsHero;
