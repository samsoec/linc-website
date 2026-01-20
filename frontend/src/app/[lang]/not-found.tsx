import { Metadata } from "next";
import NotFoundContent from "./components/NotFoundContent";
import NavbarThemeSetter from "./components/NavbarThemeSetter";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <NavbarThemeSetter theme="white" />
      <NotFoundContent />
    </>
  );
}
