import React from 'react'

// {action}
import getCurrentUser from '../actions/getCurrentUser'
import getFavoriteListings from '../actions/getFavoritesListings'

// {components}
import EmptyState from '../components/EmptyState'
import ClientOnly from '../components/ClientOnly'
import FavoritesClient from './FavoritesClient'

const ListingPage = async () => {

    // {listings / currentUser}
    const listings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    // {length === 0}
    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title='No favorites found'
                    subtitle='Looks like you have no favorites listings.'
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavoritesClient
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default ListingPage
