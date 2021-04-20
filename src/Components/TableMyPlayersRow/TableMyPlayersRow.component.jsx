import React, { useState } from 'react';
import { connect } from 'react-redux';

import { removePlayer, replacePlayer, changeDraggedPlayer } from '../../Redux/PlayerTable/PlayerTable.utils';
import { updateAllPlayersList, updateMyPlayersList, updateDraggedPlayer } from '../../Redux/PlayerTable/PlayerTable.actions';

const mapState = (state) => {
  return {
    allPlayers: state.playerTable.allPlayers,
    myPlayers: state.playerTable.myPlayers,
    draggedPlayer: state.playerTable.draggedPlayer,
    user: state.user.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateAllPlayersList: (players) => dispatch(updateAllPlayersList(players)),
    updateMyPlayersList: (myPlayers) => dispatch(updateMyPlayersList(myPlayers)),
    updateDraggedPlayer: (draggedPlayer) => dispatch(updateDraggedPlayer(draggedPlayer))
  }
}

const MyPlayersRow = ({ id, displayName, jersey, tier, rank, sortedMyPlayers, allPlayers, myPlayers, draggedPlayer, user, updateAllPlayersList, updateMyPlayersList, updateDraggedPlayer, touchDrag, touchDrop }) => {

  return (
    <tr 
      className="table__body--row"
      draggable
      onDragStart={() => changeDraggedPlayer(displayName, sortedMyPlayers, updateDraggedPlayer)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        // BELOW: CHECK TO SEE IF myPlayers & sortedMyPlayers ARE BOTH NECESSARY....
        replacePlayer(displayName, draggedPlayer, myPlayers, sortedMyPlayers, user, updateMyPlayersList)
      }}
      onTouchStart={(event) => {
        event.preventDefault();
        document.getElementById('draft-board').classList.add('lock-scroll');
        changeDraggedPlayer(displayName, sortedMyPlayers, updateDraggedPlayer);
      }}
      onTouchEnd={(event) => {
        event.preventDefault();
        document.getElementById('draft-board').classList.remove('lock-scroll');
        replacePlayer(displayName, draggedPlayer, myPlayers, sortedMyPlayers, user, updateMyPlayersList)
      }}
    >
      <th className="table__body--cell1">{displayName} (#{jersey})</th>
      <td className="table__body--cell"><div onClick={(click) => removePlayer(click, allPlayers, myPlayers, user, updateMyPlayersList, updateAllPlayersList)}> - </div></td>
      <td className="table__body--cell">{tier}</td>
      <td className="table__body--cell">{rank}</td>
    </tr>
  )
};

export default connect(mapState, mapDispatch)(MyPlayersRow);