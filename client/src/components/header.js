import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {logout} from '../actions/authActions'
import {connect} from 'react-redux'
import io from 'socket.io-client';

class Header extends Component {
    componentDidMount(){
        let server = "http://localhost:5000"
        this.socket = io(server);
    }

    render() {
        const {user,isLoading,isAuth} = this.props;

        return (
            <div className="header-section">
                <div className="container flex-wrap">
                    <NavLink exact className="header-logo" to="/">Template</NavLink>
                    <ul className="header-nav">
                        {(isLoading === false) && 
                            (!isAuth) 
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
                                        <NavLink exact className="btn simple" to="/">Chat</NavLink>
                                    </li>
                                    
                                    <li>
                                        <div onClick={()=>{this.props.logout(); this.socket.emit('UserIsLoggedOut',this.props.user)}} className="btn simple">Logout</div>
                                    </li>
                                </span>
                            )}
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({isAuth: state.auth.isAuthenticated, isLoading: state.auth.isLoading, user: state.auth.user})

export default connect(mapStateToProps, {logout})(Header)