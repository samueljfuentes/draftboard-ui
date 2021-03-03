// IMPORT LIBRARIES
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// IMPORT STYLES
import './SignIn.styles.scss';

// SIGN IN COMPONENT
const SignIn = ({loadUser, refreshRoute}) => {
  
  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');

  const resetFields = () => {
    document.getElementById("user-username").value = "";
    document.getElementById("password").value = "";
    updateUsername('');
    updatePassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // send username & password to backend & store in DB
      let response = await fetch('http://localhost:3000/signin', {
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
        let userData = await fetch(`http://localhost:3000/profile/${session.userid}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'authorization': session.token
          }
        })
        const user = await userData.json()
        if (user.userid && user.username) {
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
    <form className="sign-in-box">
      <fieldset id="sign-in" className="sign-in-box__content">
        <legend className="sign-in-box__title">Sign in & personalize a draft board</legend>
        <div className="sign-in-box__field">
          <label htmlFor="user-username" className="sign-in-box__field--title">username</label>
          <input type="username" name="user-username" id="user-username" className="sign-in-box__field--input" onChange={(event) => updateUsername(event.target.value)} />
        </div>
        <div className="sign-in-box__field">
          <label htmlFor="password" className="sign-in-box__field--title">Password</label>
          <input type="password" name="password" id="password" className="sign-in-box__field--input" onChange={(event) => updatePassword(event.target.value)} />
        </div>
        <div className="sign-in-box__reset-pswd">
          <Link target="_blank" className="sign-in-box__reset-pswd--link" to={()=>'/reset'}>Forgot your password?</Link>
        </div>
        <button className="sign-in-box__button" onClick={(event)=>handleSubmit(event)} >Sign In</button>
        <div className="sign-in-box__account-status">
          Not signed up? <br />
          <Link className="sign-in-box__account-status--signup" to={() => '/signup'} >Create a free account</Link> quickly and easily to save your changes! <br />
          Or <Link className="sign-in-box__account-status--guest" onClick={() => loadUser('guest')} to={() => '/draftboard'} >continue as a guest</Link> if you prefer.
        </div>
      </fieldset>
    </form>
  )
};

export default SignIn;