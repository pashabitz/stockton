'use client';
import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Searches() {
    const searches = useQuery(api.search.get, {});
    return (
        <ul>
             {searches?.map(({ _id, text, search_count }) => (
                <li key={_id}><div>{text} searched {search_count} time(s)</div></li>
            ))}
        </ul>
    );
}