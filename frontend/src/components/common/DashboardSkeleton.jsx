export default function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <div className="h-8 w-56 bg-slate-200 rounded-xl shimmer" />
                <div className="h-4 w-80 bg-slate-100 rounded-lg shimmer" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 shimmer" />
                            <div className="w-4 h-4 bg-slate-100 rounded shimmer" />
                        </div>
                        <div className="h-8 w-16 bg-slate-200 rounded-lg shimmer mb-2" />
                        <div className="h-4 w-24 bg-slate-100 rounded shimmer" />
                    </div>
                ))}
            </div>

            <div className="h-16 bg-amber-50 border border-amber-100 rounded-2xl shimmer" />
        </div>
    );
}