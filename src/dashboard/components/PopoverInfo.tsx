import { Info } from 'lucide-react';
import { useState } from 'react';

const PopoverInfo = ({title,text}:{title?:string,text?:string}) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  return (
    <div className="relative cursor-pointer">
      {/* Button */}
      <Info className='text-[#2196F3]' onClick={() => setIsPopoverVisible(!isPopoverVisible)}/>

      {/* Popover */}
      {isPopoverVisible && (
        <div
        role="tooltip"
        className="absolute z-10 inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600"> 
      <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
            <h3 className="text-center font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="px-3 py-2 text-center">
            <p>{text}</p>
        </div>
        <div data-popper-arrow></div>
    </div>

      
      )}
    </div>
  );
};

export default PopoverInfo
