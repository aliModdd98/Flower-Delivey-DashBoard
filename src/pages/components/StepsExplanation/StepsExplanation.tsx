import React from "react";
import SectionTitle from "../SectionTitle/SectionTitle";
import TextDetail from "../textDetail";


interface TextItem {
  title: string;
  text: string;
}

interface StepsExplanationProps {
  textArray: TextItem[];
}

const StepsExplanation: React.FC<StepsExplanationProps> = ({ textArray }) => {
  return (
    <div className="aj-story">
      <div className="flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="w-full md:w-1/2 border md:border-b-0 border-x-0 md:border-r md:border-t border-[#121212] px-4 py-10 md:p-[80px]">
          <SectionTitle title="How does it work?" />
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 flex flex-col">
          {textArray.map((el, index) => (
            <TextDetail
              key={index}
              title={el.title}
              text={el.text}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepsExplanation;
