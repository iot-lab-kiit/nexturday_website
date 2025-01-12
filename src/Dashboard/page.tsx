import { Navbar } from '../components/global/Navbar'
import Carousel from './Carousel';
import Hero from './hero';
import List from './list';  

const images = [
  "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2399097/pexels-photo-2399097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
    < Navbar />
    <div className="min-h-screen mt-8 bg-gradient-to-b from-gray-900 to-black text-white pb-12">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <Carousel images={images} />
        </div>
        <Hero />
        <List />
      </div>
    </div>
    </div>
  );
};

export default Dashboard;