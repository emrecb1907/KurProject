import { StateCreator } from 'zustand';

export interface UISlice {
  // State
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  modalVisible: boolean;
  modalContent: any;
  
  // Actions
  setIsLoading: (isLoading: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  showModal: (content: any) => void;
  hideModal: () => void;
  clearMessages: () => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  // Initial state
  isLoading: false,
  errorMessage: null,
  successMessage: null,
  modalVisible: false,
  modalContent: null,
  
  // Actions
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setErrorMessage: (message) => set({ errorMessage: message }),
  
  setSuccessMessage: (message) => set({ successMessage: message }),
  
  showModal: (content) => set({ modalVisible: true, modalContent: content }),
  
  hideModal: () => set({ modalVisible: false, modalContent: null }),
  
  clearMessages: () => set({ errorMessage: null, successMessage: null }),
});

