import { X, Package, User, Calendar, Hash } from "lucide-react";

export default function OrderDetailModal({ order, onClose }) {
    if (!order) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-modal rounded-2xl w-full max-w-lg shadow-2xl shadow-slate-900/20 animate-slide-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Order Details</h2>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">#{order.id?.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Meta Info */}
                <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400">Customer</p>
                            <p className="font-medium text-slate-700">
                                {order.customer?.full_name || order.customer_name || "—"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400">Date</p>
                            <p className="font-medium text-slate-700">{formatDate(order.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Order Items
                    </h3>
                    <div className="space-y-2">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                                <div
                                    key={item.id || idx}
                                    className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <Package className="w-4 h-4 text-primary-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">
                                            {item.product?.name || item.product_name || `Product #${item.product_id?.slice(0, 6)}`}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800 flex-shrink-0">
                                        ₹{(item.quantity * Number(item.unit_price)).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-4">No items found</p>
                        )}
                    </div>
                </div>

                {/* Total Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Total Amount</span>
                    <span className="text-xl font-bold text-slate-800">
                        ₹{Number(order.total_amount).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
