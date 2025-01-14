export const RegisterButton: React.FC = () => (
  <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-zinc-800/50">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">Starts from</p>
        <p className="text-2xl font-bold">₹200</p>
      </div>
      <a href="/form">
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
          Register Now
        </button>
      </a>
    </div>
  </div>
);
