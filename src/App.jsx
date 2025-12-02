import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, LineChart, Line, Legend, ComposedChart, ReferenceLine
} from 'recharts';
import {
    DollarSign, TrendingUp, ArrowLeft, X, Edit2, Map as MapIcon, BarChart2,
    Home, Save, AlertTriangle, Loader2, Info, Clock, Bus, Star, ArrowRight
} from 'lucide-react';
import { GRANULAR_LOOKUP } from "./all_data.js"

// --- CONFIGURATION ---
const GOOGLE_MAPS_API_KEY = "";

// --- 1. DATASETS ---
const CITY_DATA = [
    {"city": "Toronto", "country": "Canada", "lat": 43.6532, "lng": -79.3832, "pop": 6202225, "rent": 1800, "temp": 9.4, "sun": 305, "rain": 110, "snow": 40, "commute": 34, "weather": "Snowy", "baseIncome": 85000, "baseEmp": 61.5, "transitScore": 85, "workHours": 37.5},
    {"city": "Vancouver", "country": "Canada", "lat": 49.2827, "lng": -123.1207, "pop": 2642825, "rent": 2100, "temp": 10.4, "sun": 289, "rain": 168, "snow": 9, "commute": 30, "weather": "Rainy", "baseIncome": 82000, "baseEmp": 62.0, "transitScore": 80, "workHours": 38},
    {"city": "Montreal", "country": "Canada", "lat": 45.5017, "lng": -73.5673, "pop": 4291732, "rent": 1100, "temp": 6.8, "sun": 305, "rain": 160, "snow": 60, "commute": 30, "weather": "Snowy", "baseIncome": 72000, "baseEmp": 60.5, "transitScore": 82, "workHours": 36},
    {"city": "Calgary", "country": "Canada", "lat": 51.0447, "lng": -114.0719, "pop": 1481806, "rent": 1350, "temp": 4.4, "sun": 333, "rain": 68, "snow": 55, "commute": 27, "weather": "Sunny", "baseIncome": 89000, "baseEmp": 65.0, "transitScore": 60, "workHours": 40},
    {"city": "Edmonton", "country": "Canada", "lat": 53.5461, "lng": -113.4938, "pop": 1418118, "rent": 1250, "temp": 4.2, "sun": 325, "rain": 78, "snow": 60, "commute": 26, "weather": "Sunny", "baseIncome": 86000, "baseEmp": 64.0, "transitScore": 58, "workHours": 40},
    {"city": "Ottawa-Gatineau", "country": "Canada", "lat": 45.4215, "lng": -75.6972, "pop": 1488307, "rent": 1450, "temp": 6.6, "sun": 315, "rain": 120, "snow": 65, "commute": 28, "weather": "Snowy", "baseIncome": 88000, "baseEmp": 63.0, "transitScore": 65, "workHours": 37.5},
    {"city": "Winnipeg", "country": "Canada", "lat": 49.8951, "lng": -97.1384, "pop": 834678, "rent": 1100, "temp": 3.0, "sun": 316, "rain": 75, "snow": 65, "commute": 25, "weather": "Snowy", "baseIncome": 74000, "baseEmp": 61.0, "transitScore": 55, "workHours": 38},
    {"city": "Quebec City", "country": "Canada", "lat": 46.8139, "lng": -71.2080, "pop": 839311, "rent": 1000, "temp": 5.4, "sun": 290, "rain": 140, "snow": 75, "commute": 25, "weather": "Snowy", "baseIncome": 70000, "baseEmp": 60.0, "transitScore": 52, "workHours": 36},
    {"city": "Halifax", "country": "Canada", "lat": 44.6488, "lng": -63.5752, "pop": 465703, "rent": 1400, "temp": 7.5, "sun": 250, "rain": 150, "snow": 35, "commute": 23, "weather": "Varied", "baseIncome": 71000, "baseEmp": 58.0, "transitScore": 50, "workHours": 38},
    {"city": "Kitchener-Waterloo", "country": "Canada", "lat": 43.4516, "lng": -80.4925, "pop": 575847, "rent": 1600, "temp": 7.5, "sun": 295, "rain": 130, "snow": 50, "commute": 26, "weather": "Snowy", "baseIncome": 82000, "baseEmp": 62.0, "transitScore": 55, "workHours": 40},
    {"city": "Hamilton", "country": "Canada", "lat": 43.2557, "lng": -79.8711, "pop": 785184, "rent": 1550, "temp": 8.9, "sun": 300, "rain": 125, "snow": 40, "commute": 29, "weather": "Snowy", "baseIncome": 80000, "baseEmp": 60.0, "transitScore": 60, "workHours": 40},
    {"city": "London", "country": "Canada", "lat": 42.9849, "lng": -81.2453, "pop": 543551, "rent": 1450, "temp": 8.5, "sun": 290, "rain": 135, "snow": 50, "commute": 24, "weather": "Snowy", "baseIncome": 76000, "baseEmp": 59.0, "transitScore": 50, "workHours": 38},
    {"city": "Victoria", "country": "Canada", "lat": 48.4284, "lng": -123.3656, "pop": 397237, "rent": 1700, "temp": 10.8, "sun": 308, "rain": 150, "snow": 5, "commute": 22, "weather": "Rainy", "baseIncome": 78000, "baseEmp": 58.0, "transitScore": 65, "workHours": 36},
    {"city": "Saskatoon", "country": "Canada", "lat": 52.1332, "lng": -106.6700, "pop": 317480, "rent": 1150, "temp": 3.5, "sun": 319, "rain": 70, "snow": 60, "commute": 20, "weather": "Sunny", "baseIncome": 76000, "baseEmp": 64.0, "transitScore": 45, "workHours": 40},
    {"city": "Moncton", "country": "Canada", "lat": 46.0878, "lng": -64.7782, "pop": 157717, "rent": 1050, "temp": 6.1, "sun": 285, "rain": 145, "snow": 65, "commute": 19, "weather": "Snowy", "baseIncome": 70000, "baseEmp": 57.0, "transitScore": 40, "workHours": 38},
    {"city": "New York City", "country": "USA", "lat": 40.7128, "lng": -74.0060, "pop": 8467513, "rent": 3600, "temp": 12.9, "sun": 224, "rain": 122, "snow": 25, "commute": 37, "weather": "Varied", "baseIncome": 75000, "baseEmp": 59.0, "transitScore": 98, "workHours": 44},
    {"city": "Los Angeles", "country": "USA", "lat": 34.0522, "lng": -118.2437, "pop": 3849297, "rent": 2700, "temp": 18.6, "sun": 284, "rain": 35, "snow": 0, "commute": 31, "weather": "Sunny", "baseIncome": 73000, "baseEmp": 60.0, "transitScore": 65, "workHours": 42},
    {"city": "Chicago", "country": "USA", "lat": 41.8781, "lng": -87.6298, "pop": 2696555, "rent": 2000, "temp": 10.5, "sun": 189, "rain": 125, "snow": 28, "commute": 32, "weather": "Windy", "baseIncome": 71000, "baseEmp": 61.0, "transitScore": 85, "workHours": 40},
    {"city": "Houston", "country": "USA", "lat": 29.7604, "lng": -95.3698, "pop": 2288250, "rent": 1450, "temp": 21.0, "sun": 204, "rain": 104, "snow": 0, "commute": 30, "weather": "Humid", "baseIncome": 69000, "baseEmp": 63.0, "transitScore": 45, "workHours": 43},
    {"city": "Phoenix", "country": "USA", "lat": 33.4484, "lng": -112.0740, "pop": 1624569, "rent": 1550, "temp": 23.9, "sun": 299, "rain": 36, "snow": 0, "commute": 26, "weather": "Hot", "baseIncome": 72000, "baseEmp": 61.0, "transitScore": 40, "workHours": 41},
    {"city": "Philadelphia", "country": "USA", "lat": 39.9526, "lng": -75.1652, "pop": 1576251, "rent": 1750, "temp": 13.3, "sun": 205, "rain": 117, "snow": 20, "commute": 33, "weather": "Varied", "baseIncome": 60000, "baseEmp": 58.0, "transitScore": 80, "workHours": 39},
    {"city": "San Antonio", "country": "USA", "lat": 29.4241, "lng": -98.4936, "pop": 1451853, "rent": 1300, "temp": 20.8, "sun": 220, "rain": 80, "snow": 0, "commute": 27, "weather": "Hot", "baseIncome": 64000, "baseEmp": 60.0, "transitScore": 40, "workHours": 41},
    {"city": "San Diego", "country": "USA", "lat": 32.7157, "lng": -117.1611, "pop": 1381611, "rent": 2900, "temp": 17.8, "sun": 266, "rain": 42, "snow": 0, "commute": 26, "weather": "Sunny", "baseIncome": 98000, "baseEmp": 61.0, "transitScore": 55, "workHours": 40},
    {"city": "Dallas", "country": "USA", "lat": 32.7767, "lng": -96.7970, "pop": 1288457, "rent": 1650, "temp": 19.5, "sun": 234, "rain": 80, "snow": 1, "commute": 29, "weather": "Hot", "baseIncome": 70000, "baseEmp": 65.0, "transitScore": 50, "workHours": 44},
    {"city": "Austin", "country": "USA", "lat": 30.2672, "lng": -97.7431, "pop": 964177, "rent": 1700, "temp": 20.5, "sun": 228, "rain": 85, "snow": 1, "commute": 28, "weather": "Sunny", "baseIncome": 86000, "baseEmp": 68.0, "transitScore": 45, "workHours": 45},
    {"city": "San Jose", "country": "USA", "lat": 37.3382, "lng": -121.8863, "pop": 983489, "rent": 3100, "temp": 16.5, "sun": 257, "rain": 62, "snow": 0, "commute": 30, "weather": "Sunny", "baseIncome": 148000, "baseEmp": 66.0, "transitScore": 60, "workHours": 48},
    {"city": "San Francisco", "country": "USA", "lat": 37.7749, "lng": -122.4194, "pop": 815201, "rent": 3300, "temp": 14.6, "sun": 221, "rain": 115, "snow": 0, "commute": 25, "weather": "Foggy", "baseIncome": 139000, "baseEmp": 67.0, "transitScore": 90, "workHours": 46},
    {"city": "Charlotte", "country": "USA", "lat": 35.2271, "lng": -80.8431, "pop": 879709, "rent": 1600, "temp": 15.8, "sun": 259, "rain": 70, "snow": 0, "commute": 34, "weather": "Varied", "baseIncome": 74000, "baseEmp": 64.0, "transitScore": 35, "workHours": 42},
    {"city": "Columbus", "country": "USA", "lat": 39.9612, "lng": -82.9988, "pop": 906528, "rent": 1350, "temp": 11.8, "sun": 175, "rain": 130, "snow": 20, "commute": 24, "weather": "Varied", "baseIncome": 67000, "baseEmp": 63.0, "transitScore": 30, "workHours": 40},
    {"city": "Jacksonville", "country": "USA", "lat": 30.3322, "lng": -81.6557, "pop": 954614, "rent": 1450, "temp": 20.3, "sun": 218, "rain": 110, "snow": 5, "commute": 26, "weather": "Sunny", "baseIncome": 68000, "baseEmp": 60.0, "transitScore": 25, "workHours": 40},
    {"city": "Seattle", "country": "USA", "lat": 47.6062, "lng": -122.3321, "pop": 733919, "rent": 2200, "temp": 11.4, "sun": 152, "rain": 150, "snow": 4, "commute": 32, "weather": "Rainy", "baseIncome": 115000, "baseEmp": 68.0, "transitScore": 85, "workHours": 42},
    {"city": "Denver", "country": "USA", "lat": 39.7392, "lng": -104.9903, "pop": 711463, "rent": 1800, "temp": 10.1, "sun": 245, "rain": 84, "snow": 34, "commute": 28, "weather": "Snowy", "baseIncome": 85000, "baseEmp": 67.0, "transitScore": 60, "workHours": 41},
    {"city": "Washington, D.C.", "country": "USA", "lat": 38.9072, "lng": -77.0369, "pop": 670050, "rent": 2400, "temp": 14.6, "sun": 203, "rain": 115, "snow": 5, "commute": 35, "weather": "Varied", "baseIncome": 101000, "baseEmp": 66.0, "transitScore": 90, "workHours": 43},
    {"city": "Boston", "country": "USA", "lat": 42.3601, "lng": -71.0589, "pop": 654776, "rent": 2600, "temp": 10.8, "sun": 200, "rain": 120, "snow": 22, "commute": 32, "weather": "Varied", "baseIncome": 90000, "baseEmp": 65.0, "transitScore": 85, "workHours": 42},
    {"city": "Nashville", "country": "USA", "lat": 36.1627, "lng": -86.7816, "pop": 692587, "rent": 1700, "temp": 15.3, "sun": 205, "rain": 120, "snow": 3, "commute": 29, "weather": "Humid", "baseIncome": 70000, "baseEmp": 64.0, "transitScore": 30, "workHours": 42},
    {"city": "Las Vegas", "country": "USA", "lat": 36.1699, "lng": -115.1398, "pop": 646790, "rent": 1400, "temp": 20.3, "sun": 310, "rain": 26, "snow": 0, "commute": 26, "weather": "Sunny", "baseIncome": 66000, "baseEmp": 59.0, "transitScore": 40, "workHours": 40},
    {"city": "Portland", "country": "USA", "lat": 45.5152, "lng": -122.6784, "pop": 641162, "rent": 1600, "temp": 12.4, "sun": 144, "rain": 164, "snow": 4, "commute": 27, "weather": "Rainy", "baseIncome": 80000, "baseEmp": 63.0, "transitScore": 70, "workHours": 39},
    {"city": "Oklahoma City", "country": "USA", "lat": 35.4676, "lng": -97.5164, "pop": 687725, "rent": 1100, "temp": 16.1, "sun": 235, "rain": 83, "snow": 5, "commute": 24, "weather": "Sunny", "baseIncome": 60000, "baseEmp": 61.0, "transitScore": 20, "workHours": 41},
    {"city": "El Paso", "country": "USA", "lat": 31.7619, "lng": -106.4850, "pop": 678058, "rent": 1000, "temp": 18.1, "sun": 293, "rain": 45, "snow": 1, "commute": 23, "weather": "Hot", "baseIncome": 59000, "baseEmp": 55.0, "transitScore": 20, "workHours": 40},
    {"city": "Indianapolis", "country": "USA", "lat": 39.7684, "lng": -86.1581, "pop": 882039, "rent": 1200, "temp": 11.3, "sun": 187, "rain": 129, "snow": 20, "commute": 26, "weather": "Varied", "baseIncome": 65000, "baseEmp": 62.0, "transitScore": 30, "workHours": 40},
    {"city": "Fort Worth", "country": "USA", "lat": 32.7555, "lng": -97.3308, "pop": 935508, "rent": 1350, "temp": 19.0, "sun": 229, "rain": 80, "snow": 1, "commute": 29, "weather": "Hot", "baseIncome": 75000, "baseEmp": 64.0, "transitScore": 25, "workHours": 42}
];

