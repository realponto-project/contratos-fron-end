import React, { Component } from "react";
import "./index.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Progress, Button, Input, Select } from "antd";
import { MailOutlined, BellOutlined, EditOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";

import { setItem } from "../../../Relatorios/Cadastro/cadastroRedux/action";
import { GetAllItens } from "../../../../services/item";

const { Option } = Select;

class ItemContainer extends Component {
  state = {
    avancado: false,
    codigo: undefined,
    item: undefined,
    tipo: undefined,
    rows: [],
    total: 10,
    count: 0,
    page: 1,
    show: 0,
    redirect: "",
  };

  getAllItens = async () => {
    const query = {
      filters: {
        item: {
          specific: {
            code: this.state.codigo,
            name: this.state.item,
            type: this.state.tipo,
          },
        },
        page: this.state.page,
        total: this.state.total,
      },
    };

    const { status, data } = await GetAllItens(query);
    console.log(data);
    if (status === 200)
      this.setState({
        rows: data.rows,
        page: data.page,
        count: data.count,
        show: data.show,
      });
  };

  componentDidMount = async () => {
    await this.getAllItens();
  };

  onChange = async (e) => {
    const { name, value } = e.target;

    await this.setState({ [name]: value });
    await this.getAllItens();
  };

  changePages = async (pages) => {
    await this.setState(
      {
        page: pages,
      },
      () => {
        this.getAllItens();
      }
    );
  };

  Pages = () => (
    <div className="div-pages">
      {Math.ceil(this.state.count / this.state.total) >= 5 &&
      Math.ceil(this.state.count / this.state.total) - this.state.page < 1 ? (
        <button
          className="button-paginacao"
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
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 3)}
        >
          {this.state.page - 3}
        </button>
      ) : null}
      {this.state.page >= 3 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 2)}
        >
          {this.state.page - 2}
        </button>
      ) : null}
      {this.state.page >= 2 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page - 1)}
        >
          {this.state.page - 1}
        </button>
      ) : null}
      <button className="button-paginacao-atual" type="primary">
        {this.state.page}
      </button>
      {this.state.page < this.state.count / this.state.total ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 1)}
        >
          {this.state.page + 1}
        </button>
      ) : null}
      {this.state.page + 1 < this.state.count / this.state.total ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 2)}
        >
          {this.state.page + 2}
        </button>
      ) : null}
      {this.state.page + 2 < this.state.count / this.state.total &&
      this.state.page < 3 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 3)}
        >
          {this.state.page + 3}
        </button>
      ) : null}
      {this.state.page + 3 < this.state.count / this.state.total &&
      this.state.page < 2 ? (
        <button
          className="button-paginacao"
          type="primary"
          onClick={() => this.changePages(this.state.page + 4)}
        >
          {this.state.page + 4}
        </button>
      ) : null}
    </div>
  );

  setItemRedux = (item) => {
    const {
      deletedAt,
      id: itemId,
      name,
      costPriceMonthly: custoAnual,
      costPriceYearly: custoMensal,
      type: tipo,
      code: codigo,
      description: descricao,
    } = item;
    this.props.setItem({
      deletedAt: !!deletedAt,
      itemId,
      name,
      custoAnual,
      custoMensal,
      tipo,
      codigo,
      descricao,
    });

    this.setState({ redirect: "/logged/newItem/add" });
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Item</h1>
          <div className="div-info-titulo">
            <div className="div-h3-titulo">
              <h4 style={{ margin: "0" }}>EMPRESA</h4>
              <Progress
                percent={50}
                status="active"
                style={{ padding: "0 !important" }}
              />
            </div>
            <div className="div-h3-titulo">
              <h4 style={{ margin: "0" }}>USUARIO</h4>
              <Progress
                percent={50}
                status="active"
                style={{ padding: "0 !important" }}
              />
            </div>
          </div>
          <div className="div-bell-titulo">
            <MailOutlined style={{ fontSize: "28px", marginRight: "20px" }} />
            <BellOutlined style={{ fontSize: "28px" }} />
          </div>
        </div>

        <div className="div-main-client-dash">
          <div className="div-block-search-gerClient">
            <Button
              onClick={() => this.setState({ avancado: !this.state.avancado })}
            >
              {this.state.avancado ? "Ocultar" : "Avançar"}
            </Button>
            {this.state.avancado && (
              <div className="div-block-input-search-gerClient">
                <Input
                  value={this.state.codigo}
                  name="codigo"
                  placeholder="codigo"
                  style={{ width: "15%" }}
                  onChange={this.onChange}
                />
                <Input
                  value={this.state.item}
                  name="item"
                  placeholder="item"
                  style={{ width: "55%" }}
                  onChange={this.onChange}
                />
                <Select
                  value={this.state.tipo}
                  placeholder="TIPO"
                  onChange={async (value) => {
                    await this.setState({
                      tipo: value === "TODOS" ? undefined : value,
                    });
                    await this.getAllItens();
                  }}
                  style={{ width: "20%" }}
                >
                  {["SOFTWARE", "EQUIPAMENTO", "TODOS"].map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          <div className="div-main-table-client">
            <table>
              <tr>
                <th style={{ width: "15%" }}>código</th>
                <th style={{ width: "55%" }}>item</th>
                <th style={{ width: "20%" }}>tipo</th>
                <th style={{ width: "10%" }}>Ação</th>
              </tr>

              {this.state.rows.map((row) => (
                <tr>
                  {console.log(row)}
                  <td>{row.code}</td>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td>
                    <EditOutlined
                      className="icon-edit"
                      onClick={() => this.setItemRedux(row)}
                    />
                  </td>
                </tr>
              ))}
            </table>
          </div>
          <div className="div-paginacao">
            <this.Pages />
          </div>
        </div>
        {this.state.redirect && <Redirect to={this.state.redirect} />}
      </div>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ setItem }, dispach);
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, mapDispacthToProps)(ItemContainer);
