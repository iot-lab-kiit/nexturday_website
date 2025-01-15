import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Navbar } from './components/global/Navbar.tsx';
import { Toaster } from 'react-hot-toast';
import Footer from './components/global/Footer.tsx';
import { useEventStore } from './zustand/useEventStore.tsx';

const RootComponent = () => {
  const hideFooter = useEventStore((state) => state.hideFooter);

  return (
    <>
      <Navbar />
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 5000,
        }}
      />
      <div className="flex flex-col mt-16">
        <div className="flex-grow">
          <App />
        </div>
        {!hideFooter && <Footer />}
      </div>
    </>
  );
};

createRoot(document.getElementById('root')!).render(<RootComponent />);