const NAT_AVGS = {"Canada": {"inc": 43328.26, "rate": 80.76}, "USA": {"inc": 72389.66, "rate": 74.21}};
const BENCHMARK_LOOKUP = {"Canada": {"Age_Bin": {"18-24": [20000, 78.9], "25-35": [44000, 90.2], "35-45": [57000, 92.2], "45-55": [58000, 92.5], "55+": [40000, 89.5]}, "Edu_Bin": {"College": [46000, 90.4], "Graduate or Above": [69000, 94.2], "High School": [30000, 84.4], "University": [56000, 92.5]}, "Job_Bin": {"Arts & Design": [52000, 94.1], "Business & Office": [130000, 98.3], "Other": [37000, 87.3], "STEM & Technical": [80000, 95.5], "Social Service": [67000, 95.8]}}, "USA": {"Age_Bin": {"18-24": [9500, 87.6], "25-35": [40000, 96.3], "35-45": [50000, 95.6], "45-55": [55000, 96.2], "55+": [29580, 95.7]}, "Edu_Bin": {"College": [40000, 96.3], "Graduate or Above": [84030, 97.4], "High School": [20000, 92.9], "University": [60000, 96.8]}, "Job_Bin": {"Arts & Design": [50000, 94.7], "Business & Office": [80000, 97.5], "Other": [22400, 92.8], "STEM & Technical": [92000, 98.5], "Social Service": [58000, 97.6]}}};

