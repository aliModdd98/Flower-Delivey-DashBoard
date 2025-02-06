// import { useState } from "react";
// import { useReduxDispatch } from "../../../../store/store";
// import {
//   removeContactThunk,
//   toggleContactStatusThunk,
//   Contact,
// } from "../../../../store/slices/contactSlice";
// import { Button } from "../../../components/button";
// import { Trash2, CheckCircle, XCircle } from "lucide-react";

// export const Remove = ({ contactId }: { contactId: string }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useReduxDispatch();

//   const handleRemove = async () => {
//     setIsLoading(true);
//     await dispatch(removeContactThunk(contactId));
//     setIsLoading(false);
//   };

//   return (
//     <Button variant="ghost" onClick={handleRemove} disabled={isLoading}>
//       <Trash2 className="h-4 w-4" />
//     </Button>
//   );
// };

// export const ToggleStatusButton = ({ contact }: { contact: Contact }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useReduxDispatch();

//   const handleToggleStatus = async () => {
//     setIsLoading(true);
//     await dispatch(toggleContactStatusThunk(contact._id));
//     setIsLoading(false);
//   };

//   return (
//     <Button variant="ghost" onClick={handleToggleStatus} disabled={isLoading}>
//       {contact.isChecked ? (
//         <XCircle className="h-4 w-4" />
//       ) : (
//         <CheckCircle className="h-4 w-4" />
//       )}
//     </Button>
//   );
// };
