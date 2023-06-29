import { create } from 'zustand';

interface useLoginModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

// {จัดการสถานะเปิดปิด modal}
const useLoginModal = create<useLoginModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));

export default useLoginModal;
