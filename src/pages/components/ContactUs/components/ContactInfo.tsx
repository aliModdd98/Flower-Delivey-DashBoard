interface ContactInfoProps {
  img1: string;
  img2: string;
  text1: string;
  text2: string;
  title: string;
}

const ContactInfo = ({ img1, img2, text1, text2, title }: ContactInfoProps) => {
  return (
    <div className="aj-phone flex flex-col">
      <h2 className="text-[26px] md:text-[38px] text-start pl-4 leading-[31.2px] md:leading-[45.6px] font-medium md:font-bold border border-black border-r-0 py-4 md:text-center">
        {title}
      </h2>
      <ul className="flex-grow flex flex-col pl-4 justify-center md:items-center py-10 md:py-0 gap-4 md:gap-6 border border-black border-t-0 border-r-0 leading-[19.2px]">
        <li className="flex items-center gap-2 leading-[19.2px]">
          <img src={img1} alt="" />
          {text1}
        </li>
        <li className="flex items-center gap-2 leading-[19.2px]">
          <img src={img2} />
          {text2}
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;
