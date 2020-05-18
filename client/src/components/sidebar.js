import React from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
import {getUsers, logout, changeUser} from '../actions/authActions'
import {changeChat,addChat,getChats} from '../actions/chatActions'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

class Sidebar extends React.Component {
    componentDidMount(){
        this.props.getChats(this.props.user._id);
    }

    joinChat(chat) {
        this.props.changeChat(chat, this.props.socket, this.props.user._id,this.props.currentChat);
    }

    addChat(friendId){
        const currentId = this.props.user._id;
        this.props.addChat({friendId,currentId})
    }

    logoutFun() {
        this.props.logout();
        this.props.socket.emit('UserIsLoggedOut', {user:this.props.user,current_chat:this.props.currentChat});
    }

    isFriend(user_id){
        let isFriend = false;
        this.props.chats.forEach((elem,id)=>{
            const friend_id = (elem.sender._id === this.props.user._id) ? elem.talker._id : elem.sender._id;
            (user_id === friend_id) && (isFriend = true)
        })

        return isFriend;
    }

    render() {
        const {
            users,
            usersLoading,
            chatsLoading,
            user,
            isAuth,
            isLoading,
            currentChat,
            chats
        } = this.props;

        return (
            <div className="chat-sidebar">
                <ul className="user-block">
                    {(isLoading === false) && (!isAuth)
                        ? (
                            <span>
                                <li>
                                    <NavLink exact className="btn simple" to="/login">Login</NavLink>
                                </li>
                                <li>
                                    <NavLink exact className="btn simple" to="/register">Register</NavLink>
                                </li>
                            </span>
                        )
                        : (
                            <span>
                                <li>
                                    <h3 className="user-title">
                                        {(isAuth) && user.username}
                                    </h3>
                                </li>

                                <li>
                                    <div onClick={()=>{this.logoutFun()}} className="btn simple">Logout</div>
                                </li>
                            </span>
                        )}
                </ul>


                        <Tabs>
                        <TabList className="tab-buttons">
                            <Tab className="tab-button" selectedClassName="tab-button-active">Friends</Tab>
                            <Tab className="tab-button" selectedClassName="tab-button-active">World</Tab>
                        </TabList>
    
                        <TabPanel
                            className="tab-content friends"
                            selectedClassName="tab-content-active">
                        {(!chatsLoading && !isLoading)
                            ? (
                                (chats.length === 0) 
                                ? (<div className="empty-list">List is Empty</div>)
                                :(
                                (chats.map(elem => (
                                <div key={elem._id} className={`friend-item ${(currentChat !== 0) && (elem._id === currentChat._id) ? 'active' : ''}`} onClick={() => {this.joinChat(elem)}}>
                                    <div className="friend-name">
                                        {(elem.sender._id === user._id) ? elem.talker.username : elem.sender.username}
                                    </div>

                                    {(elem.sender._id === user._id) 
                                        ? (elem.talker.isOnline) &&  (<div className="online-mark"></div>)
                                        : (elem.sender.isOnline) &&  (<div className="online-mark"></div>)
                                    }

                                    {(elem.sender._id === user._id) 
                                        ? (elem.unreadTalkerMessages > 0) &&  (<div className="unread-count">{elem.unreadTalkerMessages}</div>)
                                        : (elem.unreadSenderMessages > 0) &&  (<div className="unread-count">{elem.unreadSenderMessages}</div>)
                                    }
                                       
                                </div>    
                                ))))
                                )
                            :(
                                <div></div>
                            )}
                        </TabPanel>


                        <TabPanel className="world tab-content" selectedClassName="tab-content-active">
                        {(usersLoading || chatsLoading)
                            ? (
                                <div></div>
                            )
                            : (
                                (users.length === 1) 
                                ? (<div className="empty-list">List is Empty</div>)
                                :(
                                    (users.map(elem => ((elem._id != user._id) && 
                                        <div key={elem._id} className={`friend-item ${this.isFriend(elem._id) ? 'friend' : ''}`} onClick={() => {(!this.isFriend(elem._id)) &&this.addChat(elem._id)}}>
                                            <div className="friend-name">
                                                {elem.username}
                                            </div>

                                            {elem.isOnline && (
                                                <div className="online-mark"></div>
                                            )}
                                        </div>    
                        )))))}
                        </TabPanel>
                    </Tabs>
                                    
}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    users: state.auth.users,
    usersLoading: state.auth.usersLoading,
    chatsLoading: state.chat.chatsLoading,
    isAuth: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    currentChat: state.chat.currentChat,
    chats: state.chat.chats
})

export default withRouter(connect(mapStateToProps, {getUsers, logout, changeUser, changeChat, addChat,getChats})(Sidebar));