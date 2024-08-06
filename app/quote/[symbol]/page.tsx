'use client';

import { api } from "@/convex/_generated/api"
import { useAction, useQuery } from "convex/react"
import { get } from "http";
import React, { useEffect, useState } from "react";

function formatLargeNumber(num: number): string {
    if (num > 1000000000) {
        return (num / 1000000000).toFixed(2) + "B";
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(2) + "M";
    } else {
        return num.toFixed(2);
    }
};

function formatAsDate(date: string | null): string {
    if (!date) {
        return "N/A";
    }
    var dt = new Date(date);
    return dt.toLocaleDateString();
}

export default function Page({ params }: { params: { symbol: string } }) {
    const refresh = useAction(api.quote.refreshBasicStatsIfStale);
    useEffect(() => {
        refresh({ ticker: params.symbol });
    }, []);
    const fullQuote = useQuery(api.search.getFullQuote, { symbol: params.symbol });
    return <div>
        <h1>{params.symbol.toUpperCase()}</h1>
        {fullQuote ? (
            <table>
                <tbody>
                    <tr><td>Price</td><td>${fullQuote.price}</td></tr>
                    <tr><td>Change %</td><td>{fullQuote.changesPercentage}%</td></tr>
                    <tr><td>Change</td><td>${fullQuote.change}</td></tr>
                    <tr><td>Day Low-High</td><td>${fullQuote.dayLow}-{fullQuote.dayHigh}</td></tr>
                    <tr><td>Year Low-High</td><td>${fullQuote.yearLow}-{fullQuote.yearHigh}</td></tr>
                    <tr><td>Market Cap</td><td>${formatLargeNumber(fullQuote.marketCap)}</td></tr>
                    <tr><td>Price Avg 50</td><td>${fullQuote.priceAvg50}</td></tr>
                    <tr><td>Price Avg 200</td><td>${fullQuote.priceAvg200}</td></tr>
                    <tr><td>Exchange</td><td>{fullQuote.exchange}</td></tr>
                    <tr><td>Volume</td><td>{fullQuote.volume}</td></tr>
                    <tr><td>Avg Volume</td><td>{fullQuote.avgVolume}</td></tr>
                    <tr><td>Open</td><td>${fullQuote.open}</td></tr>
                    <tr><td>Previous Close</td><td>${fullQuote.previousClose}</td></tr>
                    <tr><td>EPS</td><td>${fullQuote.eps}</td></tr>
                    <tr><td>PE</td><td>{fullQuote.pe}</td></tr>
                    <tr><td>Earnings</td><td>{formatAsDate(fullQuote.earningsAnnouncement)}</td></tr>
                    <tr><td>Shares Outstanding</td><td>{formatLargeNumber(fullQuote.sharesOutstanding)}</td></tr>
                </tbody>
            </table>
        ) : (
            <p>Loading...</p>
        )}
    </div>

  }