// IMPORT LIBRARIES
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// IMPORT STYLES
import './SignUp.styles.scss'

// SIGN UP COMPONENT
const SignUp = ({ loadUser, refreshRoute }) => {

  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');
  const [passwordConfirm, updatePasswordConfirm] = useState ('');

  const resetFields = () => {
    document.getElementById('sign-up-username').value = "";
    document.getElementById('sign-up-password').value = "";
    document.getElementById('sign-up-password2').value = "";
    updateUsername('');
    updatePassword('');
    updatePasswordConfirm();
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
      let response = await fetch('http://localhost:3000/signup', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username,
          password,
          passwordConfirm
        })
      });

      session = await response.json(); 
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
    <form className="sign-up-box">
      <fieldset id="sign-up" className="sign-up-box__content">
        <legend className="sign-up-box__title">Create an account & personalize a draft board</legend>
        <div className="sign-up-box__field">
          <label htmlFor="sign-up-username" className="sign-up-box__field--title">Username</label>
          <input type="text" name="sign-up-username" id="sign-up-username" className="sign-up-box__field--input" onChange={(event) => updateUsername(event.target.value)} />
        </div>
        <div className="sign-up-box__field">
          <label htmlFor="sign-up-password" className="sign-up-box__field--title">Password</label>
          <input type="password" name="sign-up-password" id="sign-up-password" className="sign-up-box__field--input" onChange={(event) => updatePassword(event.target.value)} />
        </div>
        <div className="sign-up-box__field">
          <label htmlFor="sign-up-password2" className="sign-up-box__field--title">Confirm Password</label>
          <input type="password" name="sign-up-password2" id="sign-up-password2" className="sign-up-box__field--input" onChange={(event) => updatePasswordConfirm(event.target.value)} />
        </div>
        {/* <div className="sign-up-box__reset-pswd">
          <a href="#0" target="_blank" className="sign-up-box__reset-pswd--link">Forgot your sign-up-password?</a>
        </div> */}
        <button className="sign-up-box__button" onClick={(event) => handleSubmit(event)} >Sign Up</button>
        <div className="sign-up-box__account-status">
          Already have an account? <br />
          <Link className="sign-up-box__account-status--signin" to={() => '/signin'} >Sign in to your account</Link> to save your changes! <br />
          Or <Link className="sign-up-box__account-status--guest" onClick={() => loadUser('guest')} to={() => '/draftboard'} >continue as a guest</Link> if you prefer.
        </div>
      </fieldset>
    </form>
  )
};

export default SignUp;