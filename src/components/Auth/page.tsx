import { signInWithGoogle, signOutUser } from "../../firebaseConfig";
import { useAuthStore } from "../../zustand/UseAuthStore";
import { useNavigate } from "react-router-dom";
import frame3Image from "../../assets/Frame3.png";
import { Icon } from "@iconify/react";
import { useEventStore } from "../../zustand/useEventStore";
const NexterLanding = () => {
  const navigate = useNavigate();
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const authData = useAuthStore((state) => state.authData);
  const hideFooter = useEventStore((state) => state.hideFooter);
  useEventStore.setState({ hideFooter: true });

  const handleSignIn = async () => {
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <div
      className="h-full bg-[#03001]"
      style={{
        backgroundImage: `url(${frame3Image})`,
        backgroundSize: "cover",
      }}
    >
      <div className="justify-center items-center h-[91vh] flex flex-col lg:flex-row ">
        <div className="space-y-6 p-6 text-center  lg:text-left ml-[10%]">
          <header className="flex items-center justify-center lg:justify-start space-x-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtexwZdQi92pIVJsxG0-6yTnSzSKS6wexQYQ&s"
              alt="IoT lab logo"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-white font-bold">IoT lab</span>
          </header>

          <div className="">
            <span
              style={{
                // background:
                //   "linear-gradient(82.82deg, #FF00E1 26.01%, #FFD8FA 116.37%)",
                // WebkitBackgroundClip: "text",
                // WebkitTextFillColor: "transparent",
                // fontFamily: "Inter"/\,
                fontSize: "101.26px",
                fontWeight: 700,
                lineHeight: "95.9px",
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
                // fontFamily: "Inter",
                fontSize: "101.26px",
                fontWeight: 700,
                lineHeight: "95.9px",
                display: "block",
              }}
            >
              DAY
            </span>
          </div>

          <p className="text-gray-200 ">
            One app for all .
            Login here to get started
          </p>
          <div className="flex justify-center lg:justify-start">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
              alt="Google Play Store Download Button"
              className="w-[12%] flex justify-center lg:justify-start"
            />
          </div>

          {/* Login Button */}
          <div className=" flex flex-col items-center space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4">
            {loggedIn ? (
              <>
                <img
                  src={authData.photoURL?.toString()}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
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
