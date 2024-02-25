'use client';
// component rendering a search box
import React from 'react';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function SearchBox() {
    const [search, setSearch] = React.useState("");
    const updateSearch = useMutation(api.search.updateSearch);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearch(event.currentTarget.value);
    }
    // submit handler for the form
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        console.log(`Search for ${search}`);
        updateSearch({ text: search });

        // get quote data - await response
        const quoteResponse = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_ACTIONS_URL}/quote?ticket=${search}`);
        const quoteData = await quoteResponse.json();
        console.log(quoteData);
        setSearch("");

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="search"
            placeholder="AAPL, TSLA, etc."
            value={search}
            onChange={handleChange} 
            className="w-full p-2 text-black"/>
        <button type="submit" className="w-full rounded border-2 p-2">Search</button>
        </form>
    );
}
