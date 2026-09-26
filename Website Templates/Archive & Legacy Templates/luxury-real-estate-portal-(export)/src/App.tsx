/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { Property, Inquiry, MaintenanceRequest, Appointment, DocumentRecord, UserProfile, UserRole } from './types';
import { SAMPLE_PROPERTIES } from './sampleData';

import { LandingPage } from './components/LandingPage';
import { ListingDirectory } from './components/ListingDirectory';
import { Portal } from './components/Portal';
import { Dashboard } from './components/Dashboard';
import { Concierge } from './components/Concierge';

import { Compass, HelpCircle, UserCheck, Eye, Sparkles, Send, X, Calendar, Key, FilePlus } from 'lucide-react';

export default function App() {
  // Navigation Routing States
  const [activeTab, setActiveTab] = useState<'landing' | 'archive' | 'portal' | 'dashboard' | 'concierge'>('landing');

  // Core Real Estate State Blocks
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  // User Authentication & Profile Context States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sandboxRole, setSandboxRole] = useState<UserRole>('broker'); // Default role in mock sandbox
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // Dynamic Overlay Modals
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<Property | null>(null);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [showingProperty, setShowingProperty] = useState<Property | null>(null);

  // Modal Input Forms
  const [inqName, setInqName] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqMsg, setInqMsg] = useState('');
  const [showDate, setShowDate] = useState('');
  const [showTime, setShowTime] = useState('');
  const [showNotes, setShowNotes] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 1. Unified State Sync Engine (Firebase Live + Local Fallback)
  useEffect(() => {
    // Check if properties exist in LocalStorage initially, if not popualte the sample properties
    const localProps = localStorage.getItem('obsidian_properties');
    if (!localProps) {
      localStorage.setItem('obsidian_properties', JSON.stringify(SAMPLE_PROPERTIES));
      setProperties(SAMPLE_PROPERTIES);
    } else {
      setProperties(JSON.parse(localProps));
    }

    // Load fallbacks for inquiries, maintenance, appointments, and docs
    const getLocalOrInit = (key: string, init: any[]) => {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(init));
        return init;
      }
      return JSON.parse(data);
    };

    setInquiries(getLocalOrInit('obsidian_inquiries', []));
    setMaintenanceRequests(getLocalOrInit('obsidian_maintenance', []));
    setAppointments(getLocalOrInit('obsidian_appointments', []));
    setDocuments(getLocalOrInit('obsidian_documents', [
      {
        id: 'doc-001',
        title: 'Lease Agreement: The Obsidian Pavilion',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        clientId: 'mock-client-uid',
        brokerId: 'broker-alpha',
        uploadedBy: 'broker-alpha',
        createdAt: new Date('2026-05-15').toISOString()
      },
      {
        id: 'doc-002',
        title: 'Deed of Title Check: Minimalist Atrium',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        clientId: 'mock-client-uid',
        brokerId: 'broker-alpha',
        uploadedBy: 'broker-alpha',
        createdAt: new Date('2026-05-16').toISOString()
      }
    ]));

    // Listen to Firebase Authenticated states
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsFirebaseReady(true);
        triggerToast(`Welcome back, ${user.displayName || user.email}`);

        // Try to fetch or initialize User Profile in Firestore
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const profileData = userSnap.data() as UserProfile;
            setUserProfile(profileData);
            setSandboxRole(profileData.role);
          } else {
            // Document does not exist, initialize a default 'client' profile
            const newProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || 'Confidential Client',
              email: user.email || 'anonymous@obsidian.io',
              role: 'client',
              createdAt: new Date()
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
            setSandboxRole('client');
          }
        } catch (err) {
          console.warn("Could not retrieve user profile from Firestore due to permission boundaries. Falling back.");
        }

        // Initialize Live Subscriptions for signed-in users
        const setupLiveListeners = () => {
          try {
            // Live Properties listener
            onSnapshot(collection(db, 'properties'), (snapshot) => {
              const liveProps: Property[] = [];
              snapshot.forEach((d) => {
                liveProps.push({ id: d.id, ...d.data() } as Property);
              });
              if (liveProps.length > 0) {
                setProperties(liveProps);
                localStorage.setItem('obsidian_properties', JSON.stringify(liveProps));
              }
            }, (err) => {
              console.warn("Firestore Security Rules restricted blanket properties snapshot reading. Using local copy.");
            });

            // Live Inquiries listener
            onSnapshot(collection(db, 'inquiries'), (snapshot) => {
              const liveInqs: Inquiry[] = [];
              snapshot.forEach((d) => {
                liveInqs.push({ id: d.id, ...d.data() } as Inquiry);
              });
              setInquiries(liveInqs);
              localStorage.setItem('obsidian_inquiries', JSON.stringify(liveInqs));
            }, (err) => {
              console.log("Firestore Inbound lead inquiries restricted by security rules. Offline fallback is active.");
            });

            // Live Maintenance Requests listener
            onSnapshot(collection(db, 'maintenanceRequests'), (snapshot) => {
              const liveMaint: MaintenanceRequest[] = [];
              snapshot.forEach((d) => {
                liveMaint.push({ id: d.id, ...d.data() } as MaintenanceRequest);
              });
              setMaintenanceRequests(liveMaint);
              localStorage.setItem('obsidian_maintenance', JSON.stringify(liveMaint));
            });

            // Live Appointments listener
            onSnapshot(collection(db, 'appointments'), (snapshot) => {
              const liveAppts: Appointment[] = [];
              snapshot.forEach((d) => {
                liveAppts.push({ id: d.id, ...d.data() } as Appointment);
              });
              setAppointments(liveAppts);
              localStorage.setItem('obsidian_appointments', JSON.stringify(liveAppts));
            });

            // Live Documents listener
            onSnapshot(collection(db, 'documents'), (snapshot) => {
              const liveDocs: DocumentRecord[] = [];
              snapshot.forEach((d) => {
                liveDocs.push({ id: d.id, ...d.data() } as DocumentRecord);
              });
              setDocuments(liveDocs);
              localStorage.setItem('obsidian_documents', JSON.stringify(liveDocs));
            });

          } catch (error) {
            console.error("Firestore onSnapshot triggers failed validation check: ", error);
          }
        };

        setupLiveListeners();

      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setIsFirebaseReady(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Persona Role Switches
  const handleSwitchRole = async (newRole: UserRole) => {
    setSandboxRole(newRole);
    triggerToast(`Active persona set to physical ${newRole.toUpperCase()} client.`);

    if (currentUser) {
      // Also write update to live UserProfile if authenticated
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, { role: newRole });
        setUserProfile(prev => prev ? { ...prev, role: newRole } : null);
      } catch (err) {
        console.warn("Firestore rules prevented active role rewriting on live database.");
      }
    }
  };

  // 3. User Google Registration
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Popup signature check failed: ", err);
      triggerToast("Auth popup verification declined.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      triggerToast("Corporate user session logged out cleanly.");
    } catch (err) {
      console.error("Logout unsuccessful: ", err);
    }
  };

  // ================= CORE WRITE METHODS (WITH STRICT TRY-CATCHES CONSTRAINTS) =================

  // Create Property Listing
  const handleCreateProperty = async (propData: Partial<Property>) => {
    const newPropId = `prop-${Date.now()}`;
    const newProperty: Property = {
      id: newPropId,
      title: propData.title || 'The Marble Pavilion',
      description: propData.description || 'Stunning brutalist villa.',
      price: propData.price || 5000000,
      location: propData.location || 'Sedona, AZ',
      bedrooms: propData.bedrooms || 3,
      bathrooms: propData.bathrooms || 3,
      sqft: propData.sqft || 4200,
      images: propData.images || ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'],
      status: 'available',
      amenities: propData.amenities || ['Priv. Heliport', 'Wine Cellar'],
      brokerId: currentUser?.uid || 'broker-alpha',
      createdAt: new Date().toISOString()
    };

    // Live Write if active
    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'properties', newPropId), newProperty);
        triggerToast("Firestore Property write succeeded!");
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `properties/${newPropId}`);
      }
    } else {
      // Local Sync write
      const updated = [newProperty, ...properties];
      setProperties(updated);
      localStorage.setItem('obsidian_properties', JSON.stringify(updated));
    }
  };

  // Create Inbound Inquiry Lead
  const handleInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryProperty || !inqName || !inqEmail || !inqMsg) return;

    const newInqId = `inq-${Date.now()}`;
    const newInquiry: Inquiry = {
      id: newInqId,
      propertyId: inquiryProperty.id,
      senderId: currentUser?.uid || 'guest-client-uid',
      senderName: inqName,
      senderEmail: inqEmail,
      message: inqMsg,
      status: 'new',
      brokerId: inquiryProperty.brokerId || 'broker-alpha',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'inquiries', newInqId), newInquiry);
        triggerToast("Inquiry logged securely to live Firestore Database.");
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `inquiries/${newInqId}`);
      }
    } else {
      const updated = [newInquiry, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('obsidian_inquiries', JSON.stringify(updated));
      triggerToast("Inquiry saved in Local Storage. Login to test Firestore updates.");
    }

    // Reset Forms
    setInqName('');
    setInqEmail('');
    setInqMsg('');
    setInquiryProperty(null);
  };

  // Update Inquiry Status in CRM table
  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'in_progress' | 'contacted' | 'closed') => {
    if (isFirebaseReady) {
      try {
        await updateDoc(doc(db, 'inquiries', id), { status });
        triggerToast("CRM Lead state advanced successfully in live DB.");
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
      }
    } else {
      const updated = inquiries.map(i => i.id === id ? { ...i, status } : i);
      setInquiries(updated);
      localStorage.setItem('obsidian_inquiries', JSON.stringify(updated));
      triggerToast("Inquiry advanced locally.");
    }
  };

  // Create Maintenance request despatch
  const handleCreateMaintenance = async (reqData: Partial<MaintenanceRequest>) => {
    const newId = `maint-${Date.now()}`;
    const newReq: MaintenanceRequest = {
      id: newId,
      propertyId: reqData.propertyId || 'prop-001',
      tenantId: currentUser?.uid || 'mock-client-uid',
      title: reqData.title || 'Standard System Restoration',
      description: reqData.description || 'Repair details.',
      urgency: reqData.urgency || 'low',
      status: 'pending',
      brokerId: reqData.brokerId || 'broker-alpha',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'maintenanceRequests', newId), newReq);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `maintenanceRequests/${newId}`);
      }
    } else {
      const updated = [newReq, ...maintenanceRequests];
      setMaintenanceRequests(updated);
      localStorage.setItem('obsidian_maintenance', JSON.stringify(updated));
    }
  };

  const handleUpdateMaintenanceStatus = async (id: string, status: 'pending' | 'scheduled' | 'completed') => {
    if (isFirebaseReady) {
      try {
        await updateDoc(doc(db, 'maintenanceRequests', id), { status });
        triggerToast("Repair status revised securely.");
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `maintenanceRequests/${id}`);
      }
    } else {
      const updated = maintenanceRequests.map(m => m.id === id ? { ...m, status } : m);
      setMaintenanceRequests(updated);
      localStorage.setItem('obsidian_maintenance', JSON.stringify(updated));
      triggerToast("Repair updated locally.");
    }
  };

  // Create Appointment Showing booking
  const handleCreateAppointment = async (apptData: Partial<Appointment>) => {
    const newId = `appt-${Date.now()}`;
    const newAppt: Appointment = {
      id: newId,
      propertyId: apptData.propertyId || 'prop-001',
      clientId: currentUser?.uid || 'mock-client-uid',
      clientName: apptData.clientName || 'Bespoke Client',
      clientEmail: apptData.clientEmail || 'confidential@gmail.com',
      brokerId: apptData.brokerId || 'broker-alpha',
      datetime: apptData.datetime instanceof Date ? apptData.datetime.toISOString() : String(apptData.datetime),
      status: 'requested',
      notes: apptData.notes || '',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'appointments', newId), newAppt);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `appointments/${newId}`);
      }
    } else {
      const updated = [newAppt, ...appointments];
      setAppointments(updated);
      localStorage.setItem('obsidian_appointments', JSON.stringify(updated));
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: 'requested' | 'confirmed' | 'cancelled') => {
    if (isFirebaseReady) {
      try {
        await updateDoc(doc(db, 'appointments', id), { status });
        triggerToast("Appointment listing updated.");
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
      }
    } else {
      const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
      setAppointments(updated);
      localStorage.setItem('obsidian_appointments', JSON.stringify(updated));
      triggerToast("Appointment updated locally.");
    }
  };

  // Upload/Register Document Reference PDF
  const handleUploadDocument = async (docData: Partial<DocumentRecord>) => {
    const newId = `doc-${Date.now()}`;
    const newDoc: DocumentRecord = {
      id: newId,
      title: docData.title || 'Legal Lease Amendment',
      fileUrl: docData.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      clientId: docData.clientId || 'mock-client-uid',
      brokerId: docData.brokerId || 'broker-alpha',
      uploadedBy: currentUser?.uid || 'broker-alpha',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'documents', newId), newDoc);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `documents/${newId}`);
      }
    } else {
      const updated = [newDoc, ...documents];
      setDocuments(updated);
      localStorage.setItem('obsidian_documents', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-neutral-200">
      
      {/* Dynamic Global Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#14120F]/95 backdrop-blur-md border border-gold-500/30 text-[#E5D3B3] text-xs font-mono tracking-wider px-5 py-3 rounded-md shadow-2xl flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-gold-400 rotate-12" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Sophisticated Zen Minimalist Navigation Menu */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-neutral-950 px-4 sm:px-6 lg:px-12 py-5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          
          {/* Logo Brand Title */}
          <div
            onClick={() => setActiveTab('landing')}
            className="text-left cursor-pointer select-none shrink-0"
            id="brand-logo-nav"
          >
            <span className="font-display font-light text-base sm:text-lg tracking-[0.45em] text-white">
              OBSIDIAN <span className="font-semibold text-[#E5D3B3]">PORTAL</span>
            </span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-[#B09E51] block leading-none mt-1.5">
              Bespoke Sanctuary Tech
            </span>
          </div>

          {/* Centered Zen Quick Tab Selectors with luxurious spacing */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {[
              { id: 'landing', label: 'Home' },
              { id: 'archive', label: 'Catalog' },
              { id: 'portal', label: 'Portal' },
              { id: 'concierge', label: 'Advisor' },
              { id: 'dashboard', label: 'Board' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative py-1 text-[10px] uppercase font-mono tracking-[0.25em] transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-gold-400 font-medium'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                id={`nav-link-${tab.id}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeHeaderTabIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[1px] bg-gold-400/50"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Aligned Quick Pill Actions & Profile Integrity Badge */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Mobile-only responsive icons */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => setActiveTab('concierge')}
                className="p-2 text-neutral-400 hover:text-[#E5D3B3]"
                title="AI Advisory"
              >
                <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
              </button>
              <button
                onClick={() => setActiveTab('portal')}
                className="p-2 text-neutral-400 hover:text-[#E5D3B3]"
                title="Portal Operations"
              >
                <Key className="w-4 h-4 text-gold-400" />
              </button>
            </div>

            {/* Subtle Minimalist Outline '[CONFIGURE]' Button */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 bg-transparent hover:bg-white/[0.02] border border-white/10 hover:border-gold-500/25 rounded-md text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 hover:text-[#E5D3B3] transition-all duration-300 cursor-pointer"
              id="top-action-portal"
            >
              Configure
            </button>

            {/* Profile Integrity Badge / Status Indicator on the far right */}
            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-neutral-900 pl-4 h-5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || "User"}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-gold-500/15"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#181510] border border-gold-500/15 flex items-center justify-center">
                    <span className="font-mono text-[8px] text-[#E5D3B3] uppercase">
                      {(currentUser.displayName || currentUser.email || "U").charAt(0)}
                    </span>
                  </div>
                )}
                <span className="hidden lg:inline font-mono text-[8.5px] uppercase tracking-wider text-neutral-500">
                  {sandboxRole}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-neutral-900 pl-4 h-5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40 animate-pulse" />
                <span className="hidden lg:inline font-mono text-[8px] uppercase tracking-wider text-neutral-600">
                  Guest
                </span>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Mobile Tab bar helper */}
      <div className="md:hidden flex justify-around bg-[#080808] border-b border-neutral-900 p-2 font-mono text-[9px] uppercase tracking-widest text-neutral-400">
        <button onClick={() => setActiveTab('landing')} className={activeTab === 'landing' ? 'text-gold-400 font-semibold' : ''}>Home</button>
        <button onClick={() => setActiveTab('archive')} className={activeTab === 'archive' ? 'text-gold-400 font-semibold' : ''}>Catalog</button>
        <button onClick={() => setActiveTab('portal')} className={activeTab === 'portal' ? 'text-gold-400 font-semibold' : ''}>Portal</button>
        <button onClick={() => setActiveTab('concierge')} className={activeTab === 'concierge' ? 'text-gold-400 font-semibold' : ''}>Advisor</button>
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-gold-400 font-semibold' : ''}>Board</button>
      </div>

      {/* 3. Dynamic App View Renderers with standard sliding transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'landing' && (
              <LandingPage
                featuredProperties={properties}
                onExplore={() => setActiveTab('archive')}
                onPortal={() => setActiveTab('portal')}
                onInquire={(p) => setInquiryProperty(p)}
                onSchedule={(p) => setShowingProperty(p)}
                onViewDetails={(p) => setSelectedPropertyForModal(p)}
              />
            )}

            {activeTab === 'archive' && (
              <ListingDirectory
                properties={properties}
                onInquire={(p) => setInquiryProperty(p)}
                onSchedule={(p) => setShowingProperty(p)}
                onViewDetails={(p) => setSelectedPropertyForModal(p)}
              />
            )}

            {activeTab === 'portal' && (
              <Portal
                properties={properties}
                documents={documents}
                maintenanceRequests={maintenanceRequests}
                appointments={appointments}
                activeUserId={currentUser?.uid || 'mock-client-uid'}
                activeUserRole={sandboxRole}
                onCreateMaintenance={handleCreateMaintenance}
                onCreateAppointment={handleCreateAppointment}
                onUploadDocument={handleUploadDocument}
                onUpdateMaintenanceStatus={handleUpdateMaintenanceStatus}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              />
            )}

            {activeTab === 'concierge' && (
              <Concierge
                properties={properties}
                triggerToast={triggerToast}
              />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard
                properties={properties}
                inquiries={inquiries}
                activeUserProfile={userProfile}
                activeUserId={currentUser?.uid || 'broker-alpha'}
                activeUserRole={sandboxRole}
                isFirebaseConnected={isFirebaseReady}
                onSwitchRole={handleSwitchRole}
                onCreateProperty={handleCreateProperty}
                onUpdateInquiryStatus={handleUpdateInquiryStatus}
                onConnectGoogleAuth={handleGoogleSignIn}
                onSignOut={handleSignOut}
                appointmentsCount={appointments.length}
                maintenanceRequestsCount={maintenanceRequests.length}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ================= MODAL DRAWER OVERLAYS ================= */}

      {/* A. Property Details Modal overlay */}
      <AnimatePresence>
        {selectedPropertyForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#080808] border border-neutral-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              id="details-modal-box"
            >
              {/* Cover Architectural Shot */}
              <div className="relative aspect-video xl:aspect-[2.1/1] overflow-hidden bg-neutral-900">
                <img
                  src={selectedPropertyForModal.images[0]}
                  alt={selectedPropertyForModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedPropertyForModal(null)}
                  className="absolute top-4 right-4 p-2 bg-black/90 backdrop-blur-md rounded-full border border-neutral-800 text-neutral-400 hover:text-white"
                  id="close-details-modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Information Section */}
              <div className="p-6 md:p-8 space-y-6 text-left">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#E5D3B3]">
                    {selectedPropertyForModal.location}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-light text-white tracking-tight mt-1">
                    {selectedPropertyForModal.title}
                  </h3>
                  <div className="font-mono text-lg text-gold-400 mt-2 font-semibold">
                    ${selectedPropertyForModal.price.toLocaleString()}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                  {selectedPropertyForModal.description}
                </p>

                {/* Exclusive Structural Amenities list */}
                <div className="space-y-4">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block border-b border-neutral-900 pb-2">
                    Exclusive Structural Amenities
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedPropertyForModal.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-neutral-950 border border-neutral-900 text-neutral-300 text-[10px] font-sans rounded-full"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-900/40">
                  <button
                    onClick={() => {
                      setInquiryProperty(selectedPropertyForModal);
                      setSelectedPropertyForModal(null);
                    }}
                    className="flex-1 py-3 px-4 bg-[#14120F] hover:bg-[#201C15] text-gold-300/90 hover:text-gold-200 border border-gold-500/15 text-xs font-mono uppercase tracking-widest rounded-sm transition-all"
                  >
                    Send Private Inquiry
                  </button>
                  <button
                    onClick={() => {
                      setShowingProperty(selectedPropertyForModal);
                      setSelectedPropertyForModal(null);
                    }}
                    className="flex-1 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-widest rounded-sm transition-all border border-neutral-800"
                  >
                    Schedule Showing
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. Dynamic Inquiry Placement Modal */}
      <AnimatePresence>
        {inquiryProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#080808] border border-neutral-900 rounded-lg max-w-md w-full p-6 sm:p-8 space-y-6 text-left"
              id="inquiry-form-modal"
            >
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <div>
                  <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest leading-none">
                    Asset Inquiry Registry
                  </span>
                  <h3 className="font-display text-xl font-light text-white tracking-tight mt-1">
                    {inquiryProperty.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInquiryProperty(null)}
                  className="p-1.5 text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter confidential name"
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    className="bg-[#0E0E0E] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                    Secure Email Link
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. buyer@luxury.com"
                    value={inqEmail}
                    onChange={(e) => setInqEmail(e.target.value)}
                    className="bg-[#0E0E0E] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                    Confidential Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Input architectural preferences, financial timing, or signature requests..."
                    value={inqMsg}
                    onChange={(e) => setInqMsg(e.target.value)}
                    className="bg-[#0E0E0E] border border-neutral-800 rounded-md py-2.5 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1D170F] hover:bg-[#2C2114] text-[#E5D3B3] text-xs font-mono uppercase tracking-widest border border-gold-500/25 rounded-md transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-gold-400" />
                  <span>Log Lead Request</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. Dynamic Showing Placement Modal */}
      <AnimatePresence>
        {showingProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#080808] border border-neutral-900 rounded-lg max-w-md w-full p-6 sm:p-8 space-y-6 text-left"
              id="showing-form-modal"
            >
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <div>
                  <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest leading-none">
                    Schedule Showcase Viewing
                  </span>
                  <h3 className="font-display text-xl font-light text-white tracking-tight mt-1">
                    {showingProperty.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowingProperty(null)}
                  className="p-1.5 text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!showDate || !showTime) return;

                  try {
                    await handleCreateAppointment({
                      propertyId: showingProperty.id,
                      clientName: 'Bespoke Inquirer',
                      clientEmail: 'confidential@gmail.com',
                      brokerId: showingProperty.brokerId,
                      datetime: new Date(`${showDate}T${showTime}`),
                      status: 'requested',
                      notes: showNotes
                    });
                    triggerToast("Bespoke showing request recorded! Check Operations Portal.");
                    setShowDate('');
                    setShowTime('');
                    setShowNotes('');
                    setShowingProperty(null);
                  } catch (err) {
                    triggerToast("Failed to schedule appointment.");
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Target Date</label>
                    <input
                      type="date"
                      value={showDate}
                      onChange={(e) => setShowDate(e.target.value)}
                      className="bg-[#0E0E0E] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] text-neutral-500 font-medium">Target Time</label>
                    <input
                      type="time"
                      value={showTime}
                      onChange={(e) => setShowTime(e.target.value)}
                      className="bg-[#0E0E0E] border border-neutral-800 rounded-md py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[10px] text-neutral-500 font-medium">Private Requests</label>
                  <textarea
                    rows={3}
                    placeholder="Helicopter helipad booking coordinates, security details..."
                    value={showNotes}
                    onChange={(e) => setShowNotes(e.target.value)}
                    className="bg-[#0E0E0E] border border-neutral-800 rounded-md py-2.5 px-3 text-xs text-neutral-300 focus:outline-none focus:border-gold-500/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-widest border border-neutral-800 rounded-md transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  <span>Secure Time Coordinates</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
