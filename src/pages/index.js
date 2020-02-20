import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { Logout, onSubmit } from "./Login/LoginRedux/action";

// import moment from "moment";

import Dash from "./Dash";
import UserRoute from "./Gerenciar/Usuario";
import NewClientRoute from "./Cadastros/Cliente";
import NewItemRoute from "./Cadastros/Item";
import NewContratosRoute from "./Cadastros/Contratos";
import NewIgpmRoute from "./IGPM/AdicionarIGPM";
import DashIgpmRoute from "./IGPM/GerenciarIGPM";
import DashConsultaRoute from "./Consulta/GerenciarConsulta";
import HistoricoRoute from "./Historico";
import RelatorioItensRoute from "./Relatorios/Itens";
import RelatorioCadastroRoute from "./Relatorios/Cadastro";
import GerenciarUsuarioRoute from "./MOD/Usuario";

import { VerifyTroll } from "../services/user";

class PagesRoute extends Component {
  state = {
    auth: true
  };

  componentDidMount = async () => {
    await promisify(jwt.verify)(
      this.props.login.token,
      // this.props.login.token,
      "%dfsJd"
    )
      .then(resp => {
        VerifyTroll({ id: resp.id }).then(user => {
          if (
            user.status === 200 &&
            user.data &&
            user.data.troll !== this.props.login.user.troll
          ) {
            // console.log(this.props.login.user.troll);
            this.props.onSubmit({
              user: {
                ...this.props.login.user,
                troll: !this.props.login.user.troll
              }
            });
          }
        });
      })
      .catch(error => {
        console.log(error);
        this.props.Logout();
      });
  };

  render() {
    if (this.props.login.token) {
      return (
        <Switch>
          <Route exact path="/logged/dash" component={Dash} />
          <Route exact path="/logged/user/dash" component={UserRoute} />
          <Route
            exact
            path="/logged/newClient/add"
            component={NewClientRoute}
          />
          <Route exact path="/logged/newItem/add" component={NewItemRoute} />
          <Route
            exact
            path="/logged/newContrato/add"
            component={NewContratosRoute}
          />
          <Route
            exact
            path="/logged/dashConsulta/dash"
            component={DashConsultaRoute}
          />
          <Route exact path="/logged/newIgpm/add" component={NewIgpmRoute} />
          <Route exact path="/logged/dashIgpm/dash" component={DashIgpmRoute} />
          <Route exact path="/logged/history/dash" component={HistoricoRoute} />
          <Route
            exact
            path="/logged/relatorioItens/dash"
            component={RelatorioItensRoute}
          />
          <Route
            exact
            path="/logged/relatorioCadastro/dash"
            component={RelatorioCadastroRoute}
          />
          <Route
            exact
            path="/logged/dashUsuario/dash"
            component={GerenciarUsuarioRoute}
          />
        </Switch>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ Logout, onSubmit }, dispach);
}

function mapStateToProps(state) {
  return {
    login: state.login
  };
}

export default connect(mapStateToProps, mapDispacthToProps)(PagesRoute);
