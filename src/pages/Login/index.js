/* eslint-disable jsx-a11y/alt-text */
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

  enterKey = async e => {
    if (e.which === 13 || e.keyCode === 13) {
      const { email, password } = this.state;

      const value = { email, password };

      const { status, data } = await login(value);

      if (status === 200) {
        await this.props.onSubmit(data);
      }
    }
  };

  handleSubmit = async () => {
    const { email, password } = this.state;

    const value = { email, password };

    const { status, data } = await login(value);

    if (status === 200) {
      await this.props.onSubmit(data);
    }
  };

  render() {
    return (
      <>
        {this.props.login.token && <Redirect to="/logged/dash" />}
        <div className="App">
          <aside className="App-aside">
            <div className="App-container-inputs-login">
              <div className="div-contrato">
                <img src="../retina.png" className="img-Login" />
              </div>
              <div className="App-block-inputs-login">
                <label>Email</label>
                <input
                  onChange={this.onChange}
                  autoFocus
                  name="email"
                  required
                  value={this.state.email}
                  placeholder="Digite seu email"
                  onKeyPress={this.enterKey}
                />
              </div>
              <div className="App-block-inputs-login">
                <label>Senha</label>
                <input
                  onChange={this.onChange}
                  name="password"
                  type="password"
                  required
                  value={this.state.password}
                  placeholder="Digite sua senha"
                  onKeyPress={this.enterKey}
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

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(LoginPage);
