import React from 'react';
import { connect } from 'react-redux';

import { updateSortOrder } from '../../Redux/PlayerTable/PlayerTable.actions';

import './TableHeader.styles.scss';

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

const TableHeader = ({ headerCells, isAsc, handleSortRequest, isMyPlayers }) => {
  return (
    <thead className="table__header">
      <tr className="table__header--row">
        <th className="table__header--title" scope="col">Player Name</th>
        {
          isMyPlayers ?
          headerCells.map((cell, i) => (
            <th 
              className="table__header--title" 
              scope="col"
              onClick={() => handleSortRequest(cell.id, isAsc)} 
              key={i}
            >
              {cell.label}
            </th>
          )) : 
          <th 
            className="table__header--title"
            scope="col" 
          >
            Add
          </th>
        }
      </tr>
    </thead>
  )
};

export default connect(mapState, mapDispatch)(TableHeader);