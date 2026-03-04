import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../services/api';
import { useNavigate } from 'react-router-dom';
import HotelLogo from "../assets/Hotel_Logo.png";
const DashboardPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await getAllRooms();
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        available: rooms.filter(r => r.status === 'AVAILABLE').length,
        occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
        maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length,
    };

    const getRoomStyles = (status) => {
        switch (status) {
            case 'AVAILABLE': return {
                bg: 'bg-status-green/10',
                border: 'border-status-green/30',
                hover: 'hover:bg-status-green/20',
                text: 'text-status-green'
            };
            case 'OCCUPIED': return {
                bg: 'bg-status-red/10',
                border: 'border-status-red/30',
                hover: 'hover:bg-status-red/20',
                text: 'text-status-red'
            };
            case 'MAINTENANCE': return {
                bg: 'bg-status-yellow/10',
                border: 'border-status-yellow/30',
                hover: 'hover:bg-status-yellow/20',
                text: 'text-status-yellow'
            };
            default: return {
                bg: 'bg-slate-100',
                border: 'border-slate-200',
                hover: 'hover:bg-slate-200',
                text: 'text-slate-400'
            };
        }
    };

    const handleBookNow = (room) => {
        navigate('/reservation', {
            state: {
                roomNumber: room.roomNumber,
                roomType: room.roomType,
                pricePerNight: room.pricePerNight
            }
        });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border bg-white px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/')}>
                        <img src={HotelLogo} alt="Hotel Logo" className="h-10 w-auto object-contain" />
                        <h2 className="text-slate-900 text-lg font-bold">Reservation Management</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <nav className="flex items-center gap-8">
                            <button onClick={() => navigate('/')} className="text-primary text-sm font-bold border-b-2 border-primary pb-1">Dashboard</button>
                            <button onClick={() => navigate('/reservations')} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">Reservations</button>
                            <button onClick={() => navigate('/guests')} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">Guests</button>
                        </nav>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
                            <p className="text-slate-500 text-base">Real-time hotel status and room availability summary.</p>
                        </div>
                        <button
                            onClick={() => navigate('/reservation')}
                            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-xl">person_add</span>
                            <span>New Booking</span>
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="p-2 bg-status-green/10 text-status-green rounded-lg material-symbols-outlined">meeting_room</span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium">Available Rooms</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.available}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="p-2 bg-status-red/10 text-status-red rounded-lg material-symbols-outlined">person_pin_circle</span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium">Occupied Rooms</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.occupied}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="p-2 bg-status-yellow/10 text-status-yellow rounded-lg material-symbols-outlined">cleaning_services</span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium">Maintenance</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.maintenance}</p>
                        </div>
                    </div>

                    {/* Floor Plan */}
                    <div className="bg-white rounded-xl border border-border shadow-sm p-6 mb-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Room Status Floor Plan</h3>
                                <p className="text-sm text-text-secondary">All Floors Overview</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-status-green"></span>
                                    <span className="text-text-secondary">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-status-red"></span>
                                    <span className="text-text-secondary">Occupied</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-status-yellow"></span>
                                    <span className="text-text-secondary">Maintenance</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
                            {rooms.map(room => {
                                const styles = getRoomStyles(room.status);
                                return (
                                    <div
                                        key={room.roomNumber}
                                        onClick={() => room.status === 'AVAILABLE' && handleBookNow(room)}
                                        className={`aspect-square ${styles.bg} border-2 ${styles.border} ${styles.hover} rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all`}
                                    >
                                        <span className={`text-sm font-bold ${styles.text}`}>{room.roomNumber}</span>
                                    </div>
                                );
                            })}
                            {rooms.length === 0 && <p className="col-span-full text-center text-text-secondary py-4">No rooms found.</p>}
                        </div>
                    </div>

                    {/* Room Cards (Available Only) */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Non-Reserved Rooms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {rooms.filter(r => r.status === 'AVAILABLE').map(room => (
                                <div key={room.roomNumber} className="bg-white rounded-xl border border-border overflow-hidden group hover:shadow-xl transition-all">
                                    <div className="h-48 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-300 text-5xl">bed</span>
                                        <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded uppercase">Ready</div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{room.roomType}</h3>
                                                <p className="text-xs text-text-secondary">Room {room.roomNumber}</p>
                                            </div>
                                            <span className="text-primary font-bold">Rs{room.pricePerNight}<span className="text-xs text-text-secondary font-medium">/nt</span></span>
                                        </div>
                                        <div className="flex gap-4 mb-6">
                                            <div className="flex items-center gap-1 text-text-secondary">
                                                <span className="material-symbols-outlined !text-base">person</span>
                                                <span className="text-xs font-medium">{room.capacity} Guests</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleBookNow(room)}
                                            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
