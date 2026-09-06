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
import {
  ref,
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

  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);

  const [screenshotUrl, setScreenshotUrl] =
    useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedInstruments, setSelectedInstruments] =
    useState<string[]>([]);

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInstrument, setCustomInstrument] = useState("");

  const [acknowledged, setAcknowledged] = useState(false);

  const [existingRegistrationId, setExistingRegistrationId] =
    useState<string | null>(null);

  // Registration ON/OFF
  const [registrationOpen, setRegistrationOpen] =
    useState(true);

  const [registrationStatusLoading, setRegistrationStatusLoading] =
    useState(true);

  const { user, loading: authLoading, refetchUserProfile } =
    useAuth();

  const router = useRouter();

  // TODO: Replace with actual UPI ID
  const UPI_ID = "jacsjjacobnellickal-1@oksbi";

  const transactionNote = `Abheri Registration ${formData.bandName
      ? `- ${formData.bandName}`
      : ""
    }`;

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Sparkz24&tn=${encodeURIComponent(
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
      if (!user) return;

      try {
        const q = query(
          collection(
            db,
            "abheri_registrations"
          ),
          where("userId", "==", user.uid),
          limit(1)
        );

        const querySnapshot =
          await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap =
            querySnapshot.docs[0];

          const data =
            docSnap.data();

          setExistingRegistrationId(
            docSnap.id
          );

          setFormData({
            bandName:
              data.bandName || "",
            collegeName:
              data.collegeName || "",
            managerName:
              data.managerName || "",
            managerMobile:
              data.managerMobile || "",
            leaderName:
              data.leaderName || "",
            leaderMobile:
              data.leaderMobile || "",
            musiciansCount:
              data.musiciansCount || "",
            vocalistCount:
              data.vocalistCount || "",
            instrumentalistCount:
              data.instrumentalistCount || "",
            transactionId:
              data.transactionId || "",
          });

          setSelectedInstruments(
            data.instruments || []
          );

          setScreenshotUrl(
            data.screenshotUrl || null
          );

          setAcknowledged(true);

          toastSuccess(
            "Loaded your existing registration."
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch registration:",
          error
        );

        toastError(
          "Failed to fetch existing registration."
        );
      }
    };

    if (!authLoading && user) {
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
  }, [formData, selectedInstruments]);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==================================================
  // INSTRUMENTS
  // ==================================================

  const addInstrument = (
    instrument: string
  ) => {
    if (
      !selectedInstruments.includes(
        instrument
      )
    ) {
      setSelectedInstruments([
        ...selectedInstruments,
        instrument,
      ]);
    }
  };

  const removeInstrument = (
    instrument: string
  ) => {
    setSelectedInstruments(
      selectedInstruments.filter(
        (i) => i !== instrument
      )
    );
  };

  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    if (value === "Other") {
      setIsAddingCustom(true);
      e.target.value = "";
    } else if (value) {
      addInstrument(value);
      e.target.value = "";
    }
  };

  const handleAddCustom = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent
  ) => {
    e.preventDefault();

    if (customInstrument.trim()) {
      addInstrument(
        customInstrument.trim()
      );

      setCustomInstrument("");
      setIsAddingCustom(false);
    }
  };

  // ==================================================
  // PAYMENT SCREENSHOT UPLOAD
  // ==================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target.files &&
      e.target.files[0]
    ) {
      const file = e.target.files[0];

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        toastError(
          "File size should be less than 5MB"
        );

        return;
      }

      if (!file.type.startsWith("image/")) {
        toastError(
          "Please upload an image file."
        );

        return;
      }

      setUploading(true);
      setUploadProgress(0);
      setPaymentScreenshot(file);

      const storageRef = ref(
        storage,
        `abheri_payment_screenshots/${Date.now()}_${file.name}`
      );

      const uploadTask =
        uploadBytesResumable(
          storageRef,
          file
        );

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred /
              snapshot.totalBytes) *
            100;

          setUploadProgress(progress);
        },

        (error) => {
          console.error(
            "Upload error:",
            error
          );

          toastError(
            "Upload failed. Please try again."
          );

          setUploading(false);
          setPaymentScreenshot(null);
        },

        () => {
          getDownloadURL(
            uploadTask.snapshot.ref
          ).then((downloadURL) => {
            setScreenshotUrl(
              downloadURL
            );

            setUploading(false);

            toastSuccess(
              "Screenshot uploaded successfully!"
            );
          });
        }
      );
    }
  };

  // ==================================================
  // DELETE SCREENSHOT
  // ==================================================

  const handleDeleteFile = async () => {
    if (screenshotUrl) {
      try {
        const fileRef = ref(
          storage,
          screenshotUrl
        );

        await deleteObject(fileRef);

        toastSuccess(
          "File removed."
        );
      } catch (error) {
        console.error(
          "Delete error:",
          error
        );
      }
    }

    setPaymentScreenshot(null);
    setScreenshotUrl(null);
    setUploading(false);
    setUploadProgress(0);
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

    // Extra security check
    if (!registrationOpen) {
      toastError(
        "Registration is currently closed."
      );

      return;
    }

    if (!user) {
      toastError(
        "Please login first."
      );

      router.push("/login");

      return;
    }

    setLoading(true);

    try {
      // Acknowledgement
      if (!acknowledged) {
        toastError(
          "Please agree to the rules and regulations."
        );

        setLoading(false);

        return;
      }

      // Required fields
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

      for (const field of requiredFields) {
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

      // Member validation
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

      // Screenshot
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

      // Duplicate transaction ID
      const transactionQuery =
        query(
          collection(
            db,
            "abheri_registrations"
          ),
          where(
            "transactionId",
            "==",
            formData.transactionId
          ),
          limit(1)
        );

      const transactionSnapshot =
        await getDocs(
          transactionQuery
        );

      if (
        !transactionSnapshot.empty
      ) {
        const existingDoc =
          transactionSnapshot.docs[0];

        if (
          !existingRegistrationId ||
          existingDoc.id !==
          existingRegistrationId
        ) {
          toastError(
            "This Transaction ID has already been used."
          );

          setLoading(false);

          return;
        }
      }

      // Registration data
      const registrationData = {
        ...formData,

        instruments:
          selectedInstruments,

        screenshotUrl:
          screenshotUrl,

        userId:
          user.uid,

        userEmail:
          user.email,

        updatedAt:
          new Date(),
      };

      // Update
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

      // Create
      else {
        await addDoc(
          collection(
            db,
            "abheri_registrations"
          ),
          {
            ...registrationData,
            createdAt: new Date(),
          }
        );

        const userRef = doc(
          db,
          "users",
          user.uid
        );

        await updateDoc(userRef, {
          registeredEvents:
            arrayUnion(
              "Abheri Battle of Bands"
            ),
        });

        await refetchUserProfile();

        toastSuccess(
          "Registration successful!"
        );
      }

      localStorage.removeItem(
        STORAGE_KEY
      );

      // Reset after new registration
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
        error.message ||
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
      <div className="min-h-screen bg-black text-white px-4 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center border border-white/10 bg-white/5 rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Registration Closed
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            The registration for Abheri is
            currently closed. Please check
            again later.
          </p>

          <Link
            href="/abheri"
            className="inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-3 font-semibold hover:bg-gray-200 transition"
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
    <div className="min-h-screen bg-black text-white px-4 py-10 md:py-14 font-sans relative overflow-hidden">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />

        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">

          <Link
            href="/abheri"
            className="inline-block mb-6 text-sm text-white/50 hover:text-white transition"
          >
            ← Back to Abheri
          </Link>

          <h1 className="text-4xl md:text-6xl font-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-fuchsia-500">
              ABHERI
            </span>
          </h1>

          <p className="text-white/50 mt-3 text-lg">
            Battle of Bands — Registration
          </p>

          {existingRegistrationId && (
            <div className="inline-block mt-5 px-5 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-300 text-sm">
              You already registered. You can
              update your details below.
            </div>
          )}
        </div>

        {/* Form card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-10 shadow-2xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >

            {/* ============================= */}
            {/* BAND DETAILS */}
            {/* ============================= */}

            <section>
              <div className="border-b border-white/10 pb-4 mb-6">
                <h2 className="text-2xl font-bold">
                  Band Details
                </h2>

                <p className="text-sm text-white/40 mt-1">
                  Enter your band information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Band Name *
                  </label>

                  <input
                    required
                    name="bandName"
                    value={formData.bandName}
                    onChange={handleChange}
                    placeholder="Enter band name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    College Name *
                  </label>

                  <input
                    required
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="Enter college name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

              </div>
            </section>

            {/* ============================= */}
            {/* MANAGER */}
            {/* ============================= */}

            <section>
              <div className="border-b border-white/10 pb-4 mb-6">
                <h2 className="text-2xl font-bold">
                  Manager Details
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Manager Name *
                  </label>

                  <input
                    required
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    placeholder="Manager name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Manager Mobile *
                  </label>

                  <input
                    required
                    type="tel"
                    name="managerMobile"
                    value={formData.managerMobile}
                    onChange={handleChange}
                    placeholder="Manager mobile number"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

              </div>
            </section>

            {/* ============================= */}
            {/* LEADER */}
            {/* ============================= */}

            <section>
              <div className="border-b border-white/10 pb-4 mb-6">
                <h2 className="text-2xl font-bold">
                  Band Leader Details
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Leader Name *
                  </label>

                  <input
                    required
                    name="leaderName"
                    value={formData.leaderName}
                    onChange={handleChange}
                    placeholder="Band leader name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Leader Mobile *
                  </label>

                  <input
                    required
                    type="tel"
                    name="leaderMobile"
                    value={formData.leaderMobile}
                    onChange={handleChange}
                    placeholder="Leader mobile number"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

              </div>
            </section>

            {/* ============================= */}
            {/* MEMBERS */}
            {/* ============================= */}

            <section>
              <div className="border-b border-white/10 pb-4 mb-6">
                <h2 className="text-2xl font-bold">
                  Band Members
                </h2>

                <p className="text-sm text-white/40 mt-1">
                  Total team size must be between
                  5 and 10 members.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-5">

                <div>
                  <label className="block text-sm text-white/70 mb-2">
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
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
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
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
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
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
                  />
                </div>

              </div>
            </section>

            {/* ============================= */}
            {/* INSTRUMENTS */}
            {/* ============================= */}

            <section>
              <div className="border-b border-white/10 pb-4 mb-6">
                <h2 className="text-2xl font-bold">
                  Instruments
                </h2>

                <p className="text-sm text-white/40 mt-1">
                  Select the instruments your
                  band uses.
                </p>
              </div>

              <select
                defaultValue=""
                onChange={handleDropdownChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500 transition"
              >
                <option
                  value=""
                  disabled
                  className="bg-black"
                >
                  Select an instrument
                </option>

                {predefinedInstruments.map(
                  (instrument) => (
                    <option
                      key={instrument}
                      value={instrument}
                      className="bg-black"
                    >
                      {instrument}
                    </option>
                  )
                )}

                <option
                  value="Other"
                  className="bg-black"
                >
                  Other
                </option>
              </select>

              {/* Custom */}
              {isAddingCustom && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">

                  <input
                    value={customInstrument}
                    onChange={(e) =>
                      setCustomInstrument(
                        e.target.value
                      )
                    }
                    placeholder="Enter instrument name"
                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-purple-500"
                  />

                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold"
                  >
                    Add
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCustom(false);
                      setCustomInstrument("");
                    }}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15"
                  >
                    Cancel
                  </button>

                </div>
              )}

              {/* Selected */}
              {selectedInstruments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">

                  {selectedInstruments.map(
                    (instrument) => (
                      <div
                        key={instrument}
                        className="flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-200"
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
                          className="text-white/50 hover:text-red-400"
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
              <div className="border-b border-white/10 pb-4 mb-6">
                <h2 className="text-2xl font-bold">
                  Payment
                </h2>

                <p className="text-sm text-white/40 mt-1">
                  Registration Fee:{" "}
                  <span className="text-white font-semibold">
                    ₹1,000
                  </span>
                </p>
              </div>

              {/* UPI */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                  <div>
                    <p className="text-sm text-white/40 mb-2">
                      UPI ID
                    </p>

                    <div className="flex items-center gap-3">

                      <Smartphone className="text-purple-400" />

                      <span className="font-mono break-all">
                        {UPI_ID}
                      </span>

                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">

                    <a
                      href={upiLink}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3 font-semibold"
                    >
                      <ExternalLink size={17} />
                      Pay via UPI
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-5 py-3 font-semibold"
                    >
                      <Copy size={17} />
                      Copy
                    </button>

                  </div>

                </div>

              </div>

              {/* Transaction */}
              <div className="mt-6">

                <label className="block text-sm text-white/70 mb-2">
                  Transaction ID / Reference Number *
                </label>

                <input
                  required
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder="Enter UPI transaction ID"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-purple-500 transition"
                />

              </div>

              {/* Screenshot */}
              <div className="mt-6">

                <label className="block text-sm text-white/70 mb-2">
                  Payment Screenshot *
                </label>

                {!screenshotUrl ? (
                  <label className="block cursor-pointer">

                    <div className="border border-dashed border-white/20 hover:border-purple-500/50 rounded-2xl p-8 text-center transition">

                      <Upload className="mx-auto mb-3 text-white/30" size={40} />

                      <p className="font-semibold">
                        Upload payment screenshot
                      </p>

                      <p className="text-sm text-white/40 mt-2">
                        JPG, PNG or WEBP — Maximum
                        5MB
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
                  <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                      <div>
                        <p className="font-semibold text-green-300">
                          ✓ Screenshot uploaded
                        </p>

                        <p className="text-sm text-white/40 mt-1">
                          {paymentScreenshot?.name ||
                            "Payment screenshot"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleDeleteFile
                        }
                        className="flex items-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 px-4 py-2"
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

                    <div className="flex justify-between text-xs text-white/40 mb-2">
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

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all"
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

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

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
                  className="mt-1 w-5 h-5 accent-purple-600"
                />

                <label
                  htmlFor="acknowledgement"
                  className="text-sm text-white/70 leading-6 cursor-pointer"
                >
                  I confirm that all the details
                  provided are accurate and I
                  agree to the Abheri Battle of
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
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-orange-500 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed py-4 font-bold text-lg transition flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <Loader2
                    size={22}
                    className="animate-spin"
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

        <p className="text-center text-white/30 text-sm mt-8">
          Sparkz 2K26 • Abheri Battle of Bands
        </p>

      </div>
    </div>
  );
}