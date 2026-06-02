import api from "./axios";

export const getCustomers = async () => {
  const response = await api.get("/customers");
  return response.data;
};

export const createCustomer = async (payload) => {
  const response = await api.post(
    "/customers",
    payload
  );

  return response.data;
};

export const updateCustomer = async (
  id,
  payload
) => {
  const response = await api.put(
    `/customers/${id}`,
    payload
  );

  return response.data;
};

export const deleteCustomer = async (
  id
) => {
  await api.delete(`/customers/${id}`);
};