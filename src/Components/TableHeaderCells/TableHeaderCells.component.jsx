import React from 'react';
import { connect } from 'react-redux';

import { updateSortOrder } from '../../Redux/PlayerTable/PlayerTable.actions';

import './TableHeaderCells.styles.scss';

const mapState = (state) => {
  return {
    headerCells: state.playerTable.headerCells,
    isAsc: state.playerTable.isAsc
  }
};

const mapDispatch = (dispatch) => {
  return {
    handleSortRequest: (property, isAsc) => dispatch(updateSortOrder(property, isAsc))
  }
}

const PlayerTableHeaderCells = ({ headerCells, isAsc, handleSortRequest, isMyPlayers }) => {
  return isMyPlayers ?
    headerCells.map((cell, i) => (
      <th 
        className="table__header--cell" 
        scope="column"
        onClick={() => handleSortRequest(cell.id, isAsc)} 
        key={i}
      >
        {cell.label}
      </th>
    )) : 
    <th 
      className="table__header--cell"
      scope="column" 
    >
      Add to My Players
    </th>
};

export default connect(mapState, mapDispatch)(PlayerTableHeaderCells);