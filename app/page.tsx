import Image from "next/image";
import SearchBox from "./SearchBox";
import Searches from "./Searches";

export default function Home() {
  return (
    <main className="min-h-screen place-content-center grid">
      <h1 className="mb-6 justify-center flex">Stockton</h1>
      <SearchBox />
      <Searches />
    </main>
  );
}
