
{/* Navbar */}
import SocialMediaLinks from "../../public/socialmedialinks";
import UserMenu from "./usermenu";
import LogoutButton from "./logoutbtton";
import UserMobileMenu from "./usermobilemenu";
import logo from "../../../assets/logo.png";

export default function UserNavBar(){
    return(
      <nav className="bg-white shadow-md top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* <h1 className="text-xl font-bold text-blue-600"> */}
                  <span className="text-yellow-500">
                    <img
                      src={logo}
                      alt="Company Logo" // Always use meaningful alt text
                      className="h-12 w-auto" // Fixed height, auto width (or vice versa)
                    />
                  </span>
                  {/* </h1> */}
        <UserMenu/>
        <SocialMediaLinks/>
        <LogoutButton/>
        <UserMobileMenu/>
      </div>
    </nav>
    )
}