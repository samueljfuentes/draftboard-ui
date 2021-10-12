import React from 'react';
import { connect } from 'react-redux';

import { sortPlayers, removePlayer, replacePlayer, changeDraggedPlayer, touchStart, touchEnd } from '../../Redux/PlayerTable/PlayerTable.utils';
import { updateAllPlayersList, updateMyPlayersList, updateDraggedPlayer } from '../../Redux/PlayerTable/PlayerTable.actions';

import { ReactComponent as RemoveSVG } from '../../Other/svg/remove.svg'
import './TableMyPlayersRow.styles.scss';


const mapState = (state) => {
  return {
    allPlayers: state.playerTable.allPlayers,
    myPlayers: state.playerTable.myPlayers,
    draggedPlayer: state.playerTable.draggedPlayer,
    isAsc: state.playerTable.isAsc,
    position: state.playerTable.position,
    user: state.user.user,
    routes: state.user.routes
  }
};

const mapDispatch = (dispatch) => {
  return {
    updateAllPlayersList: (players) => dispatch(updateAllPlayersList(players)),
    updateMyPlayersList: (myPlayers) => dispatch(updateMyPlayersList(myPlayers)),
    updateDraggedPlayer: (draggedPlayer) => dispatch(updateDraggedPlayer(draggedPlayer))
  }
};

const MyPlayersRow = ({ displayName, team, tier, rank, allPlayers, myPlayers, draggedPlayer, isAsc, position, user, routes, updateAllPlayersList, updateMyPlayersList, updateDraggedPlayer }) => {
  
  const sortedMyPlayers = sortPlayers(position, isAsc)(myPlayers);

  return (
    <tr 
      className="table__body--row"
      draggable
      passive="false"
      onDragStart={(event) => changeDraggedPlayer(displayName, sortedMyPlayers, updateDraggedPlayer)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        replacePlayer(displayName, draggedPlayer, myPlayers, sortedMyPlayers, user, updateMyPlayersList)
      }}
      onTouchStart={(event) => touchStart(event, displayName, sortedMyPlayers, updateDraggedPlayer)}
      onTouchEnd={(event) => touchEnd(event, displayName, draggedPlayer, myPlayers, sortedMyPlayers, user, updateMyPlayersList)}
    >
      <th className="table__body--cell1">{displayName} ({team})</th>
      <td className="table__body--cell">
        <RemoveSVG 
          onClick={(click) => removePlayer(click, allPlayers, myPlayers, user, routes, updateMyPlayersList, updateAllPlayersList)} 
        />
      </td>
      <td className="table__body--cell">{tier}</td>
      <td className="table__body--cell">{rank}</td>
    </tr>
  )
};


export default connect(mapState, mapDispatch)(MyPlayersRow);