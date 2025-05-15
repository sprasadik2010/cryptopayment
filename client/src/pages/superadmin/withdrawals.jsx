import SuperAdminMenu from "../../components/superadmin/common/superadminmenu";
import SuperAdminNavBar from "../../components/superadmin/common/superadminnavbar";
import ManageWithdrawals from "../../components/superadmin/managewithdrawals/managewithdrawals";

export default function AllWithdrawals(){
    return(
        <>
            <SuperAdminNavBar/>
            <ManageWithdrawals/>
        </>
    );
}