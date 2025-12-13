import Header from "@/components/Header";
import LessonsPath from "@/components/LessonsPath";

export const Home = () => {
  return <div className="min-h-screen overflow-x-hidden">
    <Header />
    <LessonsPath />
  </div>;
};

export default Home;