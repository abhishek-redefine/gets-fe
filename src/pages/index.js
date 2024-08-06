import { ADMIN_AUTH_URLS } from '@/constants/url.constants';
import withLayout from '@/layouts/unauth';
import AuthService from '@/services/auth.service';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Home = () => {

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const loginUser = async () => {
    if (username && password) {
      setIncorrect("");
      try {
        const response = await AuthService.login({ username, password, source : "web" });
        const { data } = response || {};
        const { accessToken, token, userId, name } = data || {};
        if (accessToken && token) {
          localStorage.setItem("token", token);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userDetails", JSON.stringify({userId, name}));
          localStorage.setItem("isSuperAdmin", (userId === 1).toString());
          getUserRole(userId);
        }
      } catch (e) {
        console.error(e);
        if (e?.response?.data === "Bad credentials") {
          setIncorrect("Username of password is incorrect.")
        } else {
          setIncorrect("Something went wrong! Please try again in sometime.")
        }
      }
    }
  };

  const getUserRole = async (userId) => {
    try {
      const response = await AuthService.getUserRole(userId);
      if (response?.data && Object.keys(response?.data)?.length ) {
        localStorage.setItem("userRoles", JSON.stringify(response.data));
      }
      router.push(ADMIN_AUTH_URLS.DASHBOARD);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleShowPwd = () => {
    setShowPwd((previous) => !previous);
  }

  return (
    <div>
      <div className='loginContainer'>
        <div className='loginContainerFirstChild'>
          <div>
            <img src='images/taxi-img.jpg' />
          </div>
        </div>
        <div className='loginContainerSecondChild'>
          <div className='logoContainer'>
            <img src='images/logo.jpg' />
          </div>
          <div className='loginFormContainer'>
            <h1>Get Started</h1>
            <p className='loginText'>Login to your account</p>
            <form className='loginForm'>
              <div className='form-control login-control'>
                <label htmlFor='emailId'>Email ID<span className='starMark'>*</span></label>
                <input
                  id='emailId'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Enter'
                  type='email'
                />
                {username && username.length > 2}
              </div>
              <div style={{position: "relative"}} className='form-control login-control'>
                <label htmlFor='password'>Password<span className='starMark'>*</span></label>
                <input
                  id='password'                
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPwd ? 'text' : 'password'}
                  placeholder='Enter'
                />
                <div className='visibilityIconContainer'>
                  {!showPwd && <span onClick={toggleShowPwd} className="material-symbols-outlined">visibility</span>}
                  {showPwd && <span onClick={toggleShowPwd} className="material-symbols-outlined">visibility_off</span>}
                </div>
                {/* <div className='keepMeLoggedIn'>
                  <input id='keepmelogged' type='checkbox' />
                  <label htmlFor='keepmelogged'>Keep me logged in</label>
                </div> */}
              </div>
              <div className='form-control login-control'>
                {incorrect && <p className='login-incorrect'>{incorrect}</p>}
                <button type="button" onClick={loginUser} className='btn btn-primary'>
                  Login
                </button>
              </div>
              {/* <div className='forgotPwdTextContainer'>
                <Link href="/forgot-pwd">Forgot password?</Link>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withLayout(Home);