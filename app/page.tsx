"use client";
import SearchBox from "./SearchBox";
import Searches from "./Searches";
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export default function Home() {
  const { user } = useUser();
  return (
    <div>
      <header>
        <Unauthenticated><SignInButton mode="modal" /></Unauthenticated>
        <Authenticated>
          <span className="px-1">{user?.primaryEmailAddress?.emailAddress}</span>
          <SignOutButton />
          </Authenticated>
        <AuthLoading>Loading...</AuthLoading>
      </header>    
      <main className="min-h-screen place-content-center grid">
        <h1 className="mb-6 justify-center flex">Stockton</h1>
        <SearchBox />
        <Searches />
      </main>
    </div>
  );
}
