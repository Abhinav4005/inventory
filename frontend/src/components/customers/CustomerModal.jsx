import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function CustomerModal({
    onClose,
    onSubmit,
    initialData = null,
    title = "Add Customer",
    isSubmitting = false,
}) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                full_name: initialData.full_name,
                email: initialData.email,
                phone_number: initialData.phone_number,
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
        if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!formData.phone_number.trim()) newErrors.phone_number = "Phone number is required";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit(formData);
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
                            Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            placeholder="e.g. Rahul Sharma"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                errors.full_name
                                    ? "border-rose-400 focus:ring-rose-500/20"
                                    : "border-slate-300 focus:ring-primary-500/20 focus:border-primary-500"
                            }`}
                            onChange={handleChange}
                        />
                        {errors.full_name && <p className="text-xs text-rose-500 mt-1">{errors.full_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="rahul@example.com"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                errors.email
                                    ? "border-rose-400 focus:ring-rose-500/20"
                                    : "border-slate-300 focus:ring-primary-500/20 focus:border-primary-500"
                            }`}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            placeholder="+91 98765 43210"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
                                errors.phone_number
                                    ? "border-rose-400 focus:ring-rose-500/20"
                                    : "border-slate-300 focus:ring-primary-500/20 focus:border-primary-500"
                            }`}
                            onChange={handleChange}
                        />
                        {errors.phone_number && (
                            <p className="text-xs text-rose-500 mt-1">{errors.phone_number}</p>
                        )}
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
                            {isSubmitting ? "Saving..." : initialData ? "Update Customer" : "Add Customer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}