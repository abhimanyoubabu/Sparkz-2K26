"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  getDoc,
  limit,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import Link from "next/link";
import { toastSuccess, toastError } from "@/utils/common/Toast";
import { Loader2, Smartphone, ExternalLink, Copy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/utils/firebase";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bandName: "",
    collegeName: "",
    managerName: "",
    managerMobile: "",
    leaderName: "",
    leaderMobile: "",
    musiciansCount: "",
    vocalistCount: "",
    instrumentalistCount: "",
    transactionId: "",
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInstrument, setCustomInstrument] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [existingRegistrationId, setExistingRegistrationId] = useState<
    string | null
  >(null);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [registrationStatusLoading, setRegistrationStatusLoading] = useState(true);

  // TODO: Replace with actual UPI ID
  const UPI_ID = "jacsjjacobnellickal-1@oksbi";
  const transactionNote = `Abheri Registration ${formData.bandName ? `- ${formData.bandName}` : ""
    }`;
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Sparkz24&tn=${encodeURIComponent(
    transactionNote
  )}`;

  const predefinedInstruments = ["Keyboard", "Guitar", "Bass Guitar", "Drums"];

  const STORAGE_KEY = "abheri_registration_form";

  // Load from local storage on mount
  useEffect(() => {
    // Only load from local storage if we haven't already loaded an existing registration
    if (!existingRegistrationId) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(parsed.formData);
          setSelectedInstruments(parsed.selectedInstruments);
        } catch (error) {
          toastError("Failed to load saved data.");
        }
      }
    }
  }, [existingRegistrationId]);

  const { user, loading: authLoading, refetchUserProfile } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const settingsSnap = await getDoc(
          doc(db, "eventSettings", "abheri")
        );

        if (settingsSnap.exists()) {
          setRegistrationOpen(
            settingsSnap.data().registrationOpen !== false
          );
        } else {
          // If setting doesn't exist, keep registration open
          setRegistrationOpen(true);
        }
      } catch (error) {
        console.error("Failed to fetch registration status:", error);
        setRegistrationOpen(true);
      } finally {
        setRegistrationStatusLoading(false);
      }
    };

    fetchRegistrationStatus();
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      toastError("Please login to register for Abheri");
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch existing registration
  useEffect(() => {
    const fetchRegistration = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "abheri_registrations"),
            where("userId", "==", user.uid),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const data = docSnap.data();
            setExistingRegistrationId(docSnap.id);
            setFormData({
              bandName: data.bandName || "",
              collegeName: data.collegeName || "",
              managerName: data.managerName || "",
              managerMobile: data.managerMobile || "",
              leaderName: data.leaderName || "",
              leaderMobile: data.leaderMobile || "",
              musiciansCount: data.musiciansCount || "",
              vocalistCount: data.vocalistCount || "",
              instrumentalistCount: data.instrumentalistCount || "",
              transactionId: data.transactionId || "",
            });
            setSelectedInstruments(data.instruments || []);
            setScreenshotUrl(data.screenshotUrl || null);
            setAcknowledged(true); // Assuming if they registered, they acknowledged
            toastSuccess("Loaded your existing registration.");
          }
        } catch (error) {
          toastError("Failed to fetch existing registration.");
        }
      }
    };

    if (!authLoading && user) {
      fetchRegistration();
    }
  }, [user, authLoading]);

  // Save to local storage with debounce
  useEffect(() => {
    // Don't overwrite local storage with fetched data, only user edits
    // But simpliest approach is to just save current state
    const timeoutId = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          formData,
          selectedInstruments,
        })
      );
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [formData, selectedInstruments]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addInstrument = (instrument: string) => {
    if (!selectedInstruments.includes(instrument)) {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  const removeInstrument = (instrument: string) => {
    setSelectedInstruments(selectedInstruments.filter((i) => i !== instrument));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsAddingCustom(true);
      // Reset select value visually if needed, though we act immediately
      e.target.value = "";
    } else if (value) {
      addInstrument(value);
      e.target.value = ""; // Reset dropdown
    }
  };

  const handleAddCustom = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent
  ) => {
    e.preventDefault(); // Prevent form submission if triggered by enter key in form context
    if (customInstrument.trim()) {
      addInstrument(customInstrument.trim());
      setCustomInstrument("");
      setIsAddingCustom(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toastError("File size should be less than 5MB");
        return;
      }

      // Start background upload
      setUploading(true);
      setUploadProgress(0);
      setPaymentScreenshot(file); // Keep for display name or logic, though we upload immediately

      const storageRef = ref(
        storage,
        `abheri_payment_screenshots/${Date.now()}_${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          toastError("Upload failed. Please try again.");
          setUploading(false);
          setPaymentScreenshot(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setScreenshotUrl(downloadURL);
            setUploading(false);
            toastSuccess("Screenshot uploaded successfully!");
          });
        }
      );
    }
  };

  const handleDeleteFile = async () => {
    // If we have a URL, trying to delete it from storage would be clean
    if (screenshotUrl) {
      try {
        const fileRef = ref(storage, screenshotUrl);
        await deleteObject(fileRef);
        toastSuccess("File removed.");
      } catch (error) {
        console.error("Delete error", error);
        // Ignore error, maybe it was already gone or typical permission issue?
        // Just clear UI state.
      }
    }
    setPaymentScreenshot(null);
    setScreenshotUrl(null);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    toastSuccess("UPI ID copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!acknowledged) {
        toastError("Please agree to the rules and regulations.");
        setLoading(false);
        return;
      }

      // Basic Fields Validation
      const requiredFields = [
        { key: "bandName", label: "Band Name" },
        { key: "collegeName", label: "College Name" },
        { key: "managerName", label: "Manager Name" },
        { key: "managerMobile", label: "Manager Mobile" },
        { key: "leaderName", label: "Leader Name" },
        { key: "leaderMobile", label: "Leader Mobile" },
        { key: "transactionId", label: "Transaction ID" },
      ];

      for (const field of requiredFields) {
        if (!formData[field.key as keyof typeof formData]) {
          toastError(`${field.label} is required`);
          setLoading(false);
          return;
        }
      }

      // Logic Validation: Check member counts
      const totalMembers = parseInt(formData.musiciansCount) || 0;
      const vocalists = parseInt(formData.vocalistCount) || 0;
      const instrumentalists = parseInt(formData.instrumentalistCount) || 0;

      if (totalMembers < 5) {
        toastError("Total Members must be at least 5");
        setLoading(false);
        return;
      }

      if (totalMembers > 10) {
        toastError("Total Members cannot exceed 10");
        setLoading(false);
        return;
      }
      if (vocalists < 2) {
        toastError("Vocalists must be at least 2");
        setLoading(false);
        return;
      }
      if (instrumentalists < 3) {
        toastError("Instrumentalists must be at least 3");
        setLoading(false);
        return;
      }

      if (vocalists + instrumentalists > totalMembers) {
        toastError(
          `Total members (${totalMembers}) cannot be less than sum of vocalists and instrumentalists (${vocalists + instrumentalists
          })`
        );
        setLoading(false);
        return;
      }

      // Allow a small buffer? Or strict equality?
      // Usually Total = Vocalists + Instrumentalists.
      // Sometimes there are non-musical members? "Manager" is separate.
      // Let's enforce strictly or leniently? The form says "Musicians count".
      // Vocalist + Instrumentalist = Musicians.

      if (uploading) {
        toastError("Please wait for the screenshot upload to complete.");
        setLoading(false);
        return;
      }

      if (!screenshotUrl) {
        toastError("Please upload the payment screenshot");
        setLoading(false);
        return;
      }

      // Check for duplicate Transaction ID
      const transactionQuery = query(
        collection(db, "abheri_registrations"),
        where("transactionId", "==", formData.transactionId),
        limit(1)
      );
      const transactionSnapshot = await getDocs(transactionQuery);

      if (!transactionSnapshot.empty) {
        // If we are updating, allow same ID if it belongs to this registration
        const existingDoc = transactionSnapshot.docs[0];
        if (
          existingRegistrationId &&
          existingDoc.id === existingRegistrationId
        ) {
          // It's our own ID, proceed
        } else {
          toastError("This Transaction ID has already been used.");
          setLoading(false);
          return;
        }
      }

      const registrationData = {
        ...formData,
        instruments: selectedInstruments,
        screenshotUrl: screenshotUrl,
        // Only set createdAt on new docs, maybe updatedAt on updates?
        // createdAt: new Date(),
        userId: user?.uid,
        userEmail: user?.email,
        updatedAt: new Date(),
      };

      if (existingRegistrationId) {
        // Update existing
        await updateDoc(
          doc(db, "abheri_registrations", existingRegistrationId),
          registrationData
        );
        toastSuccess("Registration updated successfully!");
      } else {
        // Create new
        await addDoc(collection(db, "abheri_registrations"), {
          ...registrationData,
          createdAt: new Date(),
        });

        if (user) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            registeredEvents: arrayUnion("Abheri Battle of Bands"),
          });
          await refetchUserProfile();
        }
        toastSuccess("Registration successful!");
      }

      localStorage.removeItem(STORAGE_KEY); // Clear saved data on success

      // If creating new, reset form. If updating, usually we keep the data there.
      if (!existingRegistrationId) {
        setFormData({
          bandName: "",
          collegeName: "",
          managerName: "",
          managerMobile: "",
          leaderName: "",
          leaderMobile: "",
          musiciansCount: "",
          vocalistCount: "",
          instrumentalistCount: "",
          transactionId: "",
        });
        setSelectedInstruments([]);
        setIsAddingCustom(false);
        setCustomInstrument("");
        setAcknowledged(false);
        router.push("/abheri");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toastError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (registrationStatusLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!registrationOpen) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center border border-white/10 bg-white/5 rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Registration Closed
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            The registration for Abheri is currently closed.
            Please check again later.
          </p>

          <Link
            href="/abheri"
            className="inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-3 font-semibold"
          >
            Back to Event Details
          </Link>
        </div>
      </div>
    );
  }


}
