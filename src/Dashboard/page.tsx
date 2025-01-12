import Carousel from "../components/ui/Carousel";

const images = [
  "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2399097/pexels-photo-2399097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const Dashboard = () => {
  return <Carousel images={images} />;
};

export default Dashboard;
