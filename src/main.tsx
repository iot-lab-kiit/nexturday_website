import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Navbar } from './components/global/Navbar.tsx'
import { Toaster } from "react-hot-toast";
import Footer from './components/global/Footer.tsx'

createRoot(document.getElementById('root')!).render(
  <>
      <Navbar />
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 5000,
        }}
      />
      <div className='min-h-screen flex flex-col mt-16'>
        <div className='flex-grow'>
          <App />
        </div>
        <Footer />
      </div>
  </>
)
