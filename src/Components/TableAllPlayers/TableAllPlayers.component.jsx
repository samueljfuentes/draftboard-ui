import React from 'react';

import AllPlayersRow from '../TableAllPlayersRow/TableAllPlayersRow.component';

import { sortByPosition } from '../../Redux/PlayerTable/PlayerTable.utils'

import './TableAllPlayers.styles.scss';


const AllPlayers = ({ allPlayers, position }) => {
  const allSortedPlayers = sortByPosition(position)(allPlayers);
  return (
    <tbody className="table__body">
      {
        allSortedPlayers.map(player => (
          <AllPlayersRow 
            key={player.playerId}
            id={player.playerId}
            displayName={player.displayName}
            team={player.team}
          />
        ))
      }
    </tbody>
  )
};

export default AllPlayers;