import React, { useState, useEffect, useMemo } from 'react';
import { getAllReservations, updateReservationStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';
import HotelLogo from "../assets/Hotel_Logo.png";

const ViewReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [rooms, setRooms] = useState([]); // Added to support room type filter
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateRangeFilter, setDateRangeFilter] = useState('All');
    const [roomTypeFilter, setRoomTypeFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resResponse, roomsResponse] = await Promise.all([
                getAllReservations(),
                import('../services/api').then(m => m.getAllRooms())
            ]);
            setReservations(resResponse.data);
            setRooms(roomsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await getAllReservations();
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateReservationStatus(id, newStatus);
            // Refresh the list
            fetchReservations();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const calculateNights = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = end.getTime() - start.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const filteredReservations = useMemo(() => {
        let result = reservations.filter(res => {
            const guestName = `${res.guest?.firstName || ''} ${res.guest?.lastName || ''}`.toLowerCase();
            const matchesSearch = guestName.includes(searchTerm.toLowerCase()) ||
                res.roomId?.toString().includes(searchTerm) ||
                res.reservationId?.toString().includes(searchTerm);

            const matchesStatus = statusFilter === 'All' || res.status === statusFilter.toUpperCase();

            // Room Type Filter
            let matchesRoomType = true;
            if (roomTypeFilter !== 'All') {
                const room = rooms.find(r => r.roomNumber === res.roomId);
                matchesRoomType = room?.roomType === roomTypeFilter;
            }

            // Date Range Filter
            let matchesDateRange = true;
            if (dateRangeFilter !== 'All') {
                const checkIn = new Date(res.checkInDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (dateRangeFilter === 'Today') {
                    matchesDateRange = checkIn.toDateString() === today.toDateString();
                } else if (dateRangeFilter === 'Next 7 Days') {
                    const nextWeek = new Date(today);
                    nextWeek.setDate(today.getDate() + 7);
                    matchesDateRange = checkIn >= today && checkIn <= nextWeek;
                } else if (dateRangeFilter === 'This Month') {
                    matchesDateRange = checkIn.getMonth() === today.getMonth() && checkIn.getFullYear() === today.getFullYear();
                }
            }

            return matchesSearch && matchesStatus && matchesRoomType && matchesDateRange;
        });

        // Sorting by check-in date (descending)
        return result.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
    }, [reservations, rooms, searchTerm, statusFilter, dateRangeFilter, roomTypeFilter]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CHECKED-IN':
            case 'CONFIRMED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-600';
            case 'CHECKED-OUT': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-600';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-600';
            case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    const getStatusDotColor = (status) => {
        switch (status) {
            case 'CHECKED-IN':
            case 'CONFIRMED': return 'bg-green-500';
            case 'CHECKED-OUT': return 'bg-gray-500';
            case 'PENDING': return 'bg-yellow-500';
            case 'CANCELLED': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className="layout-container flex h-full grow flex-col bg-background">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border bg-white px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/')}>
                    <img src={HotelLogo} alt="Hotel Logo" className="h-10 w-auto object-contain" />
                    <h2 className="text-slate-900 text-lg font-bold">Reservation Management</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <nav className="flex items-center gap-8">
                        <button onClick={() => navigate('/')} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">Dashboard</button>
                        <button onClick={() => navigate('/reservations')} className="text-primary text-sm font-bold border-b-2 border-primary pb-1">Reservations</button>
                        <button onClick={() => navigate('/guests')} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">Guests</button>
                    </nav>
                </div>
            </header>

            <main className="px-10 flex flex-1 justify-center py-8">
                <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-slate-900 text-4xl font-black">Reservations</h1>
                                <p className="text-slate-500 text-base">Manage and monitor guest bookings and room statuses.</p>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-border">
                            <div className="md:col-span-2 relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900"
                                    placeholder="Search by guest, room, or booking ID..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_today</span>
                                <select
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900 appearance-none"
                                    value={dateRangeFilter}
                                    onChange={(e) => setDateRangeFilter(e.target.value)}
                                >
                                    <option value="All">Date Range: All</option>
                                    <option value="Today">Today</option>
                                    <option value="Next 7 Days">Next 7 Days</option>
                                    <option value="This Month">This Month</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${statusFilter === status
                                    ? 'bg-primary text-white'
                                    : 'bg-white border border-border text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {status} {status === 'All' ? `(${reservations.length})` : ''}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room No</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading reservations...</td></tr>
                                ) : filteredReservations.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No reservations found.</td></tr>
                                ) : filteredReservations.map(res => (
                                    <tr key={res.reservationId} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {(res.guest?.firstName?.[0] || '') + (res.guest?.lastName?.[0] || '')}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{res.guest?.firstName} {res.guest?.lastName}</p>
                                                    <p className="text-xs text-slate-500">#RES-{res.reservationId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-slate-100 text-xs font-bold">{res.roomId}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <p>{new Date(res.checkInDate).toLocaleDateString()} - {new Date(res.checkOutDate).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-500">{calculateNights(res.checkInDate, res.checkOutDate)} Nights</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-primary">
                                            Rs{res.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(res.status)}`}>
                                                <span className={`size-1.5 rounded-full ${getStatusDotColor(res.status)}`}></span>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select
                                                className="text-primary bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-sm focus:ring-1 focus:ring-primary outline-none"
                                                value={res.status}
                                                onChange={(e) => handleStatusUpdate(res.reservationId, e.target.value)}
                                            >
                                                <option value="CONFIRMED">Confirm</option>
                                                <option value="CHECKED-IN">Check In</option>
                                                <option value="CHECKED-OUT">Check Out</option>
                                                <option value="CANCELLED">Cancel</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-border">
                            <p className="text-sm text-slate-500">Showing {filteredReservations.length} of {reservations.length} reservations</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm disabled:opacity-50">Previous</button>
                                <button className="px-3 py-1 rounded bg-primary text-white text-sm font-bold">1</button>
                                <button className="px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="mt-auto py-6 px-10 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500">© {new Date().getFullYear()} Hotel Management Systems. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ViewReservationsPage;
