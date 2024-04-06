'use client';
import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Searches() {
    const searches = useQuery(api.search.get, {});
    return (
        <ul className="space-y-1 py-2">
             {searches?.map(({ _id, text, search_count, price }) => (
                <li key={_id}><div><a href={`/quote/${text.toUpperCase()}`}>{text.toUpperCase()}</a> searched {search_count} time(s) - last price is {price == null ? "unknown" : `$${price}`}</div></li>
            ))}
        </ul>
    );
}