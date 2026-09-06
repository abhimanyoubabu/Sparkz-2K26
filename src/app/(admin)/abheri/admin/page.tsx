"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FiDownload, FiLogOut, FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AbheriRegistration {
    id: string;
    bandName: string;
    collegeName: string;
    managerName: string;
    managerMobile: string;
    leaderName: string;
    leaderMobile: string;
    musiciansCount: number;
    transactionId: string;
    screenshotUrl: string;
    instruments: string[];
}

export default function AbheriAdminPage() {
    const { userData, loading, logout } = useAuth();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<AbheriRegistration[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!userData || (userData.role !== 'abheriAdmin' && userData.role !== 'superAdmin')) {
                router.push("/");
                return;
            }
            fetchRegistrations();
        }
    }, [userData, loading, router]);

    const fetchRegistrations = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "abheri_registrations"));
            const list = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AbheriRegistration[];
            setRegistrations(list);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchLoading(false);
        }
    };

    const exportToExcel = () => {
        const data = registrations.map(r => ({
            "Band Name": r.bandName,
            "College": r.collegeName,
            "Manager": r.managerName,
            "Manager Phone": r.managerMobile,
            "Leader": r.leaderName,
            "Leader Phone": r.leaderMobile,
            "Members": r.musiciansCount,
            "Transaction ID": r.transactionId,
            "Instruments": r.instruments?.join(", "),
            "Screenshot Link": r.screenshotUrl
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Abheri Registrations");
        XLSX.writeFile(wb, "Abheri_Registrations.xlsx");
    };

    if (loading || fetchLoading) {
         return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-[#04050b] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Abheri Admin
                        </h1>
                        <p className="text-gray-400 mt-1">Manage Battle of Bands Registrations</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={exportToExcel}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-emerald-500/20"
                        >
                            <FiDownload /> Export Excel
                        </button>
                        <button 
                            onClick={() => logout()}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-800/50 text-gray-400 text-sm">
                                    <th className="p-4 font-semibold">Band Info</th>
                                    <th className="p-4 font-semibold">Contact</th>
                                    <th className="p-4 font-semibold">Details</th>
                                    <th className="p-4 font-semibold">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-800/20 transition-colors group">
                                        <td className="p-4 align-top">
                                            <div className="font-bold text-lg text-white">{reg.bandName}</div>
                                            <div className="text-sm text-gray-400">{reg.collegeName}</div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="text-sm">
                                                <span className="text-gray-500">Mgr:</span> {reg.managerName}
                                                <br />
                                                <span className="text-gray-500">Ph:</span> {reg.managerMobile}
                                            </div>
                                            <div className="text-sm mt-2">
                                                <span className="text-gray-500">Ldr:</span> {reg.leaderName}
                                                <br />
                                                <span className="text-gray-500">Ph:</span> {reg.leaderMobile}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="text-sm">
                                                <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                                                    {reg.musiciansCount} Members
                                                </span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {reg.instruments?.slice(0, 3).map((inst, i) => (
                                                    <span key={i} className="text-xs bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20">
                                                        {inst}
                                                    </span>
                                                ))}
                                                {reg.instruments?.length > 3 && (
                                                    <span className="text-xs text-gray-500">+{reg.instruments.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="text-sm font-mono text-gray-300 mb-2">{reg.transactionId}</div>
                                            {reg.screenshotUrl && (
                                                <a 
                                                    href={reg.screenshotUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 underline"
                                                >
                                                    <FiExternalLink /> View Screenshot
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {registrations.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-500">
                                            No registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
