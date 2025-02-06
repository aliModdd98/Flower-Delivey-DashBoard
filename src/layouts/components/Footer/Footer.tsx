import { useState } from "react";
import { FaInstagram } from "react-icons/fa6";
import { ImPinterest2 } from "react-icons/im";
import { PiTelegramLogo } from "react-icons/pi";
import { SlSocialFacebook, SlSocialTwitter } from "react-icons/sl";
import {
  addReminder,
  removeReminder,
} from "../../../store/slices/reminderSlice";
import { useReduxDispatch, useReduxSelector } from "../../../store/store";

const Footer = () => {
  const [, setemail] = useState<string>("");
  const user = useReduxSelector((state) => state.auth.user);

  const isReminder = user ? user.isReminder : false;
  console.log(isReminder);
  const dispatch = useReduxDispatch();
  const handleOnReminderClick = () => {
    dispatch(addReminder());
  };
  const handleOnRemoveReminder = () => {
    dispatch(removeReminder());
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-textPrimaryColor">
      <div className="space-y-6 border-b md:border-r lg:border-r p-6 md:p-10 border-textPrimaryColor">
        <p className="font-normal text-textPrimaryColor">
          Remember to offer beautiful flowers from Kyiv LuxeBouquets Valentines
          Day, Mothers Day, Christmas... Reminds you 7 days before. No spam or
          sharing your address.
        </p>
        <div className="space-y-4">
          <input
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="Your Email"
            className="w-full py-3 md:py-5 text-sm font-medium px-4 border border-gray-300 text-textSecondrayColor"
          />
          {isReminder ? (
            <button
              onClick={handleOnRemoveReminder}
              className="w-full bg-textPrimaryColor font-medium text-white py-3 md:py-5 px-4"
            >
              Remove Reminder
            </button>
          ) : (
            <button
              onClick={handleOnReminderClick}
              className="w-full bg-textPrimaryColor font-medium text-white py-3 md:py-5 px-4"
            >
              REMIND
            </button>
          )}
        </div>
      </div>
      <div className="space-y-6 border-b lg:border-r p-6 md:p-10 border-textPrimaryColor">
        <h3 className="text-lg md:text-xl text-textSecondrayColor font-medium">
          Contact Us
        </h3>
        <div>
          <p className="font-normal mb-2 text-textSecondrayColor text-sm">
            Address
          </p>
          <p className="font-medium">15/4 Khreshchatyk Street, Kyiv</p>
        </div>
        <div>
          <p className="font-normal mb-2 text-textSecondrayColor text-sm">
            Phone
          </p>
          <p className="font-medium">+380980099777</p>
        </div>
        <div>
          <p className="font-normal mb-2 text-textSecondrayColor text-sm">
            General Enquiry:
          </p>
          <p className="font-medium">Kiev.Florist.Studio@gmail.com</p>
        </div>
        <div className="space-y-6 text-sm">
          <h3 className="text-lg md:text-xl text-textSecondrayColor font-medium">
            Follow Us
          </h3>
          <div className="flex space-x-6">
            <FaInstagram size={"24px"} className="cursor-pointer" />
            <ImPinterest2 size={"24px"} className="cursor-pointer" />
            <SlSocialFacebook size={"24px"} className="cursor-pointer" />
            <SlSocialTwitter size={"24px"} className="cursor-pointer" />
            <PiTelegramLogo size={"24px"} className="cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="space-y-6 border-b md:border-r lg:border-r p-6 md:p-10 border-textPrimaryColor">
        <h3 className="text-lg md:text-xl text-textSecondrayColor font-medium">
          Shop
        </h3>
        <ul className="font-medium">
          {[
            "All Products",
            "Fresh Flowers",
            "Dried Flowers",
            "Live Plants",
            "Designer Vases",
            "Aroma Candles",
            "Freshener Diffuser",
          ].map((item) => (
            <li
              key={item}
              className="hover:underline text-textPrimaryColor mb-2 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
        <h3 className="text-lg md:text-xl text-textSecondrayColor font-medium">
          Service
        </h3>
        <ul className="font-medium">
          {["Flower Subcription", "Wedding & Event Decor"].map((item) => (
            <li
              key={item}
              className="hover:underline text-textPrimaryColor mb-2 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-6 p-6 md:p-10 border-b lg:border-r border-textPrimaryColor">
        <h3 className="text-lg md:text-xl text-textSecondrayColor font-medium">
          About Us
        </h3>
        <ul className="font-medium">
          {["Our story", "Blog"].map((item) => (
            <li
              key={item}
              className="hover:underline text-textPrimaryColor mb-2 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
        <ul className="font-medium">
          {["Shipping & returns", "Terms & conditions", "Privacy policy"].map(
            (item) => (
              <li
                key={item}
                className="hover:underline text-textPrimaryColor mb-2 cursor-pointer"
              >
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default Footer;
