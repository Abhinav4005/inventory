import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onClose,
    onConfirm,
    isLoading = false,
}) {
    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-modal rounded-2xl w-full max-w-sm shadow-2xl shadow-slate-900/20 animate-slide-up">
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                        </div>
                        <h2 className="text-base font-bold text-slate-800">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors ml-2"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="px-6 pb-6 text-sm text-slate-500 leading-relaxed">{message}</p>

                <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-60"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-60"
                    >
                        {isLoading ? "Deleting..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}