export interface Asset {
  id: string;
  name: string;
  category: 'Land & Buildings' | 'Gold' | 'Silver' | 'Artifacts' | 'Vehicles' | 'Furniture' | 'Electronics' | 'Other';
  description: string;
  acquisitionDate: string;
  currentValuation: number;
  purchaseValue: number;
  status: 'Excellent' | 'Good' | 'Needs Maintenance' | 'Archived';
  location: string;
}

export interface Donation {
  id: string;
  donorName: string;
  type: 'Monetary' | 'Gold' | 'Silver' | 'Sponsorship' | 'Asset' | 'Other';
  amount: number | null; // For non-monetary, this might be 0 or null
  itemDetails: string;
  date: string;
  purpose: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'In-Kind';
  receiptNumber: string;
  isPublic: boolean;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  periodStart: string;
  periodEnd: string | 'Present';
  bio: string;
  imageUrl?: string;
  category: 'Founder' | 'Trustee' | 'Current Committee' | 'Past Member';
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  description: string;
  reference: string;
}
