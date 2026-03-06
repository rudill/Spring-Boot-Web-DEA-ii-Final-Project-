import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuestById, getReservationsByGuest, updateGuest, deleteGuest, deleteReservation } from '../services/api';

const GuestProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guest, setGuest] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        nic: ''
    });

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

            const guestData = guestRes.data;
            setGuest(guestData);
            setEditForm({
                firstName: guestData.firstName || '',
                lastName: guestData.lastName || '',
                email: guestData.email || '',
                phoneNumber: guestData.phoneNumber || guestData.phone || '',
                nic: guestData.nic || ''
            });

            // Sort reservations by check-in date descending
            const sortedRes = resRes.data.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
            setReservations(sortedRes);
        } catch (error) {
            console.error("Error fetching guest profile data", error);
            showNotification('Failed to load guest data', 'error');
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
            case 'CONFIRMED': return 'bg-green-100 text-green-700';
            case 'COMPLETED':
            case 'CHECKED-OUT': return 'bg-gray-100 text-gray-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedGuest = { ...guest, ...editForm };
            await updateGuest(updatedGuest);
            setGuest(updatedGuest);
            setIsEditModalOpen(false);
            showNotification('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating guest:", error);
            showNotification('Failed to update profile. Please try again.', 'error');
        }
    };

    const handleDeleteReservation = async (reservationId) => {
        if (window.confirm('Are you sure you want to delete this reservation? This action cannot be undone.')) {
            try {
                await deleteReservation(reservationId);
                showNotification('Reservation deleted successfully!');
                const resRes = await getReservationsByGuest(id);
                const sortedRes = resRes.data.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
                setReservations(sortedRes);
            } catch (error) {
                console.error("Error deleting reservation:", error);
                showNotification('Failed to delete reservation. Please try again.', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
        <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full">
            <section className="flex-1 p-4 lg:p-8 flex flex-col gap-6">
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
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl overflow-hidden ring-4 ring-slate-50">
                                {(guest.firstName?.[0] || '') + (guest.lastName?.[0] || '')}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{guest.firstName} {guest.lastName}</h1>
                                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                    <span className="font-semibold text-slate-600">Guest Record</span>
                                    <span>•</span>
                                    <span>Guest ID: #{guest.guestId}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-5 py-2.5 rounded-lg border border-border bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => navigate('/reservation')}
                                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                New Booking
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                        <div className="flex flex-col gap-1">
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Stays</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.stays}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Nights Stayed</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.nights}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Spend</p>
                            <p className="text-2xl font-bold text-slate-900">Rs {stats.spend.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 border border-border rounded-xl p-6 bg-white shadow-sm">
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
                                <span className="text-sm font-medium">{guest.phoneNumber || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase">Identification (NIC)</span>
                                <span className="text-sm font-medium">{guest.nic || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                        <div className="border-b border-border px-6 py-4 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">history</span>
                                Stay History
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                        <th className="px-6 py-3">Reservation</th>
                                        <th className="px-6 py-3">Dates</th>
                                        <th className="px-6 py-3">Room</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                                                No reservations found for this guest.
                                            </td>
                                        </tr>
                                    ) : (
                                        reservations.map(res => (
                                            <tr key={res.reservationId} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-slate-900">#RES-{res.reservationId}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {new Date(res.checkInDate).toLocaleDateString()} - {new Date(res.checkOutDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-700">Room {res.roomId}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                                    Rs {res.totalAmount?.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(res.status)}`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteReservation(res.reservationId)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Reservation"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {notification.show && (
                <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl font-bold text-sm z-[200] flex items-center gap-2 animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <span className="material-symbols-outlined text-xl">
                        {notification.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {notification.message}
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-900">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Edit Guest Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">First Name</label>
                                        <input type="text" name="firstName" required value={editForm.firstName || ''} onChange={handleEditChange} className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                        <input type="text" name="lastName" required value={editForm.lastName || ''} onChange={handleEditChange} className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <input type="email" name="email" value={editForm.email || ''} onChange={handleEditChange} className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                    <input type="tel" name="phoneNumber" required value={editForm.phoneNumber || ''} onChange={handleEditChange} className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">NIC / Identification</label>
                                    <input type="text" name="nic" required value={editForm.nic || ''} onChange={handleEditChange} className="px-3 py-2 bg-slate-50 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default GuestProfilePage;
