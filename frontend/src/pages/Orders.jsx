import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    ShoppingCart,
    Plus,
    Eye,
    ChevronDown,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import EmptyState from "../components/ui/EmptyState";

import { getCustomers } from "../api/customerApi";
import { getProducts } from "../api/productApi";
import { getOrders, createOrder } from "../api/orderApi";

export default function Orders() {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        customer_id: "",
        product_id: "",
        quantity: 1,
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [customersData, productsData, ordersData] = await Promise.all([
                getCustomers(),
                getProducts(),
                getOrders(),
            ]);
            setCustomers(customersData);
            setProducts(productsData);
            setOrders(ordersData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load orders data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.customer_id) errors.customer_id = "Please select a customer";
        if (!formData.product_id) errors.product_id = "Please select a product";
        if (!formData.quantity || Number(formData.quantity) < 1)
            errors.quantity = "Quantity must be at least 1";

        const selectedProduct = products.find((p) => p.id === formData.product_id);
        if (selectedProduct && Number(formData.quantity) > selectedProduct.stock_quantity) {
            errors.quantity = `Only ${selectedProduct.stock_quantity} units in stock`;
        }
        return errors;
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setIsSubmitting(true);
            await createOrder({
                customer_id: formData.customer_id,
                items: [
                    {
                        product_id: formData.product_id,
                        quantity: Number(formData.quantity),
                    },
                ],
            });

            toast.success("Order created successfully");
            setFormData({ customer_id: "", product_id: "", quantity: 1 });
            setShowForm(false);
            await fetchData();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to create order");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCustomerName = (customerId) => {
        return customers.find((c) => c.id === customerId)?.full_name || "Unknown";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Orders</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                    </p>
                </div>
                <button
                    onClick={() => setShowForm((v) => !v)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors cursor-pointer shadow-sm shadow-primary-600/30"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Order</span>
                    <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${showForm ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 animate-slide-up">
                    <h2 className="text-base font-semibold text-slate-800 mb-5">Create New Order</h2>
                    <form onSubmit={handleCreateOrder} noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Customer */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Customer <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    name="customer_id"
                                    value={formData.customer_id}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                        formErrors.customer_id
                                            ? "border-rose-400 focus:ring-rose-500/20"
                                            : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500"
                                    }`}
                                >
                                    <option value="">Select customer...</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.full_name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.customer_id && (
                                    <p className="text-xs text-rose-500 mt-1">{formErrors.customer_id}</p>
                                )}
                            </div>

                            {/* Product */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Product <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    name="product_id"
                                    value={formData.product_id}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                        formErrors.product_id
                                            ? "border-rose-400 focus:ring-rose-500/20"
                                            : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500"
                                    }`}
                                >
                                    <option value="">Select product...</option>
                                    {products.map((p) => (
                                        <option
                                            key={p.id}
                                            value={p.id}
                                            disabled={p.stock_quantity === 0}
                                        >
                                            {p.name} — Stock: {p.stock_quantity}
                                            {p.stock_quantity === 0 ? " (Out of stock)" : ""}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.product_id && (
                                    <p className="text-xs text-rose-500 mt-1">{formErrors.product_id}</p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Quantity <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    min="1"
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                                        formErrors.quantity
                                            ? "border-rose-400 focus:ring-rose-500/20"
                                            : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500"
                                    }`}
                                    placeholder="1"
                                />
                                {formErrors.quantity && (
                                    <p className="text-xs text-rose-500 mt-1">{formErrors.quantity}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors cursor-pointer"
                            >
                                {isSubmitting ? "Creating..." : "Create Order"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Order History</h2>
                </div>

                {loading ? (
                    <div className="p-8 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <EmptyState
                        icon={ShoppingCart}
                        title="No orders yet"
                        description="Create your first order by clicking the New Order button above."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                                #{order.id?.slice(0, 8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                                            {getCustomerName(order.customer_id)}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                            ₹{Number(order.total_amount).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View
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

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </DashboardLayout>
    );
}