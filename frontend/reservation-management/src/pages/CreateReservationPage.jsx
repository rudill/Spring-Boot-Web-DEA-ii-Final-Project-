import React, { useState, useEffect, useMemo } from 'react';
import { saveGuest, saveReservation } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import HotelLogo from "../assets/Hotel_Logo.png";

const CreateReservationPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    // Default values or passed state
    const initialRoomType = state?.roomType || 'DELUXE';
    const initialPrice = state?.pricePerNight || 250;
    const initialRoomNumber = state?.roomNumber || '';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        nic: '',
        checkInDate: '',
        checkOutDate: '',
        roomType: initialRoomType,
        numberOfGuests: '2',
        specialRequests: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Calculate stay duration and costs
    const reservationSummary = useMemo(() => {
        if (!formData.checkInDate || !formData.checkOutDate) {
            return { nights: 0, basePrice: 0, tax: 0, total: 0 };
        }

        const start = new Date(formData.checkInDate);
        const end = new Date(formData.checkOutDate);

        // Difference in milliseconds
        const diffTime = end.getTime() - start.getTime();
        // Difference in days
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (nights <= 0) return { nights: 0, basePrice: 0, tax: 0, total: 0 };

        const basePrice = nights * initialPrice;
        const tax = basePrice * 0.10; // 10% Tax
        const total = basePrice + tax;

        return { nights, basePrice, tax, total };
    }, [formData.checkInDate, formData.checkOutDate, initialPrice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reservationSummary.nights <= 0) {
            setMessage({ type: 'error', text: 'Checkout date must be after check-in date.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // 1. Save Guest
            const guestResponse = await saveGuest({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                nic: formData.nic,
                email: formData.email,
            });

            const guestId = guestResponse.data.guestId;

            // 2. Save Reservation
            await saveReservation({
                guestId: guestId,
                roomId: initialRoomNumber || formData.roomType, // Use room number if available
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                totalAmount: reservationSummary.total,
                specialRequests: formData.specialRequests,
                status: 'PENDING',
            });

            setMessage({ type: 'success', text: 'Reservation confirmed successfully!' });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Error creating reservation:', error);
            setMessage({ type: 'error', text: 'Failed to create reservation. Please try again.' });
        } finally {
            setLoading(false);
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
                        <button onClick={() => navigate('/reservations')} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">Reservations</button>
                        <div className="flex flex-1 justify-end gap-8">
                            <button className="text-primary text-sm font-bold border-b-2 border-primary py-4 -mb-4 transition-colors">New Booking</button>
                        </div>
                        <button onClick={() => navigate('/guests')} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">Guests</button>
                    </nav>
                </div>
            </header>



            <main className="flex-1 overflow-y-auto pb-12">
                <div className="max-w-5xl mx-auto px-6 pt-8">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-100 border-red-200 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Create Reservation</h1>
                            <p className="text-text-secondary text-base">
                                {initialRoomNumber ? `Booking Room ${initialRoomNumber} (${initialRoomType})` : 'Register a new guest and book their stay below.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 border border-border bg-white text-text-primary text-sm font-bold hover:bg-slate-50 transition shadow-sm"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back to Dashboard
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-border bg-slate-50/50 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    <h3 className="font-bold text-slate-900">Guest Personal Information</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">First Name</span>
                                            <input name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" placeholder="Sarah" type="text" required />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">Last Name</span>
                                            <input name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" placeholder="Jenkins" type="text" required />
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">Email Address</span>
                                            <input name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="sarah.j@example.com" type="email" required />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">Phone Number</span>
                                            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-input" placeholder="0767396678" type="tel" required />
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">NIC Number</span>
                                            <input name="nic" value={formData.nic} onChange={handleChange} className="form-input" placeholder="19902345676V" type="text" required />
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-border bg-slate-50/50 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">meeting_room</span>
                                    <h3 className="font-bold text-slate-900">Stay Details</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">Check-in Date</span>
                                            <input name="checkInDate" value={formData.checkInDate} onChange={handleChange} className="form-input px-3" type="date" required />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">Check-out Date</span>
                                            <input name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} className="form-input px-3" type="date" required />
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">Room Type</span>
                                            <select name="roomType" value={formData.roomType} onChange={handleChange} className="form-input px-2" disabled={!!initialRoomNumber}>
                                                <option value="SINGLE">Single Room</option>
                                                <option value="DOUBLE">Double Room</option>
                                                <option value="DELUXE">Deluxe Suite</option>
                                            </select>
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-text-primary text-sm font-semibold">Guests</span>
                                            <select name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} className="form-input px-2">
                                                <option value="1">1 Adult</option>
                                                <option value="2">2 Adults</option>
                                                <option value="3">3 Adults</option>
                                                <option value="4">4 Adults</option>
                                            </select>
                                        </label>
                                    </div>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-text-primary text-sm font-semibold">Special Requests</span>
                                        <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} className="form-input py-3 min-h-[100px]" placeholder="Allergies, late check-in, honeymoon package..."></textarea>
                                    </label>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <section className="bg-white rounded-xl border border-border shadow-sm p-6 sticky top-24">
                                <h3 className="font-bold text-slate-900 text-lg mb-6">Reservation Summary</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-text-secondary">Room Rate (Rs{initialPrice} × {reservationSummary.nights} nights)</span>
                                        <span className="font-medium text-slate-900">Rs{reservationSummary.basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-text-secondary">Tax (10%)</span>
                                        <span className="font-medium text-slate-900">Rs{reservationSummary.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-border flex justify-between items-center">
                                        <span className="font-bold text-slate-900">Total Amount</span>
                                        <span className="font-black text-2xl text-primary">Rs{reservationSummary.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        disabled={loading || reservationSummary.nights <= 0}
                                        className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-primary hover:bg-primary-dark text-white font-bold transition shadow-md shadow-primary/20 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        {loading ? 'Confirming...' : 'Confirm Reservation'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        className="w-full h-12 bg-slate-100 text-text-primary font-bold rounded-lg hover:bg-slate-200 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </section>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateReservationPage;
