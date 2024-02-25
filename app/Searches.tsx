'use client';
import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Searches() {
    const searches = useQuery(api.search.get, {});
    return (
        <ul>
             {searches?.map(({ _id, text, search_count, price }) => (
                <li key={_id}><div>{text} searched {search_count} time(s) - last price is {price ?? "unknown"}</div></li>
            ))}
        </ul>
    );
}