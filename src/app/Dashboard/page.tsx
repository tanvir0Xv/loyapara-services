"use client";
import React, { useState } from 'react';
import { Trash2, CheckCircle, AlertCircle, MapPin, Clock, Search, Filter } from 'lucide-react';

const DashboardComplainPage = () => {
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' or 'lostfound'

  // Dummy Data
  const complaints = [
    { id: 1, type: "Noise", accused: "John Doe", status: "Pending", date: "2024-05-10" },
    { id: 2, type: "Behavior", accused: "Alex Smith", status: "Resolved", date: "2024-05-08" },
  ];

  const items = [
    { id: 1, name: "iPhone 13", location: "Cafeteria", type: "Lost", status: "Active" },
    { id: 2, name: "Wallet", location: "Library", type: "Found", status: "Claimed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Management Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage all complaints and reported items from one place.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg text-red-600"><AlertCircle size={24} /></div>
          <div><p className="text-sm text-gray-500">Total Complaints</p><h3 className="text-2xl font-bold">12</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Search size={24} /></div>
          <div><p className="text-sm text-gray-500">Lost Items</p><h3 className="text-2xl font-bold">08</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-600"><CheckCircle size={24} /></div>
          <div><p className="text-sm text-gray-500">Resolved Today</p><h3 className="text-2xl font-bold">05</h3></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`px-8 py-4 font-semibold text-sm transition-all ${activeTab === 'complaints' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Complaints List
          </button>
          <button 
            onClick={() => setActiveTab('lostfound')}
            className={`px-8 py-4 font-semibold text-sm transition-all ${activeTab === 'lostfound' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Lost & Found
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search records..." className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Table/List Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
              <tr>
                {activeTab === 'complaints' ? (
                  <>
                    <th className="px-6 py-4">Accused</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Report Type</th>
                    <th className="px-6 py-4">Status</th>
                  </>
                )}
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(activeTab === 'complaints' ? complaints : items).map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {activeTab === 'complaints' ? row.accused : row.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase ${activeTab === 'complaints' ? 'bg-orange-100 text-orange-700' : row.type === 'Lost' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${row.status === 'Resolved' || row.status === 'Claimed' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <span className="text-sm text-gray-600">{row.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {activeTab === 'complaints' ? (
                      <div className="flex items-center gap-1"><Clock size={14} /> {row.date}</div>
                    ) : (
                      <div className="flex items-center gap-1"><MapPin size={14} /> {row.location}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button title="View Details" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Search size={18} />
                      </button>
                      <button title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComplainPage;