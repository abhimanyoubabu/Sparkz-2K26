"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/utils/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiEdit2, FiSave, FiSearch, FiX } from "react-icons/fi";
import { toastError, toastSuccess } from "@/utils/common/Toast";
import { departments } from "@/utils/constants/Constants";

interface UserData {
    id: string;
    name: string;
    email: string;
    college: string;
    role?: string;
    department?: string;
}

export default function UsersManagement() {
    const { userData } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Edit form states
    const [editRole, setEditRole] = useState("");
    const [editDept, setEditDept] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredUsers(users);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredUsers(users.filter(u => 
                u.name?.toLowerCase().includes(lower) || 
                u.email?.toLowerCase().includes(lower)
            ));
        }
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "users")); 
            // Note: 'orderBy' might need an index if collection is large, keeping it simple for now
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserData[];
            
            setUsers(usersList);
            setFilteredUsers(usersList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            toastError("Failed to fetch users");
            setLoading(false);
        }
    };

    const startEdit = (user: UserData) => {
        setEditingId(user.id);
        setEditRole(user.role || 'user');
        setEditDept(user.department || 'All');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRole("");
        setEditDept("");
    };

    const saveEdit = async (userId: string) => {
        if (!userId) return;

        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                role: editRole,
                department: editRole === 'admin' ? editDept : null 
            });
            
            toastSuccess("User updated successfully");
            setUsers(users.map(u => u.id === userId ? { ...u, role: editRole, department: editDept } : u));
            setEditingId(null);
        } catch (error) {
            console.error("Error updating user:", error);
            toastError("Failed to update user");
        }
    };

    if (loading) return <div className="text-white">Loading users...</div>;
    if (userData?.role !== 'superAdmin') return <div className="text-red-500">Access Denied</div>;

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-8">User Management</h1>

            <div className="mb-6 relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-indigo-500 text-sm"
                />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 bg-gray-800/50">
                            <th className="p-4 font-semibold text-gray-400 text-sm">Name/Email</th>
                            <th className="p-4 font-semibold text-gray-400 text-sm">College</th>
                            <th className="p-4 font-semibold text-gray-400 text-sm">Role</th>
                            <th className="p-4 font-semibold text-gray-400 text-sm">Department</th>
                            <th className="p-4 font-semibold text-gray-400 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-medium text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-300">{user.college}</td>
                                <td className="p-4">
                                    {editingId === user.id ? (
                                        <select 
                                            value={editRole}
                                            onChange={(e) => setEditRole(e.target.value)}
                                            className="bg-black border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="superAdmin">Super Admin</option>
                                            <option value="abheriAdmin">Abheri Admin</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            user.role === 'superAdmin' ? 'bg-fuchsia-500/20 text-fuchsia-300' :
                                            user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' :
                                            user.role === 'abheriAdmin' ? 'bg-amber-500/20 text-amber-300' :
                                            'bg-gray-700 text-gray-300'
                                        }`}>
                                            {user.role || 'user'}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {editingId === user.id && editRole === 'admin' ? (
                                        <select 
                                            value={editDept}
                                            onChange={(e) => setEditDept(e.target.value)}
                                            className="bg-black border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="">Select Dept</option>
                                            {departments.filter(d => d !== 'All').map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            {user.department || '-'}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {editingId === user.id ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => saveEdit(user.id)}
                                                className="p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20"
                                                title="Save"
                                            >
                                                <FiSave size={16} />
                                            </button>
                                            <button 
                                                onClick={cancelEdit}
                                                className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                                                title="Cancel"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => startEdit(user)}
                                            className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                                            title="Edit"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
