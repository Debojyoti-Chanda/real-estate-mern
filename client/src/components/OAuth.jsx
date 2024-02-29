import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logInSuccess } from "../redux/user/userSlice";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then((result) => {
        fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            dispatch(logInSuccess(data));
            navigate("/");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <button
      className="bg-red-400 w-full text-white bg-primary-600 hover:bg-slate-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      type="button"
      onClick={handleGoogleClick}
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
