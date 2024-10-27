import AuthService from "@/services/auth.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import { useRouter } from "next/router";
import LoaderComponent from "@/components/loader";
// import logo from "../../../public/images/logo.jpg"

const ResetPassword = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { obj } = router?.query;

  const [values, setValues] = useState({
    userId: "",
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [incorrect, setIncorrect] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState(false);
  const [parameters, setParameters] = useState({
    userId: "",
    token: "",
  });

  const onSubmitHandler = async () => {
    let hasError = false;

    if (!values.password) {
      setError((prevError) => ({
        ...prevError,
        password: "Password is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, password: "" }));
    }

    if (!values.confirmPassword) {
      setError((prevError) => ({
        ...prevError,
        confirmPassword: "Confirm password is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, confirmPassword: "" }));
    }

    if (values.password && values.confirmPassword) {
      if (values.password !== values.confirmPassword) {
        setError((prevError) => ({
          ...prevError,
          confirmPassword: "Passwords do not match.",
        }));
        hasError = true;
      } else {
        setError((prevError) => ({ ...prevError, confirmPassword: "" }));
      }
    }

    // Proceed only if no errors
    if (!hasError) {
      try {
        let reqBody = { ...values };
        let params = new URLSearchParams(parameters);
  
        const queryString = `userId=${parameters.userId}&token=${parameters.token}`;
        console.log("queryString: ", queryString);

        // console.log("parameters: ", parameters);
        // console.log("params: ", params.toString());
        const response = await AuthService.resetPassword(
          queryString,
          reqBody
        );

        if (response.status === 200) {
          router.push("/");
          dispatch(
            toggleToast({
              message: "User verified successfully!",
              type: "success",
            })
          );
        } else {
          dispatch(
            toggleToast({
              message: "Failed! Try again later.",
              type: "error",
            })
          );
        }
      } catch (err) {
        console.error("Error: ", err);
        dispatch(
          toggleToast({
            message: "An error occurred. Please try again.",
            type: "error",
          })
        );
      }
    }
  };

  const handleValueChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const toggleShowPwd = () => {
    setShowPwd((previous) => !previous);
  };

  const toggleShowConfirmPwd = () => {
    setShowConfirmPwd((previous) => !previous);
  };

  // useEffect(() => {
  // }, []);

  useEffect(() => {
    if (obj) {
      const params = obj.reduce((acc, param) => {
        const [key, value] = param.split("=");
        acc[key] = value;
        return acc;
      }, {});

      if (params.userId && params.token) {
        setParameters((prev) => ({
          ...prev,
          userId: params.userId,
          token: params.token,
        }));

        setValues((prevValues) => ({
          ...prevValues,
          userId: params.userId,
          token: params.token,
        }));
      } else {
        console.error("userId or token not found in params");
      }
    }
  }, [obj]);

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
              <div
                style={{ position: "relative" }}
                className="form-control login-control"
              >
                <label htmlFor="password">
                  Password<span className="starMark">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleValueChange}
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter"
                  autoComplete="new-password"
                />
                <div className="visibilityIconContainer">
                  {!showPwd && (
                    <span
                      onClick={toggleShowPwd}
                      className="material-symbols-outlined"
                    >
                      visibility
                    </span>
                  )}
                  {showPwd && (
                    <span
                      onClick={toggleShowPwd}
                      className="material-symbols-outlined"
                    >
                      visibility_off
                    </span>
                  )}
                </div>
                <div>
                  {!values.password && error && (
                    <p
                      className="errorHelperText"
                      style={{
                        fontSize: 12,
                        margin: "8px 0 0 10px",
                      }}
                    >
                      {error.password}
                    </p>
                  )}
                </div>
              </div>
              <div
                style={{ position: "relative" }}
                className="form-control login-control"
              >
                <label htmlFor="confirmPassword">
                  Confirm Password<span className="starMark">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleValueChange}
                  placeholder="Enter"
                  type={showConfirmPwd ? "text" : "password"}
                  autoComplete="off"
                />
                <div className="visibilityIconContainer">
                  {!showConfirmPwd && (
                    <span
                      onClick={toggleShowConfirmPwd}
                      className="material-symbols-outlined"
                    >
                      visibility
                    </span>
                  )}
                  {showConfirmPwd && (
                    <span
                      onClick={toggleShowConfirmPwd}
                      className="material-symbols-outlined"
                    >
                      visibility_off
                    </span>
                  )}
                </div>
                <div>
                  {!values.confirmPassword && error && (
                    <p
                      className="errorHelperText"
                      style={{
                        fontSize: 12,
                        margin: "8px 0 0 10px",
                      }}
                    >
                      {error.confirmPassword}
                    </p>
                  )}
                  {values.password && values.confirmPassword && error && (
                    <p
                      className="errorHelperText"
                      style={{
                        fontSize: 12,
                        margin: "8px 0 0 10px",
                      }}
                    >
                      {error.confirmPassword}
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
                <Link href="/forgot-pwd">← Back</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* {loading ? (
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
      )} */}
    </div>
  );
};

export default ResetPassword;
