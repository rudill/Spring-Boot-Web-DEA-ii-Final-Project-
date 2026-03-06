import React, { useState, useEffect, useMemo } from 'react';
import { getAllGuests, getAllReservations } from '../services/api';
import { useNavigate } from 'react-router-dom';

const GuestDirectoryPage = () => {
    const [guests, setGuests] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [guestsRes, resRes] = await Promise.all([
                getAllGuests(),
                getAllReservations()
            ]);
            setGuests(guestsRes.data);
            setReservations(resRes.data);
        } catch (error) {
            console.error('Error fetching guest data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGuestStats = (guestId) => {
        const guestRes = reservations.filter(r => r.guestId === guestId);
        const totalStays = guestRes.length;
        const lastStay = guestRes.length > 0
            ? guestRes.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))[0]
            : null;

        return { totalStays, lastStay };
    };

    const filteredGuests = useMemo(() => {
        return guests.filter(guest => {
            const fullName = `${guest.firstName || ''} ${guest.lastName || ''}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest.phone?.includes(searchTerm);


            return matchesSearch;
        });
    }, [guests, searchTerm]);

    return (
        <main className="flex-1 px-10 py-8 max-w-[1440px] mx-auto w-full">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight">Guest Directory</h1>
                    <p className="text-slate-500 text-base">Manage profiles and view booking history for all registered guests.</p>
                </div>
                <button
                    onClick={() => navigate('/reservation')}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-xl">person_add</span>
                    <span>Add New Guest</span>
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900"
                            placeholder="Search by name, email, or phone..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                <th className="px-6 py-4">Guest Name</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Total Stays</th>
                                <th className="px-6 py-4">Last Stay</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading guests...</td></tr>
                            ) : filteredGuests.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No guests found.</td></tr>
                            ) : filteredGuests.map(guest => {
                                const stats = getGuestStats(guest.guestId);
                                return (
                                    <tr key={guest.guestId} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {(guest.firstName?.[0] || '') + (guest.lastName?.[0] || '')}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{guest.firstName} {guest.lastName}</div>
                                                    <div className="text-xs text-slate-500">Member since {new Date().getFullYear()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-slate-700 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm opacity-60">mail</span>
                                                    {guest.email}
                                                </span>
                                                <span className="text-slate-500 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm opacity-60">call</span>
                                                    {guest.phoneNumber}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900">{stats.totalStays}</span>
                                                {stats.totalStays > 0 && (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Active Guest</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                {stats.lastStay ? (
                                                    <>
                                                        <div className="text-slate-900 font-medium">{new Date(stats.lastStay.checkInDate).toLocaleDateString()}</div>
                                                        <div className="text-xs text-slate-500">Room {stats.lastStay.roomId}</div>
                                                    </>
                                                ) : (
                                                    <div className="text-slate-400 italic">No history</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate(`/guests/${guest.guestId}`)}
                                                className="text-primary hover:text-primary/80 font-bold text-sm bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-all"
                                            >
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-bold text-slate-900">{filteredGuests.length}</span> of <span className="font-bold text-slate-900">{guests.length}</span> guests
                    </p>
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30" disabled>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="px-3.5 py-1.5 rounded-lg bg-primary text-white font-bold text-sm">1</button>
                        <button className="p-2 rounded hover:bg-slate-200 text-slate-600">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default GuestDirectoryPage;
