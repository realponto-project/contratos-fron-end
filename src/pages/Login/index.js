import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";

import "./index.css";

import { login } from "../../services/login";
import { onSubmit } from "./LoginRedux/action";

class LoginPage extends Component {
  state = {
    email: "",
    password: ""
  };

  onChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = async () => {
    const { email, password } = this.state;

    const value = { email, password };

    console.log(value);
    const { status, data } = await login(value);

    if (status === 200) {
      console.log(data);
      await this.props.onSubmit(data);
    }
  };

  render() {
    console.log(this.props.login);
    return (
      <>
        {this.props.login.token && <Redirect to="/logged/dash" />}
        <div className="App">
          <aside className="App-aside">
            <div className="App-container-inputs-login">
              <div className="App-block-inputs-login">
                <label>email</label>
                <input
                  onChange={this.onChange}
                  autoFocus
                  name="email"
                  required
                  value={this.state.email}
                />
              </div>
              <div className="App-block-inputs-login">
                <label>password</label>
                <input
                  onChange={this.onChange}
                  name="password"
                  type="password"
                  required
                  value={this.state.password}
                />
              </div>
            </div>
            <button onClick={this.handleSubmit} type="submit">
              Salvar
            </button>
          </aside>
        </div>
      </>
    );
  }
}

// export default LoginPage

function mapDispacthToProps(dispach) {
  return bindActionCreators({ onSubmit }, dispach);
}

function mapStateToProps(state) {
  return {
    login: state.login
  };
}

export default connect(mapStateToProps, mapDispacthToProps)(LoginPage);
