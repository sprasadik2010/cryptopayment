import { useState, useEffect } from "react";
import useTwentyFiveClubShare from "./use25ClubTotal";
import useHundredClubShare from "./use100ClubTotal";
import useBinaryTotal from "./useBinaryTotal";
import useFifthLevelClubTotal from "./useFifthLevelClubTotal";
import useFirstLevelClubTotal from "./useFirstlevelClubTotal";
import useFourthLevelClubTotal from "./useFourthLevelClubTotal";
import useProfitClubTotal from "./useProfitClubTotal";
import useReferralTotal from "./useReferralTotal";
import useSecondLevelClubTotal from "./useSecondLevelClubTotal";
import useThirdLevelClubTotal from "./useThirdLevelClubTotal";

// Consolidated hook to fetch and calculate total payout
export default function useTotalPayout() {
  const [totalPayout, setTotalPayout] = useState(0);

  // Fetch payouts from all individual hooks
  const profitClubPayout = useProfitClubTotal();
  const twentyFiveClubPayout = useTwentyFiveClubShare();
  const hundredClubPayout = useHundredClubShare();
  const binaryTotalPayout = useBinaryTotal();
  const fifthLevelClubPayout = useFifthLevelClubTotal();
  const firstLevelClubPayout = useFirstLevelClubTotal();
  const fourthLevelClubPayout = useFourthLevelClubTotal();
  const referralTotalPayout = useReferralTotal();
  const secondLevelClubPayout = useSecondLevelClubTotal();
  const thirdLevelClubPayout = useThirdLevelClubTotal();

  useEffect(() => {
    // Sum up the payouts from all clubs
    const total = 
      profitClubPayout +
      twentyFiveClubPayout +
      hundredClubPayout +
      binaryTotalPayout +
      fifthLevelClubPayout +
      firstLevelClubPayout +
      fourthLevelClubPayout +
      referralTotalPayout +
      secondLevelClubPayout +
      thirdLevelClubPayout;

    setTotalPayout(total.toFixed(3)); // Update state with the total payout
  }, [
    profitClubPayout,
    twentyFiveClubPayout,
    hundredClubPayout,
    binaryTotalPayout,
    fifthLevelClubPayout,
    firstLevelClubPayout,
    fourthLevelClubPayout,
    referralTotalPayout,
    secondLevelClubPayout,
    thirdLevelClubPayout,
  ]);

  return totalPayout;
}
