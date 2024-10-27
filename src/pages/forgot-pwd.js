import AuthService from "@/services/auth.service";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import { useRouter } from "next/router";
import LoaderComponent from "@/components/loader";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async () => {
    let hasError = false;

    if (!userId) {
      setError((prevError) => ({
        ...prevError,
        userId: "User ID is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, userId: "" }));
    }

    // console.log("hasError:", hasError);

    if (!hasError) {
      console.log("hasError:", hasError);

      try {
        console.log("userId>>>", userId);
        setLoading(true);
        const response = await AuthService.forgetPassword({ userId });
        console.log("response.data>>>", response?.data);
        let responseMsg = JSON.stringify(response?.data);
        const successMsg = responseMsg.split(",");
        const url = successMsg[1].substring(34, 146);
        const newUrl = url.replace(" ","")
        const finalUrl = newUrl.replace(" ","")
        const url1 = finalUrl.replace("/api/v1/user/reset/password", "/reset-pwd")
        console.log("url: ", url1);

        if (response.status === 200) {
          console.log("Response is 200, toggle toast");
          dispatch(
            toggleToast({
              message: "Saifali",
              type: "success",
            }),
          );
        }

        if (response.status === 500) {
          dispatch(
            toggleToast({
              message: "Failed! Try again later.",
              type: "error",
            })
          );
        }
      } catch (err) {
        console.log("Error forgot password: ", err);
        if (err.response && err.response.status === 400) {
          dispatch(
            toggleToast({
              message: "Invalid user ID!",
              type: "error",
            })
          );
        } else {
          dispatch(
            toggleToast({
              message: "An error occurred. Please try again.",
              type: "error",
            })
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleShowPwd = () => {
    setShowPwd((previous) => !previous);
  };

  return (
    <div>
      <div className="loginContainer">
        <div className="loginContainerFirstChild">
          <div>
            <img src="images/taxi-img.jpg" />
          </div>
        </div>
        <div className="loginContainerSecondChild">
          <div className="logoContainer">
            <img src="images/logo.jpg" />
          </div>
          <div className="loginFormContainer">
            <h1>Get Started</h1>
            {/* <h1>Reset your password</h1> */}
            <p className="loginText">Reset your password</p>
            <form className="loginForm">
              <div className="form-control login-control">
                <label htmlFor="userId">
                  User ID<span className="starMark">*</span>
                </label>
                <input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter"
                  type="email"
                  autoComplete="off"
                />
                {userId && userId.length > 2}
                <div>
                  {!userId && error && (
                    <p
                      className="errorHelperText"
                      style={{
                        fontSize: 12,
                        margin: "8px 0 0 10px",
                      }}
                    >
                      {error.userId}
                    </p>
                  )}
                </div>
              </div>
              <div className="form-control login-control">
                {incorrect && <p className="login-incorrect">{incorrect}</p>}
                <button
                  type="button"
                  onClick={onSubmitHandler}
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
              <div className="forgotPwdTextContainer">
                <Link href="/">← Back</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            // backgroundColor: "#000000",
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 1,
            color: "#000000",
            // height: "100vh",
            // width: "100vw",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default ForgotPassword;
