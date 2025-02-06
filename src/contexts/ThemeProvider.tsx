import { useLocalStorage } from "@mantine/hooks";
import { createContext, PropsWithChildren, useLayoutEffect } from "react";

export const ThemeContext = createContext<{
  toggleTheme: () => void;
  theme: "dark" | "light" | null;
}>({
  toggleTheme: () => {},
  theme: null,
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean | undefined>({
    key: "theme",
    defaultValue: true
  });
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  };
  useLayoutEffect(() => {
    const isDark = JSON.parse(localStorage.getItem("theme") ?? "null") as
      | boolean
      | null;
    const isPreferDarkTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (isDark == null) {
      document.documentElement.classList.toggle("dark", isPreferDarkTheme);
      setIsDarkMode(isPreferDarkTheme);
    } else if (isDark) {
      document.documentElement.classList.toggle("dark", isDark);
      setIsDarkMode(isDark);
    }
  }, [setIsDarkMode]);

  const theme = isDarkMode ? "dark" : "light";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
