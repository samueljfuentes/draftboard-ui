import React from 'react';
import { connect } from 'react-redux';

import { updateAllPlayers, updateMyPlayersList, updateAllPlayersList } from "../../Redux/PlayerTable/PlayerTable.actions";

import Header from '../../Components/Header/Header.component';
import PositionNav from '../../Components/TablePositionNav/TablePositionNav.component';
import HeaderCells from '../../Components/TableHeaderCells/TableHeaderCells.component';
import AllPlayers from '../../Components/TableAllPlayers/TableAllPlayers.component';
import MyPlayers from '../../Components/TableMyPlayers/TableMyPlayers.component';

import './PlayerTable.styles.scss';


const mapState = (state) => {
  return {
    user: state.user.user,
    allPlayers: state.playerTable.allPlayers,
    myPlayers: state.playerTable.myPlayers,
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
    
    const allPlayers = await this.getPlayerLists();  
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

  // SORTING FUNCTIONS...
  sortByRanks = (isAsc) => (players) => {
    const sortedPlayers = players.sort((a, b) => {
      if (isAsc) {
        if (a.tier < b.tier || (a.tier === b.tier && a.rank < b.rank)) {
          return -1;
        } else if (a.tier > b.tier || (a.tier === b.tier && a.rank > b.rank)) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (a.tier < b.tier || (a.tier === b.tier && a.rank > b.rank)) {
          return 1;
        } else if (a.tier > b.tier || (a.tier === b.tier && a.rank < b.rank)) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    return sortedPlayers;
  };

  sortByTiers = (isAsc) => (players) => {
    const tier1 = [],
      tier2 = [],
      tier3 = [],
      tier4 = [],
      tier5 = [],
      tier6 = [],
      tier7 = [],
      tier8 = [],
      tier9 = [],
      tier10 = [];

    // group all players in proper tier array
    players.forEach((player) => {
      switch (player.tier) {
        case 1:
          return tier1.push(player);
        case 2:
          return tier2.push(player);
        case 3:
          return tier3.push(player);
        case 4:
          return tier4.push(player);
        case 5:
          return tier5.push(player);
        case 6:
          return tier6.push(player);
        case 7:
          return tier7.push(player);
        case 8:
          return tier8.push(player);
        case 9:
          return tier9.push(player);
        case 10:
          return tier10.push(player);
        default:
          break;
      }
    });

    return isAsc
      ? [tier1, tier2, tier3, tier4, tier5, tier6, tier7, tier8, tier9, tier10].flat()
      : [tier10, tier9, tier8, tier7, tier6, tier5, tier4, tier3, tier2, tier1].flat();
  };

  sortByPosition = (position) => (players) => {
    const sortedPlayers = players.filter(
      (player) => player.position === position
    );
    return sortedPlayers;
  };

  // pipe the sort functions together (top/left -> btm/right), and pass the players as init value
  pipeSortedPlayers = (...allSortCategories) => (players) => {
    return allSortCategories.reduce(
      (acc, currentFunc) => currentFunc(acc),
      players
    );
  };

  // sorts players by position and order, then passes the return value of each func down the chain
  sortPlayers = (position, isAsc) => {
    return this.pipeSortedPlayers(
      this.sortByPosition(position),
      this.sortByTiers(isAsc),
      this.sortByRanks(isAsc)
    );
  };

  // DRAG-N-DROP FUNCTIONS...
  dragStart = (playerName) => {
    this.changeDraggedPlayer(playerName);
  };

  allowDrop = (event) => {
    event.preventDefault();
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
  getPlayerLists = async () => {
    const token = window.sessionStorage.getItem('token');
    let players = await fetch('http://localhost:3000/draftboard', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': token
      },
      body: JSON.stringify({...this.props.user})
    }).then(data => data.json()).catch(e => null);
    const newPlayers = this.compareLists(players.myPlayers[0].playerlist, players.allPlayers);
    
    return {
      myPlayers: players.myPlayers,
      allPlayers: newPlayers
    };
  };

  addPlayer = async (clickEvent) => {
    // get the name of the player being added...
    const nodeValue = clickEvent.currentTarget.parentNode.previousSibling.textContent;
    const playerJersey = nodeValue.slice(nodeValue.indexOf('(') + 2, nodeValue.length - 1);
    const playerName = nodeValue.slice(0, nodeValue.indexOf('(') - 1);
    const allPlayers = this.sortByPosition(this.props.position)(this.props.allPlayers); // dont sort by position
    // determine player object...
    const player = allPlayers.filter(player => player.displayName === playerName && player.jersey === parseInt(playerJersey));
    let username;
    this.props.user.userid ? username = this.props.user.username : username = "guest";
    // send player in post...
    try {
      if (username === "guest") {
        // add to session storage/state...
        return
      }
      else {
        // update user list...
        // add player to my player list and return updated list...
        let response = await fetch('http://localhost:3000/addplayer', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': window.sessionStorage.getItem('token')
          },
          body: JSON.stringify({
            username,
            player: {...player[0]}
          })
        });
        let players = await response.json();
        this.props.updateMyPlayersList(players);
        console.log(allPlayers)
        this.removeFromAllPlayers(player[0], allPlayers);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  removeFromAllPlayers = (player, allPlayers) => {
    const newAllPlayers = allPlayers.filter(newPlayer => newPlayer.playerId !== player.playerId);
    this.props.updateAllPlayersList(newAllPlayers);
  };

  compareLists = (myPlayers, allPlayers) => {
    const ids = myPlayers.map(player => player.playerId)
    const newAllPlayers = allPlayers.filter(player => !ids.includes(player.playerId));
    return newAllPlayers
  };

  changeDraggedPlayer = (name) => {
    const { position, isAsc, myPlayers } = this.props;
    const sortedPlayers = this.sortPlayers(position, isAsc)(myPlayers);
    // narrow the list of players to current position; determine which player is being dragged
    const newDraggedPlayer = sortedPlayers.filter(
      (player) => name.includes(player.displayName)
    );
    this.setState({ draggedPlayer: newDraggedPlayer[0] });
  };

  replacePlayer = (name = "") => {
    console.log('replacing player...')

    if (!name || name.includes('TIER:')) {
      // this.setState({ replacedPlayer: {} });
      return;
    }
    // if drop player name is different than name of current drag player, update replace player...
    else if (name !== this.state.draggedPlayer.displayName) {
      const { position, isAsc, myPlayers } = this.props;
      const sortedPlayers = this.sortPlayers(position, isAsc)(myPlayers);
      const newReplacedPlayer = sortedPlayers.filter(
        (player) => name.includes(player.displayName)
      );
      console.log(newReplacedPlayer);
      console.log(this.state.draggedPlayer);
      this.refreshPlayerOrder(this.state.draggedPlayer, newReplacedPlayer[0]);
    }
    // default: do nothing
    else {
      return
    }
  };

  refreshPlayerOrder = (dragPlayer, rplcPlayer) => {
    const { position, isAsc, myPlayers } = this.props;
    const sortedPlayers = this.sortPlayers(position, isAsc)(myPlayers);
    let myPlayerList = [...myPlayers]; // create new all players array to modify and send to state
    let playerRange; // array of players who's ranking are affected
    let newPlayerRanks; // array with updated rankings for players who are modified

    // check to see if dragging player DOWN
    if (dragPlayer.rank < rplcPlayer.rank) {
      // grab an array of the players to be modified...
      playerRange = sortedPlayers.slice(dragPlayer.rank - 1, rplcPlayer.rank);
      newPlayerRanks = playerRange.map((player) => {
        return player.rank === dragPlayer.rank
          ? {
              ...player,
              tier: rplcPlayer.tier,
              rank: rplcPlayer.rank,
            }
          : {
              ...player,
              rank: player.rank - 1,
            };
      });
    }
    // check to see if dragging player UP
    if (dragPlayer.rank > rplcPlayer.rank) {
      // grab an array of the players to be modified...
      playerRange = sortedPlayers.slice(rplcPlayer.rank - 1, dragPlayer.rank);
      newPlayerRanks = playerRange.map((player) => {
        return player.rank === dragPlayer.rank
          ? {
              ...player,
              tier: rplcPlayer.tier,
              rank: rplcPlayer.rank,
            }
          : {
              ...player,
              rank: player.rank + 1,
            };
      });
    }
    // loop through each modified player, determine their index in the main array, and replace each player with modified version
    newPlayerRanks.forEach((newPlayer) => {
      // in the main player array, find the index of each player to replace by matching id's..
      let index = myPlayerList.findIndex(
        (player) => player.playerId === newPlayer.playerId
      );
      // in the main player array, replace each (1) player at the given index with the modified player
      myPlayerList.splice(index, 1, newPlayer);
    });
    // send action...
    this.props.updateMyPlayersList(myPlayerList);
  };

  // PLAYER TABLE COMPONENT...
  render() {
    const { isMyPlayers, allPlayers, myPlayers, position, isAsc } = this.props;
    const mySortedPlayers = this.sortPlayers(position, isAsc)(myPlayers);
    const allSortedPlayers = this.sortByPosition(position)(allPlayers);
    return (
      <>
        <Header isMyPlayers={isMyPlayers} />
        <div className="table__container" id="draft-board">
          <PositionNav />
          <table className="table">
            <thead className="table__header">
              <tr className="table__header--row">
                <th className="table__header--title" scope="column">Player Name</th>
                <HeaderCells isMyPlayers={isMyPlayers} />
              </tr>
            </thead>
            {
              isMyPlayers ? 
              (
                <MyPlayers 
                  myPlayers={mySortedPlayers}
                  dragStart={this.dragStart}
                  allowDrop={this.allowDrop}
                  drop={this.drop}
                  touchDrag={this.touchDrag}
                  touchDrop={this.touchDrop}        
                />
              ) : 
              (
                <AllPlayers 
                  allPlayers={allSortedPlayers}
                  addPlayer={this.addPlayer}
                />
              )
            }
          </table>
        </div>
      </>
    );
  }
}

export default connect(mapState, mapDispatch)(PlayerTable);