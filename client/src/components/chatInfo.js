import React from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Moment from 'react-moment';
import {deleteMessages } from '../actions/chatActions'

class ChatInfo extends React.Component {
    render() {
        const {isAuth,currentChat,user,isLoading,chatsLoading,focused} = this.props;

        return (
            <div className="chat-info">
                {(!currentChat !== 0 && !isLoading) ? (
                <div>
                    <div className="vert-center">
                    <div className="chat-friend">
                        {(currentChat.sender._id === user._id) ? currentChat.talker.username : currentChat.sender.username}
                    </div>

                    <div className="chat-friend-online">
                        {(currentChat.sender._id === user._id) 
                            ? (currentChat.talker.isOnline) ?  (<div className="online-text">Online</div>) : (<div className="time-age">(online <Moment fromNow>{currentChat.talker.lastOnlineDate}</Moment>)</div> )
                            : (currentChat.sender.isOnline) ?  (<div className="online-text">Online</div>) : (<div className="time-age">(online <Moment fromNow>{currentChat.sender.lastOnlineDate}</Moment>)</div>)
                        }
                    </div>
                    </div>

                    {(focused.length > 0) && (
                    <div className="chat-focused">
                        <div className="chat-focused-count">
                            Selected: {focused.length}
                        </div>

                        <div onClick={()=>{this.props.deleteMessages(this.props.focused,this.props.socket)}} className="focused-btn"></div>
                    </div>
                    )}

                </div>
                )
                : (
                    <div></div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuthenticated,
    currentChat: state.chat.currentChat,
    isLoading: state.auth.isLoading,
    chatsLoading: state.chat.chatsLoading,
    user: state.auth.user,
    focused: state.chat.focused
})

export default withRouter(connect(mapStateToProps, {deleteMessages})(ChatInfo));