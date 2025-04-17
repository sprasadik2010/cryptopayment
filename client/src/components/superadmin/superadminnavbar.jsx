
import SocialMediaLinks from "../public/socialmedialinks";
import MobileMenu from "../public/mobilemenu";
import LogoutButton from "../user/logoutbtton";
import SuperAdminMenu from "./superadminmenu";
export default function SuperAdminNavBar(){
    return(
      <nav className="bg-white shadow-md top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">MyWebsite</h1>
        <SuperAdminMenu/>
        <LogoutButton/>
        <MobileMenu/>
      </div>
    </nav>
    )
}