import React from "react";
import CallBack from "./components/CallBack";
import ContactImg from "./../../../assets/contact-img.jpg";
import { contactImgs } from "./data/contact.imgs";
import ContactInfo from "./components/ContactInfo";
import PhoneImage from "./../../../assets/phone.png";
import locationImage from "./../../../assets/location.png";
const ContactUs: React.FC = () => {
  return (
    <div className="aj-contact-us grid grid-cols-1 lg:grid-cols-2">
      <div className="aj-left-part flex flex-col order-2 lg:order-none">
        <CallBack />
        <div className="grid md:grid-cols-2 text-start flex-grow min-h-[207px]">
          <ContactInfo
            img1={PhoneImage || ""}
            img2={PhoneImage}
            text1="+380980099777"
            text2="+380980099111"
            title="Phone"
          />
          <ContactInfo
            img2={locationImage || ""}
            img1=""
            text1="opening hours: 8 to 11 p.m."
            text2="15/4 Khreshchatyk Street, Kyiv"
            title="Address"
          />
        </div>
      </div>
      <div className="aj-right-part flex flex-col order-1 lg:order-none">
        <div className="img-container flex-grow">
          <img
            src={ContactImg}
            alt="Kyiv LuxeBouquets"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aj-follow p-4 md:p-0 md:flex">
          <p className="w-2/4 mb-4 md:mb-0 md:py-4 text-[26px] leading-[31.2px] md:text-4xl flex items-center = md:justify-center md:border border-[#121212]">
            Follow us
          </p>
          <ul className="flex md:w-2/4 md:justify-center items-center gap-8 md:border border-[#121212]">
            {contactImgs.map((img: string, index: number) => (
              <li key={index} className="flex-shrink-0">
                <a href="#">
                  <img src={img} alt={`Social icon ${index + 1}`} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
