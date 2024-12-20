import "./globals.css";

import { Playground } from "@/components/playground";
import { IndexdbProvider } from "@/components/indexdb-provider";

export default function Home() {
  return (
    <IndexdbProvider>
      <Playground />
    </IndexdbProvider>
  );
}
