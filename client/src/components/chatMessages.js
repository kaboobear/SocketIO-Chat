import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { getUsers } from '../actions/authActions';
import { focusMessage } from '../actions/chatActions';
import Scrollbars from 'react-custom-scrollbars';

class ChatMessages extends React.Component {
  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.refs.scrollbars.scrollToBottom({});
  }

  focus(id) {
    this.props.focusMessage(id);
  }

  render() {
    const { user, messages, chatsIsLoading } = this.props;

    return (
      <Scrollbars ref="scrollbars" className="chat-messages">
        {chatsIsLoading ? (
          <div></div>
        ) : messages.length === 0 ? (
          <div className="empty-chat">Chat is empty</div>
        ) : (
          messages.map((elem) => (
            <div
              key={elem._id}
              className={`message-item ${
                elem.author._id !== user._id ? 'friend ' : ''
              } ${this.props.focused.includes(elem._id) ? 'focused ' : ''}`}
              onClick={() => {
                this.focus(elem._id);
              }}
            >
              <div className="message-body">
                <div className="message-top">
                  <div className="message-user">{elem.author.username}</div>
                </div>

                <div className="message-text">{elem.message}</div>
              </div>

              <div className="message-time">
                <Moment format="HH:mm">{elem.createdAt}</Moment>
              </div>
            </div>
          ))
        )}
      </Scrollbars>
    );
  }
}

const mapStateToProps = (state) => ({
  chatsIsLoading: state.chat.isLoading,
  messages: state.chat.messages,
  user: state.auth.user,
  currentChat: state.chat.currentChat,
  focused: state.chat.focused,
});

export default withRouter(
  connect(mapStateToProps, { getUsers, focusMessage })(ChatMessages),
);
