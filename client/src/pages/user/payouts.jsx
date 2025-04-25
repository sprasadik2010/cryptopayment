import HundredClubShare from "../../components/user/100clubshare";
import TwentyFiveClubShare from "../../components/user/25clubshare";
import BinaryPayouts from "../../components/user/binarypayouts";
import FifthLevelClubShare from "../../components/user/fifthlevelclubshare";
import FirstLevelClubShare from "../../components/user/firstlevelclubshare";
import FourthLevelClubShare from "../../components/user/fourthlevelclubshare";
import PayOutFooter from "../../components/user/payoutfooter";
import ProfitClubShare from "../../components/user/profitclubshare";
import ReferralPayouts from "../../components/user/referralpayout";
import SecondLevelClubShare from "../../components/user/secondlevelclubshare";
import ThirdLevelClubShare from "../../components/user/thirdlevelclubshare";
import UserNavBar from "../../components/user/usernavbar";

export default function PayOuts(){
    return(
        <>
        <header className="fixed top-0 left-0 w-full bg-white shadow z-50 p-4">
          <UserNavBar/>
        </header>
        <main className="pt-20">
          <BinaryPayouts/>
          <ReferralPayouts/>        
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            <div className="bg-gray-200 p-4 rounded"><ProfitClubShare /></div>
            <div className="bg-gray-200 p-4 rounded"><FirstLevelClubShare /></div>
            <div className="bg-gray-200 p-4 rounded"><SecondLevelClubShare/></div>
            <div className="bg-gray-200 p-4 rounded"><ThirdLevelClubShare/></div>
            <div className="bg-gray-200 p-4 rounded"><FourthLevelClubShare/></div>
            <div className="bg-gray-200 p-4 rounded"><FifthLevelClubShare/></div>
            <div className="bg-gray-200 p-4 rounded"><TwentyFiveClubShare/></div>
            <div className="bg-gray-200 p-4 rounded"><HundredClubShare/></div>
          </div>
        </main>
        <footer className="fixed bottom-0 left-0 w-full bg-gray-100 shadow-inner z-40 p-4 bg-blue-600">
          <PayOutFooter />
        </footer>

        </>
    );
}