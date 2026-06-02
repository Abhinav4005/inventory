import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Package, Pencil, Trash2 } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProductModal from "../components/products/ProductModal";
import ConfirmModal from "../components/common/ConfirmModal";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";

import {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} from "../api/productApi";

function getStockBadge(qty) {
    if (qty === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (qty <= 10) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
}

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (payload) => {
        try {
            setIsSubmitting(true);
            await createProduct(payload);
            toast.success("Product created successfully");
            setIsModalOpen(false);
            await fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            setIsDeleting(true);
            await deleteProduct(deleteProductId);
            setProducts((prev) => prev.filter((p) => p.id !== deleteProductId));
            toast.success("Product deleted successfully");
            setDeleteProductId(null);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateProduct = async (payload) => {
        try {
            setIsSubmitting(true);
            const updated = await updateProduct(editingProduct.id, payload);
            setProducts((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
            );
            toast.success("Product updated successfully");
            setEditingProduct(null);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Products</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {products.length} product{products.length !== 1 ? "s" : ""} in inventory
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors cursor-pointer shadow-sm shadow-primary-600/30"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Product</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No products yet"
                        description="Add your first product to get started with inventory management."
                        action={
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add Product
                            </button>
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        SKU
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                                    <Package className="w-4 h-4 text-primary-500" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-800">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                                {product.sku}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                                            ₹{Number(product.price).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                                            {product.stock_quantity}
                                        </td>
                                        <td className="px-5 py-4">
                                            {getStockBadge(product.stock_quantity)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setEditingProduct(product)}
                                                    className="p-2 rounded-lg text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteProductId(product.id)}
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
                <ProductModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateProduct}
                    isSubmitting={isSubmitting}
                />
            )}
            {editingProduct && (
                <ProductModal
                    title="Edit Product"
                    initialData={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSubmit={handleUpdateProduct}
                    isSubmitting={isSubmitting}
                />
            )}
            {deleteProductId && (
                <ConfirmModal
                    title="Delete Product"
                    message="Are you sure you want to delete this product? This action cannot be undone."
                    onClose={() => setDeleteProductId(null)}
                    onConfirm={handleDeleteProduct}
                    isLoading={isDeleting}
                />
            )}
        </DashboardLayout>
    );
}
