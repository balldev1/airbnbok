import getCurrentUser from './actions/getCurrentUser';
import getListings, { IListingsParams } from './actions/getListings';

// {components}
import ClientOnly from './components/ClientOnly'
import Container from './components/Container'
import EmptyState from './components/EmptyState';
import ListingCard from './components/listings/ListingCard';

interface HomeProps {
  searchParams: IListingsParams
}

// {สรุปคือฟังก์ชัน Home จะดึงข้อมูลรายการจากฐานข้อมูล Prisma 
// โดยใช้ getListings แล้วเก็บผลลัพธ์ในตัวแปร listings 
// เพื่อให้สามารถใช้ข้อมูลนั้นในการแสดงผลหรือดำเนินการต่อไปได้}
const Home = async ({ searchParams }: HomeProps) => {

  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  // {if listings ไม่มีแสดง empty}
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    )
  }


  return (
    <ClientOnly>
      <Container>
        <div
          className='pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {listings.map((listing: any) => (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  )
}

export default Home;

