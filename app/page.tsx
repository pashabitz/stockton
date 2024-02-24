import Image from "next/image";
import SearchBox from "./SearchBox";
import Searches from "./Searches";

export default function Home() {
  return (
    <main className="min-h-screen">
      <h1>Stockton</h1>
      <SearchBox />
      <Searches />
    </main>
  );
}
