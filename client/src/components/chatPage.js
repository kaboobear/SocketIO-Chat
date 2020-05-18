import React, {Component} from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';

import Sidebar from './sidebar';
import ChatMessages from './chatMessages'
import ChatForm from './chatForm'
import ChatInfo from './chatInfo'

import {addMessage, updateChat,deleteLocal} from '../actions/chatActions'
import {getUsers, changeUser} from '../actions/authActions'

class ChatPage extends Component {
    state = {
        socket: io("http://localhost:5000")
    }

    componentDidMount() {
        this
            .state
            .socket
            .emit('UserIsLogged', this.props.user)

        this
            .state
            .socket
            .on('OtherUserIsLogged', data => {
                this
                    .props
                    .changeUser(data);
            })

        this
            .state
            .socket
            .on('OtherUserIsLoggedOut', data => {
                this
                    .props
                    .changeUser(data);
            })

        this
            .state
            .socket
            .on('MessageIsAdded', data => {
                if(data.newMessageData.chat === this.props.currentChat._id) this.props.addMessage(data.newMessageData);
            })

        this
            .state
            .socket
            .on('MessageIsDeleted', data => {
                this.props.deleteLocal(data);
            })

        this
            .state
            .socket
            .on('RenewUnread', data => {
                if(this.props.currentChat._id !== data.newChatData._id) this.props.updateChat(data.newChatData);
            })

        this
            .props
            .getUsers();

        window.addEventListener("beforeunload", () => this.state.socket.emit('UserIsLoggedOut', {user:this.props.user,current_chat:this.props.currentChat}));
    }

    render() {
        const {currentChat} = this.props;

        return (
            <div className="chat-wrap">
                <Sidebar socket={this.state.socket}/> {(currentChat !== 0)
                    ? (
                        <div className="chat">
                            <ChatInfo socket={this.state.socket}/>
                            <ChatMessages socket={this.state.socket}/>
                            <ChatForm socket={this.state.socket}/>
                        </div>
                    )
                    : (
                        <div className="chat no-chat">Choose your chat</div>
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({currentChat: state.chat.currentChat, user: state.auth.user})

export default connect(mapStateToProps, {getUsers, changeUser, addMessage, updateChat, deleteLocal})(ChatPage);