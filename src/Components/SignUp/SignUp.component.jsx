// IMPORT LIBRARIES
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// IMPORT ICONS
import { ReactComponent as ForwardSVG } from '../../Other/svg/forward.svg';
// IMPORT STYLES
import './SignUp.styles.scss';
// IMPORT API ROUTES
// import userReducer from '../../Redux/User/User.reducer';
// const routes = userReducer().routes;

// SIGN UP COMPONENT
const SignUp = ({ loadUser, refreshRoute, routes }) => {

  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');
  const [passwordConfirm, updatePasswordConfirm] = useState ('');

  const resetFields = () => {
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    document.getElementById('password2').value = "";
    updateUsername('');
    updatePassword('');
    updatePasswordConfirm('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let session;
    // check passwords match...
    if (password !== passwordConfirm) {
      alert("Your passwords do not match. Please re-enter your credentials.")
      return
    }

    try {
      // send username, password, & passwordConfirm to backend...
      console.log(routes.signup);
      console.log(process.env);
      let response = await fetch(`${routes.signup}`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username,
          password,
          passwordConfirm
        })
      });
      session = await response.json(); 
      console.log(session);
    } 
    catch (error) {
      alert('Error Signing Up, please try again.');
    }

    if (session.success) {
      window.sessionStorage.setItem('token', session.token)
      loadUser(session.user);
      resetFields();
      refreshRoute('/draftboard');
    }
    else {
      alert('Sign up failed. Please try again.');
    }
  };

  return (
    <div className="sign-up">
      <div className="sign-up__title">
        RedZone Rumble
      </div>
      <form className="sign-up__form">
        <fieldset className="sign-up__content">
          <legend className="sign-up__content--legend">
            Create an account & start planning your draft
          </legend>
          <div className="sign-up__field">
            <label className="sign-up__field--label" htmlFor="username"></label>
            <input className="sign-up__field--input" id="username" type="text" name="username" placeholder="username" onChange={(event) => updateUsername(event.target.value)} />
          </div>
          <div className="sign-up__field">
            <label className="sign-up__field--label" htmlFor="password"></label>
            <input className="sign-up__field--input" id="password" type="password" name="password" placeholder="password" onChange={(event) => updatePassword(event.target.value)} />
          </div>
          <div className="sign-up__field">
            <label className="sign-up__field--label" htmlFor="password2"></label>
            <input className="sign-up__field--input" id="password2" type="password" name="password2" placeholder="confirm password" onChange={(event) => updatePasswordConfirm(event.target.value)} />
          </div>
          <button className="sign-up__submit" onClick={(event) => handleSubmit(event)}>
            <ForwardSVG />
          </button>
        </fieldset>
      </form>
      <Link className="sign-up__guest" onClick={() => loadUser('guest')} to={() => '/draftboard'}>
        Or continue as a Guest without saving your changes
      </Link>
      <Link className="sign-up__account" to={() => '/signin'}>
        <button className="sign-up__account--button">
          Already have an account? Sign in
        </button>
      </Link>
    </div>
  )
};

export default SignUp;