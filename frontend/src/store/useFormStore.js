import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";


const useFormStore = create((set) => ({
  form:null,
  forms: [],
  loading: false,
  error: null,

  fetchForms: async ({id}) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/forms/preview/${id}`);
      set({ form: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch forms", loading: false });
    }
  },

  createForm: async (formData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post("/forms/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        forms: [...state.forms, data],
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create form",
        loading: false,
      });
      throw err;
    }
  },

  getTestForm: async (id) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/forms/test/${id}`);
      set({ forms: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch forms", loading: false });
    }
  },  

  deleteForm: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`/forms/delete/${id}`);
      toast.success("Form deleted successfully!");

    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete form", loading: false });
      toast.error(err.response?.data?.message || "Failed to delete form")
    }
  },

}));

export default useFormStore;
