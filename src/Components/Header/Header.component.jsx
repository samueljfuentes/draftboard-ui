import React from "react";
import { connect } from 'react-redux';

import { toggleMyPlayers, toggleProfile } from '../../Redux/PlayerTable/PlayerTable.actions';

import { ReactComponent as ProfileSVG } from '../../Other/svg/profile.svg';
import { ReactComponent as SearchSVG } from '../../Other/svg/search.svg';
import './Header.styles.scss';


const mapState = (state) => {
  return {
    isMyPlayers: state.playerTable.isMyPlayers,
    isProfileOpen: state.playerTable.isProfileOpen
  }
};

const mapDispatch = (dispatch) => {
  return {
    toggleMyPlayers: (isMyPlayers) => dispatch(toggleMyPlayers(isMyPlayers)),
    toggleProfile: (isProfileOpen) => dispatch(toggleProfile(isProfileOpen))
  }
};

const Header = ({ isMyPlayers, isProfileOpen, toggleMyPlayers, toggleProfile }) => {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__search--container">
          <div className="header__search--icon-container">
            <SearchSVG />
            {/* <FontAwesomeIcon
              className="header__search--icon"
              icon="search"
              aria-hidden="true"
            /> */}
          </div>
          <div className="header__search--input-container">
            <input
              className="header__search--input"
              placeholder="Search..."
              type="text"
              aria-label="search"
            />
          </div>
        </div>
        <div className="header__icons--container">
          <button className="header__icons--profile">
            <ProfileSVG 
              onClick={() => toggleProfile(isProfileOpen)}
            />
          </button>
          {/* <div className="header__icons--profile-container">
            <FontAwesomeIcon 
              className="header__icons--profile" 
              icon="user-circle"
              aria-hidden="true"
              onClick={() => toggleProfile(isProfileOpen)}       
            />
          </div> */}
          {/* <div className="header__icons--settings-container">
            <FontAwesomeIcon 
              className="header__icons--settings"
              icon="tools"
              aria-hidden="true"
              onClick={() => toggleMyPlayers(isMyPlayers)}
            />
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default connect(mapState, mapDispatch)(Header);