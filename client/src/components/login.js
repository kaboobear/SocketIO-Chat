import React from 'react';
import { withRouter } from 'react-router-dom';
import { login } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class Login extends React.Component {
  state = {
    mail: '',
    pass: '',
    msg: {},
  };

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      username: this.state.mail,
      password: this.state.pass,
    };

    this.props.login(loginData);
  };

  componentDidUpdate(prevProps) {
    if (this.props.isAuth === true) {
      this.props.clearErrors();
      return this.props.history.push('/');
    }

    const error = this.props.error;
    if (error !== prevProps.error) {
      if (error.id === 'LOGIN_FAIL') this.setState({ msg: error.msg });
      else this.setState({ msg: {} });
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  render() {
    return (
      <div className="login-section">
        <div className="flex-wrap center">
          <div className="login-wrap">
            <div className="login-buttons">
              <div className="login-button-wrap">
                <NavLink className="login-button" to="/login">
                  Login
                </NavLink>
              </div>

              <div className="login-button-wrap">
                <NavLink className="login-button" to="/register">
                  Register
                </NavLink>
              </div>
            </div>

            <form
              onSubmit={this.onSubmit}
              className="add-form"
              autoComplete="off"
            >
              <div className="simple-input">
                <input
                  type="text"
                  name="mail"
                  placeholder="Mail"
                  value={this.state.mail}
                  onChange={this.onChange}
                  className={this.state.msg.mail && 'error'}
                />{' '}
                {this.state.msg.mail && (
                  <div className="exclam">
                    <img src="img/exclam-ico.png" alt="" />
                  </div>
                )}
              </div>

              <div className="simple-input">
                <input
                  type="password"
                  name="pass"
                  placeholder="Password"
                  value={this.state.pass}
                  onChange={this.onChange}
                  className={this.state.msg.pass && 'error'}
                />{' '}
                {this.state.msg.pass && (
                  <div className="exclam">
                    <img src="img/exclam-ico.png" alt="" />
                  </div>
                )}
              </div>

              <button type="submit" className="btn">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuthenticated,
  error: state.error,
});

export default withRouter(
  connect(mapStateToProps, { login, clearErrors })(Login),
);
