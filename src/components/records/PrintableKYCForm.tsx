import React from 'react';
import { useKYC } from '../../context/KYCContext';
import { 
  Building2, 
  Printer, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode,
  Download
} from 'lucide-react';

export const PrintableKYCForm: React.FC = () => {
  const { 
    selectedClientForPrint, 
    setSelectedClientForPrint, 
    branding, 
    companyBankDetails, 
    themeMode 
  } = useKYC();

  if (!selectedClientForPrint) return null;

  const client = selectedClientForPrint;
  const primaryBank = companyBankDetails.find(b => b.isPrimary) || companyBankDetails[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* Container */}
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none my-8">
        
        {/* Floating Print Controls (Hidden on Print) */}
        <div className="bg-slate-900 text-slate-100 p-4 px-6 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Printable A4 Enterprise KYC Verification Document</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setSelectedClientForPrint(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Area */}
        <div className="p-8 sm:p-12 space-y-8 relative font-serif text-slate-900">
          
          {/* Watermark Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <span className="text-6xl font-extrabold uppercase tracking-widest rotate-45 text-slate-900 text-center">
              {branding.watermarkText}
            </span>
          </div>

          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-emerald-800" />
                <h1 className="text-2xl font-black tracking-tight uppercase font-sans text-slate-900">
                  {branding.companyName}
                </h1>
              </div>
              <p className="text-xs font-sans text-slate-600 font-medium">
                {branding.address} | {branding.phone}
              </p>
              <p className="text-xs font-sans text-slate-500">
                {branding.pdfHeader}
              </p>
            </div>

            {/* Passport Photograph Frame */}
            <div className="w-28 h-36 border-2 border-slate-900 rounded bg-slate-100 flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
              <img 
                src={client.passportPhotoUrl} 
                alt="Passport Photograph" 
                className="w-full h-full object-cover" 
              />
              <span className="absolute bottom-0 w-full bg-slate-900 text-white text-[8px] font-sans font-bold text-center py-0.5 uppercase tracking-wider">
                PASSPORT PHOTO
              </span>
            </div>
          </div>

          {/* Title & Document Meta */}
          <div className="flex items-center justify-between font-sans border-b border-slate-300 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                KNOW YOUR CUSTOMER (KYC) COMPLIANCE FORM
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Submission Date: {client.submissionDate}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 block uppercase">Client Reference Number</span>
              <span className="font-mono text-xl font-extrabold text-emerald-800 tracking-wider">
                {client.clientNumber}
              </span>
            </div>
          </div>

          {/* 1. Personal Data */}
          <div className="space-y-3 font-sans text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-400 pb-1 uppercase tracking-wider">
              1. Personal Identity & Bio-Data
            </h3>
            <div className="grid grid-cols-3 gap-y-3 gap-x-4">
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Title & Full Name</span><strong className="text-sm">{client.title} {client.firstName} {client.lastName} {client.otherName}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Gender & Marital Status</span><strong>{client.gender} / {client.maritalStatus}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Birth</span><strong className="font-mono">{client.dateOfBirth}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Nationality</span><strong>{client.nationality} ({client.residentStatus})</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Mobile Phone</span><strong className="font-mono">{client.mobile}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span><strong>{client.email}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Bank Verification Number (BVN)</span><strong className="font-mono text-emerald-900">{client.bvn}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">National ID Number (NIN)</span><strong className="font-mono">{client.nin}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Tax Identification Number (TIN)</span><strong className="font-mono">{client.tin || 'N/A'}</strong></div>
              <div className="col-span-3"><span className="text-slate-500 block text-[10px] uppercase font-bold">Residential Address</span><strong>{client.address}</strong></div>
            </div>
          </div>

          {/* 2. Employment */}
          <div className="space-y-3 font-sans text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-400 pb-1 uppercase tracking-wider">
              2. Employment & Financial Wealth Source
            </h3>
            <div className="grid grid-cols-3 gap-y-3 gap-x-4">
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Employment Status</span><strong>{client.employmentStatus}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Occupation / Position</span><strong>{client.occupation}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Employer Name</span><strong>{client.employerName}</strong></div>
              <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Annual Income Range</span><strong>{client.annualIncome}</strong></div>
              <div className="col-span-2"><span className="text-slate-500 block text-[10px] uppercase font-bold">Source of Wealth / Funds</span><strong>{client.sourceOfFunds}</strong></div>
            </div>
          </div>

          {/* 3. Next of Kin & Beneficiary */}
          <div className="grid grid-cols-2 gap-6 font-sans text-xs">
            <div className="space-y-2 border p-3 rounded border-slate-300">
              <h4 className="font-bold text-slate-900 uppercase border-b pb-1 border-slate-200">Next of Kin</h4>
              <p><span className="text-slate-500">Name:</span> <strong>{client.nextOfKinName}</strong></p>
              <p><span className="text-slate-500">Relationship:</span> <strong>{client.nextOfKinRelationship}</strong></p>
              <p><span className="text-slate-500">Phone:</span> <strong className="font-mono">{client.nextOfKinPhone}</strong></p>
            </div>

            <div className="space-y-2 border p-3 rounded border-slate-300">
              <h4 className="font-bold text-slate-900 uppercase border-b pb-1 border-slate-200">Settlement Beneficiary Account</h4>
              <p><span className="text-slate-500">Bank:</span> <strong>{client.beneficiaryBankName}</strong></p>
              <p><span className="text-slate-500">Account Number:</span> <strong className="font-mono">{client.beneficiaryAccountNumber}</strong></p>
              <p><span className="text-slate-500">Account Name:</span> <strong>{client.beneficiaryAccountName}</strong></p>
            </div>
          </div>

          {/* 4. Signature Placeholder Block */}
          <div className="border-2 border-slate-900 p-4 rounded-lg font-sans text-xs flex items-center justify-between">
            <div className="space-y-2">
              <h4 className="font-bold uppercase text-slate-900 text-sm">
                Authorized Client Signature & Declaration
              </h4>
              <p className="text-[10px] text-slate-600 max-w-md">
                I hereby declare that all statements made on this form are true, correct, and complete to the best of my knowledge and belief.
              </p>
            </div>

            <div className="w-48 h-20 border-2 border-dashed border-slate-900 rounded bg-slate-50 flex flex-col items-center justify-center p-1 relative shrink-0">
              <img src={client.signatureUrl} alt="Signature" className="max-h-16 object-contain" />
              <span className="absolute bottom-0 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                SIGNATURE PLACEHOLDER
              </span>
            </div>
          </div>

          {/* 5. Approval History Block */}
          <div className="border border-slate-300 p-4 rounded font-sans text-xs space-y-2 bg-slate-50">
            <h4 className="font-bold uppercase text-slate-900 text-xs border-b pb-1 border-slate-300">
              Institutional Compliance Verification History
            </h4>
            <div className="space-y-1">
              {client.workflowHistory.map(h => (
                <div key={h.id} className="flex items-center justify-between text-[11px]">
                  <span><strong className="text-emerald-900">{h.toStatus}</strong> by {h.changedBy} ({h.userRole}): <em>"{h.comments}"</em></span>
                  <span className="font-mono text-slate-500">{h.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="border-t border-slate-400 pt-4 font-sans text-[10px] text-slate-500 flex items-center justify-between">
            <p>{branding.pdfFooter}</p>
            <p>Verification Code: <span className="font-mono font-bold text-slate-900">VER-2026-AEGIS-SECURE</span></p>
          </div>

        </div>

      </div>

    </div>
  );
};
