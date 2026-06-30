import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Heart, CheckCircle, Download, CreditCard, Send, QrCode, Building, Landmark } from 'lucide-react';
import { api } from '../../lib/api';

export function Donate() {
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [donationType, setDonationType] = useState('Monetary');
  const [amount, setAmount] = useState<number | ''>('');
  
  // Gold / Silver / Asset specific fields
  const [itemWeight, setItemWeight] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');

  const [purpose, setPurpose] = useState('General Fund');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isPublic, setIsPublic] = useState(true);
  
  // Checkout simulation step
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [txnRefCode, setTxnRefCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation before showing payment simulation
    if (!donorName || !phone) {
      setError('Please fill in required Devotee Name and Phone fields.');
      return;
    }

    if (donationType === 'Monetary' || donationType === 'Construction' || donationType === 'Community Service') {
      if (!amount || Number(amount) <= 0) {
        setError('Please enter a valid donation amount.');
        return;
      }
    } else {
      if (!itemDescription) {
        setError('Please enter details of the item being offered.');
        return;
      }
    }

    if (donationType === 'Monetary' && (paymentMethod === 'UPI' || paymentMethod === 'Bank Transfer')) {
      setCheckoutStep(true);
    } else {
      // In-Kind (Gold/Silver/Asset) or Cash/Cheque donations bypass checkout steps and go direct
      executeDonationSubmit('');
    }
  };

  const executeDonationSubmit = async (refCode: string) => {
    setLoading(true);
    setError('');

    try {
      // Prepare item details payload
      let finalItemDetails = '';
      if (donationType !== 'Monetary') {
        finalItemDetails = `${donationType}: ${itemDescription}`;
        if (itemWeight) finalItemDetails += ` (Weight: ${itemWeight}g)`;
        if (estimatedValue) finalItemDetails += ` (Est. Value: ₹${estimatedValue})`;
      }

      const result = await api.post('/api/donations', {
        donorName,
        email,
        phone,
        type: donationType === 'Construction' || donationType === 'Community Service' ? 'Monetary' : donationType,
        amount: donationType === 'Monetary' || donationType === 'Construction' || donationType === 'Community Service' ? Number(amount) : 0,
        itemDetails: finalItemDetails,
        purpose: donationType === 'Construction' ? 'Temple Construction' : donationType === 'Community Service' ? 'Annadanam' : purpose,
        paymentMethod: donationType === 'Monetary' ? paymentMethod : 'In-Kind',
        isPublic,
        // simulated payment txn ref
        status: donationType === 'Monetary' && paymentMethod !== 'Cash' ? 'Pending' : 'Verified',
      });

      if (result.success) {
        setSuccessData(result.data);
        setCheckoutStep(false);
      } else {
        setError(result.message || 'Submission failed');
      }
    } catch (err) {
      setError('An error occurred. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDonorName('');
    setEmail('');
    setPhone('');
    setAmount('');
    setDonationType('Monetary');
    setItemWeight('');
    setItemDescription('');
    setEstimatedValue('');
    setPurpose('General Fund');
    setPaymentMethod('UPI');
    setIsPublic(true);
    setCheckoutStep(false);
    setTxnRefCode('');
    setSuccessData(null);
  };

  return (
    <div className="py-16 px-4 bg-[#F7F1E5] min-h-[80vh] font-serif">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
        
        {/* Call to Devotion Banner */}
        <div className="flex-1 bg-gradient-to-b from-[#9B2226] to-[#3E2723] text-white p-8 rounded-2xl flex flex-col justify-between shadow-xl border border-[#CFB53B]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#CFB53B]/10 rounded-full blur-2xl"></div>
          <div>
            <span className="text-[#C09B6A] tracking-[0.25em] uppercase text-[10px] font-sans font-bold mb-3 block">
              Sacred Contribution
            </span>
            <h2 className="text-3xl font-bold italic tracking-tight text-[#F9A825] mb-4">
              Devotion & Offerings
            </h2>
            <p className="text-xs font-sans text-orange-50 leading-relaxed mb-6 opacity-90">
              "Devi Sarva-bhuteshu Shanti-rupena Samsthita"<br/>
              Support the daily rituals, community feasts, gold/silver deity embellishments, and structural renovations. We support monetary transactions, gold/silver offerings, and asset deeds with complete audit trails.
            </p>
            <div className="space-y-3 font-sans text-[10px] text-orange-200">
              <p>✓ Automated e-receipts and transaction logs.</p>
              <p>✓ Public donor bulletin board toggles.</p>
              <p>✓ Tax exemption certificates under audit section.</p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            <span className="text-xs text-orange-300 font-sans">Mandir Board:</span>
            <p className="text-sm font-sans font-bold leading-none mt-1">శ్రీ శ్రీ శ్రీ దుర్గామాత నల్లపోచమ్మ దేవాలయం.</p>
          </div>
        </div>

        {/* Donation Form Card */}
        <div className="flex-[1.2]">
          <Card className="bg-white border-[#EEDCC1] shadow-2xl h-full rounded-2xl overflow-hidden flex flex-col justify-between">
            <div className="h-2 bg-[#9B2226]"></div>
            
            {successData ? (
              <CardContent className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2 italic">Offering Logged</h3>
                <p className="text-xs text-gray-600 max-w-sm mb-6 font-sans">
                  Thank you, <strong>{successData.donorName}</strong>. Your offering has been securely registered in MongoDB under receipt number <strong>{successData.receiptNumber}</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs font-sans">
                  <a
                    href={`/api/donations/${successData._id}/receipt`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 rounded-lg bg-[#9B2226] hover:bg-[#7a181b] text-white font-bold text-[10px] uppercase flex items-center justify-center gap-2 transition-colors border-0"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                  <button
                    onClick={resetForm}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 font-bold text-[10px] uppercase text-gray-700 bg-white cursor-pointer"
                  >
                    New Offering
                  </button>
                </div>
              </CardContent>
            ) : checkoutStep ? (
              <CardContent className="p-8 flex-1 flex flex-col justify-between font-sans text-xs">
                <div className="space-y-6">
                  <h3 className="text-base font-serif font-bold italic text-gray-800 border-b border-gray-50 pb-2">Complete Payment</h3>
                  
                  {paymentMethod === 'UPI' ? (
                    <div className="text-center space-y-4 flex flex-col items-center">
                      <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                        Scan the QR code below using any UPI app (PhonePe, GooglePay, Paytm) to transfer the amount of <strong>₹{amount}</strong>.
                      </p>
                      
                      <div className="p-4 bg-white border border-[#EEDCC1] rounded-2xl shadow-inner relative flex flex-col items-center">
                        <QrCode className="w-32 h-32 text-gray-800" />
                        <span className="text-[9px] uppercase tracking-wider text-[#9B2226] font-bold mt-2">temple@sbi-upi</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-[11px] text-gray-600">
                        Initiate an IMPS / NEFT transfer for the amount of <strong>₹{amount}</strong> to the temple's bank account:
                      </p>
                      <div className="p-4 bg-[#FFF9F0] border border-[#EEDCC1] rounded-2xl space-y-2 font-sans font-medium text-[11px]">
                        <p className="text-[#3E2723]"><strong className="text-gray-500">Bank Name:</strong> State Bank of India</p>
                        <p className="text-[#3E2723]"><strong className="text-gray-500">Account Name:</strong> Sri Durga Mata Temple Trust</p>
                        <p className="text-[#3E2723]"><strong className="text-gray-500">Account Number:</strong> 409923841029</p>
                        <p className="text-[#3E2723]"><strong className="text-gray-500">IFSC Code:</strong> SBIN0004012</p>
                        <p className="text-[#3E2723]"><strong className="text-gray-500">Branch:</strong> Bapu Nagar Branch</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Enter Transaction Ref / UTR Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 302910293812"
                      value={txnRefCode}
                      onChange={e => setTxnRefCode(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#EEDCC1] rounded-lg bg-[#FDFBF7] font-bold text-center"
                    />
                    <span className="text-[9px] text-gray-400 block mt-1">
                      Our accounting team will verify the payment ledger against this code.
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-8 font-sans text-xs">
                  <Button type="button" variant="outline" onClick={() => setCheckoutStep(false)}>Back</Button>
                  <Button 
                    type="button" 
                    disabled={loading || !txnRefCode} 
                    onClick={() => executeDonationSubmit(txnRefCode)}
                    className="bg-[#9B2226] text-white"
                  >
                    {loading ? 'Submitting...' : 'Verify & Record Offering'}
                  </Button>
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#3E2723] mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#9B2226] fill-[#9B2226]" /> Online Offering Form
                  </h3>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-md">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleProceedToCheckout} className="space-y-4 font-sans text-xs">
                    
                    {/* General Devotee Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Devotee Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Name / Family Name"
                          value={donorName}
                          onChange={e => setDonorName(e.target.value)}
                          className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-[#FDFBF7] text-sm outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="10 digit mobile"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-[#FDFBF7] text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Email Address (Optional)</label>
                        <input
                          type="email"
                          placeholder="for e-receipt"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-[#FDFBF7] text-sm outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Offering Category</label>
                        <select
                          value={donationType}
                          onChange={e => setDonationType(e.target.value)}
                          className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl bg-[#FDFBF7] text-sm outline-none font-semibold cursor-pointer"
                        >
                          <option value="Monetary">Monetary Donation</option>
                          <option value="Gold">Gold Offering</option>
                          <option value="Silver">Silver Offering</option>
                          <option value="Asset">Asset offering</option>
                          <option value="Construction">Construction Contribution</option>
                          <option value="Community Service">Community Annadanam Seva</option>
                        </select>
                      </div>
                    </div>

                    {/* Dynamic Fields based on offering category */}
                    {donationType === 'Monetary' || donationType === 'Construction' || donationType === 'Community Service' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-700">Amount (INR) *</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">₹</span>
                            <input
                              type="number"
                              required
                              min="1"
                              placeholder="Enter Amount"
                              value={amount}
                              onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full pl-8 pr-4 py-3 border border-[#EEDCC1] rounded-xl focus:outline-none bg-[#FDFBF7] font-bold text-sm text-[#9B2226] outline-none"
                            />
                          </div>
                        </div>

                        {donationType === 'Monetary' ? (
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Payment Gateway</label>
                            <select
                              value={paymentMethod}
                              onChange={e => setPaymentMethod(e.target.value)}
                              className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl bg-[#FDFBF7] text-sm outline-none cursor-pointer"
                            >
                              <option value="UPI">UPI (QR Code Scan)</option>
                              <option value="Bank Transfer">Bank Wire Transfer</option>
                              <option value="Cash">Cash (At Mandir Counter)</option>
                              <option value="Cheque">Demand Draft / Cheque</option>
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Project / Description</label>
                            <input 
                              type="text" 
                              disabled 
                              value={donationType === 'Construction' ? 'Mandir Expansion Project' : 'Daily Annadanam Program'}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 text-sm font-bold" 
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 border border-dashed border-[#EEDCC1] p-4 rounded-xl">
                        <h4 className="font-bold text-[#9B2226] text-[10px] uppercase">Valuable Asset Particulars</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Weight (Grams) - if gold/silver</label>
                            <input
                              type="text"
                              placeholder="e.g. 50g"
                              value={itemWeight}
                              onChange={e => setItemWeight(e.target.value)}
                              className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl bg-[#FDFBF7] text-sm outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Estimated Valuation (INR)</label>
                            <input
                              type="text"
                              placeholder="e.g. 150000"
                              value={estimatedValue}
                              onChange={e => setEstimatedValue(e.target.value)}
                              className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl bg-[#FDFBF7] text-sm outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-gray-700">Detailed Description *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Describe the asset/item (e.g. Gold chain, Silver plate, Land coordinates)"
                            value={itemDescription}
                            onChange={e => setItemDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl bg-[#FDFBF7] text-sm outline-none resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {donationType === 'Monetary' && (
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Donation Purpose</label>
                        <select
                          value={purpose}
                          onChange={e => setPurpose(e.target.value)}
                          className="w-full px-4 py-3 border border-[#EEDCC1] rounded-xl bg-[#FDFBF7] text-sm outline-none cursor-pointer"
                        >
                          <option>General Fund</option>
                          <option>Daily Annadanam</option>
                          <option>Navratri Mahotsav 2026</option>
                          <option>Temple Construction</option>
                          <option>Special Ritual Sponsorship</option>
                        </select>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="public-visible"
                        checked={isPublic}
                        onChange={e => setIsPublic(e.target.checked)}
                        className="rounded text-orange-600 focus:ring-orange-500 w-5 h-5 cursor-pointer flex-shrink-0"
                      />
                      <label htmlFor="public-visible" className="text-gray-600 select-none cursor-pointer text-xs leading-none">
                        Display my name on the public donors bulletin board
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-4 bg-[#9B2226] hover:bg-[#7a181b] text-white flex justify-center items-center gap-2 font-bold tracking-widest text-xs uppercase rounded-xl shadow-md shadow-[#9B2226]/10 mt-6"
                    >
                      <Send className="w-3.5 h-3.5" /> Proceed to Offering
                    </Button>
                  </form>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        
      </div>
    </div>
  );
}
export default Donate;
