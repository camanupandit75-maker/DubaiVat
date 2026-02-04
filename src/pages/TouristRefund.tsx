import React, { useState } from 'react';
import { 
  Plane, CheckCircle, XCircle, MapPin, Clock, Phone, Mail, 
  ExternalLink, Navigation, Info, Globe, Smartphone
} from 'lucide-react';
import { Card } from '../components/Card';

// Refund location data with Google Maps and contact info
const refundLocations = [
  {
    id: 'dxb',
    name: 'Dubai International Airport (DXB)',
    terminals: 'Terminal 1, 2, 3 & Business Class',
    location: 'Departures area - Before check-in counters',
    hours: '24/7',
    phone: '+971 4 224 5555',
    email: 'customer.care@dubaiairports.ae',
    coordinates: { lat: 25.2532, lng: 55.3657 },
    googleMapsUrl: 'https://maps.google.com/?q=25.2532,55.3657',
    notes: 'Visit Planet counter BEFORE checking in luggage',
  },
  {
    id: 'auh',
    name: 'Zayed International Airport (AUH)',
    terminals: 'Terminal A - Common area',
    location: 'Departures area - Before check-in counters',
    hours: '24/7',
    phone: '+971 2 505 5555',
    email: 'info@adac.ae',
    coordinates: { lat: 24.4330, lng: 54.6511 },
    googleMapsUrl: 'https://maps.google.com/?q=24.4330,54.6511',
    notes: 'Previously known as Abu Dhabi International Airport',
  },
  {
    id: 'shj',
    name: 'Sharjah International Airport (SHJ)',
    terminals: 'Main Terminal',
    location: 'Departures area',
    hours: '24/7',
    phone: '+971 6 558 1111',
    email: 'info@sharjahairport.ae',
    coordinates: { lat: 25.3286, lng: 55.5172 },
    googleMapsUrl: 'https://maps.google.com/?q=25.3286,55.5172',
    notes: 'Check operating hours before visiting',
  },
  {
    id: 'dwc',
    name: 'Al Maktoum International Airport (DWC)',
    terminals: 'Main Terminal',
    location: 'Departures area',
    hours: 'Flight hours',
    phone: '+971 4 224 5555',
    email: 'customer.care@dubaiairports.ae',
    coordinates: { lat: 24.8962, lng: 55.1614 },
    googleMapsUrl: 'https://maps.google.com/?q=24.8962,55.1614',
    notes: 'Dubai World Central - Dubai South',
  },
  {
    id: 'aan',
    name: 'Al Ain International Airport',
    terminals: 'Main Terminal',
    location: 'Departures area',
    hours: 'Flight hours',
    phone: '+971 2 505 5555',
    email: 'info@adac.ae',
    coordinates: { lat: 24.2617, lng: 55.6092 },
    googleMapsUrl: 'https://maps.google.com/?q=24.2617,55.6092',
    notes: 'Operated by Abu Dhabi Airports',
  },
  {
    id: 'rak',
    name: 'Ras Al Khaimah International Airport',
    terminals: 'Main Terminal',
    location: 'Departures area',
    hours: 'Flight hours',
    phone: '+971 7 207 5200',
    email: 'administration@rakairport.com',
    coordinates: { lat: 25.6133, lng: 55.9389 },
    googleMapsUrl: 'https://maps.google.com/?q=25.6133,55.9389',
    notes: null,
  },
  {
    id: 'fjr',
    name: 'Fujairah International Airport',
    terminals: 'Main Terminal',
    location: 'Departures area',
    hours: 'Flight hours',
    phone: '+971 9 222 6222',
    email: null,
    coordinates: { lat: 25.1122, lng: 56.3240 },
    googleMapsUrl: 'https://maps.google.com/?q=25.1122,56.3240',
    notes: null,
  },
];

const landBorders = [
  {
    id: 'ghuwaifat',
    name: 'Al Ghuwaifat Border',
    country: 'Saudi Arabia',
    location: 'Abu Dhabi - Saudi Arabia border',
    hours: '24/7',
    coordinates: { lat: 24.0833, lng: 51.5833 },
    googleMapsUrl: 'https://maps.google.com/?q=24.0833,51.5833',
  },
  {
    id: 'hili',
    name: 'Al Hili Border',
    country: 'Oman',
    location: 'Al Ain - Oman border',
    hours: '24/7',
    coordinates: { lat: 24.2667, lng: 55.7667 },
    googleMapsUrl: 'https://maps.google.com/?q=24.2667,55.7667',
  },
  {
    id: 'hatta',
    name: 'Hatta Border',
    country: 'Oman',
    location: 'Dubai - Oman border',
    hours: '6 AM - 12 AM',
    coordinates: { lat: 24.8000, lng: 56.1000 },
    googleMapsUrl: 'https://maps.google.com/?q=24.8000,56.1000',
  },
];

