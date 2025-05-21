import Banner from "../../components/public/banner";
import NavBar from "../../components/public/navbar";

export default function Home() {

  return (
    <div className="h-screen bg-gray-100">
        <NavBar/>
        <Banner/>      
    </div>
  );
}
