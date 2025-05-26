import { useState } from "react";
import UserNavBar from "../../components/user/common/usernavbar";
import MyWithdrawals from "../../components/user/withdrawals/withdrawals";
import SubmitWithdrawal from "../../components/user/withdrawals/submitwithdrawal";
import ActivationWarning from "../../components/user/common/activationwarning";
import PageTitle from "../../components/user/common/pagetitle";

export default function Withdrawals() {
    
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    const [TotalWithdrawals, setTotalWithdrawals] = useState(0);

    const handleTotalWithdrawalsChange = (newValue) => {
        setTotalWithdrawals(newValue); // update parent's state
    };
    return(
        <>
        <header className="sticky top-0 left-0 w-full bg-white shadow z-50 p-4">
            <UserNavBar/>
        </header>
        <PageTitle title="Withdrawals"/>
            {
            !currentUser.is_active
            ? <ActivationWarning/>
            : <>
                <main>
                    <SubmitWithdrawal/>
                    <MyWithdrawals onTotalWithdrawalsChange={handleTotalWithdrawalsChange}/>
                </main>
                <footer className="grid grid-cols-1 gap-4 sticky bottom-0 left-0 w-full bg-blue-400 shadow-inner z-40 p-4">
                    <div className="text-center">Total Withdrawals: <br/> ${TotalWithdrawals.toFixed(3)}</div>
                </footer>
              </>
            }
        </>
    );
}