// Planet Tax Free official contact info
const planetContact = {
  phone: '+971 4 586 4700',
  phoneHours: '9 AM - 12 AM (UAE time)',
  email: 'tourists@planetpayment.com',
  website: 'https://planetpayment.ae',
  app: {
    name: 'Planet Tax Free ME',
    ios: 'https://apps.apple.com/app/planet-tax-free-me/id1438095852',
    android: 'https://play.google.com/store/apps/details?id=com.planet.taxfree.me',
  },
};

export const TouristRefund: React.FC = () => {
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const vatAmount = purchaseAmount * 0.05;
  const processingFee = 4.80; // AED per transaction
  const refundPercentage = 0.87; // 87% of VAT
  const refundAmount = (vatAmount * refundPercentage) - processingFee;
  const meetsMinimum = purchaseAmount >= 250;

  const openGoogleMaps = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B4B7F]">Tourist VAT Refund</h1>
        <p className="text-gray-600 mt-1">Claim back VAT on your purchases when leaving UAE</p>
      </div>

      {/* Planet Contact Card - Prominent */}
      <Card className="bg-gradient-to-r from-[#1B4B7F] to-[#2a5d94] text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Planet Tax Free - Official Operator
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              The exclusive provider of Tourist VAT Refund in UAE
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${planetContact.phone}`}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">{planetContact.phone}</span>
            </a>
            <a
              href={`mailto:${planetContact.email}`}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Email Support</span>
            </a>
            <a
              href={planetContact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#1B4B7F] rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">Website</span>
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-4 text-sm text-blue-100">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Support: {planetContact.phoneHours}
          </span>
          <span className="flex items-center gap-1">
            <Smartphone className="w-4 h-4" />
            Download: Planet Tax Free ME App
          </span>
        </div>
      </Card>

      {/* Refund Calculator */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Calculate Your Refund</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Purchase Amount (AED)
            </label>
            <input
              type="number"
              value={purchaseAmount || ''}
              onChange={(e) => setPurchaseAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B7F]/20"
              placeholder="Enter total purchase amount (min AED 250)"
            />
          </div>
          
          {purchaseAmount > 0 && (
            <div className={`p-4 rounded-xl ${meetsMinimum ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start gap-3">
                {meetsMinimum ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {meetsMinimum ? (
                    <>
                      <p className="font-medium text-green-800">Eligible for VAT Refund!</p>
                      <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">VAT Paid (5%):</span>
                          <span className="font-medium text-green-800">AED {vatAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Refund (87% of VAT):</span>
                          <span className="font-medium text-green-800">AED {(vatAmount * refundPercentage).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Processing Fee:</span>
                          <span className="font-medium text-green-800">- AED {processingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-green-200">
                          <span className="font-medium text-green-800">Your Refund:</span>
                          <span className="font-bold text-green-900 text-lg">AED {Math.max(0, refundAmount).toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-red-800">Below Minimum Amount</p>
                      <p className="text-sm text-red-700 mt-1">
                        Minimum purchase of AED 250 per receipt required.
                        You need AED {(250 - purchaseAmount).toFixed(2)} more.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Eligibility Criteria */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Who Can Claim?</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Non-UAE Residents</p>
              <p className="text-sm text-gray-600">Tourists and visitors not holding UAE residence visa</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Minimum AED 250 per receipt</p>
              <p className="text-sm text-gray-600">Each individual receipt must be at least AED 250</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Within 90 days of purchase</p>
              <p className="text-sm text-gray-600">Must claim refund within 90 days of buying</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Goods must leave UAE</p>
              <p className="text-sm text-gray-600">Items must be exported - take them with you when leaving</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 pt-2 border-t">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">NOT Eligible</p>
              <p className="text-sm text-gray-600">
                UAE residents, GCC nationals, items consumed in UAE, motor vehicles, services
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* How to Claim */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">How to Claim Your Refund</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#1B4B7F] text-white rounded-full flex items-center justify-center font-semibold">1</div>
            <div>
              <p className="font-medium text-gray-900">Shop at Tax Free Stores</p>
              <p className="text-sm text-gray-600">Look for "Tax Free Shopping" or Planet Tax Free signs. Ask for a Tax Free form at checkout.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#1B4B7F] text-white rounded-full flex items-center justify-center font-semibold">2</div>
            <div>
              <p className="font-medium text-gray-900">Keep Your Receipts</p>
              <p className="text-sm text-gray-600">Get the Tax Free form with your original receipt. Don't use or open the items.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#1B4B7F] text-white rounded-full flex items-center justify-center font-semibold">3</div>
            <div>
              <p className="font-medium text-gray-900">Validate at Airport</p>
              <p className="text-sm text-gray-600">Before check-in, go to the Planet Tax Free counter. Present goods, receipts, and passport.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#1B4B7F] text-white rounded-full flex items-center justify-center font-semibold">4</div>
            <div>
              <p className="font-medium text-gray-900">Get Your Refund</p>
              <p className="text-sm text-gray-600">Choose cash (AED), credit card refund, or Alipay/WeChat Pay.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Airport Locations */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plane className="w-5 h-5 text-[#1B4B7F]" />
          Airport Validation Points
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {refundLocations.slice(0, 4).map((location) => (
            <div
              key={location.id}
              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{location.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{location.terminals}</p>
                  <p className="text-xs text-gray-500 mt-1">{location.location}</p>
                </div>
                <button
                  onClick={() => openGoogleMaps(location.googleMapsUrl)}
                  className="p-2 bg-[#1B4B7F] text-white rounded-lg hover:bg-[#153d66] transition-colors"
                  title="Open in Google Maps"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
              
              {/* Contact Details */}
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                {location.phone && (
                  <a 
                    href={`tel:${location.phone}`}
                    className="text-xs text-[#1B4B7F] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {location.phone}
                  </a>
                )}
                {location.email && (
                  <a 
                    href={`mailto:${location.email}`}
                    className="text-xs text-[#1B4B7F] hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {location.email}
                  </a>
                )}
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {location.hours}
                </span>
                {location.notes && (
                  <span className="text-xs text-amber-600 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {location.notes.length > 30 ? location.notes.substring(0, 30) + '...' : location.notes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Other Airports - Collapsible */}
        <details className="mt-4">
          <summary className="text-sm text-[#1B4B7F] cursor-pointer hover:underline">
            + Show more airports (Al Ain, RAK, Fujairah)
          </summary>
          <div className="grid md:grid-cols-3 gap-3 mt-3">
            {refundLocations.slice(4).map((location) => (
              <div
                key={location.id}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{location.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{location.hours}</p>
                    {location.phone && (
                      <a 
                        href={`tel:${location.phone}`}
                        className="text-xs text-[#1B4B7F] hover:underline flex items-center gap-1 mt-1"
                      >
                        <Phone className="w-3 h-3" />
                        {location.phone}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => openGoogleMaps(location.googleMapsUrl)}
                    className="p-1.5 bg-[#1B4B7F] text-white rounded-md hover:bg-[#153d66]"
                  >
                    <Navigation className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </details>
      </Card>

      {/* Land Borders */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#1B4B7F]" />
          Land Border Validation Points
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {landBorders.map((border) => (
            <div
              key={border.id}
              className="p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{border.name}</p>
                  <p className="text-sm text-gray-600 mt-1">Border with {border.country}</p>
                  <p className="text-xs text-gray-500 mt-1">{border.location}</p>
                </div>
                <button
                  onClick={() => openGoogleMaps(border.googleMapsUrl)}
                  className="p-2 bg-[#1B4B7F] text-white rounded-lg hover:bg-[#153d66]"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2">
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {border.hours}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Contact */}
      <Card className="bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Need Help?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href={`tel:${planetContact.phone}`}
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-green-100 rounded-full">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Call Support</p>
              <p className="text-sm text-gray-600">{planetContact.phone}</p>
            </div>
          </a>
          
          <a
            href={`mailto:${planetContact.email}`}
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-blue-100 rounded-full">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Email Support</p>
              <p className="text-sm text-gray-600">{planetContact.email}</p>
            </div>
          </a>
          
          <a
            href={planetContact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-purple-100 rounded-full">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Visit Website</p>
              <p className="text-sm text-gray-600">planetpayment.ae</p>
            </div>
          </a>
        </div>
      </Card>

      {/* Pro Tips */}
      <Card className="bg-yellow-50 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>• Arrive at airport <strong>4+ hours early</strong> to allow time for refund processing</li>
          <li>• Keep items <strong>unused and in original packaging</strong> for inspection</li>
          <li>• Credit card refunds take <strong>5-10 business days</strong> to process</li>
          <li>• You must <strong>leave UAE within 6 hours</strong> of validation</li>
          <li>• Download the <strong>Planet Tax Free ME app</strong> to track your refunds</li>
          <li>• Minimum purchase is <strong>AED 250 per receipt</strong></li>
        </ul>
      </Card>
    </div>
  );
};
