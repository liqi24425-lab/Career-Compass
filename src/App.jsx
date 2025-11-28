import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
    ComposedChart,
    ReferenceLine
} from 'recharts';
import { DollarSign, TrendingUp, ArrowLeft, X, Edit2, Map as MapIcon, BarChart2, Home, Save, AlertTriangle, Loader2, Info, Clock, Bus } from 'lucide-react';
import {GRANULAR_LOOKUP} from "./all_data.js"

// --- CONFIGURATION ---
const GOOGLE_MAPS_API_KEY = "2021 Census of Population [Canada] / American Community Survey (PUMS)";

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

// D. GRANULAR LOOKUP
// Empty placeholder to prevent errors
console.log(GRANULAR_LOOKUP);

// --- HELPER FUNCTIONS ---
// REVERTED: Use full numbers (e.g. $10,000) for general display as requested
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
            projectedIncome, // Preserved precision
            emp: projectedEmp, // Preserved precision
            affordIndex // Preserved precision
        };
    });
};

// ... (MapLegend, StaticMap, GoogleMapComponent, Wizard, EditProfileModal are unchanged)

// --- MAP LEGEND COMPONENT ---
const MapLegend = ({ mapColor }) => {
    if (mapColor === 'income') {
        return (
            <div className="absolute bottom-20 left-6 bg-white/95 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-md text-xs z-[9999] pointer-events-none min-w-[140px]">
                <div className="font-bold mb-3 text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Income Level</div>
                <div className="space-y-2 font-medium text-slate-600">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#15803d] mr-2 shadow-sm"></span> Very High ({'>'}$120k)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#22c55e] mr-2 shadow-sm"></span> High ($90k-$120k)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#eab308] mr-2 shadow-sm"></span> Medium ($60k-$90k)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#f97316] mr-2 shadow-sm"></span> Low ($40k-$60k)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#ef4444] mr-2 shadow-sm"></span> Very Low ({'<'}$40k)</div>
                </div>
            </div>
        );
    }
    if (mapColor === 'emp') {
        return (
            <div className="absolute bottom-20 left-6 bg-white/95 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-md text-xs z-[9999] pointer-events-none min-w-[140px]">
                <div className="font-bold mb-3 text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Employment Rate</div>
                <div className="space-y-2 font-medium text-slate-600">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#15803d] mr-2 shadow-sm"></span> Very High ({'>'}90%)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#22c55e] mr-2 shadow-sm"></span> High (80-90%)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#eab308] mr-2 shadow-sm"></span> Medium (70-80%)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#f97316] mr-2 shadow-sm"></span> Low (60-70%)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#ef4444] mr-2 shadow-sm"></span> Very Low ({'<'}60%)</div>
                </div>
            </div>
        );
    }
    if (mapColor === 'afford') {
        return (
            <div className="absolute bottom-20 left-6 bg-white/95 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-md text-xs z-[9999] pointer-events-none min-w-[140px]">
                <div className="font-bold mb-3 text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Affordability</div>
                <div className="space-y-2 font-medium text-slate-600">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#1e40af] mr-2 shadow-sm"></span> Excellent ({'>'}5.0)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2 shadow-sm"></span> Good (4.0-5.0)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#a855f7] mr-2 shadow-sm"></span> Fair (3.0-4.0)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#ec4899] mr-2 shadow-sm"></span> Poor (2.0-3.0)</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#be123c] mr-2 shadow-sm"></span> Very Poor ({'<'}2.0)</div>
                </div>
            </div>
        );
    }
    return null;
};

