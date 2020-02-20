import React, { Component } from "react";
import "./index.css";
import { Spin, Icon, Switch } from "antd";

class GerenciarUsuario extends Component {
  state = {
    loading: false,
    total: 10,
    count: 0,
    page: 3
  };

  TableIgpm = () => (
    <div className="div-table">
      <div className="div-main-table">
        <div className="div-line-table">
          <label className="label-nome-troll">NOME</label>
          <label className="label-troll-troll">TROLL</label>
          <label className="label-button-troll">MÁGICA</label>
        </div>
      </div>
      <div className="div-lineMain-table">
        <div className="div-line-table">
          <label className="label-nome-troll">TROUXA</label>
          <label className="label-troll-troll">
            <Icon type="close-circle" style={{ color: "red" }} />
          </label>
          <div className="label-button-troll">
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  Pages = () => (
    <div className="div-pages">
      {Math.ceil(this.state.count / this.state.total) >= 5 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 1 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 4)}
        >
          {this.state.page - 4}
        </button>
      ) : null}
      {Math.ceil(this.state.count / this.state.total) >= 4 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 2 &&
      this.state.page > 3 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 3)}
        >
          {this.state.page - 3}
        </button>
      ) : null}
      {this.state.page >= 3 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 2)}
        >
          {this.state.page - 2}
        </button>
      ) : null}
      {this.state.page >= 2 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page - 1)}
        >
          {this.state.page - 1}
        </button>
      ) : null}
      <div className="div-teste">{this.state.page}</div>
      {this.state.page < this.state.count / this.state.total ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 1)}
        >
          {this.state.page + 1}
        </button>
      ) : null}
      {this.state.page + 1 < this.state.count / this.state.total ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 2)}
        >
          {this.state.page + 2}
        </button>
      ) : null}
      {this.state.page + 2 < this.state.count / this.state.total &&
      this.state.page < 3 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 3)}
        >
          {this.state.page + 3}
        </button>
      ) : null}
      {this.state.page + 3 < this.state.count / this.state.total &&
      this.state.page < 2 ? (
        <button
          className="button-salvar"
          type="primary"
          onClick={() => this.changePages(this.state.page + 4)}
        >
          {this.state.page + 4}
        </button>
      ) : null}
    </div>
  );

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Gerenciar Usuario</h1>
        </div>

        {this.state.loading ? (
          <div className="div-spin">
            <Spin />
          </div>
        ) : (
          <this.TableIgpm />
        )}
        <div className="div-main-pages">
          <this.Pages />
        </div>
      </div>
    );
  }
}

export default GerenciarUsuario;
