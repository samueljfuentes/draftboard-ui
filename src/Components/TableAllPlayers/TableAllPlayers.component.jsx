import React from 'react';

import AllPlayersRow from '../TableAllPlayersRow/TableAllPlayersRow.component';

import './TableAllPlayers.styles.scss'

const AllPlayers = ({ allPlayers, addPlayer }) => {
  return (
    <tbody className="table__body">
      {
        allPlayers.map(player => (
          <AllPlayersRow 
            key={player.playerId}
            id={player.playerId}
            displayName={player.displayName}
            jersey={player.jersey}
            addPlayer={addPlayer}
        />
        ))
      }
    </tbody>
  )
};

export default AllPlayers;