import React, { Component } from "react";
import { Select, Button, Row, Col, Input, InputNumber } from "antd";
// import { Container } from './styles';
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
      [objectName]: { ...this.state[objectName], [childrenName]: value }
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
            <Row>
              <Col span={2}>
                <div style={{ padding: "0 5px" }}>
                  <Input
                    value={searchClient.code}
                    name="searchClient code"
                    onChange={this.onChange}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: "0 5px" }}>
                  <Input
                    value={searchClient.razaosocial}
                    name="searchClient razaosocial"
                    onChange={this.onChange}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ padding: "0 5px" }}>
                  <Input
                    value={searchClient.cnpj}
                    name="searchClient cnpj"
                    onChange={this.onChange}
                  />
                </div>
              </Col>
              <Col span={2}>
                <div style={{ padding: "0 5px" }}>
                  <Input
                    value={searchClient.group}
                    name="searchClient group"
                    onChange={this.onChange}
                  />
                </div>
              </Col>
            </Row>
          </div>
        );
      case "item":
        return (
          <div className="div-container-inputs-search">
            <Row>
              <Col span={14}>
                <div style={{ padding: "0 5px" }}>
                  <Input
                    value={searchItem.name}
                    name="searchItem name"
                    onChange={this.onChange}
                  />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ padding: "0 5px" }}>
                  <Input
                    value={searchItem.type}
                    name="searchItem type"
                    onChange={this.onChange}
                  />
                </div>
              </Col>
              <Col span={4}>
                <div style={{ padding: "0 5px" }}>
                  <Input
                    value={searchItem.code}
                    name="searchItem code"
                    onChange={this.onChange}
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
              <Col span={2}>
                <strong>Código</strong>
              </Col>
              <Col span={12}>
                <strong>Razão Social</strong>
              </Col>
              <Col span={8}>
                <strong>CNPJ</strong>
              </Col>
              <Col span={2}>
                <strong>Grupo</strong>
              </Col>
            </Row>
            {/* {console.log(this.state)} */}
            {this.state.clientes.rows.map(cliente => (
              <Row>
                <Col span={2}>{cliente.code}</Col>
                <Col span={12}>{cliente.razaosocial}</Col>
                <Col span={8}>{cliente.cnpj}</Col>
                <Col span={2}>{cliente.group}</Col>
              </Row>
            ))}
          </div>
        );
      case "item":
        return (
          <div className="div-container-table">
            <Row>
              <Col span={14}>
                <strong>Nome</strong>
              </Col>
              <Col span={6}>
                <strong>Tipo</strong>
              </Col>
              <Col span={4}>
                <strong>Código</strong>
              </Col>
            </Row>
            {/* {console.log(this.state)} */}
            {this.state.items.map(item => (
              <Row>
                <Col span={14}>{item.name}</Col>
                <Col span={6}>{item.type}</Col>
                <Col span={4}>{item.code}</Col>
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
      <div className="div-main-relatorio-cadastro">
        <h1>Relatórios cadastrais</h1>
        <div className="div-container-block">
          <Select
            style={{ width: 200 }}
            placeholder="Tipo de cadastro"
            onChange={this.onChangeSelect}
          >
            <Option value="cliente">Cliente</Option>
            <Option value="item">Item</Option>
          </Select>
          <Button
            icon="search"
            onClick={() => this.setState({ search: !this.state.search })}
          >
            Search
          </Button>
        </div>
        <this.Search />
        <this.Table />
      </div>
    );
  }
}
