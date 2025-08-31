import React, { useState } from 'react';
import { Calendar, Zap, Leaf, Wind, DollarSign, Factory, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const GreenHydrogenTransactions = () => {
  // Sample transaction data
  const [transactions] = useState([
    {
      id: 'TXN-001',
      createdAt: '2025-08-30T14:30:00Z',
      credits: 500,
      status: 'completed',
      metadata: {
        price_per_unit: '200',
        el_efficiency: '764',
        ghg: '0.2',
        renewable_source: 'Wind'
      },
      producer: {
        name: 'Green Energy Solutions Ltd.',
        id: 'PROD-123',
        location: 'Gujarat, India',
        certification: 'ISO 14001'
      },
      consumer: {
        name: 'Industrial Corp',
        id: 'CONS-456',
        location: 'Maharashtra, India',
        sector: 'Steel Manufacturing'
      }
    },
    {
      id: 'TXN-002',
      createdAt: '2025-08-29T09:15:00Z',
      credits: 750,
      status: 'pending',
      metadata: {
        price_per_unit: '195',
        el_efficiency: '780',
        ghg: '0.15',
        renewable_source: 'Solar'
      },
      producer: {
        name: 'SolarHydro Dynamics',
        id: 'PROD-789',
        location: 'Rajasthan, India',
        certification: 'Green Hydrogen Standard'
      },
      consumer: {
        name: 'Chemical Industries Inc.',
        id: 'CONS-321',
        location: 'Gujarat, India',
        sector: 'Petrochemicals'
      }
    },
    {
      id: 'TXN-003',
      createdAt: '2025-08-28T16:45:00Z',
      credits: 300,
      status: 'failed',
      metadata: {
        price_per_unit: '210',
        el_efficiency: '745',
        ghg: '0.25',
        renewable_source: 'Hydro'
      },
      producer: {
        name: 'Renewable Hydrogen Co.',
        id: 'PROD-555',
        location: 'Kerala, India',
        certification: 'Clean Energy Council'
      },
      consumer: {
        name: 'Transport Solutions Ltd.',
        id: 'CONS-888',
        location: 'Tamil Nadu, India',
        sector: 'Transportation'
      }
    }
  ]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRenewableIcon = (source) => {
    switch (source.toLowerCase()) {
      case 'wind':
        return <Wind className="w-4 h-4" />;
      case 'solar':
        return <Zap className="w-4 h-4" />;
      case 'hydro':
        return <Leaf className="w-4 h-4" />;
      default:
        return <Leaf className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Green Hydrogen Transactions</h1>
        <p className="text-gray-600">Track and monitor green hydrogen credit purchases</p>
      </div>

      <div className="space-y-6">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <span className="font-semibold text-gray-900">Transaction {transaction.id}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(transaction.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Details */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Credits</span>
                      <span className="text-lg font-bold text-green-600">{transaction.credits.toLocaleString()}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Price/Unit</p>
                          <p className="font-semibold text-blue-900">₹{transaction.metadata.price_per_unit}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-600">Efficiency</p>
                          <p className="font-semibold text-purple-900">{transaction.metadata.el_efficiency}kWh/kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">GHG Emissions</p>
                          <p className="font-semibold text-green-900">{transaction.metadata.ghg} kg CO₂/kg</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 bg-cyan-50 rounded-lg">
                        {getRenewableIcon(transaction.metadata.renewable_source)}
                        <div>
                          <p className="text-xs text-gray-600">Source</p>
                          <p className="font-semibold text-cyan-900">{transaction.metadata.renewable_source}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Producer Details */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Producer</h3>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-start space-x-3">
                      <Factory className="w-6 h-6 text-orange-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-900 mb-2">{transaction.producer.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">ID:</span>
                            <span className="ml-2 font-medium text-gray-900">{transaction.producer.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Location:</span>
                            <span className="ml-2 font-medium text-gray-900">{transaction.producer.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Certification:</span>
                            <span className="ml-2 font-medium text-gray-900">{transaction.producer.certification}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consumer Details */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Consumer</h3>
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-start space-x-3">
                      <User className="w-6 h-6 text-indigo-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-indigo-900 mb-2">{transaction.consumer.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">ID:</span>
                            <span className="ml-2 font-medium text-gray-900">{transaction.consumer.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Location:</span>
                            <span className="ml-2 font-medium text-gray-900">{transaction.consumer.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Sector:</span>
                            <span className="ml-2 font-medium text-gray-900">{transaction.consumer.sector}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">Total Transaction Value</span>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{(transaction.credits * parseFloat(transaction.metadata.price_per_unit)).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">Environmental Impact</span>
                    <p className="text-lg font-semibold text-green-600">
                      {(transaction.credits * parseFloat(transaction.metadata.ghg)).toFixed(1)} kg CO₂ saved
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {transactions.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-blue-600">
                {transactions.reduce((sum, t) => sum + t.credits, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{transactions.reduce((sum, t) => sum + (t.credits * parseFloat(t.metadata.price_per_unit)), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenHydrogenTransactions;