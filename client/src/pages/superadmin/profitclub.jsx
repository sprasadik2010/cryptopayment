import SuperAdminMenu from "../../components/superadmin/common/superadminmenu";
import SuperAdminNavBar from "../../components/superadmin/common/superadminnavbar";
import CreateProfitClub from "../../components/superadmin/manageprofitclub/createprofitclub";

export default function ProfitClub(){
    return(
        <>
            <SuperAdminNavBar/>
            <CreateProfitClub/>
        </>
    );
}