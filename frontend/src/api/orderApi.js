import api from "./axios";

export const getOrders = async () => {
    const response = await api.get("/orders");
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

export const createOrder = async (payload) => {
    const response = await api.post(
        "/orders",
        payload
    );

    return response.data;
};