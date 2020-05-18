import React from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

class ChatForm extends React.Component {
    state = {
        chatText: '',
        interval:null
    }

    componentWillMount(){
        this.setState({interval:setInterval(()=>{
            this._input.focus();
        },1000)})
    }

    componentWillUnmount(){
        clearInterval(this.state.interval);
    }

    onChange = (e) => {
        const {value, name} = e.target;
        this.setState({[name]: value})
    }

    onSubmit = (e) => {
        e.preventDefault();
        const current_chat = this.props.currentChat;
        const author = this.props.user

        this.props.socket.emit('MessageIsSent', {current_chat, author, message: this.state.chatText})
        this.setState({chatText: ''})
    }

    render() {
        return (
            <form onSubmit={(e)=>{this.onSubmit(e)}} className="chat-form">
                <div className="simple-input">
                    <input
                        ref={c => (this._input = c)}
                        autoComplete="off"
                        type="text"
                        placeholder="Type message..."
                        name="chatText"
                        value={this.state.chatText}
                        onChange={this.onChange}/>
                </div>

                <button type="submit" className="btn">
                    
                </button>
            </form>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    currentChat: state.chat.currentChat
})

export default withRouter(connect(mapStateToProps, {})(ChatForm));