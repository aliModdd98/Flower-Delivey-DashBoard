import { X } from "lucide-react";

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: (id: string) => void;
  id: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  onClose,
  onConfirm,
  id,
}) => {
  return (
    <div className="fixed dark:text-white inset-0 px-6 z-50 flex justify-center items-center deleteModale bg-black bg-opacity-50 backdrop-blur-[10px]">
      <div
        className=" rounded-xl py-5 lg:w-[40%] border md:w-[75%] w-[100%]  px-3 flex flex-col"
        style={{
          boxShadow: "2px 5px 10px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex justify-between ">
          <h1 className="text-2xl font-semibold mb-3">
            Delete
          </h1>
          <button className="self-start" onClick={onClose}>
            <X />
          </button>
        </div>
        <h1 className="mb-5">Are you sure you want to delete?</h1>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 hover:bg-primary transition  h-[50px] font-medium text-center rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(id)}
            className="px-4 h-[50px] bg-primary  font-medium text-center rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
