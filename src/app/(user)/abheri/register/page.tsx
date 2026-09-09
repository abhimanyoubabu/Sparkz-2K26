"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  getDoc,
  limit,
} from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import { db } from "@/utils/firebase";
import Link from "next/link";
import { toastSuccess, toastError } from "@/utils/common/Toast";
import {
  Loader2,
  Smartphone,
  ExternalLink,
  Copy,
  Upload,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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

  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);

  const [screenshotUrl, setScreenshotUrl] =
    useState<string | null>(null);

  // Google Drive file ID
  const [screenshotFileId, setScreenshotFileId] =
    useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedInstruments, setSelectedInstruments] =
    useState<string[]>([]);

  const [isAddingCustom, setIsAddingCustom] =
    useState(false);

  const [customInstrument, setCustomInstrument] =
    useState("");

  const [acknowledged, setAcknowledged] =
    useState(false);

  const [existingRegistrationId, setExistingRegistrationId] =
    useState<string | null>(null);

  const [checkingExistingRegistration, setCheckingExistingRegistration] =
    useState(true);

  // Registration ON/OFF
  const [registrationOpen, setRegistrationOpen] =
    useState(true);

  const [registrationStatusLoading, setRegistrationStatusLoading] =
    useState(true);

  const {
    user,
    loading: authLoading,
    refetchUserProfile,
  } = useAuth();

  const router = useRouter();

  // ==================================================
  // UPI DETAILS
  // ==================================================

  const UPI_ID = "steevpalliath007@oksbi";

  const transactionNote = `Abheri Registration ${formData.bandName
    ? `- ${formData.bandName}`
    : ""
    }`;

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Sparkz2K26&am=1200&cu=INR&tn=${encodeURIComponent(
    transactionNote
  )}`;

  const predefinedInstruments = [
    "Keyboard",
    "Guitar",
    "Bass Guitar",
    "Drums",
  ];

  const STORAGE_KEY = "abheri_registration_form";

  // ==================================================
  // CHECK REGISTRATION STATUS
  // ==================================================

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
          setRegistrationOpen(true);
        }
      } catch (error) {
        console.error(
          "Failed to fetch registration status:",
          error
        );

        setRegistrationOpen(true);
      } finally {
        setRegistrationStatusLoading(false);
      }
    };

    fetchRegistrationStatus();
  }, []);

  // ==================================================
  // LOGIN CHECK
  // ==================================================

  useEffect(() => {
    if (!authLoading && !user) {
      toastError(
        "Please login to register for Abheri"
      );

      router.push("/login");
    }
  }, [user, authLoading, router]);

  // ==================================================
  // LOAD SAVED DATA
  // ==================================================

  useEffect(() => {
    if (!existingRegistrationId) {
      const savedData =
        localStorage.getItem(STORAGE_KEY);

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);

          if (parsed.formData) {
            setFormData(parsed.formData);
          }

          if (parsed.selectedInstruments) {
            setSelectedInstruments(
              parsed.selectedInstruments
            );
          }
        } catch (error) {
          console.error(
            "Failed to load saved data:",
            error
          );
        }
      }
    }
  }, [existingRegistrationId]);

  // ==================================================
  // FETCH EXISTING REGISTRATION
  // ==================================================

  useEffect(() => {
    const fetchRegistration = async () => {
      if (!user) {
        setCheckingExistingRegistration(false);
        return;
      }

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
          setScreenshotFileId(data.screenshotFileId || null);

          setAcknowledged(true);
        } else {
          // No Abheri registration exists for this account
          setExistingRegistrationId(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch existing registration:",
          error
        );

        toastError(
          "Failed to check your Abheri registration."
        );
      } finally {
        setCheckingExistingRegistration(false);
      }
    };

    if (!authLoading) {
      fetchRegistration();
    }
  }, [user, authLoading]);

  // ==================================================
  // SAVE FORM TO LOCAL STORAGE
  // ==================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          formData,
          selectedInstruments,
        })
      );
    }, 1000);

    return () =>
      clearTimeout(timeoutId);
  }, [
    formData,
    selectedInstruments,
  ]);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // HANDLE INSTRUMENT DROPDOWN
  // ==================================================

  const handleDropdownChange = (
    e: React.ChangeEvent<
      HTMLSelectElement
    >
  ) => {
    const value = e.target.value;

    if (!value) return;

    if (value === "Other") {
      setIsAddingCustom(true);
      return;
    }

    if (
      !selectedInstruments.includes(value)
    ) {
      setSelectedInstruments(
        (prev) => [...prev, value]
      );
    }

    e.target.value = "";
  };

  // ==================================================
  // ADD CUSTOM INSTRUMENT
  // ==================================================

  const handleAddCustom = () => {
    const instrument =
      customInstrument.trim();

    if (!instrument) {
      toastError(
        "Please enter an instrument name."
      );

      return;
    }

    if (
      selectedInstruments.includes(
        instrument
      )
    ) {
      toastError(
        "This instrument is already selected."
      );

      return;
    }

    setSelectedInstruments(
      (prev) => [
        ...prev,
        instrument,
      ]
    );

    setCustomInstrument("");
    setIsAddingCustom(false);
  };

  // ==================================================
  // REMOVE INSTRUMENT
  // ==================================================

  const removeInstrument = (
    instrument: string
  ) => {
    setSelectedInstruments(
      (prev) =>
        prev.filter(
          (item) =>
            item !== instrument
        )
    );
  };

  // ==================================================
  // UPLOAD SCREENSHOT TO GOOGLE DRIVE
  // ==================================================

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      !e.target.files ||
      !e.target.files[0]
    ) {
      return;
    }

    const file =
      e.target.files[0];

    // File size
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toastError(
        "File size should be less than 5MB"
      );

      return;
    }

    // File type
    if (
      !file.type.startsWith("image/")
    ) {
      toastError(
        "Please upload an image file."
      );

      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setPaymentScreenshot(file);

      const uploadData =
        new FormData();

      uploadData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "/api/abheri/upload-payment",
          {
            method: "POST",
            body: uploadData,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
          "Upload failed"
        );
      }

      // Google Drive URL
      setScreenshotUrl(
        result.url
      );

      // Google Drive file ID
      setScreenshotFileId(
        result.fileId
      );

      setUploadProgress(100);

      toastSuccess(
        "Screenshot uploaded successfully!"
      );
    } catch (error: any) {
      console.error(
        "Upload error:",
        error
      );

      toastError(
        error?.message ||
        "Upload failed. Please try again."
      );

      setPaymentScreenshot(null);
      setScreenshotUrl(null);
      setScreenshotFileId(null);
    } finally {
      setUploading(false);
    }
  };

  // ==================================================
  // DELETE SCREENSHOT FROM GOOGLE DRIVE
  // ==================================================

  const handleDeleteFile = async () => {
    try {
      if (screenshotFileId) {
        const response =
          await fetch(
            "/api/abheri/upload-payment",
            {
              method: "DELETE",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                fileId:
                  screenshotFileId,
              }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Failed to delete screenshot"
          );
        }
      }

      setPaymentScreenshot(null);
      setScreenshotUrl(null);
      setScreenshotFileId(null);
      setUploading(false);
      setUploadProgress(0);

      toastSuccess(
        "File removed."
      );
    } catch (error: any) {
      console.error(
        "Delete error:",
        error
      );

      toastError(
        error?.message ||
        "Failed to remove file."
      );
    }
  };

  // ==================================================
  // COPY UPI
  // ==================================================

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(
      UPI_ID
    );

    toastSuccess(
      "UPI ID copied to clipboard!"
    );
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Registration check
    if (!registrationOpen) {
      toastError(
        "Registration is currently closed."
      );

      return;
    }

    // Login check
    if (!user) {
      toastError(
        "Please login first."
      );

      router.push("/login");

      return;
    }

    if (existingRegistrationId) {
      toastError(
        "You have already registered for Abheri."
      );
      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // ACKNOWLEDGEMENT
      // ==================================================

      if (!acknowledged) {
        toastError(
          "Please agree to the rules and regulations."
        );

        setLoading(false);

        return;
      }

      // ==================================================
      // REQUIRED FIELDS
      // ==================================================

      const requiredFields = [
        {
          key: "bandName",
          label: "Band Name",
        },
        {
          key: "collegeName",
          label: "College Name",
        },
        {
          key: "managerName",
          label: "Manager Name",
        },
        {
          key: "managerMobile",
          label: "Manager Mobile",
        },
        {
          key: "leaderName",
          label: "Leader Name",
        },
        {
          key: "leaderMobile",
          label: "Leader Mobile",
        },
        {
          key: "transactionId",
          label: "Transaction ID",
        },
      ];

      for (
        const field of requiredFields
      ) {
        if (
          !formData[
          field.key as keyof typeof formData
          ]
        ) {
          toastError(
            `${field.label} is required`
          );

          setLoading(false);

          return;
        }
      }

      // ==================================================
      // MEMBER VALIDATION
      // ==================================================

      const totalMembers =
        parseInt(
          formData.musiciansCount
        ) || 0;

      const vocalists =
        parseInt(
          formData.vocalistCount
        ) || 0;

      const instrumentalists =
        parseInt(
          formData.instrumentalistCount
        ) || 0;

      if (totalMembers < 5) {
        toastError(
          "Total Members must be at least 5"
        );

        setLoading(false);

        return;
      }

      if (totalMembers > 10) {
        toastError(
          "Total Members cannot exceed 10"
        );

        setLoading(false);

        return;
      }

      if (vocalists < 2) {
        toastError(
          "Vocalists must be at least 2"
        );

        setLoading(false);

        return;
      }

      if (instrumentalists < 3) {
        toastError(
          "Instrumentalists must be at least 3"
        );

        setLoading(false);

        return;
      }

      if (
        vocalists +
        instrumentalists >
        totalMembers
      ) {
        toastError(
          `Total members (${totalMembers}) cannot be less than sum of vocalists and instrumentalists (${vocalists + instrumentalists})`
        );

        setLoading(false);

        return;
      }

      // ==================================================
      // SCREENSHOT VALIDATION
      // ==================================================

      if (uploading) {
        toastError(
          "Please wait for the screenshot upload to complete."
        );

        setLoading(false);

        return;
      }

      if (!screenshotUrl) {
        toastError(
          "Please upload the payment screenshot"
        );

        setLoading(false);

        return;
      }

      // ==================================================
      // TRANSACTION ID DUPLICATE CHECK
      // ==================================================

      // Check only this user's registrations.
      // Firestore rules allow users to read their own registrations.
      const transactionQuery = query(
        collection(db, "abheri_registrations"),
        where("userId", "==", user.uid),
        where("transactionId", "==", formData.transactionId),
        limit(1)
      );

      const transactionSnapshot = await getDocs(
        transactionQuery
      );

      if (!transactionSnapshot.empty) {
        const existingDoc = transactionSnapshot.docs[0];

        if (
          !existingRegistrationId ||
          existingDoc.id !== existingRegistrationId
        ) {
          toastError(
            "This Transaction ID has already been used."
          );

          setLoading(false);
          return;
        }
      }
      // ==================================================
      // REGISTRATION DATA
      // ==================================================

      const registrationData = {
        ...formData,

        instruments:
          selectedInstruments,

        // Google Drive link
        screenshotUrl:
          screenshotUrl,

        // Google Drive file ID
        screenshotFileId:
          screenshotFileId,

        userId:
          user.uid,

        userEmail:
          user.email,

        updatedAt:
          new Date(),
      };

      // ==================================================
      // UPDATE EXISTING REGISTRATION
      // ==================================================

      if (existingRegistrationId) {
        await updateDoc(
          doc(
            db,
            "abheri_registrations",
            existingRegistrationId
          ),
          registrationData
        );

        toastSuccess(
          "Registration updated successfully!"
        );
      }

      // ==================================================
      // CREATE NEW REGISTRATION
      // ==================================================

      else {
        await setDoc(
          doc(
            db,
            "abheri_registrations",
            user.uid
          ),
          {
            ...registrationData,
            userId: user.uid,
            createdAt: new Date(),
          }
        );

        const userRef =
          doc(
            db,
            "users",
            user.uid
          );

        await updateDoc(
          userRef,
          {
            registeredEvents:
              arrayUnion(
                "Abheri Battle of Bands"
              ),
          }
        );

        await refetchUserProfile();

        toastSuccess(
          "Registration successful!"
        );
      }

      // ==================================================
      // CLEAR LOCAL STORAGE
      // ==================================================

      localStorage.removeItem(
        STORAGE_KEY
      );

      // ==================================================
      // RESET AFTER NEW REGISTRATION
      // ==================================================

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

        setSelectedInstruments(
          []
        );

        setPaymentScreenshot(
          null
        );

        setScreenshotUrl(
          null
        );

        setScreenshotFileId(
          null
        );

        setUploadProgress(0);

        setIsAddingCustom(
          false
        );

        setCustomInstrument(
          ""
        );

        setAcknowledged(
          false
        );

        router.push(
          "/abheri"
        );
      }
    } catch (error: any) {
      console.error(
        "Registration error:",
        error
      );

      toastError(
        error?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (
    registrationStatusLoading
  ) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  // ==================================================
  // REGISTRATION CLOSED
  // ==================================================

  if (!registrationOpen) {
    return (
      <div className="min-h-screen bg-[#F9F6ED] text-[#221F1A] px-4 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center border border-[#DEC077] bg-[#FAF4E8] rounded-3xl p-8 md:p-12 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#221F1A]">
            Registration Closed
          </h1>

          <p className="text-[#221F1A]/70 text-lg mb-8 font-medium">
            The registration for Abheri is
            currently closed. Please check
            again later.
          </p>

          <Link
            href="/abheri"
            className="inline-flex items-center justify-center rounded-full bg-[#E9D39D] hover:bg-[#dec077] border border-[#DEC077] text-[#221F1A] px-8 py-3.5 font-bold transition shadow-md"
          >
            Back to Event Details
          </Link>
        </div>
      </div>
    );
  }

  // ==================================================
  // REGISTRATION FORM
  // ==================================================

  return (
    <div className="min-h-screen bg-[#F9F6ED] text-[#221F1A] px-4 py-10 md:py-14 font-sans relative overflow-hidden">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-[#DEC077]/20 rounded-full blur-[120px]" />

        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[#E9D39D]/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">

          <Link
            href="/abheri"
            className="inline-block mb-6 text-sm text-[#221F1A]/70 hover:text-[#C19B4C] font-semibold transition"
          >
            ← Back to Abheri
          </Link>

          <h1 className="text-4xl md:text-6xl font-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C]">
              ABHERI
            </span>
          </h1>

          <p className="text-[#221F1A]/70 mt-3 text-lg font-medium">
            Battle of Bands — Registration
          </p>

          {existingRegistrationId && (
            <div className="inline-block mt-5 px-5 py-2 rounded-full border border-green-600/30 bg-green-100 text-green-800 font-semibold text-sm">
              You already registered. You can
              update your details below.
            </div>
          )}
        </div>

        {/* Form card */}
        <div className="rounded-3xl border border-[#DEC077] bg-[#FAF4E8] backdrop-blur-xl p-6 md:p-10 shadow-xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >

            {/* ============================= */}
            {/* BAND DETAILS */}
            {/* ============================= */}

            <section>
              <div className="border-b border-[#DEC077]/50 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#221F1A]">
                  Band Details
                </h2>

                <p className="text-sm text-[#221F1A]/60 mt-1">
                  Enter your band information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    Band Name *
                  </label>

                  <input
                    required
                    name="bandName"
                    value={formData.bandName}
                    onChange={handleChange}
                    placeholder="Enter band name"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    College Name *
                  </label>

                  <input
                    required
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="Enter college name"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

              </div>
            </section>

            {/* ============================= */}
            {/* MANAGER */}
            {/* ============================= */}

            <section>
              <div className="border-b border-[#DEC077]/50 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#221F1A]">
                  Manager Details
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    Manager Name *
                  </label>

                  <input
                    required
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    placeholder="Manager name"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    Manager Mobile *
                  </label>

                  <input
                    required
                    type="tel"
                    name="managerMobile"
                    value={formData.managerMobile}
                    onChange={handleChange}
                    placeholder="Manager mobile number"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

              </div>
            </section>

            {/* ============================= */}
            {/* LEADER */}
            {/* ============================= */}

            <section>
              <div className="border-b border-[#DEC077]/50 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#221F1A]">
                  Band Leader Details
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    Leader Name *
                  </label>

                  <input
                    required
                    name="leaderName"
                    value={formData.leaderName}
                    onChange={handleChange}
                    placeholder="Band leader name"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    Leader Mobile *
                  </label>

                  <input
                    required
                    type="tel"
                    name="leaderMobile"
                    value={formData.leaderMobile}
                    onChange={handleChange}
                    placeholder="Band leader mobile number"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

              </div>
            </section>

            {/* ============================= */}
            {/* MEMBERS */}
            {/* ============================= */}

            <section>
              <div className="border-b border-[#DEC077]/50 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#221F1A]">
                  Band Members
                </h2>

                <p className="text-sm text-[#221F1A]/60 mt-1">
                  Total team size must be between
                  5 and 10 members.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-5">

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    Total Members *
                  </label>

                  <input
                    required
                    type="number"
                    min="5"
                    max="10"
                    name="musiciansCount"
                    value={formData.musiciansCount}
                    onChange={handleChange}
                    placeholder="5 - 10"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    Vocalists *
                  </label>

                  <input
                    required
                    type="number"
                    min="2"
                    name="vocalistCount"
                    value={formData.vocalistCount}
                    onChange={handleChange}
                    placeholder="Minimum 2"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                    Instrumentalists *
                  </label>

                  <input
                    required
                    type="number"
                    min="3"
                    name="instrumentalistCount"
                    value={formData.instrumentalistCount}
                    onChange={handleChange}
                    placeholder="Minimum 3"
                    className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                  />
                </div>

              </div>
            </section>

            {/* ============================= */}
            {/* INSTRUMENTS */}
            {/* ============================= */}

            <section>
              <div className="border-b border-[#DEC077]/50 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#221F1A]">
                  Instruments
                </h2>

                <p className="text-sm text-[#221F1A]/60 mt-1">
                  Select the instruments your
                  band uses.
                </p>
              </div>

              <select
                defaultValue=""
                onChange={
                  handleDropdownChange
                }
                className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] font-medium"
              >
                <option
                  value=""
                  disabled
                  className="bg-[#FAF4E8] text-[#221F1A]"
                >
                  Select an instrument
                </option>

                {predefinedInstruments.map(
                  (instrument) => (
                    <option
                      key={instrument}
                      value={instrument}
                      className="bg-[#FAF4E8] text-[#221F1A]"
                    >
                      {instrument}
                    </option>
                  )
                )}

                <option
                  value="Other"
                  className="bg-[#FAF4E8] text-[#221F1A]"
                >
                  Other
                </option>
              </select>

              {/* Custom */}
              {isAddingCustom && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">

                  <input
                    value={
                      customInstrument
                    }
                    onChange={(e) =>
                      setCustomInstrument(
                        e.target.value
                      )
                    }
                    placeholder="Enter instrument name"
                    className="flex-1 rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] text-[#221F1A]"
                  />

                  <button
                    type="button"
                    onClick={
                      handleAddCustom
                    }
                    className="px-6 py-3 rounded-xl bg-[#E9D39D] hover:bg-[#dec077] border border-[#DEC077] font-bold text-[#221F1A] transition shadow-xs"
                  >
                    Add
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCustom(
                        false
                      );
                      setCustomInstrument(
                        ""
                      );
                    }}
                    className="px-6 py-3 rounded-xl bg-[#FAF4E8] hover:bg-[#F9F6ED] border border-[#DEC077] text-[#221F1A] font-semibold"
                  >
                    Cancel
                  </button>

                </div>
              )}

              {/* Selected */}
              {selectedInstruments.length >
                0 && (
                  <div className="flex flex-wrap gap-2 mt-5">

                    {selectedInstruments.map(
                      (instrument) => (
                        <div
                          key={instrument}
                          className="flex items-center gap-2 rounded-full border border-[#DEC077] bg-[#E9D39D] px-4 py-2 text-sm text-[#221F1A] font-semibold shadow-xs"
                        >
                          <span>
                            {instrument}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeInstrument(
                                instrument
                              )
                            }
                            className="text-[#221F1A]/60 hover:text-red-600 font-bold ml-1"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}

                  </div>
                )}
            </section>

            {/* ============================= */}
            {/* PAYMENT */}
            {/* ============================= */}

            <section>
              <div className="border-b border-[#DEC077]/50 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#221F1A]">
                  Payment
                </h2>

                <p className="text-sm text-[#221F1A]/70 mt-1 font-medium">
                  Registration Fee:{" "}
                  <span className="text-[#C19B4C] font-black">
                    ₹1,200
                  </span>
                </p>
              </div>

              {/* UPI PAYMENT CARD */}
              <div className="rounded-2xl border border-[#DEC077] bg-[#F9F6ED] p-6 shadow-xs">

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                  {/* UPI DETAILS */}
                  <div className="flex-1">

                    <p className="text-sm text-[#221F1A]/60 mb-2 font-medium">
                      UPI ID
                    </p>

                    <div className="flex items-center gap-3">

                      <Smartphone
                        className="text-[#C19B4C] shrink-0"
                        size={22}
                      />

                      <span className="font-mono break-all font-bold text-[#221F1A]">
                        {UPI_ID}
                      </span>

                    </div>

                    <p className="text-sm text-[#221F1A]/70 mt-3 font-medium">
                      Amount:{" "}
                      <span className="text-[#C19B4C] font-black">
                        ₹1,200
                      </span>
                    </p>

                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-3">

                    <a
                      href={upiLink}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E9D39D] hover:bg-[#dec077] border border-[#DEC077] px-5 py-3 font-bold text-[#221F1A] transition shadow-xs"
                    >
                      <ExternalLink size={17} />
                      Pay via UPI
                    </a>

                    <button
                      type="button"
                      onClick={
                        handleCopyUPI
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FAF4E8] hover:bg-[#F9F6ED] border border-[#DEC077] text-[#221F1A] px-5 py-3 font-bold transition shadow-xs"
                    >
                      <Copy size={17} />
                      Copy UPI
                    </button>

                  </div>

                </div>

                {/* QR CODE */}
                <div className="mt-8 pt-8 border-t border-[#DEC077]/50">

                  <div className="flex flex-col items-center text-center">

                    <h3 className="text-xl font-bold text-[#221F1A]">
                      Scan &amp; Pay
                    </h3>

                    <p className="text-sm text-[#221F1A]/60 mt-2 mb-5">
                      Scan this QR code using
                      Google Pay, PhonePe,
                      Paytm or any UPI app
                    </p>

                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-[#DEC077]">

                      <QRCodeSVG
                        value={upiLink}
                        size={220}
                        level="H"
                        includeMargin={true}
                      />

                    </div>

                    <div className="mt-5">

                      <p className="text-sm text-[#221F1A]/60 font-medium">
                        Registration Fee
                      </p>

                      <p className="text-2xl font-black text-[#C19B4C] mt-1">
                        ₹1,200
                      </p>

                    </div>

                    <div className="mt-3 max-w-full">

                      <p className="text-xs text-[#221F1A]/50 font-semibold">
                        UPI ID
                      </p>

                      <p className="text-sm text-[#221F1A] font-mono break-all font-bold">
                        {UPI_ID}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* TRANSACTION ID */}
              <div className="mt-6">

                <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                  Transaction ID / Reference Number *
                </label>

                <input
                  required
                  name="transactionId"
                  value={
                    formData.transactionId
                  }
                  onChange={handleChange}
                  placeholder="Enter UPI transaction ID"
                  className="w-full rounded-xl border border-[#DEC077] bg-[#F9F6ED] px-4 py-3 font-mono outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition text-[#221F1A] placeholder:text-[#221F1A]/30 font-medium"
                />

                <p className="text-xs text-[#221F1A]/60 mt-2">
                  Enter the transaction/reference
                  number shown after completing
                  the payment.
                </p>

              </div>

              {/* SCREENSHOT */}
              <div className="mt-6">

                <label className="block text-sm font-semibold text-[#221F1A]/80 mb-2">
                  Payment Screenshot *
                </label>

                {!screenshotUrl ? (
                  <label className="block cursor-pointer">

                    <div className="border border-dashed border-[#DEC077] hover:border-[#C19B4C] bg-[#F9F6ED] rounded-2xl p-8 text-center transition">

                      <Upload
                        className="mx-auto mb-3 text-[#C19B4C]"
                        size={40}
                      />

                      <p className="font-bold text-[#221F1A]">
                        Upload payment screenshot
                      </p>

                      <p className="text-sm text-[#221F1A]/60 mt-2">
                        JPG, PNG or WEBP —
                        Maximum 5MB
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleFileChange
                        }
                        className="hidden"
                      />

                    </div>

                  </label>
                ) : (
                  <div className="rounded-2xl border border-green-600/30 bg-green-100 p-5">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                      <div>
                        <p className="font-bold text-green-800">
                          ✓ Screenshot uploaded
                        </p>

                        <p className="text-sm text-green-700 mt-1">
                          {paymentScreenshot?.name ||
                            "Payment screenshot"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleDeleteFile
                        }
                        className="flex items-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 px-4 py-2 font-bold"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>

                    </div>

                  </div>
                )}

                {/* Progress */}
                {uploading && (
                  <div className="mt-4">

                    <div className="flex justify-between text-xs text-[#221F1A]/60 mb-2 font-semibold">

                      <span>
                        Uploading...
                      </span>

                      <span>
                        {Math.round(
                          uploadProgress
                        )}
                        %
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-[#DEC077]/30 overflow-hidden">

                      <div
                        className="h-full bg-gradient-to-r from-[#C19B4C] to-[#DEC077] transition-all"
                        style={{
                          width: `${uploadProgress}%`,
                        }}
                      />

                    </div>

                  </div>
                )}

              </div>

            </section>

            {/* ============================= */}
            {/* ACKNOWLEDGEMENT */}
            {/* ============================= */}

            <div className="rounded-2xl border border-[#DEC077]/50 bg-[#E9D39D]/20 p-5">

              <div className="flex items-start gap-3">

                <input
                  id="acknowledgement"
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) =>
                    setAcknowledged(
                      e.target.checked
                    )
                  }
                  className="mt-1 w-5 h-5 accent-[#C19B4C]"
                />

                <label
                  htmlFor="acknowledgement"
                  className="text-sm text-[#221F1A]/80 leading-6 cursor-pointer font-medium"
                >
                  I confirm that all the
                  details provided are
                  accurate and I agree to
                  the Abheri Battle of
                  Bands rules and regulations.
                </label>

              </div>

            </div>

            {/* ============================= */}
            {/* SUBMIT */}
            {/* ============================= */}

            <button
              type="submit"
              disabled={
                loading ||
                uploading ||
                !acknowledged
              }
              className="w-full rounded-full bg-[#E9D39D] hover:bg-[#dec077] border border-[#DEC077] text-[#221F1A] font-black text-lg py-4 transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading ? (
                <>
                  <Loader2
                    size={22}
                    className="animate-spin text-[#C19B4C]"
                  />

                  Processing...
                </>
              ) : existingRegistrationId ? (
                "Update Registration"
              ) : (
                "Confirm Registration"
              )}

            </button>

          </form>
        </div>

        <p className="text-center text-[#221F1A]/40 text-sm mt-8 font-medium">
          Sparkz 2K26 • Abheri Battle of Bands
        </p>

      </div>
    </div>
  );
}