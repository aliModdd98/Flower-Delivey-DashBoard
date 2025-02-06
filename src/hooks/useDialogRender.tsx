import { useSearchParams } from "react-router-dom";
import { EnumsDialogShow, EnumsSearchParams } from "../types/global";
import VerificationDialog from "../components/auth/VerificationDialog";
import LoginFormDialog from "../components/auth/LoginFormDialog";
import RegisterFormDialog from "../components/auth/RegisterFormDialog";
import ForgotPasswordDialog from "../components/auth/ForgotPasswordDialog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDialogRenderer = (user: any) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const closeAllDialog = () => {
    setSearchParams(
      (prevParams) => {
        prevParams.delete(EnumsSearchParams.dialog);
        return prevParams;
      },
      { replace: true }
    );
  };

  const dialogType = searchParams.get(EnumsSearchParams.dialog);

  const renderDialog = () => {
    if (
      dialogType === EnumsDialogShow.Login &&
      (!localStorage.getItem("token") ||
        localStorage.getItem("token") === "undefined")
    ) {
      return <LoginFormDialog isOpen={true} handleClose={closeAllDialog} />;
    }

    if (dialogType === EnumsDialogShow.SignUp) {
      return <RegisterFormDialog isOpen={true} handleClose={closeAllDialog} />;
    }

    if (dialogType === EnumsDialogShow.ForgotPassowrd) {
      return (
        <ForgotPasswordDialog isOpen={true} handleClose={closeAllDialog} />
      );
    }

    if (
      dialogType === EnumsDialogShow.Verify &&
      ((localStorage.getItem("user") !== "undefined" &&
        JSON.parse(localStorage.getItem("user") ?? "{}")?.isAccountVerified ===
          false) ||
        user?.isAccountVerified === false)
    ) {
      return <VerificationDialog isOpen={true} handleClose={closeAllDialog} />;
    }

    return null; // No dialog to show
  };

  return { renderDialog };
};
