import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT_SUCCESS,
    USERS_LOADED,
    USERS_LOADING,
    CHANGE_USER,
} from '../actions/types'

const initialState = {
    user: {},
    users: [],
    isAuthenticated: false,
    isLoading: false,
    usersLoading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case CHANGE_USER:
            return {
                ...state,
                users: state
                    .users
                    .map(elem => {
                        if (elem._id === action.payload._id) 
                            return action.payload;
                        else 
                            return elem;
                        }
                    )
            }
        case USERS_LOADING:
            return {
                ...state,
                usersLoading: true
            }
        case USER_LOADED:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload
            }
        case USERS_LOADED:
            return {
                ...state,
                usersLoading: false,
                users: action.payload
            }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                isAuthenticated: true
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: {}
            }
        default:
            return state
    }
}