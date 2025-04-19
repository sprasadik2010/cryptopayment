import BinaryPayouts from "../../components/user/binarypayouts";
import ReferralPayouts from "../../components/user/referralpayout";
import UserNavBar from "../../components/user/usernavbar";

export default function PayOuts(){
    return(
        <>
        <UserNavBar/>
        <BinaryPayouts/>
        <ReferralPayouts/>
        </>
    );
}