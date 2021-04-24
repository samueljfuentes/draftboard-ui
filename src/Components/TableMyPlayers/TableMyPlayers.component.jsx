import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import TierRow from '../TableTierRow/TableTierRow.component';
import MyPlayersRow from '../TableMyPlayersRow/TableMyPlayersRow.component';

import { sortPlayers } from '../../Redux/PlayerTable/PlayerTable.utils';


const mapState = (state) => {
  return {
    myPlayers: state.playerTable.myPlayers,
    isAsc: state.playerTable.isAsc,
    position: state.playerTable.position,
    tiers: state.playerTable.tiers,
  }
};

const MyPlayers = ({ myPlayers, isAsc, position, tiers }) => {
  const sortedMyPlayers = sortPlayers(position, isAsc)(myPlayers);

  // make event listeners non-passive for touch drag-n-drop, to prevent default and allow functionality...
  useEffect(() => {
    const rows = document.querySelectorAll('.table__body--row');
    rows.forEach(row => {
      row.addEventListener('touchstart', (event) => event.preventDefault(), { passive: false });
      row.addEventListener('touchend', (event) => event.preventDefault(), { passive: false })
    })
  }, []);

  return (
    <tbody className="table__body">
    {
      // first render each tier...
      tiers.map(tier => {
        return (
          <React.Fragment key={tier}>
            <TierRow tier={tier} /> 
            {
              // underneath each tier, render the players that match that tier
              sortedMyPlayers.map(myPlayer => {
                return myPlayer.tier === tier ?
                  <MyPlayersRow 
                    key={myPlayer.playerId}
                    displayName={myPlayer.displayName}
                    jersey={myPlayer.jersey}
                    tier={myPlayer.tier}
                    rank={myPlayer.rank}
                  />
                  :
                  null
              })
            }
          </React.Fragment>
        )
      })
    }
    </tbody>
  )
};

export default connect(mapState)(MyPlayers);