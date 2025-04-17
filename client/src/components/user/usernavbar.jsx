
{/* Navbar */}
import SocialMediaLinks from "../public/socialmedialinks";
import UserMenu from "./usermenu";
import LogoutButton from "./logoutbtton";
import UserMobileMenu from "./usermobilemenu";
export default function UserNavBar(){
    return(
      <nav className="bg-white shadow-md top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">MyWebsite</h1>
        <UserMenu/>
        <SocialMediaLinks/>
        <LogoutButton/>
        <UserMobileMenu/>
      </div>
    </nav>
    )
}