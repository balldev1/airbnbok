import './globals.css'
import { Nunito } from 'next/font/google'

// {Components}
import ClientOnly from './components/ClientOnly'
import RegisterModal from './components/Modals/RegisterModal'
import Navbar from './components/navbar/Navbar'
import ToasterProvider from './providers/ToasterProvider'
import LoginModal from './components/Modals/LoginModal'
import getCurrentUser from './actions/getCurrentUser'
import RentModal from './components/Modals/RentModal'
import Search from './components/navbar/Search'
import SearchModal from './components/Modals/SearchModal'



const font = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'Airbnb',
  description: 'AirbnbNext',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurrentUser();


  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <LoginModal />
          <RegisterModal />
          <RentModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
      </body>
    </html>
  )
}
