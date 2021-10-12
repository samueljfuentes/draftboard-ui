// IMPORT LIBRARIES
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// IMPORT STYLES & ICONS
import { ReactComponent as ForwardSVG } from '../../Other/svg/forward.svg';
import './SignIn.styles.scss';
// IMPORT API ROUTES
// import userReducer from '../../Redux/User/User.reducer';
// const routes = userReducer().routes;

// SIGN IN COMPONENT
const SignIn = ({loadUser, refreshRoute, routes}) => {
  console.log(routes);
  
  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');

  const resetFields = () => {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    updateUsername('');
    updatePassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // send username & password to backend & store in DB
      let response = await fetch(`${routes.signin}`, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      const session = await response.json();
      console.log(session);
      // check that session data is correct...
      if (session.userid && session.success) {
        // save the token in browser session and get user profile...
        window.sessionStorage.setItem('token', session.token);
        let userData = await fetch(`${routes.profile + session.userid}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'authorization': session.token
          }
        })
        const user = await userData.json();
        console.log(user);
        if (user.userid && user.username) {
          loadUser(user);
          resetFields();
          refreshRoute('/draftboard')
        }
      }  
    }
    catch (error) {
      console.log(error)
      alert('Error signing in. Please try again.');
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in__title">
        RedZone Rumble
      </div>
      <form className="sign-in__form">
        <fieldset className="sign-in__content">
          <legend className="sign-in__content--legend">
            Sign in & start organizing a draftboard
          </legend>
          <div className="sign-in__field">
            <label className="sign-in__field--label" htmlFor="username"></label>
            <input className="sign-in__field--input" id="username" type="text" name="username" placeholder="username" onChange={(event) => updateUsername(event.target.value)} />
          </div>
          <div className="sign-in__field">
            <label className="sign-in__field--label" htmlFor="password"></label>
            <input className="sign-in__field--input" id="password" type="password" name="password" placeholder="password" onChange={(event) => updatePassword(event.target.value)} />
          </div>
          <button className="sign-in__submit" onClick={(event) => handleSubmit(event)}>
            <ForwardSVG />
          </button>
        </fieldset>
      </form>
      <Link className="sign-in__guest" onClick={() => loadUser('guest')} to={() => '/draftboard'}>
        Or continue as a Guest without saving your changes
      </Link>
      <Link className="sign-in__account" to={() => '/signup'}>
        <button className="sign-in__account--button">
          Create Account
        </button>
      </Link>
    </div>
    // <form className="sign-in-box">
    //   <fieldset id="sign-in" className="sign-in-box__content">
    //     <legend className="sign-in-box__title">Sign in & personalize a draft board</legend>
    //     <div className="sign-in-box__field">
    //       <label htmlFor="user-username" className="sign-in-box__field--title">username</label>
    //       <input type="username" name="user-username" id="user-username" className="sign-in-box__field--input" onChange={(event) => updateUsername(event.target.value)} />
    //     </div>
    //     <div className="sign-in-box__field">
    //       <label htmlFor="password" className="sign-in-box__field--title">Password</label>
    //       <input type="password" name="password" id="password" className="sign-in-box__field--input" onChange={(event) => updatePassword(event.target.value)} />
    //     </div>
    //     <div className="sign-in-box__reset-pswd">
    //       <Link target="_blank" className="sign-in-box__reset-pswd--link" to={()=>'/reset'}>Forgot your password?</Link>
    //     </div>
    //     <button className="sign-in-box__button" onClick={(event)=>handleSubmit(event)} >Sign In</button>
    //     <div className="sign-in-box__account-status">
    //       Not signed up? <br />
    //       <Link className="sign-in-box__account-status--signup" to={() => '/signup'} >Create a free account</Link> quickly and easily to save your changes! <br />
    //       Or <Link className="sign-in-box__account-status--guest" onClick={() => loadUser('guest')} to={() => '/draftboard'} >continue as a guest</Link> if you prefer.
    //     </div>
    //   </fieldset>
    // </form>
  )
};

export default SignIn;