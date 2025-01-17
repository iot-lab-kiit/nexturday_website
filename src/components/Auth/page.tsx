import { signInWithGoogle, signOutUser } from "../../firebaseConfig";
import { useAuthStore } from "../../zustand/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Chrome } from 'lucide-react';
import image from '../../assets/Frame2.png';

const NexterLanding = () => {
  const navigate = useNavigate();
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const authData = useAuthStore((state) => state.authData);

  const handleSignIn = async () => {
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <div
      className=""
      style={{
        background: `
          radial-gradient(78.04% 121.39% at 91.04% 12.83%, rgba(40, 3, 53, 0.87) 0%, rgba(41, 41, 41, 0.26) 100%),
          radial-gradient(68.46% 198.58% at -18.46% 107.11%, #05537D 0%, rgba(0, 0, 0, 0) 100%)
        `,
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
      }}
    >
      <div className="p-6:"></div>
      <div className="max-w-6xl mx-auto">


        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 p-6">

            <header className="flex items-center space-x-3 mb-12 ">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtexwZdQi92pIVJsxG0-6yTnSzSKS6wexQYQ&s"
              alt="IoT lab logo"
              className="w-12 h-12 rounded-full"
              />
              <span className="text-white text-xl ">IoT lab</span>
            </header>

            <h1 className="space-y-2">
              <span
                style={{
                  background: 'linear-gradient(82.82deg, #FF00E1 26.01%, #FFD8FA 116.37%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Inter',
                  fontSize: '101.26px',
                  fontWeight: 700,
                  lineHeight: '95.9px',
                  display: 'block'
                }}
              >
                NEXTER
              </span>
              <span
                style={{
                  background: 'linear-gradient(255.77deg, #006FFF 51.85%, #B7D6FF 128.1%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Inter',
                  fontSize: '101.26px',
                  fontWeight: 700,
                  lineHeight: '95.9px',
                  display: 'block'
                }}
              >
                DAY
              </span>
            </h1>

            <p className="text-gray-200 text-xl">
              One app for all <br />
              Login here to get started
            </p>
            <p className="text-gray-300">

            </p>

            {/* Login Button */}
            <div className="py-9 flex items-center space-x-4">
              {loggedIn ? (
                <>
                  <img
                    src={authData.photoURL?.toString()}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <button
                    onClick={signOutUser}
                    className="w-[50%] border text-white rounded-md p-2 font-semibold flex justify-center items-center gap-3 active:scale-95 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="flex items-center space-x-3 bg-white text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Chrome className="w-5 h-5" />
                  <span>Login with Google</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative h-[600px]">
            <div className="overflow-hidden">
              <img
                src={image}
                alt="App screenshot 1"
                className="w-full"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default NexterLanding;
