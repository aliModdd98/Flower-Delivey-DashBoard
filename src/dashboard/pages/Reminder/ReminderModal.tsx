import { X } from "lucide-react";
import { useState } from "react";
import { sendReminder } from "../../../store/slices/reminderSlice";
import { useReduxDispatch } from "../../../store/store";
import { Textarea } from "../../components/textarea";

interface DeleteModalProps {
  onClose: () => void;
}

const ReminderModal: React.FC<DeleteModalProps> = ({ onClose }) => {
  const [festivalName, setfestivalName] = useState<string>("");
  const [festivalDate, setfestivalDate] = useState<string>("");
  const [subject, setsubject] = useState<string>("");
  const [text, settext] = useState<string>("");

  const dispatch = useReduxDispatch();

  const onSend = (): void => {
    console.log("Sending reminder", festivalName, festivalDate, subject, text);
    // const data = {
    //   festivalName,
    //   festivalDate,
    //   subject,
    //   text,
    // };
    dispatch(sendReminder());
    onClose();
  };

  return (
    <div className="fixed dark:text-white inset-0 px-6 z-50 flex justify-center items-center deleteModale bg-black bg-opacity-50 backdrop-blur-[10px]">
      <div
        className="bg-[#020817] rounded-xl py-5 lg:w-[40%] border md:w-[75%] w-[100%]  px-3 flex flex-col"
        style={{
          boxShadow: "2px 5px 10px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex justify-between ">
          <h1 className="text-2xl text-white font-semibold mb-3">Reminder</h1>
          <button className="self-start" onClick={onClose}>
            <X />
          </button>
        </div>
        <h1 className="mb-5">Enter the event you want to remind users</h1>
        <div>
          <input
            onChange={(e) => setfestivalName(e.target.value)}
            type="text"
            placeholder="Event Name"
            className="border border-gray-600 bg-black text-white rounded w-full p-2 mb-3"
          />
          <input
            onChange={(e) => setsubject(e.target.value)}
            type="text"
            placeholder="Subject"
            className="border border-gray-600 bg-black text-white rounded w-full p-2 mb-3"
          />

          <Textarea
            onChange={(e) => settext(e.target.value)}
            placeholder="Text"
            required
            className="h-52 border border-gray-600 bg-black text-white rounded w-full p-2 mb-3"
          />
          <input
            onChange={(e) => setfestivalDate(e.target.value)}
            type="text"
            placeholder="0000-00-00"
            className="border border-gray-600 bg-black text-white rounded w-full p-2 mb-3"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 hover:bg-primary transition  h-[50px] text-white font-medium text-center rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            className="px-4 h-[50px] bg-primary text-white font-medium text-center rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
