import { signInWithGoogle, signOutUser } from "../../firebaseConfig";
import { useAuthStore } from "../../zustand/UseAuthStore.tsx";
// import { useNavigate } from "react-router-dom";
import frame3Image from "../../assets/Frame3.webp";
import { Icon } from "@iconify/react";
import { useEventStore } from "../../zustand/useEventStore";
const NexterLanding = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const authData = useAuthStore((state) => state.authData);
  useEventStore.setState({ hideFooter: true });

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div
      className="h-full bg-[#03001]"
      style={{
        backgroundImage: `url(${frame3Image})`,
        backgroundSize: "cover",
      }}
    >
      <div className=" items-center justify-center md:justify-normal  h-[91vh] flex flex-col lg:flex-row ">
        <div className="space-y-6 p-6 text-center justify-center flex items-center md:items-start flex-col  lg:text-left lg:ml-[10%]">
          <header className="flex items-center justify-center lg:justify-start space-x-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtexwZdQi92pIVJsxG0-6yTnSzSKS6wexQYQ&s"
              alt="IoT lab logo"
              loading="lazy"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-white font-bold">IoT lab</span>
          </header>

          <div className="">
            <span
              style={{
                fontSize: "8vw",
                fontWeight: 700,
                lineHeight: "1.1",
                display: "block",
              }}
              className="text-white"
            >
              NEXTER
            </span>
            <span
              style={{
                background: "rgb(103, 51, 152)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "8vw",
                fontWeight: 700,
                lineHeight: "1.1",
                display: "block",
              }}
            >
              DAY
            </span>
          </div>

          <p className="text-gray-200 ">
            One app for all . Login with your <strong>kiit email</strong>!
          </p>
          <div className="flex justify-center lg:justify-start">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
              alt="Google Play Store Download Button"
              loading="lazy"
              className="w-[45%] md:w-[12%] flex justify-center lg:justify-start"
            />
          </div>

          <div className=" flex flex-col items-center space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4">
            {loggedIn ? (
              <>
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-purple-700 to-purple-900 animate-pulse" />
                  {authData.photoURL && (
                    <img
                      src={authData.photoURL.toString()}
                      onLoad={(e) =>
                        e.currentTarget.classList.remove("opacity-0")
                      }
                      onError={(e) => e.currentTarget.classList.add("hidden")}
                      alt="Profile"
                      className="absolute inset-0 w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-opacity duration-300 cursor-pointer opacity-0"
                    />
                  )}
                </div>

                <button
                  onClick={signOutUser}
                  className="w-20px border text-white rounded-md p-2 font-semibold flex justify-center items-center gap-3 active:scale-95 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-3 bg-white text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon icon="devicon:google" width="15" height="15" />
                <span>Login with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexterLanding;
