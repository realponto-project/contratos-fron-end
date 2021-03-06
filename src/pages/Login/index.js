/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";

import "./index.css";

import { message } from "antd";

import { login } from "../../services/login";
import { onSubmit } from "./LoginRedux/action";

class LoginPage extends Component {
  state = {
    email: "",
    password: "",
    message: "",
    fieldError: ""
  };

  onChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  error = () => {
    message.error(this.state.message, this.configuracaoError);
  };

  configuracaoError = message.config({
    top: 10,
    duration: 2,
    maxCount: 3,
    rtl: true,
    className: "message-error"
  });

  enterKey = async e => {
    if (e.which === 13 || e.keyCode === 13) {
      const { email, password } = this.state;

      const value = { email, password };

      const { status, data } = await login(value);

      if (status === 200) {
        await this.props.onSubmit(data);
      }
      if (status === 401) {
        this.setState(data);
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
    if (status === 401) {
      this.setState(data);
    }
  };

  onFocus = () => {
    this.setState({
      message: "",
      fieldError: ""
    });
  };

  render() {
    return (
      <>
        {this.props.login.token && <Redirect to="/logged/dash" />}
        <div className="App">
          <aside className="App-aside">
            <div className="App-container-inputs-login">
              <div className="div-contrato">Conecte-se</div>
              <div className="App-block-inputs-login">
                <label style={{ textTransform: "none", fontSize: "14px" }}>
                  E-mail
                </label>
                <input
                  onChange={this.onChange}
                  onFocus={this.onFocus}
                  autoFocus
                  style={{
                    textTransform: "none"
                  }}
                  name="email"
                  required
                  value={this.state.email}
                  placeholder="Digite seu email"
                  onKeyPress={this.enterKey}
                  className={
                    this.state.fieldError === "email"
                      ? "input-login-error"
                      : "App-block-inputs-login"
                  }
                />
                {this.state.fieldError === "email" && this.error()}
              </div>
              <div className="App-block-inputs-login">
                <label style={{ textTransform: "none", fontSize: "14px" }}>
                  Senha
                </label>
                <input
                  style={{
                    textTransform: "none"
                  }}
                  onFocus={this.onFocus}
                  onBlur={this.onFocus}
                  onChange={this.onChange}
                  name="password"
                  type="password"
                  required
                  value={this.state.password}
                  placeholder="Digite sua senha"
                  onKeyPress={this.enterKey}
                  className={
                    this.state.fieldError === "password"
                      ? "input-login-error"
                      : "App-block-inputs-login"
                  }
                />
                {this.state.fieldError === "password" && this.error()}
              </div>
              <div className="div-button-login">
                <button onClick={this.handleSubmit} type="submit">
                  Conectar
                </button>
              </div>
            </div>
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
