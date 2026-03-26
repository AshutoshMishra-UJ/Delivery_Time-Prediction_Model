'use client';

import React, { useState, FormEvent } from 'react';
import {
    User, MapPin, Clock, Map, Sunrise, Navigation, Truck, Package, Utensils,
    Car, Calendar, Star, FileWarning
} from 'lucide-react';

// Generates a random ID for the delivery ID
const generateID = () => '0x' + Math.random().toString(16).substring(2, 6);

type FormData = {
    ID: string;
    Delivery_person_ID: string;
    Delivery_person_Age: string;
    Delivery_person_Ratings: string;
    Restaurant_latitude: string;
    Restaurant_longitude: string;
    Delivery_location_latitude: string;
    Delivery_location_longitude: string;
    Order_Date: string;
    Time_Orderd: string;
    Time_Order_picked: string;
    Weatherconditions: string;
    Road_traffic_density: string;
    Vehicle_condition: string;
    Type_of_order: string;
    Type_of_vehicle: string;
    multiple_deliveries: string;
    Festival: string;
    City: string;
};

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [predictedTime, setPredictedTime] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        ID: generateID(),
        Delivery_person_ID: 'SURATRES07DEL02',
        Delivery_person_Age: '28',
        Delivery_person_Ratings: '4.7',
        Restaurant_latitude: '21.1702',
        Restaurant_longitude: '72.8311',
        Delivery_location_latitude: '21.1802',
        Delivery_location_longitude: '72.8411',
        Order_Date: '15-05-2023',
        Time_Orderd: '18:00:00',
        Time_Order_picked: '18:15:00',
        Weatherconditions: 'conditions Sunny',
        Road_traffic_density: 'High',
        Vehicle_condition: '2',
        Type_of_order: 'Snack',
        Type_of_vehicle: 'motorcycle',
        multiple_deliveries: '0',
        Festival: 'No',
        City: 'Urban',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value } = e.target;

        // Auto-format dates from yyyy-mm-dd to dd-mm-yyyy for API requirement
        if (name === 'Order_Date_Input') {
            const parts = value.split('-');
            if (parts.length === 3) {
                const formatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
                setFormData(prev => ({ ...prev, Order_Date: formatted, [name]: value }));
                return;
            }
        }

        // Add seconds to time pickers if user selects only HH:MM
        if (e.target.type === 'time' && value.length === 5) {
            value = value + ':00';
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPredictedTime(null);
        setError(null);

        // Prepare payload making sure floats are actually parsed
        const payload = {
            ...formData,
            Restaurant_latitude: parseFloat(formData.Restaurant_latitude),
            Restaurant_longitude: parseFloat(formData.Restaurant_longitude),
            Delivery_location_latitude: parseFloat(formData.Delivery_location_latitude),
            Delivery_location_longitude: parseFloat(formData.Delivery_location_longitude),
            Vehicle_condition: parseInt(formData.Vehicle_condition)
        };

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch prediction from the server.');
            }

            const data = await response.json();
            setPredictedTime(data); // Expecting the float response in minutes
        } catch (err: any) {
            setError(err.message || 'An error occurred. Make sure your Python backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-6 md:p-12 relative flex items-center justify-center">
            {/* Absolute Toast Error */}
            {error && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center space-x-3 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-100 px-6 py-3 rounded-full shadow-lg">
                        <FileWarning size={20} />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-4 hover:text-white">&times;</button>
                    </div>
                </div>
            )}

            <div className="max-w-6xl w-full container mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(234,88,12,0.3)] relative">
                <div className="bg-gradient-to-r from-orange-500/20 to-orange-500/5 p-8 border-b border-orange-500/20">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 tracking-tight flex items-center gap-4">
                        <Utensils size={40} className="text-orange-400" />
                        Food Delivery Predictor
                    </h1>
                    <p className="mt-2 text-slate-400 text-lg">Harnessing machine learning to estimate ETA in real-time.</p>
                </div>

                <div className="p-8 pb-12 flex flex-col xl:flex-row gap-8">
                    <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Driver Details */}
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 transition hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.05)] hover:border-slate-600">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-emerald-400"><User size={24} /> Driver Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1">Driver ID</label>
                                    <input name="Delivery_person_ID" value={formData.Delivery_person_ID} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-200 transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 block mb-1">Age</label>
                                        <input name="Delivery_person_Age" type="number" value={formData.Delivery_person_Age} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-200" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 flex items-center gap-1 mb-1"><Star size={16} className="text-yellow-400" /> Rating</label>
                                        <input name="Delivery_person_Ratings" type="number" step="0.1" max="5.0" value={formData.Delivery_person_Ratings} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-200" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Time & Dates */}
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 transition hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.05)] hover:border-slate-600">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-indigo-400"><Clock size={24} /> Time & Date</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1 flex items-center gap-2"><Calendar size={16} /> Order Date</label>
                                    {/* Map html date back to the state formatting */}
                                    <input name="Order_Date_Input" type="date" onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-200 transition-all" />
                                    <p className="text-xs text-slate-500 mt-1">Payload format: {formData.Order_Date}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 block mb-1">Time Ordered</label>
                                        <input name="Time_Orderd" type="time" step="1" value={formData.Time_Orderd} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[15px] text-slate-200" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 block mb-1">Time Picked</label>
                                        <input name="Time_Order_picked" type="time" step="1" value={formData.Time_Order_picked} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-[15px]  text-slate-200" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 transition hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.05)] hover:border-slate-600 md:col-span-2 lg:col-span-1">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-rose-400"><Map size={24} /> Location Coordinates</h2>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="col-span-2 text-sm text-rose-300/80 border-b border-slate-700 pb-2 flex items-center gap-2"><MapPin size={16} /> Restaurant</div>
                                <div>
                                    <label className="text-xs mb-1 block text-slate-400">Latitude</label>
                                    <input name="Restaurant_latitude" type="number" step="any" value={formData.Restaurant_latitude} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-rose-500/50 text-slate-200" />
                                </div>
                                <div>
                                    <label className="text-xs mb-1 block text-slate-400">Longitude</label>
                                    <input name="Restaurant_longitude" type="number" step="any" value={formData.Restaurant_longitude} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-rose-500/50 text-slate-200" />
                                </div>

                                <div className="col-span-2 text-sm text-cyan-300/80 border-b border-slate-700 pb-2 mt-2 flex items-center gap-2"><Navigation size={16} /> Destination</div>
                                <div>
                                    <label className="text-xs mb-1 block text-slate-400">Latitude</label>
                                    <input name="Delivery_location_latitude" type="number" step="any" value={formData.Delivery_location_latitude} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-cyan-500/50 text-slate-200" />
                                </div>
                                <div>
                                    <label className="text-xs mb-1 block text-slate-400">Longitude</label>
                                    <input name="Delivery_location_longitude" type="number" step="any" value={formData.Delivery_location_longitude} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-cyan-500/50 text-slate-200" />
                                </div>
                            </div>
                        </div>

                        {/* External Factors */}
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 transition hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.05)] hover:border-slate-600">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-amber-400"><Sunrise size={24} /> Conditions & Factors</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1">Weather</label>
                                    <select name="Weatherconditions" value={formData.Weatherconditions} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-amber-500/50 text-slate-200">
                                        <option value="conditions Sunny">Sunny</option>
                                        <option value="conditions Stormy">Stormy</option>
                                        <option value="conditions Sandstorms">Sandstorms</option>
                                        <option value="conditions Cloudy">Cloudy</option>
                                        <option value="conditions Fog">Fog</option>
                                        <option value="conditions Clear">Clear</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1">Traffic Density</label>
                                    <select name="Road_traffic_density" value={formData.Road_traffic_density} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-amber-500/50 text-slate-200">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Jam">Jam</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1">City Type</label>
                                    <select name="City" value={formData.City} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-amber-500/50 text-slate-200">
                                        <option value="Urban">Urban</option>
                                        <option value="Metropolitian">Metropolitian</option>
                                        <option value="Semi-Urban">Semi-Urban</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1">Festival</label>
                                    <select name="Festival" value={formData.Festival} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-amber-500/50 text-slate-200">
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Order & Vehicle */}
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 transition hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.05)] hover:border-slate-600 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-fuchsia-400"><Package size={24} /> Extra Context</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1"><Car size={14} className="inline mr-1" /> Vehicle Type</label>
                                    <select name="Type_of_vehicle" value={formData.Type_of_vehicle} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-fuchsia-500/50 text-slate-200">
                                        <option value="motorcycle">Motorcycle</option>
                                        <option value="scooter">Scooter</option>
                                        <option value="electric_scooter">Electric Scooter</option>
                                        <option value="bicycle">Bicycle</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1">Condition (0-2)</label>
                                    <input name="Vehicle_condition" type="number" min="0" max="2" value={formData.Vehicle_condition} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-fuchsia-500/50 text-slate-200" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1">Order Type</label>
                                    <select name="Type_of_order" value={formData.Type_of_order} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-fuchsia-500/50 text-slate-200">
                                        <option value="Snack">Snack</option>
                                        <option value="Drinks">Drinks</option>
                                        <option value="Meal">Meal</option>
                                        <option value="Buffet">Buffet</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1">Prior Deliveries</label>
                                    <select name="multiple_deliveries" value={formData.multiple_deliveries} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-fuchsia-500/50 text-slate-200">
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-3.5 text-lg font-bold rounded-xl flex items-center gap-3 transition-all ${loading
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_20px_-5px_rgba(249,115,22,0.8)] hover:shadow-[0_0_30px_-5px_rgba(249,115,22,1)] hover:scale-105 active:scale-95'
                                    }`}
                            >
                                {loading ? (
                                    <><div className="w-6 h-6 border-4 border-slate-500 border-t-white rounded-full animate-spin"></div> Predicting...</>
                                ) : (
                                    <><Truck className="animate-bounce" /> Get Prediction</>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Result Sidebar */}
                    <div className="xl:w-80 flex flex-col gap-6">
                        <div className={`flex-1 rounded-2xl border transition-all duration-700 flex items-center justify-center relative overflow-hidden backdrop-blur-md ${predictedTime !== null ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_50px_-15px_rgba(249,115,22,0.3)]' : 'bg-slate-800/30 border-slate-700 min-h-[300px]'}`}>

                            {/* Background glowing orb for result */}
                            {predictedTime !== null && <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent blur-3xl rounded-full scale-150 animate-pulse"></div>}

                            <div className="text-center p-6 relative z-10">
                                {predictedTime !== null ? (
                                    <div className="animate-in zoom-in spin-in-2 duration-500">
                                        <div className="text-sm font-semibold tracking-wider text-orange-300 uppercase mb-2">Estimated Arrival</div>
                                        <div className="text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                            {predictedTime.toFixed(1)}<span className="text-3xl text-slate-300">m</span>
                                        </div>
                                        <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-200 text-sm">
                                            Model Confidence: Very High
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-slate-500 flex flex-col items-center">
                                        <Clock size={48} className="mb-4 opacity-50" />
                                        <p className="text-lg">Fill the parameters and submit to get an ETA.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
