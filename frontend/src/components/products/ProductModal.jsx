import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ProductModal({
    onClose,
    onSubmit,
    initialData = null,
    title = "Add Product",
    isSubmitting = false,
}) {
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        price: "",
        stock_quantity: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                sku: initialData.sku,
                price: initialData.price,
                stock_quantity: initialData.stock_quantity,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.sku.trim()) newErrors.sku = "SKU is required";
        if (!formData.price || Number(formData.price) <= 0)
            newErrors.price = "Price must be greater than 0";
        if (formData.stock_quantity === "" || Number(formData.stock_quantity) < 0)
            newErrors.stock_quantity = "Stock quantity must be 0 or more";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit({
            ...formData,
            price: Number(formData.price),
            stock_quantity: Number(formData.stock_quantity),
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-modal rounded-2xl w-full max-w-md shadow-2xl shadow-slate-900/20 animate-slide-up">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Product Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="e.g. Wireless Keyboard"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                errors.name
                                    ? "border-rose-400 focus:ring-rose-500/20"
                                    : "border-slate-300 focus:ring-primary-500/20 focus:border-primary-500"
                            }`}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            SKU <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            placeholder="e.g. KB-001"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                errors.sku
                                    ? "border-rose-400 focus:ring-rose-500/20"
                                    : "border-slate-300 focus:ring-primary-500/20 focus:border-primary-500"
                            }`}
                            onChange={handleChange}
                        />
                        {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Price (₹) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.price
                                        ? "border-rose-400 focus:ring-rose-500/20"
                                        : "border-slate-300 focus:ring-primary-500/20 focus:border-primary-500"
                                }`}
                                onChange={handleChange}
                            />
                            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Stock Qty <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                placeholder="0"
                                min="0"
                                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.stock_quantity
                                        ? "border-rose-400 focus:ring-rose-500/20"
                                        : "border-slate-300 focus:ring-primary-500/20 focus:border-primary-500"
                                }`}
                                onChange={handleChange}
                            />
                            {errors.stock_quantity && (
                                <p className="text-xs text-rose-500 mt-1">{errors.stock_quantity}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}