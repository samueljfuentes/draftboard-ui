import React from 'react';
import { connect } from 'react-redux';

import { allowDrop, replacePlayer } from '../../Redux/PlayerTable/PlayerTable.utils';

import './TableTierRow.styles.scss';


const mapState = (state) => {
  return {
    myPlayers: state.playerTable.myPlayers,
    draggedPlayer: state.playerTable.draggedPlayer,
    user: state.user.user
  }
}

const TierRow = ({ tier, myPlayers, draggedPlayer }) => {
  return (
    <tr className="tier__row" 
      draggable
      onDragOver={(event) => allowDrop(event)}
      // onDrop={(event) => drop(event, `TIER: ${tier}`)}
      onDrop={(event) => {
        event.preventDefault();
        replacePlayer(`TIER: ${tier}`, draggedPlayer, myPlayers)
      }}
    >
      <th className="tier__cell" colSpan="4"> TIER: {tier} </th>
    </tr>
  )
};

export default connect(mapState, mapDispatch)(TierRow);  