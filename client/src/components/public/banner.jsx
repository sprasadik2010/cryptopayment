{/* Banner Section */}
export default function Banner(){
    return(              
      <div className="h-screen flex items-center justify-center text-center bg-blue-500 text-white">
      <div>
        <h2 className="text-4xl font-bold">Welcome to MyWebsite</h2>
        <p className="mt-2 text-lg">Your tagline or description goes here.</p>
        <button className="mt-6 bg-white text-blue-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">
          Get Started
        </button>
      </div>
    </div>
    );
}