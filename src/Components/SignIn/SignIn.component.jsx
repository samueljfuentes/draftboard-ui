// IMPORT LIBRARIES
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Loader from '../Loader/Loader.component';
// IMPORT STYLES & ICONS
import { ReactComponent as ForwardSVG } from '../../Other/svg/forward.svg';
import './SignIn.styles.scss';


// SIGN IN COMPONENT
const SignIn = ({loadUser, refreshRoute, routes}) => {
  
  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');

  const resetFields = () => {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    updateUsername('');
    updatePassword('');
  };

  const startLoader = () => {
    const loader = document.getElementById("loader");
    loader.hidden = false;
  };

  const closeLoader = () => {
    const loader = document.getElementById("loader");
    loader.hidden = true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    startLoader();
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
        if (user.userid && user.username) {
          closeLoader();
          loadUser(user);
          resetFields();
          refreshRoute('/draftboard')
        }
      }  
    }
    catch (error) {
      alert('Error signing in. Please try again.');
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in__title">
        RedZone Rumble
      </div>
      <form className="sign-in__form">
        <Loader />
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
  )
};

export default SignIn;