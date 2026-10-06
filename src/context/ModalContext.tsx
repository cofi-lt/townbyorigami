import { createContext, useContext, useState, ReactNode } from "react";

export type ModalType = "consultation" | "request_call" | "language" | "preferences" | null;

interface ModalContextType {
  activeModal: ModalType;
  modalPayload: any;
  openModal: (modal: ModalType, payload?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  const openModal = (modal: ModalType, payload?: any) => {
    setActiveModal(modal);
    setModalPayload(payload || null);
    document.body.style.overflow = modal ? "hidden" : "";
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
    document.body.style.overflow = "";
  };

  return (
    <ModalContext.Provider value={{ activeModal, modalPayload, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
