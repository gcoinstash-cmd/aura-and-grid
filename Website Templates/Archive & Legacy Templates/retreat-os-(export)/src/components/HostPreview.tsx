import React, { useState } from 'react';
import { RetreatApplication } from '../types';
import { X, Check, XCircle, Trash2, FolderOpen, Calendar, Mail, FileText, ChevronRight, UserCheck } from 'lucide-react';

interface HostPreviewProps {
  applications: RetreatApplication[];
  onUpdateStatus: (id: string, newStatus: 'pending' | 'reviewed' | 'accepted') => void;
  onDeleteApplication: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HostPreview({
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onClearAll,
  isOpen,
  onClose
}: HostPreviewProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    applications.length > 0 ? applications[0].id : null
  );

  if (!isOpen) return null;

  const currentApp = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-xs z-50 flex justify-end">
      {/* Visual background closer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Panel Content container */}
      <div className="relative w-full max-w-4xl bg-[#FBF9F6] h-full shadow-2xl flex flex-col border-l border-ink/15 z-10 transition-transform duration-300">
        {/* Header Drawer */}
        <div className="border-b border-ink/10 p-6 flex items-center justify-between bg-white shadow-xs">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-ochre animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#5A6455] font-bold">
                [ DEMO INSPECTOR MODE ]
              </span>
            </div>
            <h2 className="font-serif text-2xl font-light text-ink">Guest Applications Portal</h2>
          </div>
          <div className="flex items-center space-x-3">
            {applications.length > 0 && (
              <button
                onClick={() => {
                  if(confirm("Confirm removal of all stored demo profiles?")) {
                    onClearAll();
                  }
                }}
                className="text-[9px] uppercase tracking-widest text-red-600 hover:text-red-800 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 transition font-bold rounded-xs cursor-pointer"
              >
                Clear All Demo Data
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 border border-ink/10 hover:border-ink/40 text-ink/75 hover:text-ink transition cursor-pointer rounded-xs"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Outer Split Pane Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT COLUMN: List of standard profiles (span 5) */}
          <div className="lg:col-span-5 border-r border-ink/10 overflow-y-auto p-4 space-y-3 bg-[#F5F2EB]/70">
            <h3 className="text-[9px] uppercase tracking-widest text-[#5A6455] font-bold block px-2 mb-3">
              Received Applications ({applications.length})
            </h3>

            {applications.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-ink/20 rounded-sm bg-white/40">
                <FileText size={24} className="mx-auto text-ink/20 mb-2" />
                <p className="font-serif text-sm italic text-ink/65">No applications currently registered</p>
                <p className="text-[10px] text-ink/50 font-sans mt-1">Submit an application on the portal tab first to see how it registers here.</p>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 border rounded-sm cursor-pointer transition flex items-center justify-between gap-4 ${
                    (selectedAppId === app.id || (!selectedAppId && currentApp?.id === app.id))
                      ? 'bg-white border-ochre shadow-sm'
                      : 'bg-white/30 border-ink/5 hover:border-ink/20'
                  }`}
                >
                  <div className="truncate pr-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink truncate font-semibold">
                      {app.fullName}
                    </h4>
                    <p className="text-[10px] text-ochre font-mono mt-0.5 truncate font-bold">{app.retreatTitle}</p>
                    <span className="text-[9px] text-ink/50 block mt-1 font-medium">
                      {new Date(app.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center space-x-2">
                    <span className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-mono ${
                      app.status === 'accepted' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : app.status === 'reviewed' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-yellow-105 text-yellow-850 border border-yellow-250 font-bold'
                    }`}>
                      {app.status}
                    </span>
                    <ChevronRight size={12} className="text-ink/30" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT COLUMN: Specific Profile Examination (span 7) */}
          <div className="lg:col-span-7 overflow-y-auto p-6 bg-[#FBF9F6] flex flex-col justify-between">
            {currentApp ? (
              <div className="space-y-6">
                {/* Specific head meta */}
                <div className="border-b border-ink/10 pb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-ochre tracking-wider uppercase font-bold">[ ID: {currentApp.id} ]</span>
                    <h3 className="font-serif text-3xl font-light text-ink mt-1">
                      {currentApp.fullName}
                    </h3>
                    <p className="text-xs text-ochre tracking-widest uppercase font-bold mt-0.5">
                      Selected retreat: {currentApp.retreatTitle} ({currentApp.tierName})
                    </p>
                  </div>
                  <span className="text-[10px] text-ink/50 font-mono shrink-0 font-bold">
                    {new Date(currentApp.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Demographics / metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-white border border-ink/5 rounded-sm shadow-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#5A6455] font-bold block mb-1">Email address</span>
                    <span className="text-xs text-ink/85 font-mono font-semibold">{currentApp.email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#5A6455] font-bold block mb-1">Phone number</span>
                    <span className="text-xs text-ink/85 font-mono font-semibold">{currentApp.phone}</span>
                  </div>
                  {currentApp.instagram && (
                    <div className="col-span-2 pt-2 border-t border-ink/5">
                      <span className="text-[9px] uppercase tracking-wider text-[#5A6455] font-bold block mb-1">Social media profile</span>
                      <span className="text-xs text-ochre font-mono font-semibold">{currentApp.instagram}</span>
                    </div>
                  )}
                  {currentApp.dietaryRestrictions && (
                    <div className="col-span-2 pt-2 border-t border-ink/5">
                      <span className="text-[9px] uppercase tracking-wider text-[#5A6455] font-bold block mb-1">Dietary & health requirements</span>
                      <span className="text-xs text-ink/85 font-sans font-medium">{currentApp.dietaryRestrictions}</span>
                    </div>
                  )}
                </div>

                {/* Registration Essay answers */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#5A6455] font-bold block border-l-2 border-ochre pl-2 mb-2">
                      Application Intent
                    </span>
                    <p className="text-xs text-ink/85 font-sans leading-relaxed p-3 bg-white rounded-sm italic border border-ink/5 shadow-xs">
                      &ldquo;{currentApp.callingText}&rdquo;
                    </p>
                  </div>

                  {currentApp.experienceText && (
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#5A6455] font-bold block border-l-2 border-ochre pl-2 mb-2">
                        Relevant Experience
                      </span>
                      <p className="text-xs text-ink/85 font-sans leading-relaxed p-3 bg-white rounded-sm border border-ink/5 shadow-xs">
                        {currentApp.experienceText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Operations & actions on app */}
                <div className="pt-6 border-t border-ink/10 flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateStatus(currentApp.id, 'reviewed')}
                      disabled={currentApp.status === 'reviewed'}
                      className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold border transition rounded-xs cursor-pointer ${
                        currentApp.status === 'reviewed'
                          ? 'bg-ink/5 text-ink/30 border-ink/5 cursor-default'
                          : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Review Application
                    </button>
                    <button
                      onClick={() => onUpdateStatus(currentApp.id, 'accepted')}
                      disabled={currentApp.status === 'accepted'}
                      className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold border transition rounded-xs cursor-pointer ${
                        currentApp.status === 'accepted'
                          ? 'bg-ink/5 text-ink/30 border-ink/5 cursor-default'
                          : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      Accept Guest
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if(confirm("Permanently delete this specific application record?")) {
                        onDeleteApplication(currentApp.id);
                        setSelectedAppId(null);
                      }
                    }}
                    className="flex items-center space-x-1.5 text-red-600 hover:text-red-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Delete Record</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8 bg-transparent min-h-[400px]">
                <div>
                  <FolderOpen size={30} className="mx-auto text-ochre/40 mb-3" />
                  <p className="font-serif text-lg italic text-ink/50">No Application Selected</p>
                  <p className="text-xs text-ink/50 max-w-sm mt-1 mx-auto">Click on any guest application on the left to review their statement of intent and details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
