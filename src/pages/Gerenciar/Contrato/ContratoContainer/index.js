import React, { Component } from "react";
import "./index.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Progress, Button, Input, Select } from "antd";
import { MailOutlined, BellOutlined, EditOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";

import { setContract } from "../../../Relatorios/Cadastro/cadastroRedux/action";
import { GetAllGroups } from "../../../../services/client";
import { GetAllContract } from "../../../../services/contract";

const { Option } = Select;

class ContratoContainer extends Component {
  state = {
    avancado: false,
    codigo: undefined,
    razao: undefined,
    cnpj: undefined,
    grupo: undefined,
    rows: [],
    total: 10,
    count: 0,
    page: 1,
    show: 0,
    redirect: "",
    groups: [],
    groupId: undefined,
  };

  getAllContract = async () => {
    const query = {
      filters: {
        contract: {
          specific: {
            code: this.state.codigo,
          },
        },
        client: {
          specific: {
            razaosocial: this.state.razao,
            cnpj: this.state.cnpj,
          },
        },
        group: {
          specific: {
            // group: this.state.grupo,
            id: this.state.groupId,
          },
        },
      },
      page: this.state.page,
      total: this.state.total,
    };
    const { status, data } = await GetAllContract(query);
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
    await this.getAllGroups();
    await this.getAllContract();
  };

  getAllGroups = async (grupo) => {
    const query = {
      filters: {
        group: {
          specific: {
            group: grupo,
          },
        },
      },
    };

    await GetAllGroups(query)
      .then((resp) => this.setState({ groups: resp.data }))
      .catch((err) => console.error(err));
  };

  onChange = async (e) => {
    const { name, value } = e.target;

    await this.setState({ [name]: value });
    await this.getAllContract();
  };

  changePages = async (pages) => {
    await this.setState(
      {
        page: pages,
      },
      () => {
        this.getAllContract();
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

  setContractRedux = (contract) => {
    const { code } = contract;

    this.props.setContract({
      code,
    });

    this.setState({ redirect: "/logged/newContrato/add" });
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Contratos</h1>
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
                  value={this.state.razao}
                  name="razao"
                  placeholder="razao"
                  style={{ width: "40%" }}
                  onChange={this.onChange}
                />
                <Input
                  value={this.state.cnpj}
                  name="cnpj"
                  placeholder="cnpj"
                  style={{ width: "20%" }}
                  onChange={this.onChange}
                />
                <Select
                  showSearch
                  onSearch={async (grupo) => await this.getAllGroups({ grupo })}
                  onChange={async (grupo, prop) => {
                    await this.setState({ grupo, groupId: prop.key });

                    await this.getAllContract();
                  }}
                  style={{ width: "15%" }}
                  value={this.state.grupo}
                  placeholder="GRUPO"
                  getInputElement={() => (
                    <input
                      style={{
                        textTransform: "uppercase",
                      }}
                    />
                  )}
                >
                  {this.state.groups.length !== 0 &&
                    this.state.groups.map((group) => (
                      <Option key={group.id} value={group.group}>
                        {group.group}
                      </Option>
                    ))}
                </Select>
              </div>
            )}
          </div>

          <div className="div-main-table-client">
            <table>
              <tr>
                <th style={{ width: "15%" }}>Nº Contrato</th>
                <th style={{ width: "50%" }}>razão</th>
                <th style={{ width: "15%" }}>cnpj</th>
                <th style={{ width: "10%" }}>grupo</th>
                <th style={{ width: "10%" }}>açao</th>
              </tr>

              {this.state.rows.map((row) => (
                <tr>
                  <td>{row.code}</td>
                  <td>{row.client.razaosocial}</td>
                  <td>{row.client.cnpj}</td>
                  <td>{row.client.group.group}</td>
                  <td>
                    <EditOutlined
                      className="icon-edit"
                      onClick={() => this.setContractRedux(row)}
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
  return bindActionCreators({ setContract }, dispach);
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, mapDispacthToProps)(ContratoContainer);
