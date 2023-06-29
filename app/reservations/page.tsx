import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";

import ReservationsClient from "./ReservationsClient";
import getReservations from "../actions/getReservations";

const ReservationsPage = async () => {
    const currentUser = await getCurrentUser();

    // { !currentUser }
    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title='Unauthorized'
                    subtitle='Please login'
                />
            </ClientOnly>
        );
    }

    // {กำหนด authorId ให้เป็น currentUser.id => getReservations }
    const reservations = await getReservations({
        authorId: currentUser.id
    });

    // {length === 0}
    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No reservations found"
                    subtitle="Looks like you have no reservations on your properties."
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ReservationsClient
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )

};

export default ReservationsPage