import React, { Component } from "react";
import { Select, Row, Button, Col, Input, Progress } from "antd";
import "./index.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { GetAllClient } from "../../../../services/client";
import { GetAllItens } from "../../../../services/item";
import { setItem, setClient } from "../cadastroRedux/action";
import { BellOutlined, MailOutlined } from "@ant-design/icons";

const { Option } = Select;

class RelatorioCadastroContainer extends Component {
  state = {
    select: "",
    clientes: {},
    items: {},
    search: false,
    searchClient: {
      code: "",
      razaosocial: "",
      cnpj: "",
      group: "",
    },
    searchItem: {
      name: "",
      type: "",
      code: "",
    },
    total: 10,
    count: 0,
    page: 1,
    redirect: "",
  };

  componentDidMount = async () => {
    await this.getAllClient();

    this.setState({
      select: "cliente",
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
            igpm: false,
          },
        },
      },
      total: this.state.total,
      page: this.state.page,
      paranoid: false,
    };

    const { status, data: items } = await GetAllItens(query);

    const { count, show, page } = items;

    if (status === 200) await this.setState({ items, count, show, page });
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
            group,
          },
        },
      },
      total: this.state.total,
      page: this.state.page,
    };

    const { status, data: clientes } = await GetAllClient(query);

    const { count, show, page } = clientes;

    if (status === 200) await this.setState({ clientes, count, show, page });
  };

  onChange = async (e) => {
    const { name, value } = e.target;

    const [objectName, childrenName] = name.split(" ");

    await this.setState({
      [objectName]: {
        ...this.state[objectName],
        [childrenName]: value.toUpperCase(),
      },
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
                    style={{ height: "40px" }}
                    value={searchClient.code}
                    name="searchClient code"
                    onChange={this.onChange}
                    placeholder="CÓD"
                  />
                </div>
              </Col>
              <Col span={9}>
                <div style={{ marginRight: "5px" }}>
                  <Input
                    value={searchClient.razaosocial}
                    name="searchClient razaosocial"
                    onChange={this.onChange}
                    style={{ height: "40px" }}
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
                    style={{ height: "40px" }}
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
                    style={{ height: "40px" }}
                    placeholder="GRUPO"
                  />
                </div>
              </Col>
              <Col span={1}></Col>
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
                    style={{ height: "40px" }}
                  />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ marginRight: "5px" }}>
                  <Select
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="TIPO"
                    name="searchItem type"
                    onChange={async (value) => {
                      await this.setState({
                        searchItem: { ...this.state.searchItem, type: value },
                      });
                      await this.getAllItens();
                    }}
                    defaultValue="TODOS"
                  >
                    <Option key={1} value="SOFTWARE">
                      SOFTWARE
                    </Option>
                    <Option key={2} value="EQUIPAMENTO">
                      EQUIPAMENTO
                    </Option>
                    <Option key={3} value="">
                      TODOS
                    </Option>
                  </Select>
                  {/* <Input
                    placeholder="TIPO"
                    value={searchItem.type}
                    name="searchItem type"
                    onChange={this.onChange}
                    style={{ height: "38px" }}
                  /> */}
                </div>
              </Col>
              <Col span={4}>
                <div>
                  <Input
                    placeholder="CÓDIGO"
                    value={searchItem.code}
                    name="searchItem code"
                    onChange={this.onChange}
                    style={{ height: "40px" }}
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

  setClientRedux = (client) => {
    const {
      deletedAt,
      id: clientId,
      razaosocial,
      cnpj,
      code: codigo,
      address: {
        street: rua,
        neighborhood: bairro,
        zipCode: cep,
        city: cidade,
        state: uf,
        complement: complemento,
        observation: observacoes,
      },
      contact: {
        email: emailContato,
        name: nomeContato,
        telphone: celularContato,
        celular: telefoneContato,
      },
      group: { group: grupo },
    } = client;

    this.props.setClient({
      deletedAt: !!deletedAt,
      clientId,
      razaosocial,
      cnpj,
      codigo,
      rua,
      bairro,
      cep,
      cidade,
      uf,
      complemento,
      observacoes,
      emailContato,
      nomeContato,
      celularContato,
      telefoneContato,
      grupo,
    });

    this.setState({ redirect: "/logged/newClient/add" });
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
                span={9}
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
              <Col className="col-icon-edit" span={1}></Col>
            </Row>
            {this.state.clientes.rows.map((cliente) => (
              <Row>
                <Col style={{ margin: "0 5px 10px 0" }} span={3}>
                  {cliente.code}
                </Col>
                <Col style={{ margin: "0 5px 10px 0" }} span={9}>
                  {cliente.razaosocial}
                </Col>
                <Col style={{ margin: "0 5px 10px 0" }} span={6}>
                  {cliente.cnpj}
                </Col>
                <Col style={{ marginBottom: "0" }} span={4}>
                  {cliente.group.group}
                </Col>
                <Col className="col-icon-edit" span={1}>
                  <EditOutlined
                    className="icon-edit"
                    onClick={() => this.setClientRedux(cliente)}
                    style={{ fontSize: "16px", color: "#001529" }}
                  />
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
                span={12}
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
              <Col className="col-icon-edit" span={1}></Col>
            </Row>
            {this.state.items.rows.map((item) => (
              <Row>
                <Col style={{ margin: "0 5px 10px 0" }} span={12}>
                  {item.name}
                </Col>
                <Col style={{ margin: "0 5px 10px 0" }} span={6}>
                  {item.type}
                </Col>
                <Col style={{ marginBottom: "10px" }} span={4}>
                  {item.code}
                </Col>
                <Col className="col-icon-edit" span={1}>
                  <EditOutlined
                    className="icon-edit"
                    onClick={() => this.setItemRedux(item)}
                    style={{ fontSize: "16px", color: "#001529" }}
                  />
                </Col>
              </Row>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  onChangeSelect = async (select) => {
    await this.setState({
      total: 10,
      count: 0,
      page: 1,
    });
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

  changePages = async (pages) => {
    await this.setState({
      page: pages,
    });

    switch (this.state.select) {
      case "cliente":
        await this.getAllClient();
        break;
      case "item":
        await this.getAllItens();
        break;
      default:
        return null;
    }
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

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Relatorios cadastrais</h1>
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
        <div className="div-container-block">
          <div className="div-buttons-search">
            <Select
              style={{ width: "25%", marginLeft: "25px" }}
              value={this.state.select}
              onChange={this.onChangeSelect}
              size="large"
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
            <>
              <this.Table />
              <div className="div-main-pages">
                <this.Pages />
              </div>
            </>
          ) : (
            <div className="div-seminfo-relatorio">
              <p className="p-relatorio">NENHUM TIPO DE CADASTRO SELECIONADO</p>
            </div>
          )}
        </div>
        {this.state.redirect && <Redirect to={this.state.redirect} />}
      </div>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ setItem, setClient }, dispach);
}

function mapStateToProps(state) {
  return {
    itemValue: state.itemValue,
  };
}

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(RelatorioCadastroContainer);
