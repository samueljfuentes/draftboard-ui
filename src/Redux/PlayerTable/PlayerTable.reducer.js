// *** STATE ***
const INITIAL_STATE = {
  allPlayers: [],
  myPlayers: [],
  draggedPlayer: {},
  isProfileOpen: false,
  isMyPlayers: false,
  isAsc: true,
  orderBy: "tier",
  tiers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  position: "QB",
  positionTabs: [
    {id: "QB"},
    {id: "RB"},
    {id: "WR"},
    {id: "TE"}
  ],
  headerCells: [
    {id: "del", label: "Delete"},
    { id: "tier", label: "Tier" },
    { id: "rank", label: "Rank" },
  ]
};

// *** REDUCER ***
const playerTableReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_POSITION':
      return {
        ...state,
        position: action.payload
      }
    case 'UPDATE_SORT_ORDER':
      return {
        ...state,
        isAsc: action.payload,
        tiers: state.tiers.reverse()
      }
    case 'UPDATE_ALL_PLAYERS':
      return {
        ...state,
        allPlayers: action.payload.allPlayers,
        myPlayers: action.payload.myPlayers
      }
    case 'UPDATE_ALL_PLAYERS_LIST':
      return {
        ...state,
        allPlayers: action.payload
      }
    case 'UPDATE_MY_PLAYERS_LIST':
      return {
        ...state,
        myPlayers: action.payload
      }
    case 'TOGGLE_MY_PLAYERS':
      return {
        ...state,
        isMyPlayers: action.payload
      }
    case 'TOGGLE_PROFILE':
      return {
        ...state,
        isProfileOpen: action.payload
      }
    default:
      return state;
  }
}

export default playerTableReducer;