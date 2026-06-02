export default function DeleteProductModal({
  onClose,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">

        <h2 className="text-xl font-semibold mb-3">
          Delete Product
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this product?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}