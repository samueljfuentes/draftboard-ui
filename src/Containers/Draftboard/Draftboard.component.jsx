import React from 'react';
import { connect } from 'react-redux';

import { updateAllPlayers, updateMyPlayersList, updateAllPlayersList } from "../../Redux/PlayerTable/PlayerTable.actions";
import { getPlayerLists, sortPlayers, sortByPosition } from '../../Redux/PlayerTable/PlayerTable.utils';

import Modal from '../Modal/Modal.component';

import Header from '../../Components/Header/Header.component';
import Table from '../../Components/Table/Table.component';
import PositionNav from '../../Components/TablePositionNav/TablePositionNav.component';
import ProfileOverlay from '../../Components/ProfileOverlay/ProfileOverlay.component';

import './Draftboard.styles.scss';


const mapState = (state) => {
  return {
    user: state.user.user,
    allPlayers: state.playerTable.allPlayers,
    myPlayers: state.playerTable.myPlayers,
    isProfileOpen: state.playerTable.isProfileOpen,
    isMyPlayers: state.playerTable.isMyPlayers,
    position: state.playerTable.position,
    isAsc: state.playerTable.isAsc,
  };
};

const mapDispatch = (dispatch) => {
  return ({
    updateAllPlayers: (players) => dispatch(updateAllPlayers(players)),
    updateMyPlayersList: (myPlayers) => dispatch(updateMyPlayersList(myPlayers)),
    updateAllPlayersList: (allPlayers) => dispatch(updateAllPlayersList(allPlayers))
  })
};

class PlayerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggedPlayer: {}
    };
  };

  // LIFECYCLE METHODS...
  async componentDidMount() {
    console.log('PLAYER TABLE MOUNTED..getting player lists...');
    
    const allPlayers = await getPlayerLists(this.props.user);
    allPlayers ? this.props.updateAllPlayers(allPlayers) : alert('Server Error: Failed to fetch players. Please try again later.')
  };

  shouldComponentUpdate(nextProps, nextState) {
    // update if the all player list changes...
    console.log('checking if should update...')
    if (nextProps.allPlayers !== this.props.allPlayers) {
      console.log('player list changed, UPDATE TABLE...')
      return true;
    }
    // update if the my player list changes...
    else if (nextProps.myPlayers !== this.props.myPlayers) {
      console.log('my players modified, UPDATE TABLE')
      return true
    }
    // update if the sort position changes...
    else if (nextProps.position !== this.props.position) {
      console.log('sort position changed, UPDATE TABLE...')
      return true
    }
    // update when toggling different views...
    else if (nextProps.isMyPlayers !== this.props.isMyPlayers) {
      console.log('toggling my players view, UPDATE TABLE')
      return true
    }
    else if (nextProps.isProfileOpen !== this.props.isProfileOpen) {
      console.log('toggling profile, UPDATE TABLE')
      return true
    }
    // NEVER UPDATE WHEN STATE CHANGES, this is placeholder for drag/repl players... 
    else if (this.state !== nextState) {
      console.log('changing placeholders, DONT UPDATE TABLE...')
      return false
    }
    else {
      // default: dont update this round, but send update action again 
      console.log('NOTHING DETERMINEd, DEFAULT DONT UPDATE')
      return false;
    }
  };


  // PLAYER TABLE COMPONENT...
  render() {
    const { isProfileOpen, allPlayers, myPlayers, position, isAsc } = this.props;
    const mySortedPlayers = sortPlayers(position, isAsc)(myPlayers);
    const allSortedPlayers = sortByPosition(position)(allPlayers);
    return (
      <>
        {
          isProfileOpen ?
          <Modal>
            <ProfileOverlay isProfileOpen={isProfileOpen} />
          </Modal> :
          null
        }
        <div className="draftboard" id="draft-board">
          <Header />
          <Table 
          myPlayers={mySortedPlayers}
          allPlayers={allSortedPlayers}
          removePlayer={this.removePlayer}
          dragStart={this.dragStart}
          allowDrop={this.allowDrop}
          drop={this.drop}
          touchDrag={this.touchDrag}
          touchDrop={this.touchDrop}
          />
          <PositionNav />
        </div>
      </>
    );
  }
}

export default connect(mapState, mapDispatch)(PlayerTable);