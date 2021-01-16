import React from "react";
import { connect } from 'react-redux';

import { toggleMyPlayers } from '../../Redux/PlayerTable/PlayerTable.actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.styles.scss';


const mapDispatch = (dispatch) => {
  return {
    toggleMyPlayers: (isMyPlayers) => dispatch(toggleMyPlayers(isMyPlayers))
  }
}

const Header = ({ isMyPlayers, toggleMyPlayers }) => {
  return (
    <div className="header__container">
      <header className="header__inner">
        <div className="header__content">
          <div className="header__icons--container">
            <div className="header__icons--profile-container">
              <FontAwesomeIcon 
                className="header__icons--profile" 
                icon="user-circle"
                aria-hidden="true"       
              />
            </div>
            <div className="header__icons--settings-container">
              <FontAwesomeIcon 
                className="header__icons--settings"
                icon="tools"
                aria-hidden="true"
                onClick={() => toggleMyPlayers(isMyPlayers)}
              />
            </div>
          </div>
          <div className="header__search--container">
            <div className="header__search--icon-container">
              <FontAwesomeIcon
                className="header__search--icon"
                icon="search"
                aria-hidden="true"
              />
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
        </div>
      </header>
    </div>
  );
};

export default connect(null, mapDispatch)(Header);