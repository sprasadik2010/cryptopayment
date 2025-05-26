import { useState } from "react";
import HundredClubShare from "../../components/user/payouts/100clubshare";
import TwentyFiveClubShare from "../../components/user/payouts/25clubshare";
import BinaryPayouts from "../../components/user/payouts/binarypayouts";
import FifthLevelClubShare from "../../components/user/payouts/fifthlevelclubshare";
import FirstLevelClubShare from "../../components/user/payouts/firstlevelclubshare";
import FourthLevelClubShare from "../../components/user/payouts/fourthlevelclubshare";
import PayOutFooter from "../../components/user/payouts/payoutfooter";
import ProfitClubShare from "../../components/user/payouts/profitclubshare";
import ReferralPayouts from "../../components/user/payouts/referralpayout";
import SecondLevelClubShare from "../../components/user/payouts/secondlevelclubshare";
import ThirdLevelClubShare from "../../components/user/payouts/thirdlevelclubshare";
import UserNavBar from "../../components/user/common/usernavbar";

import useTotalPayout from "../../customhooks/useTotalPayout"
import useWithdrawals from "../../customhooks/useWithdrawals";
import PageTitle from "../../components/user/common/pagetitle";
import ActivationWarning from "../../components/user/common/activationwarning";

export default function PayOuts(){
  
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const [payoutSum, setPayoutSum] = useState({
    binary: 0,
    referral: 0,
    profitclub: 0,
    firstlevelclub: 0,
    secondlevelclub: 0,
    thirdlevelclub: 0,
    fourthlevelclub: 0,
    fifthlevelclub: 0,
    twentyfiveclub: 0,
    hundredclub: 0
  });
  const onUpdate = (amount, source) => {
    setPayoutSum(prev => ({
      ...prev,
      [source]: amount
    }));
  };
  console.log(payoutSum);
  const totalPayout = useTotalPayout();//Object.values(payoutSum).reduce((acc, val) => acc + val, 0);
  const { withdrawals, totalWithdrawals } = useWithdrawals(currentUser?.id);
    return(
        <>
          <header className="sticky top-0 left-0 w-full bg-white shadow z-50 p-4">
            <UserNavBar/>
          </header>
          <PageTitle title="Payouts"/>
          {
            !currentUser.is_active
            ? <ActivationWarning/>
            : <>
                <main>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-0 sm:p-4">
                    <div className="bg-gray-200 p-0 sm:p-4 rounded"><BinaryPayouts onUpdate={(val) => onUpdate(val, "binary")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><ReferralPayouts onUpdate={(val) => onUpdate(val, "referral")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><ProfitClubShare onUpdate={(val) => onUpdate(val, "profitclub")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><FirstLevelClubShare onUpdate={(val) => onUpdate(val, "firstlevelclub")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><SecondLevelClubShare onUpdate={(val) => onUpdate(val, "secondlevelclub")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><ThirdLevelClubShare onUpdate={(val) => onUpdate(val, "thirdlevelclub")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><FourthLevelClubShare onUpdate={(val) => onUpdate(val, "fourthlevelclub")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><FifthLevelClubShare onUpdate={(val) => onUpdate(val, "fifthlevelclub")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><TwentyFiveClubShare onUpdate={(val) => onUpdate(val, "twentyfiveclub")} /></div>
                    <div className="bg-gray-200 p-4 rounded"><HundredClubShare onUpdate={(val) => onUpdate(val, "hundredclub")} /></div>
                  </div>
                </main>
                <footer className="grid grid-cols-3 gap-4 sticky bottom-0 left-0 w-full bg-blue-400 shadow-inner z-40 p-4">
                  <div className="text-center">Total: <br/> ${parseFloat(totalPayout).toFixed(3)}</div>
                  <div className="text-center">Withdrawal: <br/> ${parseFloat(totalWithdrawals).toFixed(3)}</div>
                  <div className="text-center">Reamaing: <br/> ${parseFloat(totalPayout - totalWithdrawals).toFixed(3)}</div>
                </footer>
              </>
            }
        </>
    );
}