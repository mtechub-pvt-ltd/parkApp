import { SET_USER_NAME,SET_USER_ID, SET_APP_THEME,SET_MAP_THEME,SET_USER_TOKEN,SET_LOCATION_ID,SET_ROUTE } from './actions';

const initialState = {
    name: '',
   theme:'',
   id:'',
   maptheme:'',
   token:'',
   locationid:'',
   routeid:''
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER_NAME:
            return { ...state, name: action.payload };
            case SET_USER_ID:
                return { ...state, id: action.payload };
                case SET_USER_TOKEN:
                    return { ...state, token: action.payload };
        case SET_APP_THEME:
            return { ...state, theme: action.payload };
            case SET_MAP_THEME:
                return { ...state, maptheme: action.payload };
                case SET_LOCATION_ID:
                    return { ...state, locationid: action.payload };
                    case SET_ROUTE:
                        return { ...state, routeid: action.payload };
        default:
            return state;
    }
}

export default userReducer;