// --- HELPER FUNCTIONS ---
const formatCurrency = (val) => `$${Math.round(val).toLocaleString()}`;

const calculateMetrics = (profile) => {
    if (!profile) return [];

    const isFallback =
        profile.job === "Prefer not to answer" ||
        profile.edu === "Prefer not to answer" ||
        profile.age === "Prefer not to answer" ||
        !profile.job;

    return CITY_DATA.map(city => {
        let projectedIncome = city.baseIncome;
        let projectedEmp = city.baseEmp;

        if (!isFallback) {
            const key = `${city.city}|${profile.age}|${profile.edu}|${profile.job}`;
            const specificData = GRANULAR_LOOKUP[key];

            if (specificData) {
                projectedIncome = specificData[0];
                projectedEmp = specificData[1];
            } else {
                const benchmarks = BENCHMARK_LOOKUP[city.country];
                let benchInc = null;
                let benchRate = null;

                const tryGetBench = (type, val) => {
                    if (benchmarks && benchmarks[type] && benchmarks[type][val]) {
                        return benchmarks[type][val];
                    }
                    return null;
                };

                let res = tryGetBench("Job_Bin", profile.job);
                if (!res) res = tryGetBench("Edu_Bin", profile.edu);
                if (!res) res = tryGetBench("Age_Bin", profile.age);

                if (res) {
                    benchInc = res[0];
                    benchRate = res[1];
                    const natAvgInc = NAT_AVGS[city.country].inc;
                    const natAvgRate = NAT_AVGS[city.country].rate;
                    if (benchInc) projectedIncome = city.baseIncome * (benchInc / natAvgInc);
                    if (benchRate) projectedEmp = Math.min(100, city.baseEmp + (benchRate - natAvgRate));
                }
            }
        }

        if (projectedIncome < 12000 && projectedIncome > 0) projectedIncome *= 12;

        const affordIndex = projectedIncome / (city.rent * 12);

        return {
            ...city,
            projectedIncome,
            emp: projectedEmp,
            affordIndex
        };
    });
};

