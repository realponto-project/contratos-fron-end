/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";

import "./index.css";

import { Icon } from "antd";

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
              <div className="div-contrato">
                <img src="../retina.png" className="img-Login" />
              </div>
              <div className="App-block-inputs-login">
                <label>Email</label>
                <input
                  onChange={this.onChange}
                  onFocus={this.onFocus}
                  autoFocus
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
                {this.state.fieldError === "email" && (
                  <label className="labelError-login">
                    <Icon
                      type="exclamation-circle"
                      theme="filled"
                      style={{
                        color: "red",
                        marginRight: "5px",
                        fontSize: "18px"
                      }}
                    />
                    {this.state.message}
                  </label>
                )}
              </div>
              <div className="App-block-inputs-login">
                <label>Senha</label>
                <input
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
                {this.state.fieldError === "password" && (
                  <label className="labelError-login">
                    <Icon
                      type="exclamation-circle"
                      theme="filled"
                      style={{
                        color: "red",
                        marginRight: "5px",
                        fontSize: "18px"
                      }}
                    />
                    {this.state.message}
                  </label>
                )}
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