// --- STATIC MAP COMPONENT WITH LOADER ---
const StaticMap = ({ markers = [], onMarkerClick, mapColor }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const getMarkerColor = (city, type) => {
        if (type === 'income') {
            if (city.projectedIncome > 120000) return '#15803d'; // Deep Green
            if (city.projectedIncome > 90000) return '#22c55e';  // Green
            if (city.projectedIncome > 60000) return '#eab308';  // Yellow
            if (city.projectedIncome > 40000) return '#f97316';  // Orange
            return '#ef4444';                                    // Red
        }
        if (type === 'emp') {
            if (city.emp > 90) return '#15803d';
            if (city.emp > 80) return '#22c55e';
            if (city.emp > 70) return '#eab308';
            if (city.emp > 60) return '#f97316';
            return '#ef4444';
        }
        if (type === 'afford') {
            if (city.affordIndex > 5.0) return '#1e40af'; // Deep Blue
            if (city.affordIndex > 4.0) return '#3b82f6'; // Blue
            if (city.affordIndex > 3.0) return '#a855f7'; // Purple
            if (city.affordIndex > 2.0) return '#ec4899'; // Pink
            return '#be123c';                             // Deep Red
        }
        return '#333';
    };

    return (
        <div className="relative w-full h-full bg-[#e0e7eb] overflow-hidden border-t border-b border-slate-300" style={{ height: '100vh', minHeight: '600px' }}>

            {/* Loading State for Image - Kept behind markers */}
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-0 bg-[#e0e7eb]">
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-slate-400 mb-2" size={32} />
                    </div>
                </div>
            )}

            {/* Real Map Image - Wikimedia Commons */}
            <div className={`absolute inset-0 flex items-center justify-center bg-[#c8d3d9] transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/North_America_blank_map_with_state_and_province_boundaries.svg/1200px-North_America_blank_map_with_state_and_province_boundaries.svg.png"
                    alt="North America Map"
                    className="w-full h-full object-contain opacity-90"
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* Markers Layer - ALWAYS SHOW IMMEDIATELY (Z-Index > Loading Spinner) */}
            <div className="absolute inset-0 z-30">
                {markers.map((city) => {
                    const left = ((city.lng + 135) / 75) * 100;
                    const top = ((65 - city.lat) / 40) * 100;
                    const color = getMarkerColor(city, mapColor);

                    return (
                        <div
                            key={city.city}
                            onClick={() => onMarkerClick(city)}
                            className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full shadow-sm border border-white cursor-pointer transition-transform hover:scale-150 hover:z-50 group flex items-center justify-center"
                            style={{ left: `${left}%`, top: `${top}%`, backgroundColor: color }}
                        >
                            <div className="absolute bottom-full mb-1 hidden group-hover:block min-w-[120px] bg-white border border-slate-200 shadow-lg text-slate-800 text-[10px] rounded p-2 text-center z-50 pointer-events-none whitespace-nowrap">
                                <div className="font-bold text-xs">{city.city}</div>
                                <div className="text-slate-500">
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

// --- NATIVE GOOGLE MAP COMPONENT (Robust Loading & Fixed Deps) ---
const GoogleMapComponent = ({ markers = [], onMarkerClick, mapColor }) => {
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const markersRef = useRef([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false); // Track if map is fully loaded

    const getMarkerColor = useCallback((city, type) => {
        if (type === 'income') {
            if (city.projectedIncome > 120000) return '#15803d';
            if (city.projectedIncome > 90000) return '#22c55e';
            if (city.projectedIncome > 60000) return '#eab308';
            if (city.projectedIncome > 40000) return '#f97316';
            return '#ef4444';
        }
        if (type === 'emp') {
            if (city.emp > 90) return '#15803d';
            if (city.emp > 80) return '#22c55e';
            if (city.emp > 70) return '#eab308';
            if (city.emp > 60) return '#f97316';
            return '#ef4444';
        }
        if (type === 'afford') {
            if (city.affordIndex > 5.0) return '#1e40af';
            if (city.affordIndex > 4.0) return '#3b82f6';
            if (city.affordIndex > 3.0) return '#a855f7';
            if (city.affordIndex > 2.0) return '#ec4899';
            return '#be123c';
        }
        return '#333';
    }, []);

    // 1. Define updateMarkers with useCallback so it's a stable dependency
    const updateMarkers = useCallback(() => {
        if (!window.google?.maps || !googleMapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        markers.forEach(city => {
            const color = getMarkerColor(city, mapColor);

            // Create marker
            const marker = new window.google.maps.Marker({
                position: { lat: city.lat, lng: city.lng },
                map: googleMapRef.current,
                title: `${city.city}\nInc: ${formatCurrency(city.projectedIncome)}\nEmp: ${city.emp.toFixed(1)}%\nAfford: ${city.affordIndex.toFixed(2)}`,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: color,
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "white",
                }
            });

            // Add click listener
            marker.addListener("click", () => {
                onMarkerClick(city);
            });

            markersRef.current.push(marker);
        });
    }, [markers, mapColor, getMarkerColor, onMarkerClick]);

    // 2. Initialization Effect - Runs ONCE
    useEffect(() => {
        const initMap = () => {
            if (!mapRef.current || !window.google || !window.google.maps) return;

            try {
                if (!googleMapRef.current) {
                    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
                        center: { lat: 48.0, lng: -97.0 },
                        zoom: 4,
                        disableDefaultUI: false,
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        backgroundColor: '#e0e7eb'
                    });

                    // Add idle listener to remove loading spinner once tiles are ready
                    window.google.maps.event.addListenerOnce(googleMapRef.current, 'idle', () => {
                        setLoading(false);
                        setIsMapReady(true); // Signal that map is ready for markers
                    });
                }
            } catch (err) {
                console.error("Map init error:", err);
                setError("Failed to initialize map.");
                setLoading(false);
            }
        };

        if (window.google?.maps) {
            initMap();
        } else {
            const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);

            if (!existingScript) {
                const script = document.createElement("script");
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
                script.async = true;
                script.defer = true;
                script.onload = initMap;
                script.onerror = () => {
                    setError("Network error loading Maps API.");
                    setLoading(false);
                };
                document.head.appendChild(script);
            } else {
                const checkGoogle = setInterval(() => {
                    if (window.google?.maps) {
                        clearInterval(checkGoogle);
                        initMap();
                    }
                }, 100);

                setTimeout(() => {
                    clearInterval(checkGoogle);
                    if (loading) setLoading(false);
                }, 8000);
            }
        }
        // We explicitly do NOT include dependencies here to ensure this runs exactly once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3. Update Effect - Runs when data changes or map becomes ready
    useEffect(() => {
        if (isMapReady) {
            updateMarkers();
        }
    }, [isMapReady, updateMarkers]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#e0e7eb' }}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#e0e7eb]">
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-slate-400 mb-2" size={32} />
                        <span className="text-xs font-bold text-slate-500 uppercase">Loading Google Maps...</span>
                    </div>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-red-50">
                    <div className="text-red-500 font-bold flex items-center">
                        <AlertTriangle className="mr-2" /> {error}
                    </div>
                </div>
            )}
            <div ref={mapRef} style={{ width: '100%', height: '100%', opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }} />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
                <MapLegend mapColor={mapColor} />
            </div>
        </div>
    );
};

// --- WIZARD COMPONENT ---
const Wizard = ({ onFinish }) => {
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState({ gender: '', edu: '', age: '', immigrant: '', job: '' });

    const updateProfile = (key, value) => setProfile(prev => ({ ...prev, [key]: value }));

    const steps = [
        { title: "Welcome", desc: "Find your place. Build your life.", isIntro: true },
        { title: "What is your gender?", key: "gender", options: ["Male", "Female", "Non-binary", "Prefer not to answer"] },
        { title: "Education Level", key: "edu", options: ["High School", "College", "University", "Graduate or Above", "Prefer not to answer"] },
        { title: "Age Group", key: "age", options: ["18-24", "25-35", "35-45", "45-55", "55+", "Prefer not to answer"] },
        { title: "Immigrant Status", key: "immigrant", options: ["Immigrant", "Non-immigrant", "Prefer not to answer"] },
        { title: "Job Field", key: "job", options: ["STEM & Technical", "Business & Office", "Social Service", "Arts & Design", "Other", "Prefer not to answer"] }
    ];

    const currentStep = steps[step];

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
                {currentStep.isIntro ? (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <MapIcon size={32} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800 mb-3">CareerCompass</h1>
                        <p className="text-slate-500 mb-8 text-lg leading-relaxed">Explore cities across Canada & the US based on your personal profile and career goals.</p>
                        <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 w-full">
                            Get Started
                        </button>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">Step {step} of 5</span>
                            <button onClick={() => setStep(0)} className="text-slate-300 hover:text-red-400 transition"><X size={20} /></button>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-left">{currentStep.title}</h2>
                        <div className="space-y-3">
                            {currentStep.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const newProfile = { ...profile, [currentStep.key]: opt };
                                        updateProfile(currentStep.key, opt);
                                        if (step < 5) {
                                            setStep(step + 1);
                                        } else {
                                            onFinish(newProfile);
                                        }
                                    }}
                                    className={`w-full py-3.5 px-5 rounded-xl border transition text-left font-medium flex justify-between items-center group ${
                                        profile[currentStep.key] === opt
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    {opt}
                                    {profile[currentStep.key] === opt && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                </button>
                            ))}
                        </div>
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} className="mt-6 text-slate-400 hover:text-slate-600 text-sm flex items-center justify-center w-full transition">
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

    useEffect(() => {
        setLocalProfile(currentProfile);
    }, [currentProfile]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Edit Profile</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Field</label>
                        <select
                            className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm"
                            value={localProfile.job}
                            onChange={(e) => setLocalProfile({...localProfile, job: e.target.value})}
                        >
                            {["STEM & Technical", "Business & Office", "Social Service", "Arts & Design", "Other", "Prefer not to answer"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age Group</label>
                        <select
                            className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm"
                            value={localProfile.age}
                            onChange={(e) => setLocalProfile({...localProfile, age: e.target.value})}
                        >
                            {["18-24", "25-35", "35-45", "45-55", "55+", "Prefer not to answer"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Education</label>
                        <select
                            className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm"
                            value={localProfile.edu}
                            onChange={(e) => setLocalProfile({...localProfile, edu: e.target.value})}
                        >
                            {["High School", "College", "University", "Graduate or Above", "Prefer not to answer"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition">Cancel</button>
                    <button onClick={() => onSave(localProfile)} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition flex items-center">
                        <Save size={16} className="mr-1.5"/> Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ profile, setView, filters, setFilters, mapColor, setMapColor, onEditProfile }) => (
    <aside className="w-80 flex-shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-6 z-10 shadow-sm">
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-2xl border border-blue-100 mb-8">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-blue-900">Your Profile</h3>
                <div onClick={onEditProfile} className="text-blue-400 hover:text-blue-600 transition bg-white p-1.5 rounded-md shadow-sm cursor-pointer border border-blue-100">
                    <Edit2 size={14} />
                </div>
            </div>
            <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center"><span className="w-16 text-slate-400 text-xs uppercase font-bold">Job</span> {profile?.job || 'Not set'}</li>
                <li className="flex items-center"><span className="w-16 text-slate-400 text-xs uppercase font-bold">Age</span> {profile?.age || 'Not set'}</li>
                <li className="flex items-center"><span className="w-16 text-slate-400 text-xs uppercase font-bold">Edu</span> {profile?.edu || 'Not set'}</li>
            </ul>
        </div>

        <div className="space-y-8">
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Min Employment</label>
                    {/* ADDED: > symbol in the label */}
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{'>'} {filters.emp}%</span>
                </div>
                <input type="range" min="50" max="80" value={filters.emp} onChange={e => setFilters({...filters, emp: Number(e.target.value)})}
                       className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Min Income</label>
                    {/* ADDED: > symbol in the label and used formatCurrency */}
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{'>'} {formatCurrency(filters.income)}</span>
                </div>
                <input type="range" min="0" max="150000" step="5000" value={filters.income} onChange={e => setFilters({...filters, income: Number(e.target.value)})}
                       className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-600" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Color Map By</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        {id: 'income', label: 'Income', icon: DollarSign},
                        {id: 'emp', label: 'Jobs', icon: BarChart2},
                        {id: 'afford', label: 'Index', icon: Home}
                    ].map(k => (
                        <div
                            key={k.id}
                            onClick={() => setMapColor(k.id)}
                            className={`flex flex-col items-center justify-center py-3 rounded-xl border transition cursor-pointer ${mapColor === k.id ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                        >
                            <k.icon size={16} className="mb-1" />
                            <span className="text-[10px] font-bold">{k.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Data Sources</h4>
            <div className="text-[10px] text-slate-400 leading-relaxed space-y-1">
                <p>• <strong>Economic:</strong> 2021 Census of Population [Canada] / American Community Survey (PUMS).</p>
                <p>• <strong>Housing:</strong> Rental Market Reports.</p>
                <p>• <strong>Weather:</strong> Climate Normals (1981-2010).</p>
                <p>• <strong>Transit:</strong> Synthesized density scores.</p>
                <p>• <strong>Work-Life:</strong> Regional labor stats.</p>
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
    const [filters, setFilters] = useState({ emp: 50, income: 0 }); // Default income filter 0 to avoid disappearing cities
    const [mapColor, setMapColor] = useState('income');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showCalcInfo, setShowCalcInfo] = useState(false); // State for showing calculation info
    const [showTransitInfo, setShowTransitInfo] = useState(false); // State for showing transit score info

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        // Always run calculation, even if profile is null (it will handle fallback)
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

    // PREPARE WEATHER CHART DATA (SEASONAL SPLIT LOGIC)
    const weatherChartData = useMemo(() => {
        return data.filter(c => selectedCities.includes(c.city)).map(city => {
            // Simple heuristic to split annual data into seasonal chunks
            const isSnowy = city.snow > 15; // Threshold for "Winter Snow" cities

            return {
                ...city,
                // Bar 1: Early Year (Jan-Mar). If snowy, use 60% of snow. If not, use 40% of rain.
                part1: isSnowy ? city.snow * 0.6 : city.rain * 0.4,

                // Bar 2: Spring (Apr-May). Use 40% of rain.
                part2: city.rain * 0.4,

                // Bar 3: Summer/Core (Jun-Sep). Use 100% of sun.
                part3: city.sun,

                // Bar 4: Autumn (Oct-Nov). Use 60% of rain.
                part4: city.rain * 0.6,

                // Bar 5: Late Year (Dec). If snowy, use 40% of snow. If not, use nothing/rain.
                part5: isSnowy ? city.snow * 0.4 : 0,
            };
        });
    }, [data, selectedCities]);

    if (!mounted) return null;
    if (view === 'wizard') return <Wizard onFinish={handleFinishWizard} />;

    return (
        <div className="flex h-screen flex-col bg-white font-sans text-slate-800 overflow-hidden">
            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentProfile={profile}
                onSave={handleSaveProfile}
            />

            <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white z-30 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-lg shadow-sm"><TrendingUp size={20} /></div>
                    <span className="font-bold text-xl tracking-tight text-slate-800">CareerCompass</span>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setView('map')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${view === 'map' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Explore</button>
                    <button onClick={() => setView('compare')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${view === 'compare' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Comparison</button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">

                {/* --- VIEW: MAP EXPLORER --- */}
                {view === 'map' && (
                    <>
                        <Sidebar
                            profile={profile}
                            setView={setView}
                            filters={filters}
                            setFilters={setFilters}
                            mapColor={mapColor}
                            setMapColor={setMapColor}
                            onEditProfile={() => setIsEditModalOpen(true)}
                        />
                        <div className="flex-1 relative bg-slate-50">

                            {/* HYBRID MAP RENDERER */}
                            {/* Use Google Maps ONLY if Key is present, otherwise fallback to Static Map */}
                            {GOOGLE_MAPS_API_KEY ? (
                                <GoogleMapComponent
                                    markers={filteredData}
                                    mapColor={mapColor}
                                    onMarkerClick={setDetailCity}
                                />
                            ) : (
                                <>
                                    <StaticMap
                                        markers={filteredData}
                                        mapColor={mapColor}
                                        onMarkerClick={setDetailCity}
                                    />
                                </>
                            )}

                            {/* Detail Panel */}
                            {detailCity && (
                                <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-0 z-[1000] overflow-hidden animate-in slide-in-from-right-4 duration-300 ring-1 ring-black/5">
                                    <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-start">
                                        <div>
                                            <h2 className="font-bold text-xl text-slate-800 leading-none mb-1">{detailCity.city}</h2>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{detailCity.country}</p>
                                        </div>
                                        <button onClick={() => setDetailCity(null)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 hover:shadow-sm transition"><X size={16} /></button>
                                    </div>

                                    <div className="p-5 space-y-6">
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center">Est. Income</div>
                                                <div className="font-bold text-green-600 text-lg">{formatCurrency(detailCity.projectedIncome)}</div>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center">Commute</div>
                                                <div className="font-bold text-slate-700 text-lg">{detailCity.commute} <span className="text-xs font-normal text-slate-400">min</span></div>
                                            </div>
                                        </div>

                                        {/* Weather Chart */}
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase">Weather Days</h4>
                                                <div className="text-xs font-bold text-slate-600">{detailCity.weather} ({detailCity.temp}°C)</div>
                                            </div>
                                            <div className="h-3 rounded-full flex overflow-hidden w-full">
                                                <div style={{width: `${(detailCity.sun/365)*100}%`}} className="bg-amber-400" title="Sunny"/>
                                                <div style={{width: `${(detailCity.rain/365)*100}%`}} className="bg-blue-400" title="Rainy"/>
                                                <div style={{width: `${(detailCity.snow/365)*100}%`}} className="bg-slate-300" title="Snowy"/>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
                                                <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1"></div>Sun</span>
                                                <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1"></div>Rain</span>
                                                <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1"></div>Snow</span>
                                            </div>
                                        </div>

                                        {/* Rent Chart Mock */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase">Rent Trend</h4>
                                                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">{formatCurrency(detailCity.rent)}/mo</span>
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

                                        <button
                                            onClick={() => {
                                                if (selectedCities.includes(detailCity.city)) setSelectedCities(selectedCities.filter(c => c !== detailCity.city));
                                                else if (selectedCities.length < 3) setSelectedCities([...selectedCities, detailCity.city]);
                                            }}
                                            className={`w-full py-3 rounded-xl font-bold text-sm transition transform active:scale-95 ${
                                                selectedCities.includes(detailCity.city)
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'}`}
                                        >
                                            {selectedCities.includes(detailCity.city) ? 'Remove from Compare' : 'Add to Compare'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Smart Comparison Bar */}
                            {selectedCities.length > 0 && (
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg border border-white/50 p-2 rounded-2xl shadow-2xl z-[900] flex items-center space-x-2 animate-in slide-in-from-bottom-8">
                                    <div className="flex space-x-2 px-2">
                                        {selectedCities.map((city, i) => (
                                            <div key={city} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                                                <span className="text-xs font-bold text-slate-700">{city}</span>
                                                <button onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))} className="text-slate-300 hover:text-red-500"><X size={12}/></button>
                                            </div>
                                        ))}
                                        {[...Array(3 - selectedCities.length)].map((_, i) => (
                                            <div key={i} className="w-24 h-8 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase">Empty Slot</div>
                                        ))}
                                    </div>
                                    <div className="w-px h-8 bg-slate-200 mx-2"></div>
                                    <button onClick={() => setView('compare')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition">
                                        Compare
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* --- VIEW: COMPARISON DASHBOARD --- */}
                {view === 'compare' && (
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 w-full">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center mb-8">
                                <button onClick={() => setView('map')} className="mr-4 bg-white p-2.5 rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-600"><ArrowLeft size={20}/></button>
                                <h1 className="text-3xl font-extrabold text-slate-800">City Showdown</h1>
                            </div>

                            {selectedCities.length === 0 ? (
                                <div className="text-center py-32">
                                    <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><BarChart2 size={40} /></div>
                                    <h3 className="text-xl font-bold text-slate-400">No cities selected</h3>
                                    <p className="text-slate-400 mb-6">Go back to the map to add cities to your comparison.</p>
                                    <button onClick={() => setView('map')} className="text-blue-600 font-bold hover:underline">Back to Map</button>
                                </div>
                            ) : (
                                <>
                                    {/* Comparison Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {data.filter(c => selectedCities.includes(c.city)).map(city => (
                                            <div key={city.city} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 bg-blue-50 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-blue-600 uppercase tracking-wide">{city.country}</div>
                                                <h2 className="text-xl font-bold text-slate-800 mb-4">{city.city}</h2>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-500 font-medium">Projected Income</span>
                                                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{formatCurrency(city.projectedIncome)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-500 font-medium">Monthly Rent</span>
                                                        <span className="font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">{formatCurrency(city.rent)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-500 font-medium">Commute</span>
                                                        <span className="font-bold text-slate-700">{city.commute} min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* GRID LAYOUT FOR CHARTS: 4 COLUMNS (2 Top, 2 Bottom) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">

                                        {/* TOP LEFT: Financial Efficiency */}
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-800">Financial Efficiency</h3>
                                                        <p className="text-xs text-slate-400">Comparing Income (Bars) vs. Affordability Index (Line)</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowCalcInfo(!showCalcInfo)}
                                                        className="text-slate-400 hover:text-blue-500 transition"
                                                        title="How is this calculated?"
                                                    >
                                                        <Info size={18} />
                                                    </button>
                                                </div>

                                                {/* Calculation Info Toggle */}
                                                {showCalcInfo && (
                                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 border border-blue-100 animate-in fade-in zoom-in duration-200">
                                                        <strong>Affordability Index Calculation:</strong><br/>
                                                        <code>(Projected Annual Income) / (Annual Rent)</code>
                                                        <br/>A score of <strong>3.0+</strong> means rent is affordable (less than 33% of income).
                                                    </div>
                                                )}
                                            </div>
                                            <div className="h-72">
                                                <ResponsiveContainer>
                                                    <ComposedChart data={data.filter(c => selectedCities.includes(c.city))}>
                                                        <defs>
                                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="city" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />

                                                        {/* Left Y Axis: Income (Rounded K format ONLY for Chart) */}
                                                        <YAxis yAxisId="left" tickFormatter={(val) => `$${Math.round(val/1000)}k`} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />

                                                        {/* Right Y Axis: Affordability Index (Rounded 1 decimal) */}
                                                        <YAxis yAxisId="right" orientation="right" domain={[0, 6]} tickFormatter={(val) => val.toFixed(1)} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#3b82f6'}} />

                                                        <RechartsTooltip
                                                            cursor={{fill: '#f8fafc'}}
                                                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                                            formatter={(value, name) => {
                                                                // Round specifically for this chart tooltip
                                                                if (name === "Projected Income") return [`$${Math.round(value/1000)}k`, name];
                                                                if (name === "Affordability Index") return [value.toFixed(1), name];
                                                                return [value, name];
                                                            }}
                                                        />
                                                        <Legend iconType="circle" wrapperStyle={{paddingTop: '10px'}} />

                                                        {/* Bar: Projected Income */}
                                                        <Bar yAxisId="left" dataKey="projectedIncome" name="Projected Income" fill="url(#colorIncome)" radius={[4, 4, 0, 0]} barSize={50} />

                                                        {/* Line: Affordability Index */}
                                                        <Line yAxisId="right" type="monotone" dataKey="affordIndex" name="Affordability Index" stroke="#3b82f6" strokeWidth={3} dot={{r: 5, strokeWidth: 2, fill: 'white'}} activeDot={{r: 7}} />
                                                    </ComposedChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* TOP RIGHT: Weather Chart */}
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                            <div className="mb-6">
                                                <h3 className="font-bold text-lg text-slate-800">Weather (Yearly)</h3>
                                                <p className="text-xs text-slate-400">Seasonal Pattern: Winter → Summer → Winter</p>
                                            </div>
                                            <div className="h-72">
                                                <ResponsiveContainer>
                                                    <BarChart data={weatherChartData} layout="vertical" stackOffset="expand">
                                                        {/* Month labels on X-axis */}
                                                        <XAxis
                                                            type="number"
                                                            domain={[0, 1]}
                                                            ticks={[0, 1/11, 2/11, 3/11, 4/11, 5/11, 6/11, 7/11, 8/11, 9/11, 10/11, 1]}
                                                            tickFormatter={(val) => {
                                                                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                                                const index = Math.round(val * 11);
                                                                return months[index] || "";
                                                            }}
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{fontSize: 10, fill: '#94a3b8'}}
                                                            interval={0}
                                                        />
                                                        <YAxis dataKey="city" type="category" width={80} tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />

                                                        <Bar dataKey="part1" stackId="a" fill="#e2e8f0" radius={[6, 0, 0, 6]} name="Winter" />
                                                        <Bar dataKey="part2" stackId="a" fill="#93c5fd" name="Spring" />
                                                        <Bar dataKey="part3" stackId="a" fill="#fde047" name="Summer" />
                                                        <Bar dataKey="part4" stackId="a" fill="#fdba74" name="Autumn" />
                                                        <Bar dataKey="part5" stackId="a" fill="#e2e8f0" radius={[0, 6, 6, 0]} name="Winter" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* BOTTOM LEFT: Transit Score */}
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                            <div className="mb-6 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="bg-blue-50 p-2 rounded-lg mr-3 text-blue-600">
                                                        <Bus size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-800">Transit Score</h3>
                                                        <p className="text-xs text-slate-400">Public transport accessibility (0-100)</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowTransitInfo(!showTransitInfo)}
                                                    className="text-slate-400 hover:text-blue-500 transition"
                                                    title="What does this score mean?"
                                                >
                                                    <Info size={18} />
                                                </button>
                                            </div>

                                            {/* Transit Info Toggle */}
                                            {showTransitInfo && (
                                                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 border border-blue-100 animate-in fade-in zoom-in duration-200">
                                                    <strong>Transit Score Definition:</strong><br/>
                                                    A measure of how well a location is served by public transit.<br/>
                                                    • <strong>90-100:</strong> Rider's Paradise (World-class transit)<br/>
                                                    • <strong>70-89:</strong> Excellent Transit (Convenient for most trips)<br/>
                                                    • <strong>50-69:</strong> Good Transit (Many nearby options)<br/>
                                                    • <strong>0-49:</strong> Minimal Transit (Car required)
                                                </div>
                                            )}

                                            <div className="h-64">
                                                <ResponsiveContainer>
                                                    <BarChart data={data.filter(c => selectedCities.includes(c.city))}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="city" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                                        <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                                        <Bar dataKey="transitScore" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Score" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* BOTTOM RIGHT: Work Hours Distribution - UPDATED TO HORIZONTAL BAR CHART */}
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                            <div className="mb-6 flex items-center">
                                                <div className="bg-orange-50 p-2 rounded-lg mr-3 text-orange-600">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-800">Avg. Weekly Hours</h3>
                                                    <p className="text-xs text-slate-400">Standard 40h week comparison</p>
                                                </div>
                                            </div>
                                            <div className="h-64">
                                                <ResponsiveContainer>
                                                    {/* Switched to horizontal layout for better readability */}
                                                    <BarChart layout="vertical" data={data.filter(c => selectedCities.includes(c.city))}>
                                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                                        <XAxis type="number" domain={[30, 50]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                                        <YAxis dataKey="city" type="category" width={80} tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                                                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />

                                                        {/* Reference Line for 40h Standard */}
                                                        <ReferenceLine x={40} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: '40h', fill: 'red', fontSize: 10 }} />

                                                        <Bar dataKey="workHours" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} name="Hours/Week" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

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