// --- UI COMPONENTS ---

// 1. Style Injection for Keyframes & Custom Classes
const GlobalStyles = () => (
    <style>{`
        /* Title Animation */
        @keyframes slideDownChar {
            0% { transform: translateY(-110%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        /* Icon Sway Animation */
        @keyframes sway {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
            100% { transform: rotate(0deg); }
        }
        .animate-sway:hover {
            animation: sway 0.6s ease-in-out infinite;
        }
        
        /* Glow Button Variables */
        .glow-btn {
            --x: 50%;
            --y: 50%;
        }
        
        /* Glow Effect Pseudo-element */
        .glow-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at var(--x) var(--y), rgba(139, 92, 246, 0.4), transparent 50%);
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .glow-btn:hover::before {
            opacity: 1;
        }
        
        /* Glow Border Pseudo-element */
        .glow-btn-border {
            position: absolute;
            inset: 0;
            border-radius: inherit; 
            padding: 1px; 
            background: radial-gradient(circle at var(--x) var(--y), rgba(167, 139, 250, 1) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 80%); 
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
            -webkit-mask-composite: xor; 
            mask-composite: exclude; 
            pointer-events: none;
            opacity: 0.7;
        }

        /* Flashlight Card Effect */
        .flashlight-card {
            --mouse-x: -1000px;
            --mouse-y: -1000px;
        }
        .flashlight-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
                600px circle at var(--mouse-x) var(--mouse-y),
                rgba(255, 255, 255, 0.04),
                transparent 40%
            );
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 0;
        }
        .flashlight-card:hover::before { opacity: 1; }

        .flashlight-card-border {
             position: absolute;
             inset: 0;
             border-radius: inherit;
             padding: 1px;
             background: radial-gradient(
                 400px circle at var(--mouse-x) var(--mouse-y),
                 rgba(129, 140, 248, 0.5),
                 transparent 40%
             );
             -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
             mask-composite: exclude;
             pointer-events: none;
             opacity: 0;
             transition: opacity 0.3s;
             z-index: 1;
        }
        .flashlight-card:hover .flashlight-card-border { opacity: 1; }
    `}</style>
);

