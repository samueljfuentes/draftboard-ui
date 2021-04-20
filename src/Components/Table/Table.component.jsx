import React from 'react';

import { connect } from 'react-redux';

import TableHeader from '../TableHeader/TableHeader.component';
import AllPlayers from '../TableAllPlayers/TableAllPlayers.component';
import MyPlayers from '../TableMyPlayers/TableMyPlayers.component';

import './Table.styles.scss';


const mapState = (state) => {
  return {
    allPlayers: state.playerTable.allPlayers,
    position: state.playerTable.position,
    isMyPlayers: state.playerTable.isMyPlayers
  }
};

const Table = ({ allPlayers, position, isMyPlayers }) => {
  return (
    <table className="table">
      <TableHeader isMyPlayers={isMyPlayers}/>
      {
        isMyPlayers ?
        <MyPlayers />
        :
        <AllPlayers allPlayers={allPlayers} position={position}/>
      }
    </table>
  )
};

export default connect(mapState)(Table);