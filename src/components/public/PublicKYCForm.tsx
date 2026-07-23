import React, { useState, useRef } from 'react';
import { useKYC } from '../../context/KYCContext';
import { 
  Building2, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Camera, 
  PenTool, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight,
  FileText,
  Printer,
  Copy,
  Check,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';

export const PublicKYCForm: React.FC = () => {
  const { 
    branding, 
    sections, 
    fields, 
    units, 
    companyBankDetails, 
    officers, 
    emailSettings,
    addClientRecord, 
    setSelectedClientForPrint,
    themeMode 
  } = useKYC();

  const isDark = themeMode === 'dark';

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    title: 'Mr',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Nigeria',
    residentStatus: 'Resident',
    employmentStatus: 'Employed',
    annualIncome: '₦50,000,000 - ₦250,000,000',
    sourceOfFunds: 'Business Profits',
    investmentUnitId: units[0]?.id || 'unit-1',
    investmentUnitsCount: 1,
    paymentMethod: 'Bank Transfer',
    paymentDate: new Date().toISOString().split('T')[0],
    branch: 'Head Office Victoria Island',
    accountOfficerId: officers[0]?.id || 'off-1',
    relationshipManagerId: officers[0]?.id || 'off-1'
  });

  // Passport & Signature preview state
  const [passportPreview, setPassportPreview] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );
  const [signaturePreview, setSignaturePreview] = useState<string>(
    'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png'
  );

  // Success Confirmation State
  const [submittedClientNum, setSubmittedClientNum] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Financial Statements Modal Reader state
  const [activeModalImage, setActiveModalImage] = useState<{ title: string; url: string } | null>(null);
  const [confirmedReadFinancials, setConfirmedReadFinancials] = useState<boolean>(false);

  const primaryBank = companyBankDetails.find(b => b.isPrimary) || companyBankDetails[0];
  const selectedUnit = units.find(u => u.id === formData.investmentUnitId) || units[0];
  const unitPrice = selectedUnit?.priceNGN || 50000000;
  const currentUnitsCount = formData.investmentUnitsCount || 1;
  const totalInvestmentAmount = unitPrice * currentUnitsCount;

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clientNum = addClientRecord({
      title: formData['f-title'] || formData.title,
      firstName: formData['f-firstname'] || 'Application',
      lastName: formData['f-lastname'] || 'User',
      otherName: formData['f-othername'] || '',
      gender: formData['f-gender'] || formData.gender,
      maritalStatus: formData['f-marital'] || formData.maritalStatus,
      dateOfBirth: formData['f-dob'] || '1990-01-01',
      nationality: formData['f-nationality'] || formData.nationality,
      residentStatus: formData['f-resident'] || formData.residentStatus,
      address: formData['f-address'] || '10 Financial Centre Way, Victoria Island, Lagos',
      email: formData['f-email'] || 'client@aegisbank.com',
      mobile: formData['f-mobile'] || '+234 803 000 0000',
      nationalIdNumber: formData['f-nationalid'] || 'NIN-9920192',
      bvn: formData['f-bvn'] || '22194830192',
      nin: formData['f-nin'] || '10928374829',
      tin: formData['f-tin'] || 'TIN-901928',
      employmentStatus: formData['f-empstatus'] || formData.employmentStatus,
      occupation: formData['f-occupation'] || 'Director',
      employerName: formData['f-employername'] || 'Private Enterprise',
      employerAddress: formData['f-employeraddress'] || 'Lagos, Nigeria',
      annualIncome: formData['f-annualincome'] || formData.annualIncome,
      sourceOfFunds: formData['f-sourceoffunds'] || formData.sourceOfFunds,
      passportPhotoUrl: passportPreview,
      signatureUrl: signaturePreview,
      investmentUnitId: selectedUnit?.id,
      investmentUnitsCount: selectedUnit?.unitsCount || 1,
      investmentTotalAmount: (selectedUnit?.priceNGN || 50000000) * (formData.investmentUnitsCount || 1),
      paymentMethod: formData['f-paymentmethod'] || formData.paymentMethod,
      transactionRef: formData['f-txref'] || `AEG-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: formData['f-paymentdate'] || formData.paymentDate,
      nextOfKinName: formData['f-nokname'] || 'Primary Contact',
      nextOfKinRelationship: formData['f-nokrel'] || 'Spouse',
      nextOfKinPhone: formData['f-nokphone'] || '+234 802 000 0000',
      nextOfKinAddress: formData['f-nokaddress'] || 'Lagos',
      nextOfKinEmail: formData['f-nokemail'] || 'nok@aegisbank.com',
      beneficiaryAccountName: formData['f-benname'] || 'Settlement Account',
      beneficiaryAccountNumber: formData['f-bennumber'] || '1029384756',
      beneficiaryBankName: formData['f-benbank'] || 'Aegis Central Bank',
      beneficiarySwift: formData['f-benswift'] || 'AEGISNGLA',
      referredBy: formData['f-referredby'] || 'Public Online Portal',
      accountOfficerId: formData.accountOfficerId,
      relationshipManagerId: formData.relationshipManagerId,
      branch: formData['f-branch'] || formData.branch,
      dynamicFieldsData: formData,
      createdBy: 'Self (Public Customer Form)'
    });

    setSubmittedClientNum(clientNum);
  };

  const copyClientNum = () => {
    if (submittedClientNum) {
      navigator.clipboard.writeText(submittedClientNum);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If submitted successfully, display receipt confirmation card
  if (submittedClientNum) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className={`p-8 rounded-2xl border text-center space-y-6 shadow-xl ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
              KYC Application Submitted Successfully!
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Your application and identity verification documents have been securely transmitted to SharePoint Online & Compliance Vault.
            </p>
          </div>

          {/* Reference Card */}
          <div className={`p-5 rounded-xl border max-w-md mx-auto ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
              Assigned Client KYC Reference Number
            </span>
            <div className="flex items-center justify-center space-x-3 mt-2">
              <span className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                {submittedClientNum}
              </span>
              <button 
                onClick={copyClientNum} 
                className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 transition-colors"
                title="Copy Reference ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Please save this Client Number to track your verification lifecycle status.
            </p>
          </div>

          {/* Email Copy Automated Dispatch Confirmation Notice */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs text-left space-y-2 max-w-lg mx-auto">
            <div className="flex items-center space-x-2 font-bold text-sm text-emerald-700 dark:text-emerald-400">
              <Mail className="w-4 h-4 shrink-0" />
              <span>Automated Form Copy Dispatched</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              A copy of your submitted KYC application has been automatically dispatched to your personal email (<strong className="text-black dark:text-white font-bold">{formData['f-email'] || formData.email || 'client@aegisbank.com'}</strong>) and copied to Relationship Management (<strong className="text-black dark:text-white font-bold">{emailSettings.relationshipManagerEmail}</strong>).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedClientNum(null);
                setFormData({
                  title: 'Mr',
                  gender: 'Male',
                  maritalStatus: 'Single',
                  nationality: 'Nigeria',
                  residentStatus: 'Resident',
                  employmentStatus: 'Employed',
                  annualIncome: '₦50,000,000 - ₦250,000,000',
                  sourceOfFunds: 'Business Profits',
                  investmentUnitId: units[0]?.id || 'unit-1',
                  investmentUnitsCount: 1,
                  paymentMethod: 'Bank Transfer',
                  paymentDate: new Date().toISOString().split('T')[0],
                  branch: 'Head Office Victoria Island'
                });
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              Submit Another Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sorted active sections
  const activeSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Banner */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden shadow-lg ${
        isDark ? 'bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-slate-800' : 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-emerald-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            {branding.logoUrl && (
              <div className="h-14 w-14 rounded-xl bg-slate-300 dark:bg-slate-700 p-1 flex items-center justify-center overflow-hidden border border-slate-400 dark:border-slate-600 shrink-0 shadow-md">
                <img src={branding.logoUrl} alt="Company Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Public Client Enrollment Portal</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {branding.companyName}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Complete your enterprise Know Your Customer (KYC) onboarding form below. Upon submission, your record is automatically registered in the compliance system.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shrink-0">
            <span className="font-bold">Security Notice:</span> Enforced by Enterprise Compliance & DLP
          </div>
        </div>
      </div>

      {/* WhatsApp Direct Relationship Assistance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl my-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-lg border border-emerald-300/40">
            <MessageSquare className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-emerald-100">Need help filling out your KYC Form?</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
                Live RM Support
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Connect directly with our Relationship Manager on WhatsApp for immediate form submission assistance.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/2348106318408?text=Hello%20Relationship%20Manager%2C%20I%20am%20filling%20out%20the%20KYC%20Form%20and%20need%20assistance."
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs flex items-center space-x-2 transition-all shadow-lg hover:shadow-emerald-500/20 shrink-0 border border-white/20"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      {/* Floating WhatsApp Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/2348106318408?text=Hello%20Relationship%20Manager%2C%20I%20am%20filling%20out%20the%20KYC%20Form%20and%20need%20assistance."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs shadow-2xl transition-all transform hover:scale-105 border-2 border-white/30 group"
          title="Chat directly with Relationship Manager on WhatsApp"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-white" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full animate-ping" />
          </div>
          <span className="font-bold text-xs tracking-wide">WhatsApp Assistance</span>
        </a>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Passport Photograph & Authorized Signature Upload Placeholders Card */}
        <div className={`p-6 rounded-2xl border space-y-6 shadow-md ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-300 border-slate-400 text-black'
        }`}>
          <div className="border-b pb-3 border-slate-400 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950 dark:text-emerald-400 tracking-tight flex items-center space-x-2">
                <Camera className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>Client Identification Photo & Authorized Signature</span>
              </h2>
              <p className="text-xs text-slate-800 dark:text-slate-400 mt-0.5 font-medium">
                Upload your passport photograph in the photo placeholder and digital signature in the signature placeholder.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-600/20 text-emerald-900 dark:text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-600/30 font-bold">
              Mandatory Identity Media
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Passport Photograph Placeholder */}
            <div className={`p-5 rounded-xl border flex flex-col items-center justify-center space-y-3 relative ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-300'
            }`}>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Passport Photograph Placeholder
              </span>

              {/* Passport Frame */}
              <div className="w-36 h-44 rounded-xl border-2 border-dashed border-emerald-500/40 bg-slate-900/80 overflow-hidden flex items-center justify-center relative group shadow-inner">
                {passportPreview ? (
                  <img src={passportPreview} alt="Passport Photograph" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-3 text-slate-500">
                    <Camera className="w-8 h-8 mx-auto text-slate-600 mb-1" />
                    <span className="text-[10px]">No Photo Uploaded</span>
                  </div>
                )}
                
                {/* Overlay Upload Button */}
                <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-2 text-center">
                  <Upload className="w-6 h-6 mb-1 text-emerald-400" />
                  <span className="text-[11px] font-bold">Change Passport Photo</span>
                  <input type="file" accept="image/*" onChange={handlePassportUpload} className="hidden" />
                </label>
              </div>

              <label className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                <span>Upload Passport Photograph</span>
                <input type="file" accept="image/*" onChange={handlePassportUpload} className="hidden" />
              </label>

              <p className="text-[10px] text-slate-400 text-center">
                Clear front-facing color photo (JPEG or PNG, max 5MB).
              </p>
            </div>

            {/* Signature Upload Placeholder */}
            <div className={`p-5 rounded-xl border flex flex-col items-center justify-center space-y-3 relative ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-300'
            }`}>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Authorized Signature Placeholder
              </span>

              {/* Signature Frame */}
              <div className="w-full max-w-xs h-32 rounded-xl border-2 border-dashed border-emerald-500/40 bg-slate-900/80 overflow-hidden flex items-center justify-center relative group shadow-inner p-2">
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Signature" className="max-h-full max-w-full object-contain filter invert-0" />
                ) : (
                  <div className="text-center p-3 text-slate-500">
                    <PenTool className="w-8 h-8 mx-auto text-slate-600 mb-1" />
                    <span className="text-[10px]">No Signature Uploaded</span>
                  </div>
                )}

                {/* Overlay Upload Button */}
                <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-2 text-center">
                  <Upload className="w-6 h-6 mb-1 text-emerald-400" />
                  <span className="text-[11px] font-bold">Change Signature</span>
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                </label>
              </div>

              <label className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                <span>Upload Signature Image</span>
                <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
              </label>

              <p className="text-[10px] text-slate-400 text-center">
                Scanned signature image or digital signature drawing on white background.
              </p>
            </div>

          </div>
        </div>

        {/* Investment Units Minimum / Maximum Selector Card - Admin Configured */}
        <div className={`p-6 rounded-2xl border space-y-6 shadow-md ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="border-b pb-3 border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-emerald-400 tracking-tight flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Investment Subscription Units Selection</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select from the approved investment units configured by the Administrator.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Admin Configured Units Only
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {units.filter(u => u.enabled).map(u => {
              const isSelected = formData.investmentUnitId === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    investmentUnitId: u.id,
                    investmentUnitsCount: u.unitsCount 
                  }))}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg'
                      : isDark
                        ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-emerald-400">{u.name}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <p className="text-sm font-mono font-extrabold text-slate-100 mb-1">
                    ₦{(u.priceNGN * u.unitsCount).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 leading-snug">
                    {u.description || `${u.unitsCount} Unit(s) Subscription Tier`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sections Loop */}
        {activeSections.map(section => {
          const sectionFields = fields
            .filter(f => f.sectionId === section.id && !f.hidden)
            .sort((a, b) => a.order - b.order);

          if (sectionFields.length === 0) return null;

          return (
            <div 
              key={section.id} 
              className={`p-6 rounded-2xl border space-y-6 shadow-md ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Section Header */}
              <div className="border-b pb-3 border-slate-800/80 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-emerald-400 tracking-tight">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{section.description}</p>
                  )}
                </div>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {sectionFields.map(field => {
                  const val = formData[field.id] || '';

                  return (
                    <div key={field.id} className={field.type === 'Address' || field.type === 'Textarea' ? 'sm:col-span-2 md:col-span-3' : ''}>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        {field.label} {field.mandatory && <span className="text-red-400">*</span>}
                      </label>

                      {/* Input Types Rendering */}
                      {field.type === 'Text' || field.type === 'Phone' || field.type === 'Email' || field.type === 'Country' || field.type === 'State' || field.type === 'City' || field.type === 'Relationship' || field.type === 'Bank' ? (
                        <input
                          type={field.type === 'Email' ? 'email' : field.type === 'Phone' ? 'tel' : 'text'}
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label}...`}
                          required={field.mandatory}
                          className={`w-full px-3.5 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                            isDark 
                              ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                          }`}
                        />
                      ) : field.type === 'Number' || field.type === 'Currency' ? (
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || '0'}
                          required={field.mandatory}
                          className={`w-full px-3.5 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                            isDark 
                              ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                          }`}
                        />
                      ) : field.type === 'Date' ? (
                        <input
                          type="date"
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.mandatory}
                          className={`w-full px-3.5 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                            isDark 
                              ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                          }`}
                        />
                      ) : field.type === 'Dropdown' && field.options ? (
                        <select
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.mandatory}
                          className={`w-full px-3.5 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                            isDark 
                              ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                          }`}
                        >
                          <option value="">Select Option...</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'Radio Button' && field.options ? (
                        <div className="flex items-center space-x-4 py-1">
                          {field.options.map(opt => (
                            <label key={opt} className="inline-flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                              <input
                                type="radio"
                                name={field.id}
                                value={opt}
                                checked={val === opt}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className="text-emerald-500 focus:ring-emerald-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === 'Address' || field.type === 'Textarea' ? (
                        <textarea
                          rows={2}
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || 'Enter full address details...'}
                          required={field.mandatory}
                          className={`w-full px-3.5 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                            isDark 
                              ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                          }`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.label}...`}
                          className={`w-full px-3.5 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                            isDark 
                              ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                          }`}
                        />
                      )}

                      {field.helpText && (
                        <p className="text-[10px] text-slate-500 mt-1">{field.helpText}</p>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}

        {/* Audited & Unaudited Financial Statements Reading Section */}
        <div className={`p-6 rounded-2xl border space-y-6 shadow-md ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="border-b pb-3 border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-emerald-400 tracking-tight flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Financial Statements & Disclosure Documents (Mandatory Reading)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Please click to inspect and read the institution's Audited and Unaudited Financial Statements below before submitting your KYC application.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Regulatory Disclosure
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Audited Financial Statement Card */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-300'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                    1. Audited Financial Statement
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                    Audited & Certified
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Full certified independent audit report and balance sheet.
                </p>

                <div className="h-48 rounded-xl border border-slate-800 bg-black overflow-hidden relative group flex items-center justify-center">
                  {branding.auditedStatementUrl ? (
                    <img src={branding.auditedStatementUrl} alt="Audited Statement" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-500">Statement Document Available</span>
                  )}

                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveModalImage({
                        title: 'Audited Financial Statement',
                        url: branding.auditedStatementUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80'
                      })}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Click to Read Full Document</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalImage({
                  title: 'Audited Financial Statement',
                  url: branding.auditedStatementUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80'
                })}
                className="w-full py-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-colors flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Open Audited Statement Viewer</span>
              </button>
            </div>

            {/* Unaudited Financial Statement Card */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-300'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                    2. Unaudited Financial Statement
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">
                    Q1 Interim Unaudited
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Interim quarterly management accounts and trial balance disclosures.
                </p>

                <div className="h-48 rounded-xl border border-slate-800 bg-black overflow-hidden relative group flex items-center justify-center">
                  {branding.unauditedStatementUrl ? (
                    <img src={branding.unauditedStatementUrl} alt="Unaudited Statement" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-500">Interim Document Available</span>
                  )}

                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveModalImage({
                        title: 'Unaudited Financial Statement (Q1 Interim)',
                        url: branding.unauditedStatementUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80'
                      })}
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Click to Read Full Document</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalImage({
                  title: 'Unaudited Financial Statement (Q1 Interim)',
                  url: branding.unauditedStatementUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80'
                })}
                className="w-full py-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Open Unaudited Statement Viewer</span>
              </button>
            </div>

          </div>

          {/* Acknowledgement Checkbox */}
          <div className="pt-2 border-t border-slate-800">
            <label className="inline-flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={confirmedReadFinancials}
                onChange={(e) => setConfirmedReadFinancials(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-700 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-200">
                I hereby confirm that I have inspected, read, and understood the Audited and Unaudited Financial Statements above prior to submitting this KYC subscription application. <span className="text-red-400">*</span>
              </span>
            </label>
          </div>
        </div>

        {/* Company Account Details Box (Auto-renders on form) */}
        {primaryBank && (
          <div className={`p-6 rounded-2xl border space-y-4 shadow-md ${
            isDark ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">
                  Company Settlement Bank Account Details
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                Official Account Information
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-1.5 text-xs">
                <p><span className="text-slate-400">Bank Name:</span> <span className="font-bold text-slate-200">{primaryBank.bankName}</span></p>
                <p><span className="text-slate-400">Account Name:</span> <span className="font-bold text-slate-200">{primaryBank.accountName}</span></p>
                <p><span className="text-slate-400">Account Number:</span> <span className="font-mono font-bold text-emerald-400 text-sm">{primaryBank.accountNumber}</span></p>
                <p><span className="text-slate-400">SWIFT Code:</span> <span className="font-mono font-bold text-slate-200">{primaryBank.swiftCode}</span></p>
                {primaryBank.iban && <p><span className="text-slate-400">IBAN:</span> <span className="font-mono font-bold text-slate-200">{primaryBank.iban}</span></p>}
              </div>

              <div className="text-xs text-slate-400 space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-300 block mb-1">Transfer Instructions:</span>
                <p>{primaryBank.instructions}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Action Footer */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-slate-500 max-w-md">
            By submitting this form, you confirm that all information provided is accurate and complies with financial regulations.
          </p>

          <button
            type="submit"
            disabled={!confirmedReadFinancials}
            className={`px-8 py-3.5 rounded-xl text-white font-bold text-sm transition-all shadow-lg flex items-center space-x-2 ${
              confirmedReadFinancials
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                : 'bg-slate-700 opacity-60 cursor-not-allowed'
            }`}
          >
            <span>Submit KYC Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

      {/* Full Screen Image Modal Reader for Financial Statements */}
      {activeModalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in">
          <div className="w-full max-w-5xl flex items-center justify-between text-white border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-extrabold text-lg text-emerald-400">{activeModalImage.title}</h3>
                <p className="text-xs text-slate-400">Official Financial Statement Document Viewer</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModalImage(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Close Document
            </button>
          </div>

          <div className="w-full max-w-5xl flex-1 my-4 flex items-center justify-center overflow-auto rounded-2xl bg-slate-950 border border-slate-800 p-2">
            <img 
              src={activeModalImage.url} 
              alt={activeModalImage.title} 
              className="max-h-[75vh] max-w-full object-contain rounded-lg" 
            />
          </div>

          <div className="w-full max-w-5xl flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Verified Financial Disclosure • Aegis Financial Services</span>
            <button
              onClick={() => setActiveModalImage(null)}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Confirm & Return to KYC Form
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
