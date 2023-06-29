import { create } from 'zustand';

interface useRentModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

// {จัดการสถานะเปิดปิด modal}
const useRentModal = create<useRentModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));

export default useRentModal;
