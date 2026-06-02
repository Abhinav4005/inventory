import { useEffect, useState } from "react";
import {
    Package,
    Users,
    ShoppingCart,
    AlertTriangle,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";
import api from "../api/axios";

import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardSkeleton from "../components/common/DashboardSkeleton";

const statCards = [
    {
        key: "total_products",
        label: "Total Products",
        icon: Package,
        color: "from-violet-500 to-indigo-600",
        bg: "bg-violet-50",
        iconColor: "text-violet-600",
    },
    {
        key: "total_customers",
        label: "Total Customers",
        icon: Users,
        color: "from-emerald-500 to-teal-600",
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        key: "total_orders",
        label: "Total Orders",
        icon: ShoppingCart,
        color: "from-blue-500 to-cyan-600",
        bg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        key: "low_stock_products",
        label: "Low Stock Items",
        icon: AlertTriangle,
        color: "from-amber-500 to-orange-500",
        bg: "bg-amber-50",
        iconColor: "text-amber-600",
        isDanger: true,
    },
];

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get("/dashboard");
            setStats(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <DashboardSkeleton />
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-7 h-7 text-rose-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-1">Something went wrong</h2>
                    <p className="text-sm text-slate-400 mb-5">{error}</p>
                    <button
                        onClick={fetchDashboard}
                        className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Inventory Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Welcome back — here's what's happening with your inventory.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map(({ key, label, icon: Icon, bg, iconColor, isDanger }) => {
                    const value = stats?.[key] ?? 0;
                    return (
                        <div
                            key={key}
                            className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ${
                                isDanger && value > 0 ? "border-amber-200" : "border-slate-100"
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-300" />
                            </div>
                            <p
                                className={`text-3xl font-bold mb-1 ${
                                    isDanger && value > 0 ? "text-amber-600" : "text-slate-800"
                                }`}
                            >
                                {value}
                            </p>
                            <p className="text-sm text-slate-500 font-medium">{label}</p>
                        </div>
                    );
                })}
            </div>

            {stats?.low_stock_products > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <h2 className="text-sm font-semibold text-amber-800">
                            Low Stock Alert
                        </h2>
                    </div>
                    <p className="text-sm text-amber-700">
                        <span className="font-bold">{stats.low_stock_products}</span> product
                        {stats.low_stock_products !== 1 ? "s are" : " is"} running low on stock. Review your inventory and restock soon.
                    </p>
                </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Data refreshed on load — click the browser refresh to update.</span>
            </div>
        </DashboardLayout>
    );
}