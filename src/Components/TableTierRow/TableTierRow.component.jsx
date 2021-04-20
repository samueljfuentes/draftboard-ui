import React from 'react';
import { connect } from 'react-redux';

import { updateMyPlayersList } from '../../Redux/PlayerTable/PlayerTable.actions';
import { replacePlayer } from '../../Redux/PlayerTable/PlayerTable.utils';

import './TableTierRow.styles.scss';


const mapState = (state) => {
  return {
    draggedPlayer: state.playerTable.draggedPlayer,
    user: state.user.user
  }
};

const mapDispatch = (dispatch) => {
  return {
    updateMyPlayersList: (myPlayers) => dispatch(updateMyPlayersList(myPlayers))
  }
};

const TierRow = ({ tier, sortedMyPlayers, draggedPlayer, user, updateMyPlayersList }) => {
  return (
    <tr className="tier__row" 
      draggable
      onDragOver={(event) => event.preventDefault()}
      // onDrop={(event) => drop(event, `TIER: ${tier}`)}
      onDrop={(event) => {
        event.preventDefault();
        replacePlayer(`TIER: ${tier}`, draggedPlayer, sortedMyPlayers, sortedMyPlayers, user, updateMyPlayersList)
      }}
    >
      <th className="tier__cell" colSpan="4"> TIER: {tier} </th>
    </tr>
  )
};

export default connect(mapState, mapDispatch)(TierRow);  