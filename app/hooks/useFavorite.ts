import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '@/app/types';
import useLoginModal from './useLoginModal';



interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

// { useFavorite บันทึกรายโปรด (listid,currentUser)}
const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
    // {Router,Modal}
    const router = useRouter();
    const LoginModal = useLoginModal();

    // {Memo}
    // {listingId อยู่ใน list ไหม ถ้าอยู่จะ true / ไม่อยู่ false }
    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || [];

        return list.includes(listingId)
    }, [currentUser, listingId])

    // {toggle} e: React.MouseEvent<HTMLDivElement> คือ รับ e ทีเกิดการคลิปบน HTML
    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!currentUser) {
            return LoginModal.onOpen();
        }

        // {if hasFavorited  }
        try {
            let request;

            // {hasfovirited.memo => true.delete / false.post}
            if (hasFavorited) {
                request = () => axios.delete(`/api/favorites/${listingId}`);
            } else {
                request = () => axios.post(`/api/favorites/${listingId}`);
            }

            await request();
            router.refresh();
            toast.success('Success');
        } catch (error) {
            toast.error('Something went wrong.');
        }

    }, [currentUser, hasFavorited, listingId, router, LoginModal]);

    return {
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorite;