import { signInWithGoogle, signOutUser } from "../../firebaseConfig";
import { useAuthStore } from "../../zustand/UseAuthStore";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const authData = useAuthStore((state) => state.authData);

  const handleSignIn = async () => {
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <>
      <div className="flex h-svh w-screen justify-center items-center font-monaSans">
        <div className="md:w-[55%]">
          <div className="p-6 md:min-w-80 md:max-w-[600px] m-auto">
            <h1 className="font-bold text-3xl pb-2 leading-8">
              Login to your account
            </h1>
            <p className="leading-5">
              Continue tracking your progress after logging in to your account
            </p>
            <div className="py-9">
              {loggedIn ? (
                <>
                  <img
                    src={authData.photoURL?.toString()}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <button
                    onClick={signOutUser}
                    className="w-full border rounded-md p-2 font-semibold flex justify-center items-center gap-3 active:scale-95 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full border rounded-md p-2 font-semibold flex justify-center items-center gap-3 active:scale-95 transition-all"
                >
                  <Icon icon="devicon:google" width="15" height="15" />
                  Login with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
