import BinaryPayouts from "../../components/user/binarypayouts";
import ProfitClubPayouts from "../../components/user/profitclubpayouts";
import ReferralPayouts from "../../components/user/referralpayout";
import UserNavBar from "../../components/user/usernavbar";

export default function PayOuts(){
    return(
        <>
        <UserNavBar/>
        <BinaryPayouts/>
        <ReferralPayouts/>
        <ProfitClubPayouts/>
{/* 
        <LevelPayoutTable
  levelName="First Level"
  percentage={0.10}
  users={firstLevelUsers}
  totalAmount={profitAmount}
/>
<LevelPayoutTable
  levelName="Second Level"
  percentage={0.05}
  users={secondLevelUsers}
  totalAmount={profitAmount}
/>
<LevelPayoutTable
  levelName="Third Level"
  percentage={0.03}
  users={thirdLevelUsers}
  totalAmount={profitAmount}
/>
<LevelPayoutTable
  levelName="Fourth Level"
  percentage={0.02}
  users={fourthLevelUsers}
  totalAmount={profitAmount}
/>
<LevelPayoutTable
  levelName="Fifth Level"
  percentage={0.01}
  users={fifthLevelUsers}
  totalAmount={profitAmount}
/> */}
        </>
    );
}