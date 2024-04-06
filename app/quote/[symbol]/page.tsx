'use client';

import { api } from "@/convex/_generated/api"
import { useAction, useQuery } from "convex/react"
import { get } from "http";
import React, { useEffect, useState } from "react";

export default function Page({ params }: { params: { symbol: string } }) {
    const refresh = useAction(api.quote.refreshBasicStatsIfStale);
    useEffect(() => {
        refresh({ ticker: params.symbol });
    }, []);
    const symbol = useQuery(api.symbol.get, { symbol: params.symbol });
    return <div>
        <h1>{params.symbol.toUpperCase()}</h1>
        {symbol && symbol.stats && 
        <table>
            <tbody>
            {Object.keys(symbol.stats.metric).map((m: string) => <tr key={m}>
                <th>{m}</th>
                <th>{symbol.stats.metric[m]}</th>
            </tr>)}
            </tbody>
        </table>
        }
    </div>

  }