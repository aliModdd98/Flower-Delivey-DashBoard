import { Link } from "react-router-dom";

interface TextContentProps {
  subTitle: string;
  title: string;
  text: string;
  button: string;
  white?: boolean;
}

const TextContent = ({ subTitle, title, text, button, white }: TextContentProps) => {
  let buttonStyle;
  if(white) {
    buttonStyle = "flex justify-center items-center leading-[19.2px] w-full md:w-[180px] h-[56px] border border-white tracking-[0.03em] uppercase";
  } else {
    buttonStyle = "flex justify-center items-center leading-[19.2px] w-full md:w-[180px] h-[56px] border border-[#121212] tracking-[0.03em] uppercase";
  }

  return (
    <div className="flower-container px-4 py-[51px] md:py-[80px] w-full md:w-[77.78%] flex flex-col justify-center items-center">
      <h4 className="text-sm leading-[16.8px] mb-6">{subTitle}</h4>
      <h2 className="text-[34px] md:text-[50px] text-center leading-[60px] font-semibold mb-4">
        {title}
      </h2>
      <p className="text-lg leading-[25.2px] max-w-[586px] mb-[64px] text-center">
        {text}
      </p>
      <Link to={"/subscribe"} className={buttonStyle}>
        {button}
      </Link>
    </div>
  );
};

export default TextContent;
