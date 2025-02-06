import * as Dialog from "@radix-ui/react-dialog";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface FaqProps {
    question : string;
    answer : string;
}

export const FaqItem : React.FC<FaqProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-b border-textPrimaryColor">
        <Dialog.Trigger className="w-full">
          <div className="flex items-center justify-between py-4 cursor-pointer">
            <span className="text-[16px] md:text-[21px] lg:text-[28px] font-normal  text-textPrimaryColor">
              {question}
            </span>
            <div className="text-gray-500">
              {isOpen ? (
                <ArrowUpRight size={"24px"} />
              ) : (
                <ArrowDownRight size={"24px"} />
              )}
            </div>
          </div>
        </Dialog.Trigger>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pb-4">
            <p className="text-faq text-base font-normal">{answer}</p>
          </motion.div>
        )}
      </div>
    </Dialog.Root>
  );
};
