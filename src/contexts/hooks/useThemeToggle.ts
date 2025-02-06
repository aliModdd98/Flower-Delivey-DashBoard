import { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";

export const useThemeToggle = () => useContext(ThemeContext);
