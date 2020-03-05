import React, { Component } from "react";
import { Select, Row, Button, Col, Input } from "antd";
import "./index.css";

import { GetAllClient } from "../../../../services/client";
import { GetAllItens } from "../../../../services/item";

const { Option } = Select;

export default class RelatorioCadastroContainer extends Component {
  state = {
    select: "",
    clientes: {},
    items: {},
    search: false,
    searchClient: {
      code: "",
      razaosocial: "",
      cnpj: "",
      group: ""
    },
    searchItem: {
      name: "",
      type: "",
      code: ""
    }
  };

  componentDidMount = async () => {
    await this.getAllClient();

    this.setState({
      select: "cliente"
    });
  };

  getAllItens = async () => {
    const { name, type, code } = this.state.searchItem;

    const query = {
      filters: {
        item: {
          specific: {
            name,
            type,
            code,
            igpm: false
          }
        }
      }
    };

    const { status, data: items } = await GetAllItens(query);

    if (status === 200) await this.setState({ items });
  };

  getAllClient = async () => {
    const { code, razaosocial, cnpj, group } = this.state.searchClient;

    const query = {
      filters: {
        client: {
          specific: {
            code,
            razaosocial,
            cnpj: cnpj.replace(/\D/gi, ""),
            group
          }
        }
      }
    };

    const { status, data: clientes } = await GetAllClient(query);

    if (status === 200) await this.setState({ clientes });
  };

  onChange = async e => {
    const { name, value } = e.target;

    const [objectName, childrenName] = name.split(" ");

    await this.setState({
      [objectName]: {
        ...this.state[objectName],
        [childrenName]: value.toUpperCase()
      }
    });

    switch (objectName) {
      case "searchClient":
        await this.getAllClient();
        break;
      case "searchItem":
        await this.getAllItens();
        break;
      default:
        break;
    }
  };

  Search = () => {
    const { search, select, searchClient, searchItem } = this.state;

    if (!search) return null;
    switch (select) {
      case "cliente":
        return (
          <div className="div-container-inputs-search">
            <Row style={{ width: "100%" }}>
              <Col span={3}>
                <div style={{ marginRight: "5px" }}>
                  <Input
                    style={{ height: "38px" }}
                    value={searchClient.code}
                    name="searchClient code"
                    onChange={this.onChange}
                    placeholder="CÓD"
                  />
                </div>
              </Col>
              <Col span={10}>
                <div style={{ marginRight: "5px" }}>
                  <Input
                    value={searchClient.razaosocial}
                    name="searchClient razaosocial"
                    onChange={this.onChange}
                    style={{ height: "38px" }}
                    placeholder="RAZÃO SOCIAL"
                  />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ marginRight: "5px" }}>
                  <Input
                    value={searchClient.cnpj}
                    name="searchClient cnpj"
                    onChange={this.onChange}
                    style={{ height: "38px" }}
                    placeholder="CNPJ"
                  />
                </div>
              </Col>
              <Col span={5}>
                <div>
                  <Input
                    value={searchClient.group}
                    name="searchClient group"
                    onChange={this.onChange}
                    style={{ height: "38px" }}
                    placeholder="GRUPO"
                  />
                </div>
              </Col>
            </Row>
          </div>
        );
      case "item":
        return (
          <div className="div-container-inputs-search">
            <Row style={{ width: "100%" }}>
              <Col span={14}>
                <div style={{ marginRight: "5px" }}>
                  <Input
                    placeholder="ITEM"
                    value={searchItem.name}
                    name="searchItem name"
                    onChange={this.onChange}
                    style={{ height: "38px" }}
                  />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ marginRight: "5px" }}>
                  <Input
                    placeholder="TIPO"
                    value={searchItem.type}
                    name="searchItem type"
                    onChange={this.onChange}
                    style={{ height: "38px" }}
                  />
                </div>
              </Col>
              <Col span={4}>
                <div>
                  <Input
                    placeholder="CÓDIGO"
                    value={searchItem.code}
                    name="searchItem code"
                    onChange={this.onChange}
                    style={{ height: "38px" }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  Table = () => {
    switch (this.state.select) {
      case "cliente":
        return (
          <div className="div-container-table">
            <Row>
              <Col
                style={{ fontSize: "16px", margin: "0 5px 10px 0" }}
                span={3}
              >
                <strong>CÓDIGO</strong>
              </Col>
              <Col
                style={{ fontSize: "16px", margin: "0 5px 10px 0" }}
                span={10}
              >
                <strong>RAZÃO SOCIAL</strong>
              </Col>
              <Col
                style={{ fontSize: "16px", margin: "0 5px 10px 0" }}
                span={6}
              >
                <strong>CNPJ</strong>
              </Col>
              <Col style={{ fontSize: "16px", marginBottom: "0" }} span={4}>
                <strong>GRUPO</strong>
              </Col>
            </Row>
            {this.state.clientes.rows.map(cliente => (
              <Row>
                <Col style={{ margin: "0 5px 10px 0" }} span={3}>
                  {cliente.code}
                </Col>
                <Col style={{ margin: "0 5px 10px 0" }} span={10}>
                  {cliente.razaosocial}
                </Col>
                <Col style={{ margin: "0 5px 10px 0" }} span={6}>
                  {cliente.cnpj}
                </Col>
                <Col style={{ marginBottom: "0" }} span={4}>
                  {cliente.group}
                </Col>
              </Row>
            ))}
          </div>
        );
      case "item":
        return (
          <div className="div-container-table">
            <Row>
              <Col
                style={{ fontSize: "16px", margin: "0 5px 10px 0" }}
                span={13}
              >
                <strong>NOME</strong>
              </Col>
              <Col
                style={{ fontSize: "16px", margin: "0 5px 10px 0" }}
                span={6}
              >
                <strong>TIPO</strong>
              </Col>
              <Col style={{ fontSize: "16px", marginBottom: "0" }} span={4}>
                <strong>CÓDIGO</strong>
              </Col>
            </Row>
            {this.state.items.map(item => (
              <Row>
                <Col style={{ margin: "0 5px 10px 0" }} span={13}>
                  {item.name}
                </Col>
                <Col style={{ margin: "0 5px 10px 0" }} span={6}>
                  {item.type}
                </Col>
                <Col style={{ marginBottom: "10px" }} span={4}>
                  {item.code}
                </Col>
              </Row>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  onChangeSelect = async select => {
    switch (select) {
      case "cliente":
        await this.getAllClient();
        break;
      case "item":
        await this.getAllItens();
        break;
      default:
        break;
    }

    this.setState({ select });
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Relatorios cadastrais</h1>
        </div>
        <div className="div-container-block">
          <div className="div-buttons-search">
            <Select
              style={{ width: "25%", marginLeft: "25px" }}
              // placeholder="TIPO DO CADASTRO"
              value={this.state.select}
              onChange={this.onChangeSelect}
              size="large"
              value={this.state.select}
            >
              <Option value="cliente">CLIENTE</Option>
              <Option value="item">ITEM</Option>
            </Select>

            {this.state.select !== "" ? (
              <Button
                style={{ height: "38px", marginRight: "25px" }}
                icon="search"
                onClick={() => this.setState({ search: !this.state.search })}
              >
                {!this.state.search ? "PESQUISAR" : "OCULTAR"}
              </Button>
            ) : null}
          </div>
          <this.Search />
          {this.state.select !== "" ? (
            <this.Table />
          ) : (
            <div className="div-seminfo-relatorio">
              <p className="p-relatorio">NENHUM TIPO DE CADASTRO SELECIONADO</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
