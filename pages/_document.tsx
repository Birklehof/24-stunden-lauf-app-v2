import { Html, Head, Main, NextScript } from "next/document";
import Menu from "../components/Menu";

export default function Document() {
  return (
    <Html lang="de">
      <Head />
      <body className="max-h-screen overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
