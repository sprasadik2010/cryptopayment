import React from "react";
import NavBar from "../../components/public/navbar";
import Banner from "../../components/public/banner";

const Homepage = () => {
  return (
    <>
            <NavBar/>
            {/* <Banner/> */}
    <div className="bg-gray-900 text-white pt-2 font-sans">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-indigo-800 to-purple-700">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Earn Crypto with Our Smart MLM Network
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Join our decentralized community and earn USDT/BTC instantly via referrals and level-based rewards.
        </p>
        <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition">
          Join Now & Start Earning
        </button>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-800">
        <h2 className="text-3xl text-center font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { title: "Register & Verify", desc: "Create your wallet-based account with email verification." },
            { title: "Refer & Build", desc: "Invite others using your referral link and build your tree." },
            { title: "Earn Crypto Instantly", desc: "Get instant USDT payouts for each level member." },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-yellow-400 transition">
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crypto Earnings Section */}
      <section className="py-16 px-6 bg-gray-900">
        <h2 className="text-3xl text-center font-bold mb-12">Crypto Earnings</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-gray-800 p-6 rounded-xl text-center w-60">
            <p className="text-2xl font-bold text-green-400">$5</p>
            <p className="mt-2 text-sm">Per Level 1 Member</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center w-60">
            <p className="text-2xl font-bold text-green-400">$3</p>
            <p className="mt-2 text-sm">Per Level 2 Member</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center w-60">
            <p className="text-2xl font-bold text-green-400">$1</p>
            <p className="mt-2 text-sm">Levels 3-5</p>
          </div>
        </div>
      </section>

      {/* Referral Tree Teaser */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-900 to-purple-800 text-center">
        <h2 className="text-3xl font-bold mb-6">Powerful 5-Level Referral Tree</h2>
        <p className="max-w-xl mx-auto mb-8">
          You earn crypto not just from your referrals, but also from their referrals up to 5 levels deep.
        </p>
        <button className="bg-white text-indigo-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
          View My Team Tree
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-6 mt-10">
        <p>© 2025 CryptoMLM Inc. All rights reserved.</p>
        <p className="text-sm">Powered by Blockchain & FastAPI</p>
      </footer>
    </div>     
    </>
  );
};

export default Homepage;
