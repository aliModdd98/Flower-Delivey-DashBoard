import { Link } from "react-router-dom";

export function LoginPrompt() {
  return (
    <div className="bg-[#E9E9E9] p-4 mb-8">
      <p className="text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Log in
        </Link>{" "}
        for faster checkout
      </p>
    </div>
  );
}
