'use client';

import { api } from "@/convex/_generated/api"
import { useAction } from "convex/react"
import { get } from "http";
import React from "react";

export default function Page({ params }: { params: { symbol: string } }) {
    const getBasicStats = useAction(api.quote.getBasicStats);
    const [stats, setStats] = React.useState(null);
    
    getBasicStats({ ticker: params.symbol }).then(setStats);
    return <div>
        <h2>Symbol: {params.symbol}</h2>
        {stats && <pre>{JSON.stringify(stats, null, 2)}</pre>}
    </div>

  }