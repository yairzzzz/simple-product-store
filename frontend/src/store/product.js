import { create } from "zustand";
export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    set((prevState) => ({ products: [...prevState.products, data.data] }));
    return { success: true, message: "Product create successfully." };
  },
  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },
  deleteProduct: async (id) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      products: state.products.filter((product) => product._id !== id),
    }));

    return { success: true, message: data.message };
  },
  updateProduct: async (updatedProduct) => {
    if (
      !updatedProduct.name ||
      !updatedProduct.image ||
      !updatedProduct.price
    ) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch(`api/products/${updatedProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    set((prevState) => ({
      products: prevState.products.map((product) => {
        return product._id === updatedProduct._id
          ? { ...product, ...updatedProduct }
          : product;
      }),
    }));
    return data;
  },
}));
