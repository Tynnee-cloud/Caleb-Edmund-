
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Plus, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  ExternalLink,
  Settings
} from 'lucide-react';
import { getStore, addBusiness, addSlot, createBooking, updateBookingStatus, saveStore } from './store';
import { Business, Slot, Booking, UserRole } from './types';

// --- Components ---

const Navbar: React.FC = () => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">NoShowPay</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="text-gray-500 hover:text-gray-700 p-2">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6">
        Never lose money to <span className="text-blue-600">no-shows</span> again.
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Require a small refundable attendance bond for every booking. Show up? Refunded. No-show? You get paid.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={() => navigate('/business/signup')}
          className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <Building2 className="mr-2 w-5 h-5" /> I'm a Business
        </button>
        <button 
          onClick={() => navigate('/customer/search')}
          className="flex items-center justify-center px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          <User className="mr-2 w-5 h-5" /> I'm a Customer
        </button>
      </div>
    </div>
  );
};

const BusinessSignup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', type: 'Barber', location: '', email: '', payoutDetails: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    addBusiness({ ...form, id });
    navigate(`/business/dashboard/${id}`);
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Register Business</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Sharp Cuts" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option>Barber</option>
              <option>Salon</option>
              <option>Tutor</option>
              <option>Medical</option>
              <option>Consultant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Street name, City" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email / Phone</label>
            <input required type="text" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="contact@business.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payout Details (Bank or Mobile Money)</label>
            <input required type="text" value={form.payoutDetails} onChange={e => setForm({...form, payoutDetails: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acc: 1234567890" />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all mt-4">
            Create Business Profile
          </button>
        </form>
      </div>
    </div>
  );
};

const BusinessDashboard: React.FC = () => {
  const { id } = useParams();
  const [store, setStore] = useState(getStore());
  const business = store.businesses.find(b => b.id === id);
  const slots = store.slots.filter(s => s.businessId === id);
  const bookings = store.bookings.filter(b => b.businessId === id);

  const [newSlot, setNewSlot] = useState({ date: '', time: '', amount: 10 });

  useEffect(() => {
    const interval = setInterval(() => setStore(getStore()), 2000);
    return () => clearInterval(interval);
  }, []);

  if (!business) return <div className="p-10 text-center">Business not found.</div>;

  const totalBookings = bookings.length;
  const noShows = bookings.filter(b => b.status === 'forfeited').length;
  const revenue = bookings.filter(b => b.status === 'forfeited').reduce((acc, b) => acc + (b.amount * (1 - store.platformFee / 100)), 0);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    addSlot({
      id: Math.random().toString(36).substr(2, 9),
      businessId: business.id,
      date: newSlot.date,
      time: newSlot.time,
      bondAmount: newSlot.amount,
      status: 'available'
    });
    setStore(getStore());
  };

  const handleAction = (bookingId: string, type: 'refunded' | 'forfeited') => {
    updateBookingStatus(bookingId, type);
    setStore(getStore());
  };

  const bookingLink = `${window.location.origin}/#/booking/${business.id}`;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-gray-500">{business.type} • {business.location}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl w-full md:w-auto">
          <p className="text-sm font-semibold text-blue-800 mb-1">Share Booking Link:</p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-white border border-blue-200 p-2 rounded flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
              {bookingLink}
            </code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(bookingLink);
                alert('Link copied!');
              }}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-xl"><Calendar className="text-blue-600 w-6 h-6" /></div>
          <div><p className="text-gray-500 text-sm">Total Bookings</p><p className="text-2xl font-bold">{totalBookings}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center space-x-4">
          <div className="bg-red-100 p-3 rounded-xl"><XCircle className="text-red-600 w-6 h-6" /></div>
          <div><p className="text-gray-500 text-sm">No-Shows Prevented</p><p className="text-2xl font-bold">{noShows}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-xl"><DollarSign className="text-green-600 w-6 h-6" /></div>
          <div><p className="text-gray-500 text-sm">No-Show Earnings</p><p className="text-2xl font-bold">${revenue.toFixed(2)}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h3 className="text-lg font-bold mb-4 flex items-center"><Plus className="mr-2 w-5 h-5 text-blue-600" /> Create New Slot</h3>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input required type="date" value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input required type="time" value={newSlot.time} onChange={e => setNewSlot({...newSlot, time: e.target.value})} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bond Amount ($)</label>
                <input required type="number" min="1" value={newSlot.amount} onChange={e => setNewSlot({...newSlot, amount: parseInt(e.target.value)})} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black">Add Slot</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">Active Bookings</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {bookings.filter(b => b.status === 'paid').length === 0 ? (
                <div className="p-10 text-center text-gray-400">No active bookings. Share your link to get started!</div>
              ) : (
                bookings.filter(b => b.status === 'paid').map(b => (
                  <div key={b.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <p className="font-bold text-lg">{b.customerName}</p>
                      <p className="text-sm text-gray-500">{b.customerEmail}</p>
                      <div className="flex items-center text-xs mt-1 text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded w-fit">
                        Bond Paid: ${b.amount}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleAction(b.id, 'refunded')}
                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Showed Up
                      </button>
                      <button 
                        onClick={() => handleAction(b.id, 'forfeited')}
                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> No-Show
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">Available Slots</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
              {slots.filter(s => s.status === 'available').length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-4">No available slots created yet.</div>
              ) : (
                slots.filter(s => s.status === 'available').map(s => (
                  <div key={s.id} className="border border-gray-100 p-3 rounded-xl text-center">
                    <p className="font-bold text-gray-900">{s.time}</p>
                    <p className="text-xs text-gray-500">{s.date}</p>
                    <p className="text-sm font-semibold mt-1">${s.bondAmount}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerSearch: React.FC = () => {
  const [store] = useState(getStore());
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Book an Appointment</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {store.businesses.length === 0 && <p className="col-span-full text-center text-gray-400">No businesses registered yet.</p>}
        {store.businesses.map(b => (
          <div key={b.id} onClick={() => navigate(`/booking/${b.id}`)} className="bg-white p-6 rounded-2xl border border-gray-200 cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{b.name}</h3>
                <p className="text-gray-500 text-sm">{b.type}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><ArrowRight className="w-5 h-5" /></div>
            </div>
            <p className="text-sm text-gray-600 flex items-center"><Building2 className="w-4 h-4 mr-2" /> {b.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookingPage: React.FC = () => {
  const { businessId } = useParams();
  const [store, setStore] = useState(getStore());
  const business = store.businesses.find(b => b.id === businessId);
  const slots = store.slots.filter(s => s.businessId === businessId && s.status === 'available');

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [isPaying, setIsPaying] = useState(false);

  if (!business) return <div className="p-10 text-center">Business not found.</div>;

  const handleBooking = () => {
    if (!selectedSlot) return;
    setIsPaying(true);
    
    // Simulate payment delay
    setTimeout(() => {
      const slot = slots.find(s => s.id === selectedSlot)!;
      createBooking({
        id: Math.random().toString(36).substr(2, 9),
        slotId: slot.id,
        businessId: business.id,
        customerName: customer.name,
        customerEmail: customer.email,
        status: 'paid',
        amount: slot.bondAmount,
        timestamp: Date.now()
      });
      setIsPaying(false);
      alert('Booking Confirmed! Your bond is secure.');
      window.location.href = '/#/';
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-900 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
          <p className="opacity-80">{business.type} • {business.location}</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">1. Select Appointment Time</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {slots.length === 0 ? (
              <p className="col-span-full text-gray-400">No available slots at this time.</p>
            ) : (
              slots.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setSelectedSlot(s.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${selectedSlot === s.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-200 text-gray-700'}`}
                >
                  <p className="font-bold">{s.time}</p>
                  <p className="text-xs">{s.date}</p>
                  <p className="text-sm mt-2 font-semibold">Bond: ${s.bondAmount}</p>
                </button>
              ))
            )}
          </div>

          <h2 className="text-xl font-bold mb-6">2. Your Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <input 
              required 
              type="text" 
              placeholder="Full Name" 
              value={customer.name}
              onChange={e => setCustomer({...customer, name: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" 
            />
            <input 
              required 
              type="email" 
              placeholder="Email Address" 
              value={customer.email}
              onChange={e => setCustomer({...customer, email: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" 
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl mb-8 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-yellow-800">Refundable Attendance Bond</p>
              <p className="text-sm text-yellow-700">
                A secure bond is required to confirm your booking. This amount will be automatically refunded to your original payment method immediately after you attend your appointment.
              </p>
            </div>
          </div>

          <button 
            disabled={!selectedSlot || !customer.name || isPaying}
            onClick={handleBooking}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isPaying ? (
              <>Processing Secure Payment...</>
            ) : (
              <>
                <CreditCard className="mr-2 w-5 h-5" /> 
                {selectedSlot ? `Pay $${slots.find(s => s.id === selectedSlot)?.bondAmount} & Book` : 'Select a Slot'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [store, setStore] = useState(getStore());

  const totalBondsHeld = store.bookings.filter(b => b.status === 'paid').reduce((acc, b) => acc + b.amount, 0);
  const platformRevenue = store.bookings.filter(b => b.status === 'forfeited').reduce((acc, b) => acc + (b.amount * (store.platformFee / 100)), 0);

  const clearData = () => {
    if (confirm('Are you sure you want to wipe all data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const updateFee = (val: string) => {
    const fee = parseInt(val);
    const newStore = { ...store, platformFee: fee };
    saveStore(newStore);
    setStore(newStore);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button onClick={clearData} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200">
          Wipe Database
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">Businesses</p>
          <p className="text-2xl font-bold">{store.businesses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">Active Bonds</p>
          <p className="text-2xl font-bold">${totalBondsHeld.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">Platform Profit</p>
          <p className="text-2xl font-bold text-green-600">${platformRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">No-Show Fee %</p>
          <input 
            type="number" 
            value={store.platformFee} 
            onChange={(e) => updateFee(e.target.value)}
            className="text-2xl font-bold w-full outline-none focus:text-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-bold text-sm text-gray-500">Business</th>
              <th className="p-4 font-bold text-sm text-gray-500">Type</th>
              <th className="p-4 font-bold text-sm text-gray-500">Bookings</th>
              <th className="p-4 font-bold text-sm text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {store.businesses.map(b => (
              <tr key={b.id}>
                <td className="p-4 font-medium">{b.name}</td>
                <td className="p-4 text-gray-500">{b.type}</td>
                <td className="p-4">{store.bookings.filter(bk => bk.businessId === b.id).length}</td>
                <td className="p-4">
                  <Link to={`/business/dashboard/${b.id}`} className="text-blue-600 hover:underline">View Dashboard</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- App Root ---

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/business/signup" element={<BusinessSignup />} />
            <Route path="/business/dashboard/:id" element={<BusinessDashboard />} />
            <Route path="/customer/search" element={<CustomerSearch />} />
            <Route path="/booking/:businessId" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p>&copy; 2025 NoShowPay MVP. Secure bonds for serious businesses.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
