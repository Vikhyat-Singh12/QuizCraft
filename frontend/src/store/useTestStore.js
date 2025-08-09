import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useTestStore = create((set, get) => ({
  submitting: false,

  submitTest: async (formId, answers, navigate) => {
    set({ submitting: true });
    try {
      await axios.post(
        "/test/submit",
        { formId, answers },
      );

      toast.success("Test submitted successfully!");
      navigate("/"); 
    } catch (err) {
      console.error("Error submitting test:", err);
      toast.error(err.response?.data?.error || "Failed to submit test");
    } finally {
      set({ submitting: false });
    }
  },
}));
