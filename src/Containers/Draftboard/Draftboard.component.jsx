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

  // DRAG-N-DROP FUNCTIONS...
  dragStart = (playerName) => {
    this.changeDraggedPlayer(playerName);
  };


  drop = (event, playerName) => {
    event.preventDefault();
    this.replacePlayer(playerName);
  };

  touchDrag = (event) => {
    event.preventDefault();
    const draggedPlayer = event.target.textContent;
    this.changeDraggedPlayer(draggedPlayer);
    // prevent scrolling
    document.getElementById('draft-board').classList.add('lock-scroll');
  };

  touchDrop = (event) => {
    event.preventDefault();
    const playerToReplace = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY).textContent;
    this.replacePlayer(playerToReplace);
    // prevent scrolling
    document.getElementById('draft-board').classList.remove('lock-scroll');
  };

  // ORGANIZE PLAYERS FUNCTIONS

  changeDraggedPlayer = (name) => {
    const { position, isAsc, myPlayers } = this.props;
    const sortedPlayers = this.sortPlayers(position, isAsc)(myPlayers);
    // narrow the list of players to current position; determine which player is being dragged
    const newDraggedPlayer = sortedPlayers.filter(
      (player) => name.includes(player.displayName)
    );
    this.setState({ draggedPlayer: newDraggedPlayer[0] });
  };

checkModifiedPlayers = (dragPlayer, droppedOn) => {
  const { position, isAsc, myPlayers } = this.props;
  const sortedPlayers = this.sortPlayers(position, isAsc)(myPlayers);
  let playerRange; // array of players who's ranking are affected
  let newPlayerRanks; // array with updated rankings for players who are modified
  // if dragging UP onto tier row
  if (typeof droppedOn === 'number' && droppedOn <= dragPlayer.tier) {
    playerRange = sortedPlayers.filter(player => player.tier >= droppedOn && player.rank <= dragPlayer.rank);
    newPlayerRanks = playerRange.map(player => {
      return player.rank === dragPlayer.rank ?
        {
          ...player,
          tier: droppedOn,
          rank: playerRange[0].rank
        }
        :
        {
          ...player,
          rank: player.rank + 1
        }
    })
  };
  // if dragging DOWN onto tier row
  if (typeof droppedOn === 'number' && droppedOn > dragPlayer.tier) {
    playerRange = sortedPlayers.filter(player => player.tier < droppedOn && player.rank >= dragPlayer.rank);
    newPlayerRanks = playerRange.map(player => {
      return player.rank === dragPlayer.rank ?
        {
          ...player,
          tier: droppedOn,
          rank: playerRange[playerRange.length - 1].rank
        }
        :
        {
          ...player,
          rank: player.rank - 1
        }
    })
  };
  // check to see if dragging player DOWN
  if (dragPlayer.rank < droppedOn.rank) {
    // grab an array of the players to be modified...
    playerRange = sortedPlayers.slice(dragPlayer.rank - 1, droppedOn.rank);
    newPlayerRanks = playerRange.map((player) => {
      return player.rank === dragPlayer.rank
        ? {
            ...player,
            tier: droppedOn.tier,
            rank: droppedOn.rank,
          }
        : {
            ...player,
            rank: player.rank - 1,
          };
    });
  };
  // check to see if dragging player UP
  if (dragPlayer.rank > droppedOn.rank) {
    // grab an array of the players to be modified...
    playerRange = sortedPlayers.slice(droppedOn.rank - 1, dragPlayer.rank);
    newPlayerRanks = playerRange.map((player) => {
      return player.rank === dragPlayer.rank
        ? {
            ...player,
            tier: droppedOn.tier,
            rank: droppedOn.rank,
          }
        : {
            ...player,
            rank: player.rank + 1,
          };
    });
  };
  return newPlayerRanks
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