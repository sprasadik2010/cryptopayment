import { useEffect, useState } from "react";
import SuperAdminMenu from "../../components/superadmin/common/superadminmenu";
import SuperAdminNavBar from "../../components/superadmin/common/superadminnavbar";
import CreateProfitClub from "../../components/superadmin/manageprofitclub/createprofitclub";
import ProfitClubShareList from "../../components/superadmin/manageprofitclub/profitclubsharelist";

export default function ProfitClub() {
  const [AllProfitClubShares, setAllProfitClubShares] = useState([]);

  const fetchProfitClubShares = async () => {
    try {
      const result = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getallprofitclubs`);
      const profitclubshares = await result.json();
      setAllProfitClubShares(profitclubshares);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchProfitClubShares();
  }, []);

  return (
    <>
      <SuperAdminNavBar />
      {/* <div className="flex"> */}
        {/* <SuperAdminMenu /> */}
        <div className="flex-1 p-4">
          <CreateProfitClub refreshList={fetchProfitClubShares} />
          <ProfitClubShareList AllProfitClubShares={AllProfitClubShares} />
        </div>
      {/* </div> */}
    </>
  );
}
