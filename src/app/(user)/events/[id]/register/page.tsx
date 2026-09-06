"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc, arrayUnion, query, where, getDocs, limit, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Link from "next/link";
import { toastSuccess, toastError, toastInfo } from "@/utils/common/Toast";
import { Loader2, Smartphone, ExternalLink, AlertCircle, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Event } from "@/utils/types/event";
import Image from "next/image";
import GradientBackground from "@/components/ui/GradientBackground";

export default function Register() {
  const params = useParams();
  const id = params?.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  // Dynamic form state
  const [formData, setFormData] = useState<Record<string, any>>({
    leaderName: "",
    leaderEmail: "",
    leaderMobile: "",
    leaderCollege: "",
    leaderDepartment: "",
    leaderYear: "",
    transactionId: "",
  });
  
  // For team events
  const [teamMembers, setTeamMembers] = useState<{name: string, mobile: string}[]>([]);
  
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [existingRegistrationId, setExistingRegistrationId] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const { user, loading: authLoading, refetchUserProfile } = useAuth();
  const router = useRouter();

  const STORAGE_KEY = `event_registration_${id}`;

  // Fetch Event Data
  useEffect(() => {
    const fetchEvent = async () => {
        try {
            const docRef = doc(db, "events", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
            } else {
                toastError("Event not found");
                // router.push('/events'); // Optional: redirect
            }
        } catch (error) {
            console.error("Error fetching event:", error);
            toastError("Failed to load event details");
        } finally {
            setPageLoading(false);
        }
    };

    if (id) {
        fetchEvent();
    }
  }, [id]);

  // Check deadline
  useEffect(() => {
    if (!event) return;

    const checkDeadline = () => {
      try {
        if (!event.regFinalDate) return;

        // Parse DD-MM-YYYY
        const [day, month, year] = event.regFinalDate.split("-").map(Number);
        
        let deadline = new Date(year, month - 1, day);
        
        // Add time if available, else end of day
        if (event.RegCloseTime) {
            deadline.setHours(event.RegCloseTime.hours);
            deadline.setMinutes(event.RegCloseTime.minutes);
            deadline.setSeconds(0);
        } else {
            deadline.setHours(23, 59, 59);
        }

        const now = new Date();
        if (now > deadline) {
            setIsRegistrationClosed(true);
        }
      } catch (err) {
        console.error("Error checking deadline:", err);
      }
    };

    checkDeadline();
  }, [event]);

  // Auth check - Removed login required feature
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //       toastError("Please login to register");
  //       router.push(`/events/${id}`);
  //   }
  // }, [user, authLoading, router, id]);

  // Load from Local Storage
  useEffect(() => {
    if (!existingRegistrationId) {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.formData) setFormData(parsed.formData);
                if (parsed.teamMembers) setTeamMembers(parsed.teamMembers);
            } catch (error) {
                console.error("Failed to parse saved draft:", error);
            }
        }
    }
  }, [existingRegistrationId, STORAGE_KEY]);

  // Save to Local Storage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        if (!existingRegistrationId) {
             localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, teamMembers }));
        }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, teamMembers, existingRegistrationId, STORAGE_KEY]);


  // Fetch existing registration
  useEffect(() => {
    const fetchRegistration = async () => {
      if (user && event) {
        try {
          const q = query(
            collection(db, "registrations"), 
            where("eventId", "==", event.id),
            where("userId", "==", user.uid),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const data = docSnap.data();
            setExistingRegistrationId(docSnap.id);
            
            // Populate form with existing data
            const loadedData = { ...data };
            // Remove meta fields if they shouldn't be in form state
            delete loadedData.eventId;
            delete loadedData.userId;
            delete loadedData.createdAt;
            delete loadedData.updatedAt;
            
            // Separate team members if exists
            if (loadedData.teamMembers && Array.isArray(loadedData.teamMembers)) {
                setTeamMembers(loadedData.teamMembers);
                delete loadedData.teamMembers;
            }
            
            setFormData(loadedData);
            setAcknowledged(true);
            toastInfo("Loaded your existing registration.");
          }
        } catch (error) {
          console.error("Error fetching registration:", error);
        }
      }
    };

    if (!authLoading && user) {
        fetchRegistration();
    }
  }, [user, authLoading, event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    if (!event) return;
    const max = event.memberMaxCount || 0;
    // Current total = leader + members. 
    // If leader counts as 1 member, then teamMembers.length should be < max - 1
    if (teamMembers.length + 1 < max) {
        setTeamMembers([...teamMembers, { name: "", mobile: "" }]);
    } else {
        toastError(`Maximum team size is ${max}`);
    }
  };

  const removeTeamMember = (index: number) => {
    const updated = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    
    // Validation
    const min = event.memberMinCount || 1;
    const max = event.memberMaxCount || 1;
    const currentCount = 1 + teamMembers.length; // Leader + members
    
    if (event.eveType === 'team') {
      if (currentCount < min) {
          toastError(`Minimum team size is ${min} (including leader)`);
          return;
      }
      if (currentCount > max) {
          toastError(`Maximum team size is ${max} (including leader)`);
          return;
      }
    }

    setLoading(true);

    try {
      const registrationData = {
        eventId: event.id,
        eventTitle: event.title,
        userId: user?.uid || "",
        userEmail: user?.email || formData.leaderEmail,
        userName: user?.displayName || formData.leaderName,
        ...formData,
        teamMembers: event.eveType === 'team' ? teamMembers : [], // Ensure no members for individual events
        updatedAt: new Date()
      };

      if (existingRegistrationId) {
          // Update
          await updateDoc(doc(db, "registrations", existingRegistrationId), registrationData);
          toastSuccess("Registration updated!");
      } else {
          // Create
          await addDoc(collection(db, "registrations"), {
              ...registrationData,
              status: "pending", // Payment status
              createdAt: new Date()
          });

          // Update user profile if logged in
          if (user) {
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                  registeredEvents: arrayUnion(event.title) // Or ID, sticking to title as per abheri
              });
              await refetchUserProfile();
          }
          
          toastSuccess("Registered successfully!");
      }
      
      localStorage.removeItem(STORAGE_KEY);
      
      if (!existingRegistrationId) {
         router.push('/events'); // Or stay and show success state
      }

    } catch (error) {
      console.error("Registration error:", error);
      toastError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center text-white">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
      );
  }

  if (!event) return <div className="min-h-screen flex items-center justify-center text-white">Event not found</div>;

  // Handle UPI Link - checking both single string upi1 (legacy) and array upi (new)
  const upiId = (event.upi && event.upi.length > 0) ? event.upi[0] : (event as any).upi1; 
  const upiLink = upiId ? `upi://pay?pa=${upiId}&pn=Sparkz24&tn=${encodeURIComponent(`${event.title} Reg`)}` : "#";
  const amount = event.registrationFee;

  return (
    <div className="min-h-screen text-white selection:bg-indigo-500/30 font-sans relative overflow-hidden">
        {/* Global Gradient Background */}
        <GradientBackground />

        <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-3xl w-full bg-white/3 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                             <span className="bg-linear-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                                {event.title} Registration
                             </span>
                        </h1>
                        <p className="text-white/60 mt-2 flex items-center gap-2 text-sm md:text-base">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            Date: {event.date}
                        </p>
                    </div>
                    {isRegistrationClosed && (
                        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center gap-2 font-semibold">
                            <AlertCircle className="w-5 h-5" />
                            Registration Closed
                        </div>
                    )}
                </div>

                {isRegistrationClosed && !existingRegistrationId ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xl text-gray-300">Registration for this event is currently closed.</p>
                        <Link href="/events" className="inline-block mt-6 px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 rounded-xl transition-all">
                            Browse other events
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Leader Details */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-indigo-200 border-b border-indigo-500/20 pb-2">
                                {event.eveType === 'team' ? "Team Leader Details" : "Participant Details"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Name <span className="text-red-400">*</span></label>
                                    <input required type="text" name="leaderName" value={formData.leaderName} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all placeholder:text-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Mobile <span className="text-red-400">*</span></label>
                                    <input required type="tel" name="leaderMobile" value={formData.leaderMobile} onChange={handleInputChange} placeholder="Mobile Number" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all placeholder:text-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Email <span className="text-red-400">*</span></label>
                                    <input required type="email" name="leaderEmail" value={formData.leaderEmail} onChange={handleInputChange} placeholder="Email Address" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all placeholder:text-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">College <span className="text-red-400">*</span></label>
                                    <input required type="text" name="leaderCollege" value={formData.leaderCollege} onChange={handleInputChange} placeholder="College Name" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all placeholder:text-white/20" />
                                </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Department/Year <span className="text-red-400">*</span></label>
                                    <input required type="text" name="leaderDepartment" value={formData.leaderDepartment} onChange={handleInputChange} placeholder="e.g. CSE S5" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all placeholder:text-white/20" />
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        {event.eveType === 'team' && (
                            <div className="space-y-5">
                                 <div className="flex justify-between items-center border-b border-indigo-500/20 pb-2">
                                    <h3 className="text-lg font-semibold text-indigo-200">Team Members</h3>
                                    <div className="text-sm text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                        Limit: {event.memberMinCount}-{event.memberMaxCount} members
                                    </div>
                                </div>
                                
                                {teamMembers.map((member, idx) => (
                                    <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative group hover:bg-white/8 transition-colors">
                                         <button type="button" onClick={() => removeTeamMember(idx)} className="absolute top-3 right-3 text-white/40 hover:text-red-400 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-white/50 ml-1">Member {idx + 2} Name</label>
                                                <input required type="text" value={member.name} onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-white/50 ml-1">Mobile</label>
                                                <input required type="tel" value={member.mobile} onChange={(e) => handleTeamMemberChange(idx, 'mobile', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {teamMembers.length + 1 < (event.memberMaxCount || 99) && (
                                    <button type="button" onClick={addTeamMember} className="w-full py-3 border border-dashed border-white/20 rounded-2xl text-white/60 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all font-medium flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">+</div>
                                        Add Team Member
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Extra Fields */}
                        {event.requiresExtraData && event.extraFields && (
                             <div className="space-y-5">
                                <h3 className="text-lg font-semibold text-indigo-200 border-b border-indigo-500/20 pb-2">Additional Information</h3>
                                <div className="grid grid-cols-1 gap-5">
                                    {event.extraFields.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-sm font-medium text-white/70">{field.name} <span className="text-red-400">*</span></label>
                                            <input required type={field.type || "text"} name={field.name} value={formData[field.name] || ""} onChange={handleInputChange} placeholder={`Enter ${field.name}`} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all placeholder:text-white/20" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Section */}
                        {event.registrationFee && event.registrationFee !== "0" && (
                             <div className="space-y-6 pt-4">
                                <h3 className="text-xl font-bold bg-linear-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                                    Payment Details <span className="text-white/50 text-base font-normal ml-2">(Fee: ₹{event.registrationFee})</span>
                                </h3>
                                 <div className="flex flex-col items-center justify-center gap-4 bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl">
                                      <a href={upiLink} className="w-full max-w-sm flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all group cursor-pointer hover:border-indigo-500/30">
                                        <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                            <Smartphone className="w-6 h-6" />
                                          </div>
                                          <div className="text-left">
                                            <div className="font-bold text-white group-hover:text-indigo-300 text-sm transition-colors">Pay via UPI App</div>
                                            <div className="text-xs text-white/40">{upiId ? "Tap to pay" : "UPI ID not available"}</div>
                                          </div>
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                                      </a>

                                      {upiId && (
                                         <div className="text-sm text-white/50 font-mono bg-black/30 px-3 py-1 rounded border border-white/5">
                                            UPI ID: {upiId}
                                         </div>
                                      )}
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Transaction ID / Reference No <span className="text-red-400">*</span></label>
                                    <input required type="text" name="transactionId" value={formData.transactionId} onChange={handleInputChange} placeholder="Enter UPI Transaction ID" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none font-mono placeholder:text-white/20" />
                                 </div>
                             </div>
                        )}

                        {/* Acknowledgement */}
                        <div className="flex items-start gap-3 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                            <input id="ack" type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1 w-5 h-5 rounded border-white/10 text-indigo-600 focus:ring-indigo-500 bg-black/40 cursor-pointer" />
                            <label htmlFor="ack" className="text-sm text-white/70 cursor-pointer select-none">
                                I confirm that the details provided are accurate and I agree to the event rules.
                            </label>
                        </div>

                        <button type="submit" disabled={loading || !acknowledged} className="w-full bg-linear-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/20 disabled:grayscale disabled:shadow-none">
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : existingRegistrationId ? "Update Registration" : "Confirm Registration"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
  );

}