// 2. Animated Title (Both words Extra Bold + White)
const AnimatedTitle = ({ text, className = "" }) => {
    return (
        <div className={`flex overflow-hidden font-extrabold text-white ${className}`}>
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    className="inline-block"
                    style={{
                        animation: `slideDownChar 0.5s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards`,
                        animationDelay: `${i * 0.05}s`,
                        opacity: 0,
                        transform: 'translateY(-110%)'
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </div>
    );
};

// 3. Hero Button (Letters Swap: Get Started -> Let's Go)
const HeroButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-slate-800 px-10 py-4 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:bg-slate-700 hover:shadow-indigo-500/40 border border-slate-700"
        >
            <div className="relative flex items-center justify-center">
                {/* Initial Text: Get Started + Star */}
                <div className="flex items-center gap-2 transition-all duration-300 group-hover:-translate-y-10 group-hover:opacity-0">
                    <div className="flex">
                        {"Get Started".split("").map((char, i) => (
                            <span key={`in-${i}`} className="inline-block" style={{ transitionDelay: `${i * 15}ms` }}>
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-spin-slow" />
                </div>

                {/* Hover Text: Let's Go + Arrow */}
                <div className="absolute flex items-center gap-2 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-indigo-300">
                    <div className="flex">
                        {"Let's Go".split("").map((char, i) => (
                            <span key={`out-${i}`} className="inline-block" style={{ transitionDelay: `${i * 15}ms` }}>
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </button>
    );
};

// 4. Interactive Compare Button (Letters Swap: Compare -> Generating with spinning star)
// Replaces the GlowButton in the map view bottom bar.
const InteractiveCompareButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:bg-indigo-500 border border-indigo-500/50"
        >
            <div className="relative flex items-center justify-center">
                {/* Initial Text: Compare + Star */}
                <div className="flex items-center gap-2 transition-all duration-300 group-hover:-translate-y-8 group-hover:opacity-0">
                    <div className="flex">
                        {"Compare".split("").map((char, i) => (
                            <span key={`in-${i}`} className="inline-block" style={{ transitionDelay: `${i * 20}ms` }}>{char}</span>
                        ))}
                    </div>
                    <Star className="h-4 w-4 fill-white/50 text-white/50" />
                </div>

                {/* Hover Text: Generating + Spinning Star */}
                <div className="absolute flex items-center gap-2 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex">
                        {"Generating".split("").map((char, i) => (
                            <span key={`out-${i}`} className="inline-block" style={{ transitionDelay: `${i * 20}ms` }}>{char}</span>
                        ))}
                    </div>
                    <Star className="h-4 w-4 fill-white text-white animate-spin" />
                </div>
            </div>
        </button>
    );
};

// 5. Glow Button (The specific implementation requested)
const GlowButton = ({ children, onClick, className = "", icon = true, small = false, variant = "primary", type = "button" }) => {
    const btnRef = useRef(null);

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        const handleMouseMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--x', `${x}px`);
            btn.style.setProperty('--y', `${y}px`);
        };

        btn.addEventListener('mousemove', handleMouseMove);
        return () => btn.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const baseStyles = "glow-btn group relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 focus:outline-none";
    const sizeStyles = small
        ? "px-3 py-1.5 text-xs rounded-lg"
        : "px-6 py-3 text-sm font-bold rounded-xl";

    const colorStyles = variant === "primary"
        ? "text-white bg-slate-800 backdrop-blur-md border border-slate-700 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/40"
        : "text-slate-300 bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 shadow-sm";

    return (
        <button
            ref={btnRef}
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${sizeStyles} ${colorStyles} ${className}`}
        >
            <div className="glow-btn-border"></div>
            <span className="relative z-10 flex items-center gap-2">
                {children}
                {icon && (
                    <svg className="arrow-icon w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12H19"></path>
                        <path d="M12 5L19 12L12 19"></path>
                    </svg>
                )}
            </span>
        </button>
    );
};

// 6. Beam Button (For Dashboard Toggle)
const BeamButton = ({ children, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`relative rounded-xl px-4 py-1.5 text-sm font-bold transition-all duration-300 overflow-hidden group ${isActive ? 'bg-slate-700 text-white shadow-inner' : 'bg-transparent text-slate-400 hover:text-white'}`}
        >
            {/* Beam - visible on hover or active */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#6366f1_50%,transparent_100%)]" />
            </div>

            {/* Inner Mask */}
            <div className={`absolute inset-[1px] rounded-[10px] z-0 bg-slate-900 transition-colors duration-300 ${isActive ? 'bg-slate-800' : 'bg-slate-900'}`} />

            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
    );
};

// 7. Flashlight Card (For Comparison Summary)
const FlashlightCard = ({ children, className = "" }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        card.addEventListener('mousemove', handleMouseMove);
        return () => card.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={cardRef} className={`flashlight-card group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm ${className}`}>
            <div className="flashlight-card-border"></div>
            <div className="relative z-10">{children}</div>
        </div>
    );
};


// --- MAP COMPONENTS ---
const MapLegend = ({ mapColor }) => {
    const items = {
        income: [
            { color: '#15803d', label: 'Very High (>$120k)' },
            { color: '#22c55e', label: 'High ($90k-$120k)' },
            { color: '#eab308', label: 'Medium ($60k-$90k)' },
            { color: '#f97316', label: 'Low ($40k-$60k)' },
            { color: '#ef4444', label: 'Very Low (<$40k)' },
        ],
        emp: [
            { color: '#15803d', label: 'Very High (>90%)' },
            { color: '#22c55e', label: 'High (80-90%)' },
            { color: '#eab308', label: 'Medium (70-80%)' },
            { color: '#f97316', label: 'Low (60-70%)' },
            { color: '#ef4444', label: 'Very Low (<60%)' },
        ],
        afford: [
            { color: '#1e40af', label: 'Excellent (>5.0)' },
            { color: '#3b82f6', label: 'Good (4.0-5.0)' },
            { color: '#a855f7', label: 'Fair (3.0-4.0)' },
            { color: '#ec4899', label: 'Poor (2.0-3.0)' },
            { color: '#be123c', label: 'Very Poor (<2.0)' },
        ]
    };

    const currentItems = items[mapColor] || [];
    const titles = { income: 'Income Level', emp: 'Employment Rate', afford: 'Affordability' };

    return (
        <div className="absolute bottom-8 left-6 bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-xl text-xs z-[9999] pointer-events-none min-w-[140px]">
            <div className="font-bold mb-3 text-slate-300 uppercase tracking-wider border-b border-slate-700 pb-2">{titles[mapColor]}</div>
            <div className="space-y-2 font-medium text-slate-400">
                {currentItems.map((item, i) => (
                    <div key={i} className="flex items-center"><span className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{backgroundColor: item.color}}></span> {item.label}</div>
                ))}
            </div>
        </div>
    );
};

const StaticMap = ({ markers = [], onMarkerClick, mapColor }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const getMarkerColor = (city, type) => {
        if (type === 'income') return city.projectedIncome > 120000 ? '#15803d' : city.projectedIncome > 90000 ? '#22c55e' : city.projectedIncome > 60000 ? '#eab308' : city.projectedIncome > 40000 ? '#f97316' : '#ef4444';
        if (type === 'emp') return city.emp > 90 ? '#15803d' : city.emp > 80 ? '#22c55e' : city.emp > 70 ? '#eab308' : city.emp > 60 ? '#f97316' : '#ef4444';
        if (type === 'afford') return city.affordIndex > 5.0 ? '#1e40af' : city.affordIndex > 4.0 ? '#3b82f6' : city.affordIndex > 3.0 ? '#a855f7' : city.affordIndex > 2.0 ? '#ec4899' : '#be123c';
        return '#333';
    };

    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden border-t border-b border-slate-800" style={{ height: '100vh', minHeight: '600px' }}>
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-0 bg-slate-900">
                    <Loader2 className="animate-spin text-slate-500 mb-2" size={32} />
                </div>
            )}
            <div className={`absolute inset-0 flex items-center justify-center bg-slate-900 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/North_America_blank_map_with_state_and_province_boundaries.svg/1200px-North_America_blank_map_with_state_and_province_boundaries.svg.png"
                    alt="North America Map"
                    className="w-full h-full object-contain opacity-50 invert brightness-75 sepia-[.2] hue-rotate-[180deg]"
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
            <div className="absolute inset-0 z-30">
                {markers.map((city) => {
                    const left = ((city.lng + 135) / 75) * 100;
                    const top = ((65 - city.lat) / 40) * 100;
                    const color = getMarkerColor(city, mapColor);
                    return (
                        <div
                            key={city.city}
                            onClick={() => onMarkerClick(city)}
                            className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] border border-white/50 cursor-pointer transition-transform hover:scale-150 hover:z-50 group flex items-center justify-center"
                            style={{ left: `${left}%`, top: `${top}%`, backgroundColor: color }}
                        >
                            <div className="absolute bottom-full mb-1 hidden group-hover:block min-w-[120px] bg-slate-800 border border-slate-700 shadow-xl text-slate-200 text-[10px] rounded p-2 text-center z-50 pointer-events-none whitespace-nowrap">
                                <div className="font-bold text-xs text-white">{city.city}</div>
                                <div className="text-slate-400">
                                    Inc: {formatCurrency(city.projectedIncome)} <br/>
                                    Emp: {city.emp.toFixed(1)}% <br/>
                                    Afford: {city.affordIndex.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <MapLegend mapColor={mapColor} />
        </div>
    );
};

const GoogleMapComponent = ({ markers = [], onMarkerClick, mapColor }) => {
    return <StaticMap markers={markers} onMarkerClick={onMarkerClick} mapColor={mapColor} />;
};

// --- WIZARD ---
const Wizard = ({ onFinish }) => {
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState({ gender: '', edu: '', age: '', immigrant: '', job: '' });
    const updateProfile = (key, value) => setProfile(prev => ({ ...prev, [key]: value }));

    const steps = [
        { title: "Welcome", desc: "Find your place.", isIntro: true },
        { title: "What is your gender?", key: "gender", options: ["Male", "Female", "Non-binary", "Prefer not to answer"] },
        { title: "Education Level", key: "edu", options: ["High School", "College", "University", "Graduate or Above", "Prefer not to answer"] },
        { title: "Age Group", key: "age", options: ["18-24", "25-35", "35-45", "45-55", "55+", "Prefer not to answer"] },
        { title: "Immigrant Status", key: "immigrant", options: ["Immigrant", "Non-immigrant", "Prefer not to answer"] },
        { title: "Job Field", key: "job", options: ["STEM & Technical", "Business & Office", "Social Service", "Arts & Design", "Other", "Prefer not to answer"] }
    ];
    const currentStep = steps[step];

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 font-sans p-4 relative overflow-hidden">
            <GlobalStyles />
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-800 z-10 relative">
                {currentStep.isIntro ? (
                    <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                        <div className="animate-sway bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/25 cursor-pointer">
                            <MapIcon size={40} className="text-white" />
                        </div>

                        {/* 1. UPDATED TITLE: Both words EXTRA BOLD */}
                        <div className="mb-6 h-16 flex items-center justify-center text-4xl">
                            <AnimatedTitle text="Career Compass" />
                        </div>

                        <p className="text-slate-400 mb-10 text-lg leading-relaxed font-medium">Explore cities across Canada & the US based on your personal profile and career goals.</p>

                        {/* 2. UPDATED HERO BUTTON */}
                        <HeroButton onClick={() => setStep(1)} />
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/20">Step {step} of 5</span>
                            <button onClick={() => setStep(0)} className="text-slate-500 hover:text-red-400 transition"><X size={20} /></button>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-8 text-left">{currentStep.title}</h2>
                        <div className="space-y-3">
                            {currentStep.options.map(opt => (
                                <GlowButton
                                    key={opt}
                                    onClick={() => {
                                        const newProfile = { ...profile, [currentStep.key]: opt };
                                        updateProfile(currentStep.key, opt);
                                        if (step < 5) setStep(step + 1);
                                        else onFinish(newProfile);
                                    }}
                                    className={`w-full justify-between !px-5 !py-4 !rounded-xl text-left !font-medium`}
                                    icon={false}
                                    variant={profile[currentStep.key] === opt ? 'primary' : 'secondary'}
                                >
                                    {opt}
                                    {profile[currentStep.key] === opt && <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />}
                                </GlowButton>
                            ))}
                        </div>
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} className="mt-8 text-slate-500 hover:text-slate-300 text-sm flex items-center justify-center w-full transition hover:underline">
                                <ArrowLeft size={14} className="mr-1" /> Back
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- EDIT PROFILE MODAL ---
const EditProfileModal = ({ isOpen, onClose, currentProfile, onSave }) => {
    const [localProfile, setLocalProfile] = useState(currentProfile);
    useEffect(() => { setLocalProfile(currentProfile); }, [currentProfile]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200 text-slate-200">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Edit Profile</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    {['job', 'age', 'edu'].map((key, i) => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{['Job Field', 'Age Group', 'Education'][i]}</label>
                            <select
                                className="w-full p-2 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                                value={localProfile[key]}
                                onChange={(e) => setLocalProfile({...localProfile, [key]: e.target.value})}
                            >
                                {(i===0 ? ["STEM & Technical", "Business & Office", "Social Service", "Arts & Design", "Other"] : i===1 ? ["18-24", "25-35", "35-45", "45-55", "55+"] : ["High School", "College", "University", "Graduate or Above"]).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="bg-slate-800/50 px-6 py-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition">Cancel</button>
                    <GlowButton onClick={() => onSave(localProfile)} className="!px-4 !py-2 !text-sm" icon={false}><Save size={16} className="mr-1.5"/> Save</GlowButton>
                </div>
            </div>
        </div>
    );
};

// --- SIDEBAR ---
const Sidebar = ({ profile, setView, filters, setFilters, mapColor, setMapColor, onEditProfile }) => (
    <aside className="w-80 flex-shrink-0 border-r border-slate-800 bg-slate-900 overflow-y-auto p-6 z-10 shadow-xl">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700 mb-8">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-indigo-400">Your Profile</h3>
                <button onClick={onEditProfile} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-md border border-slate-700 hover:bg-slate-700 transition"><Edit2 size={14} /></button>
            </div>
            <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center"><span className="w-16 text-slate-500 text-xs uppercase font-bold">Job</span> {profile?.job || 'Not set'}</li>
                <li className="flex items-center"><span className="w-16 text-slate-500 text-xs uppercase font-bold">Age</span> {profile?.age || 'Not set'}</li>
                <li className="flex items-center"><span className="w-16 text-slate-500 text-xs uppercase font-bold">Edu</span> {profile?.edu || 'Not set'}</li>
            </ul>
        </div>

        <div className="space-y-8">
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Employment Rate</label>
                    <span className="text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-800/50">{'>'} {filters.emp}%</span>
                </div>
                <input type="range" min="50" max="95" value={filters.emp} onChange={e => setFilters({...filters, emp: Number(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Median Income</label>
                    <span className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-0.5 rounded border border-green-800/50">{'>'} {formatCurrency(filters.income)}</span>
                </div>
                <input type="range" min="0" max="150000" step="5000" value={filters.income} onChange={e => setFilters({...filters, income: Number(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Color Map By</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        {id: 'income', label: 'Income', icon: DollarSign},
                        {id: 'emp', label: 'Jobs', icon: BarChart2},
                        {id: 'afford', label: 'Index', icon: Home}
                    ].map(k => (
                        <GlowButton key={k.id} onClick={() => setMapColor(k.id)} className={`!flex-col !h-auto !py-3 !rounded-xl !border ${mapColor === k.id ? '!bg-slate-800 !border-indigo-500/50 !text-indigo-400 shadow-md' : '!bg-slate-900 !border-slate-800 !text-slate-500 hover:!bg-slate-800'}`} icon={false} variant="secondary">
                            <k.icon size={16} className="mb-1" />
                            <span className="text-[10px] font-bold">{k.label}</span>
                        </GlowButton>
                    ))}
                </div>
            </div>
        </div>
    </aside>
);

export default function App() {
    const [view, setView] = useState('wizard');
    const [profile, setProfile] = useState(null);
    const [data, setData] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [detailCity, setDetailCity] = useState(null);
    const [filters, setFilters] = useState({ emp: 50, income: 0 });
    const [mapColor, setMapColor] = useState('income');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showCalcInfo, setShowCalcInfo] = useState(false);
    const [showTransitInfo, setShowTransitInfo] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setData(calculateMetrics(profile));
    }, [profile]);

    const handleFinishWizard = (prof) => {
        setProfile(prof);
        setView('map');
    };

    const handleSaveProfile = (newProfile) => {
        setProfile(newProfile);
        setIsEditModalOpen(false);
    };

    const filteredData = useMemo(() => {
        return data.filter(c => c.emp >= filters.emp && c.projectedIncome >= filters.income);
    }, [data, filters]);

    const weatherChartData = useMemo(() => {
        return data.filter(c => selectedCities.includes(c.city)).map(city => {
            const isSnowy = city.snow > 15;
            return {
                ...city,
                part1: isSnowy ? city.snow * 0.6 : city.rain * 0.4,
                part2: city.rain * 0.4,
                part3: city.sun,
                part4: city.rain * 0.6,
                part5: isSnowy ? city.snow * 0.4 : 0,
            };
        });
    }, [data, selectedCities]);

    if (!mounted) return null;
    if (view === 'wizard') return <Wizard onFinish={handleFinishWizard} />;

    return (
        <div className="flex h-screen flex-col bg-slate-950 font-sans text-slate-200 overflow-hidden">
            <GlobalStyles />
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} currentProfile={profile} onSave={handleSaveProfile} />

            <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900 z-30 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="animate-sway bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-1.5 rounded-lg shadow-lg shadow-indigo-500/20 cursor-pointer"><TrendingUp size={20} /></div>
                    <div className="font-extrabold text-xl tracking-tight text-white flex items-center">
                        Career Compass
                    </div>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-lg gap-1 border border-slate-700">
                    <BeamButton isActive={view === 'map'} onClick={() => setView('map')}>Explore</BeamButton>
                    <BeamButton isActive={view === 'compare'} onClick={() => setView('compare')}>Comparison</BeamButton>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {view === 'map' && (
                    <>
                        <Sidebar profile={profile} setView={setView} filters={filters} setFilters={setFilters} mapColor={mapColor} setMapColor={setMapColor} onEditProfile={() => setIsEditModalOpen(true)} />
                        <div className="flex-1 relative bg-slate-900">
                            {GOOGLE_MAPS_API_KEY ? <GoogleMapComponent markers={filteredData} mapColor={mapColor} onMarkerClick={setDetailCity} /> : <StaticMap markers={filteredData} mapColor={mapColor} onMarkerClick={setDetailCity} />}

                            {detailCity && (
                                <div className="absolute top-4 right-4 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 p-0 z-[1000] overflow-hidden animate-in slide-in-from-right-4 duration-300 text-slate-200">
                                    <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-start">
                                        <div><h2 className="font-bold text-xl text-white leading-none mb-1">{detailCity.city}</h2><p className="text-xs text-slate-400 uppercase font-bold">{detailCity.country}</p></div>
                                        <button onClick={() => setDetailCity(null)} className="text-slate-400 hover:text-white"><X size={16} /></button>
                                    </div>
                                    <div className="p-5 space-y-6">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700"><div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Est. Income</div><div className="font-bold text-green-400 text-lg">{formatCurrency(detailCity.projectedIncome)}</div></div>
                                            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700"><div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Commute</div><div className="font-bold text-white text-lg">{detailCity.commute} <span className="text-xs font-normal text-slate-500">min</span></div></div>
                                        </div>

                                        {/* Weather Days Bar */}
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase">Weather Days</h4>
                                                <div className="text-xs font-bold text-slate-400">{detailCity.weather} ({detailCity.temp}°C)</div>
                                            </div>
                                            <div className="h-3 rounded-full flex overflow-hidden w-full bg-slate-700">
                                                <div style={{width: `${(detailCity.sun/365)*100}%`}} className="bg-amber-400" title="Sunny"/>
                                                <div style={{width: `${(detailCity.rain/365)*100}%`}} className="bg-blue-500" title="Rainy"/>
                                                <div style={{width: `${(detailCity.snow/365)*100}%`}} className="bg-slate-400" title="Snowy"/>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
                                                <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1"></div>Sun</span>
                                                <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></div>Rain</span>
                                                <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1"></div>Snow</span>
                                            </div>
                                        </div>

                                        {/* Rent Trend Chart */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase">Rent Trend</h4>
                                                <span className="text-xs font-bold text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded border border-orange-800/50">{formatCurrency(detailCity.rent)}/mo</span>
                                            </div>
                                            <div className="h-24 -mx-2">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={[
                                                        {y:2018, v: detailCity.rent*0.85},
                                                        {y:2019, v: detailCity.rent*0.9},
                                                        {y:2020, v: detailCity.rent*0.92},
                                                        {y:2021, v: detailCity.rent}
                                                    ]}>
                                                        <Line type="monotone" dataKey="v" stroke="#f97316" strokeWidth={2} dot={{r: 2, fill: '#f97316'}} />
                                                        <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <GlowButton onClick={() => { if (selectedCities.includes(detailCity.city)) setSelectedCities(selectedCities.filter(c => c !== detailCity.city)); else if (selectedCities.length < 3) setSelectedCities([...selectedCities, detailCity.city]); }} className="w-full justify-center" icon={!selectedCities.includes(detailCity.city)} variant={selectedCities.includes(detailCity.city) ? "secondary" : "primary"}>
                                            {selectedCities.includes(detailCity.city) ? 'Remove' : 'Add to Compare'}
                                        </GlowButton>
                                    </div>
                                </div>
                            )}

                            {selectedCities.length > 0 && (
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-lg border border-slate-700 p-2 rounded-2xl shadow-2xl z-[900] flex items-center space-x-2 animate-in slide-in-from-bottom-8">
                                    <div className="flex space-x-2 px-2">
                                        {selectedCities.map(city => (
                                            <div key={city} className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"><span className="text-xs font-bold text-white">{city}</span><button onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))} className="text-slate-500 hover:text-red-400"><X size={12}/></button></div>
                                        ))}
                                        {[...Array(3 - selectedCities.length)].map((_, i) => <div key={i} className="w-24 h-8 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase">Empty</div>)}
                                    </div>
                                    <div className="w-px h-8 bg-slate-700 mx-2"></div>
                                    <InteractiveCompareButton onClick={() => setView('compare')} />
                                </div>
                            )}
                        </div>
                    </>
                )}

                {view === 'compare' && (
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-950 w-full text-slate-200">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center mb-8">
                                <GlowButton onClick={() => setView('map')} variant="secondary" className="!p-2.5 mr-4" icon={false}><ArrowLeft size={20}/></GlowButton>
                                <h1 className="text-3xl font-extrabold text-white">City Showdown</h1>
                            </div>
                            {selectedCities.length === 0 ? <div className="text-center py-32 text-slate-500">No cities selected.</div> : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {data.filter(c => selectedCities.includes(c.city)).map(city => (
                                            <FlashlightCard key={city.city}>
                                                <div className="absolute top-0 right-0 bg-slate-800 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-blue-400 uppercase tracking-wide">{city.country}</div>
                                                <h2 className="text-xl font-bold text-white mb-4">{city.city}</h2>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between"><span className="text-sm text-slate-400">Income</span><span className="font-bold text-green-400">{formatCurrency(city.projectedIncome)}</span></div>
                                                    <div className="flex justify-between"><span className="text-sm text-slate-400">Rent</span><span className="font-bold text-orange-400">{formatCurrency(city.rent)}</span></div>
                                                    <div className="flex justify-between"><span className="text-sm text-slate-400">Commute</span><span className="font-bold text-slate-200">{city.commute} min</span></div>
                                                </div>
                                            </FlashlightCard>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                                        {/* Financial Efficiency */}
                                        <FlashlightCard>
                                            <div className="mb-6 flex justify-between items-center">
                                                <h3 className="font-bold text-lg text-white">Financial Efficiency</h3>
                                                <button onClick={() => setShowCalcInfo(!showCalcInfo)} className="text-slate-500 hover:text-blue-400"><Info size={18} /></button>
                                            </div>
                                            {showCalcInfo && <div className="mb-4 p-3 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">Index = Income / Annual Rent. >3.0 is good.</div>}
                                            <div className="h-72">
                                                <ResponsiveContainer>
                                                    <ComposedChart data={data.filter(c => selectedCities.includes(c.city))}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                                        <XAxis dataKey="city" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                        <YAxis yAxisId="left" tickFormatter={(val) => `$${Math.round(val/1000)}k`} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                                        <YAxis yAxisId="right" orientation="right" domain={[0, 6]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#3b82f6'}} />
                                                        <RechartsTooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px'}} />
                                                        <Legend iconType="circle" />
                                                        <Bar yAxisId="left" dataKey="projectedIncome" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={50} />
                                                        <Line yAxisId="right" type="monotone" dataKey="affordIndex" name="Index" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                                                    </ComposedChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </FlashlightCard>

                                        {/* Weather Patterns */}
                                        <FlashlightCard>
                                            <h3 className="font-bold text-lg text-white mb-6">Weather Patterns</h3>
                                            <div className="h-72">
                                                <ResponsiveContainer>
                                                    <BarChart data={weatherChartData} layout="vertical" stackOffset="expand">
                                                        <XAxis type="number" domain={[0, 1]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} tickFormatter={(val) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Math.round(val*11)] || ""} interval={0} />
                                                        <YAxis dataKey="city" type="category" width={80} tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px'}} />
                                                        <Bar dataKey="part1" stackId="a" fill="#475569" radius={[4, 0, 0, 4]} name="Winter" />
                                                        <Bar dataKey="part2" stackId="a" fill="#60a5fa" name="Spring" />
                                                        <Bar dataKey="part3" stackId="a" fill="#facc15" name="Summer" />
                                                        <Bar dataKey="part4" stackId="a" fill="#fb923c" name="Autumn" />
                                                        <Bar dataKey="part5" stackId="a" fill="#475569" radius={[0, 4, 4, 0]} name="Winter" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </FlashlightCard>

                                        {/* Transit Score */}
                                        <FlashlightCard>
                                            <div className="mb-6 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="bg-blue-900/30 p-2 rounded-lg mr-3 text-blue-400">
                                                        <Bus size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-white">Transit Score</h3>
                                                        <p className="text-xs text-slate-400">Public transport accessibility (0-100)</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setShowTransitInfo(!showTransitInfo)} className="text-slate-500 hover:text-blue-400 transition"><Info size={18} /></button>
                                            </div>
                                            {showTransitInfo && (
                                                <div className="mb-4 p-3 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                                                    90-100: Rider's Paradise<br/>70-89: Excellent Transit<br/>50-69: Good Transit<br/>0-49: Minimal Transit
                                                </div>
                                            )}
                                            <div className="h-64">
                                                <ResponsiveContainer>
                                                    <BarChart data={data.filter(c => selectedCities.includes(c.city))}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                                        <XAxis dataKey="city" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                        <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                        <RechartsTooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px'}} />
                                                        <Bar dataKey="transitScore" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Score" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </FlashlightCard>

                                        {/* Avg Weekly Hours */}
                                        <FlashlightCard>
                                            <div className="mb-6 flex items-center">
                                                <div className="bg-orange-900/30 p-2 rounded-lg mr-3 text-orange-400">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-white">Avg. Weekly Hours</h3>
                                                    <p className="text-xs text-slate-400">Standard 40h week comparison</p>
                                                </div>
                                            </div>
                                            <div className="h-64">
                                                <ResponsiveContainer>
                                                    <BarChart layout="vertical" data={data.filter(c => selectedCities.includes(c.city))}>
                                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                                        <XAxis type="number" domain={[30, 50]} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                        <YAxis dataKey="city" type="category" width={80} tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                        <RechartsTooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px'}} />
                                                        <ReferenceLine x={40} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: '40h', fill: 'red', fontSize: 10 }} />
                                                        <Bar dataKey="workHours" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} name="Hours/Week" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </FlashlightCard>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}