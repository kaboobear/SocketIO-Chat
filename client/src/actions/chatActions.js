import {MESSAGES_LOADING, MESSAGES_LOADED, ADD_MESSAGE, CHANGE_CHAT, ADD_CHAT, CHATS_LOADING, CHATS_LOADED,UPDATE_CHAT,FOCUS_MESSAGE,DELETE_MESSAGE} from '../actions/types';
import axios from 'axios';

export const getMessages = (chat_id) => (dispatch) => {
    dispatch({type: MESSAGES_LOADING});

    axios
        .post('/chat',{chat_id})
        .then(res => {
            return dispatch({type: MESSAGES_LOADED, payload: res.data})
        })
}

export const getChats = (user_id) => (dispatch) => {
    dispatch({type: CHATS_LOADING});

    axios
        .post('/chat/getChats',{user_id})
        .then(res => {
            return dispatch({type: CHATS_LOADED, payload: res.data})
        })
}

export const addMessage = (data) => {
    return({type: ADD_MESSAGE, payload: data})
}

export const focusMessage = (id) => {
    return({type: FOCUS_MESSAGE, payload: id})
}


export const addChat = (chatInfo) => (dispatch) => {
    axios.post('/chat/addChat',chatInfo).then(res=>{
        dispatch({type: ADD_CHAT, payload: res.data})
    })
}

export const updateChat = (chat)=> {
    return ({type: UPDATE_CHAT, payload: chat})
}

export const changeUnread = (chat,user_id) => (dispatch) =>{
    axios.post('/chat/changeUnread',{chat,user_id}).then(res=>{
        dispatch({type: UPDATE_CHAT, payload: res.data})
    })
}

export const deleteMessages = (arr,socket) => (dispatch) =>{
    axios.post('/chat/deleteMessages',arr).then(res=>{
        socket.emit('DeleteMessages', arr)
        dispatch({type: DELETE_MESSAGE, payload: arr})
    })
}

export const deleteLocal = (arr) =>{
        return ({type: DELETE_MESSAGE, payload: arr})
}

export const changeChat = (chat,socket,user_id,current_chat) => (dispatch) => {
        if(current_chat !== 0) dispatch(changeUnread(current_chat,user_id));
        dispatch({type: CHANGE_CHAT, payload: chat});
        socket.emit("JoinUser",chat._id);

        dispatch(changeUnread(chat,user_id));
        dispatch(getMessages(chat._id));
}