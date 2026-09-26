/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Property, DocumentRecord, MaintenanceRequest, Appointment } from '../types';
import { FileText, Wrench, CalendarDays, UploadCloud, CheckCircle, AlertTriangle, Send, X, Sparkles, ShieldAlert } from 'lucide-react';

interface PortalProps {
  properties: Property[];
  documents: DocumentRecord[];
  maintenanceRequests: MaintenanceRequest[];
  appointments: Appointment[];
  activeUserId: string;
  activeUserRole: 'client' | 'broker';
  onCreateMaintenance: (req: Partial<MaintenanceRequest>) => Promise<void>;
  onCreateAppointment: (appt: Partial<Appointment>) => Promise<void>;
  onUploadDocument: (doc: Partial<DocumentRecord>) => Promise<void>;
  onUpdateMaintenanceStatus?: (id: string, status: 'pending' | 'scheduled' | 'completed') => Promise<void>;
  onUpdateAppointmentStatus?: (id: string, status: 'requested' | 'confirmed' | 'cancelled') => Promise<void>;
}

export function Portal({
  properties,
  documents,
  maintenanceRequests,
  appointments,
  activeUserId,
  activeUserRole,
  onCreateMaintenance,
  onCreateAppointment,
  onUploadDocument,
  onUpdateMaintenanceStatus,
  onUpdateAppointmentStatus,
}: PortalProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'maintenance' | 'appointments'>('documents');
  
  // Local Form States
  const [docTitle, setDocTitle] = useState('');
  const [docProperty, setDocProperty] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docCategory, setDocCategory] = useState('Lease Agreement');

  // AI Audit States
  const [isAuditingDocId, setIsAuditingDocId] = useState<string | null>(null);
  const [auditedReport, setAuditedReport] = useState<any | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [activePropertyForAudit, setActivePropertyForAudit] = useState<any | null>(null);

  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mProperty, setMProperty] = useState('');
  const [mUrgency, setMUrgency] = useState<'low' | 'medium' | 'high' | 'emergency'>('low');

  const [aProperty, setAProperty] = useState('');
  const [aDate, setADate] = useState('');
  const [aTime, setATime] = useState('');
  const [aNotes, setANotes] = useState('');

  // UI Notification States
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleDocumentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    // Simulate subtle upload progress bar for premium feel
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 100);

    setTimeout(async () => {
      try {
        await onUploadDocument({
          title: `${docCategory}: ${docTitle}`,
          fileUrl: `https://storage.googleapis.com/luxury-estate-docs/mock_${Date.now()}.pdf`,
          clientId: activeUserRole === 'client' ? activeUserId : 'mock-client-uid',
          brokerId: activeUserRole === 'broker' ? activeUserId : 'broker-alpha',
          uploadedBy: activeUserId
        });
        triggerToast("Exclusive PDF transaction record updated securely.");
        setDocTitle('');
        setUploadProgress(0);
      } catch (err) {
        triggerToast("Failed to upload document reference check configuration.");
      }
    }, 500);
  };

  const handleMaintenanceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mTitle || !mDesc || !mProperty) return;

    try {
      await onCreateMaintenance({
        propertyId: mProperty,
        tenantId: activeUserId,
        title: mTitle,
        description: mDesc,
        urgency: mUrgency,
        status: 'pending',
        brokerId: properties.find(p => p.id === mProperty)?.brokerId || 'broker-alpha'
      });
      triggerToast("Digital service ticket registered in live database.");
      setMTitle('');
      setMDesc('');
      setMProperty('');
      setMUrgency('low');
    } catch (err) {
      triggerToast("Firestore security rules denied creation of service request.");
    }
  };

  const handleAppointmentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!aProperty || !aDate || !aTime) return;

    try {
      const selectedProp = properties.find(p => p.id === aProperty);
      await onCreateAppointment({
        propertyId: aProperty,
        clientId: activeUserId,
        clientName: 'Exclusive Portal Member',
        clientEmail: 'confidential@obsidian.io',
        brokerId: selectedProp?.brokerId || 'broker-alpha',
        datetime: new Date(`${aDate}T${aTime}`),
        status: 'requested',
        notes: aNotes
      });
      triggerToast("Consultation event submitted for broker review.");
      setAProperty('');
      setADate('');
      setATime('');
      setANotes('');
    } catch (err) {
      triggerToast("Could not record consultation. Verify database connection rules.");
    }
  };

  const handleSmartAudit = async (docRecord: DocumentRecord) => {
    setIsAuditingDocId(docRecord.id);
    setActivePropertyForAudit(docRecord);
    try {
      const category = docRecord.title.includes(":") ? docRecord.title.split(":")[0].trim() : "Lease Agreement";
      const titleOnly = docRecord.title.includes(":") ? docRecord.title.split(":")[1].trim() : docRecord.title;
      
      const response = await fetch("/api/gemini/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleOnly,
          category: category
        })
      });
      const data = await response.json();
      if (data.success) {
        setAuditedReport(data);
        setShowAuditModal(true);
        triggerToast("Exclusive Gemini risk Audit completed!");
      } else {
        triggerToast(data.error || "Unable to parse legal instrument.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error linking with Obsidian AI verification servers.");
    } finally {
      setIsAuditingDocId(null);
    }
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="operations-portal-module">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#161411] border border-gold-500/30 text-[#E5D3B3] text-xs font-mono tracking-wider px-5 py-3 rounded-md shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-gold-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Module Narrative Header */}
      <div className="mb-10 text-left">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400">
          Client & Broker Interface
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-light text-white tracking-tight mt-1">
          Operational Workflows
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-2 max-w-2xl leading-relaxed">
          Operational portal handles key real estate lifecycle workflows. Review legal contracts, submit digital maintenance schedules, or coordinate private showings.
        </p>
      </div>

      {/* Grid Layout: Controls on one side, active listings / forms on other */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Controls */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-neutral-900 pr-0 lg:pr-6">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-xs font-sans tracking-wide uppercase transition-all duration-300 w-full shrink-0 text-left ${
              activeTab === 'documents'
                ? 'bg-[#15130F] border border-gold-500/20 text-[#E5D3B3]'
                : 'bg-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            id="tab-documents-btn"
          >
            <FileText className="w-4 h-4 text-gold-400" />
            <span className="font-medium">Document Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-xs font-sans tracking-wide uppercase transition-all duration-300 w-full shrink-0 text-left ${
              activeTab === 'maintenance'
                ? 'bg-[#15130F] border border-gold-500/20 text-[#E5D3B3]'
                : 'bg-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            id="tab-maintenance-btn"
          >
            <Wrench className="w-4 h-4 text-gold-400" />
            <span className="font-medium">Service Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-xs font-sans tracking-wide uppercase transition-all duration-300 w-full shrink-0 text-left ${
              activeTab === 'appointments'
                ? 'bg-[#15130F] border border-gold-500/20 text-[#E5D3B3]'
                : 'bg-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            id="tab-appointments-btn"
          >
            <CalendarDays className="w-4 h-4 text-gold-400" />
            <span className="font-medium">Consultation Log</span>
          </button>
        </div>

        {/* Dynamic Workflow Tab Content */}
        <div className="lg:col-span-9 bg-[#080808] border border-neutral-900 rounded-lg p-6 sm:p-8">
          
          {/* TAB 1: USER DOCUMENTS VAULT */}
          {activeTab === 'documents' && (
            <div className="space-y-8" id="document-vault-tab">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
                <div>
                  <h3 className="font-display text-lg font-medium text-white">Confidential Document Records</h3>
                  <p className="text-xs text-neutral-500 font-sans mt-1">Upload and catalog transaction sheets or lease agreement PDFs.</p>
                </div>
                <span className="font-mono text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-900 px-3 py-1 rounded-sm">
                  {documents.length} Files Enrolled
                </span>
              </div>

              {/* Upload PDF Form (Simulated File Select) */}
              <form onSubmit={handleDocumentSubmit} className="bg-[#050505] border border-neutral-900 p-5 rounded-md space-y-4">
                <h4 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Register Legal Contract Reference</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Document Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Townhouse Lease Block B, Deed"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Agreement Category</label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                    >
                      <option value="Lease Agreement">Lease Agreement</option>
                      <option value="Deed of Title">Deed of Title</option>
                      <option value="Broker Exclusivity">Broker Exclusivity</option>
                      <option value="Maintenance Annex">Maintenance Annex</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      type="submit"
                      disabled={uploadProgress > 0}
                      className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-gold-400 font-semibold py-2 px-4 rounded-md transition-all duration-300 disabled:opacity-50"
                    >
                      <UploadCloud className="w-4 h-4 text-gold-400" />
                      <span>{uploadProgress > 0 ? `Securing ${uploadProgress}%` : 'Upload PDF'}</span>
                    </button>
                  </div>
                </div>

                {uploadProgress > 0 && (
                  <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400 transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </form>

              {/* Shared Files List */}
              <div className="space-y-3">
                <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest mb-2">Available Vault Archives</h4>
                {documents.length > 0 ? (
                  <div className="divide-y divide-neutral-900 border border-neutral-900 rounded-sm">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-[#050505]/55 hover:bg-neutral-950 transition-colors">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-gold-400/80 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-display text-sm text-neutral-200 block font-normal">{doc.title}</span>
                            <span className="font-mono text-[9px] text-neutral-600 block uppercase mt-0.5 tracking-wider">
                              ID: {doc.id} • Confid. Reference Check Passed
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSmartAudit(doc)}
                            disabled={isAuditingDocId !== null}
                            className="font-mono text-[10px] bg-[#120F0B] text-gold-400 border border-gold-500/20 px-3 py-1 rounded-sm hover:bg-[#E5D3B3] hover:text-black transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isAuditingDocId === doc.id ? (
                              <>
                                <span className="animate-pulse">◆</span> AUDITING...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 text-gold-400" /> SMART AUDIT
                              </>
                            )}
                          </button>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] text-neutral-400 hover:text-white transition-colors px-3 py-1 bg-neutral-900 rounded-sm border border-neutral-800"
                          >
                            DOWNLOAD PDF
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-neutral-900 bg-neutral-950 rounded-md text-neutral-500 text-xs">
                    No residential contracts uploaded yet. Ensure broker is connected.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL MAINTENANCE REQUESTS */}
          {activeTab === 'maintenance' && (
            <div className="space-y-8" id="maintenance-tab">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
                <div>
                  <h3 className="font-display text-lg font-medium text-white">Digital Maintenance Tickets</h3>
                  <p className="text-xs text-neutral-500 font-sans mt-1">Tenant dispatch interface for urgent repair coordinates.</p>
                </div>
                <span className="font-mono text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-900 px-3 py-1 rounded-sm">
                  {maintenanceRequests.length} Scheduled
                </span>
              </div>

              {/* Tenant File ticket Form */}
              {activeUserRole === 'client' ? (
                <form onSubmit={handleMaintenanceSubmit} className="bg-[#050505] border border-neutral-900 p-6 rounded-md space-y-4">
                  <h4 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Submit New Service Ticket</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="font-sans text-[10px] text-neutral-500 font-medium">Selected Asset Property</label>
                      <select
                        value={mProperty}
                        onChange={(e) => setMProperty(e.target.value)}
                        className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                        required
                      >
                        <option value="">Select Property Link...</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="font-sans text-[10px] text-neutral-500 font-medium">Urgency Classification</label>
                      <select
                        value={mUrgency}
                        onChange={(e) => setMUrgency(e.target.value as any)}
                        className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      >
                        <option value="low">Low (Cosmetic/Scheduled Improvement)</option>
                        <option value="medium">Medium (Standard System Maintenance)</option>
                        <option value="high">High (Heating/Structural Interference)</option>
                        <option value="emergency">Emergency (Leak/Biometric lockout)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Brief Target Summary</label>
                    <input
                      type="text"
                      placeholder="e.g. Geothermal climate control heater resetting intermittently"
                      value={mTitle}
                      onChange={(e) => setMTitle(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2.5 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Full Repair Specifications</label>
                    <textarea
                      placeholder="Input comprehensive technical details. Include physical access keys context..."
                      rows={3}
                      value={mDesc}
                      onChange={(e) => setMDesc(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2.5 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs uppercase tracking-wider font-mono text-gold-400 hover:text-white rounded-md transition-all duration-300"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>File Ticket</span>
                  </button>
                </form>
              ) : (
                <div className="bg-[#15130F] border border-gold-500/20 text-[#E5D3B3] text-xs font-sans px-4 py-3 rounded-md flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Broker Privilege Active:</strong> You are viewing resident maintenance requests across all your properties. Update a ticket status to 'Scheduled' or 'Completed' below to notify the resident.
                  </p>
                </div>
              )}

              {/* Maintenance list */}
              <div className="space-y-3">
                <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest mb-2">Registered Maintenance Despatches</h4>
                {maintenanceRequests.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceRequests.map((req) => {
                      const associatedProp = properties.find(p => p.id === req.propertyId);
                      return (
                        <div key={req.id} className="bg-[#050505] border border-neutral-900 rounded-md p-5 flex flex-col md:flex-row justify-between gap-6 hover:border-neutral-800 transition-all">
                          <div className="space-y-2 max-w-xl text-left">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 font-mono text-[8px] uppercase rounded-sm border ${
                                req.urgency === 'low' ? 'bg-neutral-950 border-neutral-800 text-neutral-400' :
                                req.urgency === 'medium' ? 'bg-indigo-950/20 border-indigo-900/30 text-indigo-400' :
                                req.urgency === 'high' ? 'bg-amber-950/20 border-amber-900/40 text-amber-500' :
                                'bg-red-950/30 border-red-900/50 text-red-500 font-semibold'
                              }`}>
                                {req.urgency} Priority
                              </span>
                              <span className="font-mono text-[10px] text-neutral-600">ID: {req.id}</span>
                            </div>

                            <h4 className="font-display text-base font-medium text-white leading-snug">{req.title}</h4>
                            <p className="text-xs text-neutral-400 leading-relaxed font-light">{req.description}</p>
                            
                            <div className="text-[10px] text-neutral-500 font-sans flex items-center gap-1.5 pt-1">
                              <span className="text-neutral-400">{associatedProp?.title || 'Luxury Estate Link'}</span>
                              <span>•</span>
                              <span>{req.createdAt instanceof Date ? req.createdAt.toLocaleDateString() : 'Confidential Date'}</span>
                            </div>
                          </div>

                          {/* Status and Action Buttons for Broker */}
                          <div className="flex flex-col justify-between items-start md:items-end gap-3 shrink-0">
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-[10px] text-neutral-500">Status:</span>
                              <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                                req.status === 'pending' ? 'bg-neutral-950 border border-neutral-800 text-neutral-400' :
                                req.status === 'scheduled' ? 'bg-[#1D170C] border border-gold-500/20 text-[#E5D3B3]' :
                                'bg-emerald-950/30 border-emerald-900/30 text-emerald-400'
                              }`}>
                                {req.status}
                              </span>
                            </div>

                            {activeUserRole === 'broker' && onUpdateMaintenanceStatus && (
                              <div className="flex gap-1.5 mt-2">
                                <button
                                  onClick={() => onUpdateMaintenanceStatus(req.id, 'scheduled')}
                                  className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-neutral-900 text-neutral-400 hover:text-white rounded-sm border border-neutral-800"
                                >
                                  Schedule
                                </button>
                                <button
                                  onClick={() => onUpdateMaintenanceStatus(req.id, 'completed')}
                                  className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-[#101A12] text-emerald-400 rounded-sm border border-emerald-900/30"
                                >
                                  Complete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-neutral-900 bg-neutral-950 rounded-md text-neutral-500 text-xs">
                    No active maintenance tickets filed.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRIVATE SCHEDULING & SHOWINGS */}
          {activeTab === 'appointments' && (
            <div className="space-y-8" id="appointments-tab">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
                <div>
                  <h3 className="font-display text-lg font-medium text-white">Private Consultation Log</h3>
                  <p className="text-xs text-neutral-500 font-sans mt-1">Book private showcase viewing times or schedule custom contract reviews.</p>
                </div>
                <span className="font-mono text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-900 px-3 py-1 rounded-sm">
                  {appointments.length} Appointments Listed
                </span>
              </div>

              {/* Showings Request Form */}
              <form onSubmit={handleAppointmentSubmit} className="bg-[#050505] border border-neutral-900 p-6 rounded-md space-y-4">
                <h4 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Book Digital Consultation/Showing</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Selected Asset Property</label>
                    <select
                      value={aProperty}
                      onChange={(e) => setAProperty(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      required
                    >
                      <option value="">Select Property Link...</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Target Showcase Date</label>
                    <input
                      type="date"
                      value={aDate}
                      onChange={(e) => setADate(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Target Time Slot</label>
                    <input
                      type="time"
                      value={aTime}
                      onChange={(e) => setATime(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[10px] text-neutral-500 font-medium">Private Concierge Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="Provide bespoke specifications (e.g., helicopter arrival time, beverage preferences, dietary flags)..."
                    value={aNotes}
                    onChange={(e) => setANotes(e.target.value)}
                    className="bg-[#0D0D0D] border border-neutral-800 rounded-md py-2.5 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1812] hover:bg-[#2A2318] text-[#E5D3B3] text-xs font-mono uppercase tracking-widest border border-gold-500/25 rounded-md transition-all duration-300"
                >
                  <CalendarDays className="w-4 h-4 text-gold-400" />
                  <span>Request Booking</span>
                </button>
              </form>

              {/* Consultation schedules log list */}
              <div className="space-y-3">
                <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest mb-2">Booked Consultation/Showing Logs</h4>
                {appointments.length > 0 ? (
                  <div className="divide-y divide-neutral-900 border border-neutral-900 rounded-md overflow-hidden">
                    {appointments.map((appt) => {
                      const associatedProp = properties.find(p => p.id === appt.propertyId);
                      return (
                        <div key={appt.id} className="bg-[#050505]/60 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-950 transition-colors">
                          <div className="text-left space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-sm font-medium text-white">
                                Showing: {associatedProp?.title || 'Luxury Estate Link'}
                              </h4>
                              <span className={`font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                                appt.status === 'requested' ? 'bg-neutral-950 border-neutral-800 text-neutral-500' :
                                appt.status === 'confirmed' ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' :
                                'bg-red-950/20 border-red-900/30 text-red-500'
                              }`}>
                                {appt.status}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-400 font-mono">
                              {appt.datetime instanceof Date ? appt.datetime.toLocaleString() : String(appt.datetime)}
                            </p>
                            {appt.notes && (
                              <p className="text-[11px] text-neutral-500 italic max-w-lg mt-1 font-sans">
                                Notes: "{appt.notes}"
                              </p>
                            )}
                          </div>

                          {/* Appt Updates for Broker */}
                          {activeUserRole === 'broker' && onUpdateAppointmentStatus && appt.status === 'requested' && (
                            <div className="flex gap-2 shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => onUpdateAppointmentStatus(appt.id, 'confirmed')}
                                className="px-3 py-1 bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 text-[10px] font-mono uppercase rounded-sm hover:bg-emerald-900/20"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => onUpdateAppointmentStatus(appt.id, 'cancelled')}
                                className="px-3 py-1 bg-neutral-950 border border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase rounded-sm hover:text-white"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-neutral-900 bg-neutral-950 rounded-md text-neutral-500 text-xs">
                    No showings or consultation schedules loaded.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>

    {/* Smart Audit Modal Overlay */}
    {showAuditModal && auditedReport && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
        <div className="bg-[#0A0806] border border-gold-500/30 rounded-lg max-w-xl w-full p-6 sm:p-8 space-y-6 text-left shadow-2xl relative">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-neutral-950 pb-4">
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] text-[#E5D3B3] bg-[#221C14] border border-gold-500/10 px-2.5 py-1 rounded-sm uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3 h-3 text-gold-400 rotate-12" />
                CONFIDENTIAL LEGAL AUDIT SYSTEM
              </span>
              <h3 className="font-display text-lg font-light text-white tracking-tight pt-1">
                {activePropertyForAudit?.title || "Legal Instrument Detail"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAuditModal(false)}
              className="text-neutral-500 hover:text-white transition-colors p-1.5 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Audit Status Panel */}
          <div className="p-3.5 bg-neutral-950 rounded-sm border border-neutral-900 flex justify-between items-center">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
              VERIFICATION METRIC:
            </span>
            <span className={`font-mono text-[9px] uppercase font-semibold px-2.5 py-0.5 rounded-sm border ${
              auditedReport.riskCategory?.includes("Low") || auditedReport.riskCategory?.includes("Secure") || auditedReport.riskCategory?.includes("Approved")
                ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                : 'bg-amber-950/20 border-gold-500/20 text-[#E5D3B3]'
            }`}>
              {auditedReport.riskCategory || auditedReport.riskCategory || 'Approved secure'}
            </span>
          </div>

          {/* Content Tabs / Info */}
          <div className="space-y-4">
            {/* Executive Summary */}
            <div className="space-y-1.5">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                Executive Legal Summary
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans max-h-44 overflow-y-auto">
                {auditedReport.summary}
              </p>
            </div>

            {/* Key Covenants */}
            <div className="space-y-2">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                Key Financial Covenants & SLA Details
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {auditedReport.keyClauses?.map((clause: string, i: number) => (
                  <div key={i} className="flex gap-2.5 text-xs text-neutral-400 items-start font-light">
                    <span className="text-gold-400 font-mono shrink-0">0{i+1}.</span>
                    <span>{clause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Compliance Checklist */}
            <div className="space-y-1.5 border-t border-neutral-900 pt-3">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-semibold block">
                Cryptographic Integrity & Signature
              </span>
              <p className="text-[10px] text-[#E5D3B3] leading-relaxed font-mono">
                {auditedReport.securityCompliance}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-900">
            <button
              type="button"
              onClick={() => setShowAuditModal(false)}
              className="w-full py-2.5 bg-[#1C1812] hover:bg-[#2A2318] text-[#E5D3B3] text-xs font-mono uppercase tracking-widest border border-gold-500/20 rounded-md transition-all font-medium text-center cursor-pointer"
            >
              Close Audit Report
            </button>
          </div>
          
        </div>
      </div>
    )}
    </>
  );
}
