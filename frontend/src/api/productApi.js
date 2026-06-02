import api from "./axios";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await api.post("/products", payload);
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

export const updateProduct = async (
  id,
  payload
) => {
  const response = await api.put(
    `/products/${id}`,
    payload
  );

  return response.data;
};