import NavBar from "../../components/public/navbar";
import BannerSlider from "../../components/public/BannerSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomeNew() {
  return (
    <div className="h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100 text-gray-800">
      <NavBar />
      <BannerSlider />

      {/* Tagline Section */}
      <section className="text-center px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700">
          Welcome to <span className="text-yellow-500">RollFx</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Crypto Meets Community Growth — Earn securely in USDT while expanding your trusted network with RollFx.
        </p>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <Feature
            title="Secure Crypto Payments"
            desc="Seamless USDT transactions built on blockchain security."
            icon="🔐"
          />
          <Feature
            title="Transparent Network"
            desc="Track referrals and earnings in a user-friendly dashboard."
            icon="📈"
          />
          <Feature
            title="Instant Rewards"
            desc="Automated payout system with real-time updates."
            icon="⚡"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} RollFx. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-blue-700 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
