const INITIAL_STATE = {
  user: {},
  // determine if PROD or DEV env, and set API routes accordingly
  routes: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 
  // DEV ROUTES
  {
    signin: 'http://localhost:3000/signin',
    signup: 'http://localhost:3000/signup',
    profile: 'http://localhost:3000/profile/',
    draftboard: 'http://localhost:3000/draftboard',
    addPlayer: 'http://localhost:3000/addplayer',
    removePlayer: 'http://localhost:3000/removeplayer',
    updateMyPlayers: 'http://localhost:3000/updatemyplayers'
  } 
  :
  // PRODUCTION ROUTES 
  {
    signin: 'https://limitless-reaches-84398.herokuapp.com/signin',
    signup: 'https://limitless-reaches-84398.herokuapp.com/signup',
    profile: 'https://limitless-reaches-84398.herokuapp.com/profile/',
    draftboard: 'https://limitless-reaches-84398.herokuapp.com/draftboard',
    addPlayer: 'https://limitless-reaches-84398.herokuapp.com/addplayer',
    removePlayer: 'https://limitless-reaches-84398.herokuapp.com/removeplayer',
    updateMyPlayers: 'https://limitless-reaches-84398.herokuapp.com/updatemyplayers' 
  })
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      }
    case 'SET_ROUTES':
      return {
        ...state,
        routes: action.payload
      }
    default:
      return state;
  }
};

export default userReducer;