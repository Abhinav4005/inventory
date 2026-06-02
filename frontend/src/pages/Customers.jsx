import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Users, Pencil, Trash2, Mail, Phone } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import CustomerModal from "../components/customers/CustomerModal";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from "../api/customerApi";

function getInitials(name = "") {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

const avatarColors = [
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
];

function getAvatarColor(name = "") {
    const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarColors[sum % avatarColors.length];
}

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [deleteCustomerId, setDeleteCustomerId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCustomer = async (payload) => {
        try {
            setIsSubmitting(true);
            await createCustomer(payload);
            toast.success("Customer added successfully");
            setIsModalOpen(false);
            await fetchCustomers();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to create customer");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateCustomer = async (payload) => {
        try {
            setIsSubmitting(true);
            const updated = await updateCustomer(editingCustomer.id, payload);
            setCustomers((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
            );
            toast.success("Customer updated successfully");
            setEditingCustomer(null);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to update customer");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCustomer = async () => {
        try {
            setIsDeleting(true);
            await deleteCustomer(deleteCustomerId);
            setCustomers((prev) => prev.filter((c) => c.id !== deleteCustomerId));
            toast.success("Customer deleted successfully");
            setDeleteCustomerId(null);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to delete customer");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Customers</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {customers.length} customer{customers.length !== 1 ? "s" : ""} registered
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors cursor-pointer shadow-sm shadow-primary-600/30"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Customer</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : customers.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No customers yet"
                        description="Add your first customer to start managing relationships."
                        action={
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add Customer
                            </button>
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {customers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(
                                                        customer.full_name
                                                    )}`}
                                                >
                                                    {getInitials(customer.full_name)}
                                                </div>
                                                <span className="text-sm font-medium text-slate-800">
                                                    {customer.full_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                                {customer.email}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                                {customer.phone_number}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setEditingCustomer(customer)}
                                                    className="p-2 rounded-lg text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteCustomerId(customer.id)}
                                                    className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CustomerModal
                    title="Add Customer"
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateCustomer}
                    isSubmitting={isSubmitting}
                />
            )}
            {editingCustomer && (
                <CustomerModal
                    title="Edit Customer"
                    initialData={editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                    onSubmit={handleUpdateCustomer}
                    isSubmitting={isSubmitting}
                />
            )}
            {deleteCustomerId && (
                <ConfirmModal
                    title="Delete Customer"
                    message="Are you sure you want to delete this customer? This action cannot be undone."
                    onClose={() => setDeleteCustomerId(null)}
                    onConfirm={handleDeleteCustomer}
                    isLoading={isDeleting}
                />
            )}
        </DashboardLayout>
    );
}