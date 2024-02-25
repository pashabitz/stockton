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
        <form onSubmit={handleSubmit}>
        <input
            type="search"
            placeholder="Search for stocks"
            value={search}
            onChange={handleChange} />
        <button type="submit">Search</button>
        </form>
    );
}
