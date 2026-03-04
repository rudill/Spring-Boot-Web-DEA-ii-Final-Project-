import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuestById, getReservationsByGuest, updateGuest, deleteGuest } from '../services/api';
import HotelLogo from "../assets/Hotel_Logo.png";
const GuestProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guest, setGuest] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);

    // Notifications
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    useEffect(() => {
        fetchGuestProfile();
    }, [id]);

    const fetchGuestProfile = async () => {
        setLoading(true);
        try {
            const [guestRes, resRes] = await Promise.all([
                getGuestById(id),
                getReservationsByGuest(id)
            ]);
            setGuest(guestRes.data);
            setEditFormData(guestRes.data);

            // Sort reservations by check-in date descending
            const sortedRes = resRes.data.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
            setReservations(sortedRes);
        } catch (error) {
            console.error("Error fetching guest profile data", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        if (!reservations.length) return { stays: 0, nights: 0, spend: 0 };
        return reservations.reduce((acc, current) => {
            acc.stays += 1;
            acc.spend += current.totalAmount || 0;

            if (current.checkInDate && current.checkOutDate) {
                const start = new Date(current.checkInDate);
                const end = new Date(current.checkOutDate);
                const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                acc.nights += nights > 0 ? nights : 0;
            }
            return acc;
        }, { stays: 0, nights: 0, spend: 0 });
    }, [reservations]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CHECKED-IN':
            case 'CONFIRMED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-600';
            case 'COMPLETED':
            case 'CHECKED-OUT': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-600';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-600';
            case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateGuest(editFormData);
            setGuest(editFormData);
            setIsEditModalOpen(false);
            showNotification('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating guest:", error);
            showNotification('Failed to update profile. Please try again.', 'error');
        }
    };

    const handleDeleteGuest = async () => {
        if (window.confirm('Are you sure you want to delete this guest profile? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await deleteGuest(guest);
                showNotification('Guest deleted successfully!');
                setTimeout(() => navigate('/guests'), 1500);
            } catch (error) {
                console.error("Error deleting guest:", error);
                showNotification('Failed to delete guest. Please try again.', 'error');
                setIsDeleting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <p className="text-slate-500 font-medium">Loading guest profile...</p>
            </div>
        );
    }

    if (!guest) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
                <p className="text-slate-500 font-medium">Guest not found.</p>
                <button onClick={() => navigate('/guests')} className="text-primary hover:underline font-medium">Return to Directory</button>
            </div>
        );
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background">
            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border bg-white px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/')}>
                        <img src={HotelLogo} alt="Hotel Logo" className="h-10 w-auto object-contain" />
                        <h2 className="text-slate-900 text-lg font-bold">Reservation Management</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <nav className="flex items-center gap-8">
                            <button onClick={() => navigate('/')} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">Dashboard</button>
                            <button onClick={() => navigate('/reservations')} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">Reservations</button>
                            <button onClick={() => navigate('/guests')} className="text-primary text-sm font-bold border-b-2 border-primary pb-1">Guests</button>
                        </nav>
                    </div>
                </header>

                <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full">
                    {/* Main Content Area */}
                    <section className="flex-1 p-4 lg:p-8 flex flex-col gap-6">
                        {/* Profile Header */}
                        <div className="flex items-center gap-2 mb-2 text-sm">
                            <button onClick={() => navigate('/guests')} className="text-slate-500 hover:text-primary font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Directory
                            </button>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-900 font-bold">{guest.firstName} {guest.lastName}</span>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl overflow-hidden ring-4 ring-slate-50">
                                            {(guest.firstName?.[0] || '') + (guest.lastName?.[0] || '')}
                                        </div>
                                        {stats.stays > 5 && (
                                            <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-amber-400 border-4 border-white flex items-center justify-center" title="Gold Member">
                                                <span className="material-symbols-outlined text-white text-[16px]">military_tech</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900">{guest.firstName} {guest.lastName}</h1>
                                        <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                            {stats.stays > 5 ? (
                                                <span className="font-semibold text-amber-600">Gold Status</span>
                                            ) : (
                                                <span className="font-semibold text-slate-600">Standard Member</span>
                                            )}
                                            <span>•</span>
                                            <span>Guest ID: #{guest.guestId}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-border bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/reservation')}
                                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        New Booking
                                    </button>
                                </div>
                            </div>

                            {/* Profile Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                                <div className="flex flex-col gap-1">
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Stays</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.stays}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Nights</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.nights}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Spend to Date</p>
                                    <p className="text-2xl font-bold text-slate-900">Rs {stats.spend.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Column 1: Personal Info & Preferences */}
                            <div className="lg:col-span-1 flex flex-col gap-6">
                                {/* Contact Info */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-xl">contact_page</span>
                                        Personal Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 uppercase">Email Address</span>
                                            <span className="text-sm font-medium">{guest.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 uppercase">Phone Number</span>
                                            <span className="text-sm font-medium">{guest.phoneNumber || guest.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 uppercase">Identification (NIC)</span>
                                            <span className="text-sm font-medium">{guest.nic || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border flex justify-end">
                                        <button
                                            onClick={handleDeleteGuest}
                                            disabled={isDeleting}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            {isDeleting ? 'Deleting...' : 'Delete Guest Profile'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 & 3: Bookings */}
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                {/* Bookings Tabs */}
                                <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                                    <div className="border-b border-border px-6 pt-4">
                                        <div className="flex gap-8">
                                            <button className="pb-3 text-sm font-bold text-primary border-b-2 border-primary">Stay History</button>
                                        </div>
                                    </div>
                                    <div className="p-0 overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                                    <th className="px-6 py-3">Reservation</th>
                                                    <th className="px-6 py-3">Dates</th>
                                                    <th className="px-6 py-3">Room</th>
                                                    <th className="px-6 py-3">Amount</th>
                                                    <th className="px-6 py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {reservations.length === 0 ? (
                                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No reservations found for this guest.</td></tr>
                                                ) : reservations.map(res => (
                                                    <tr key={res.reservationId} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-semibold">#RES-{res.reservationId}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">
                                                            {new Date(res.checkInDate).toLocaleDateString()} - {new Date(res.checkOutDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium">Room {res.roomId}</td>
                                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                                            Rs {res.totalAmount?.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(res.status)}`}>
                                                                {res.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl font-bold text-sm z-50 flex items-center gap-2 animate-bounce ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    <span className="material-symbols-outlined text-xl">
                        {notification.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {notification.message}
                </div>
            )}

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Edit Guest Profile</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">First Name</label>
                                        <input
                                            type="text" name="firstName" required
                                            value={editFormData.firstName || ''} onChange={handleEditChange}
                                            className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                        <input
                                            type="text" name="lastName" required
                                            value={editFormData.lastName || ''} onChange={handleEditChange}
                                            className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <input
                                        type="email" name="email"
                                        value={editFormData.email || ''} onChange={handleEditChange}
                                        className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                    <input
                                        type="tel" name="phoneNumber" required
                                        value={editFormData.phoneNumber || editFormData.phone || ''} onChange={handleEditChange}
                                        className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">NIC / Identification</label>
                                    <input
                                        type="text" name="nic" required
                                        value={editFormData.nic || ''} onChange={handleEditChange}
                                        className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestProfilePage;
