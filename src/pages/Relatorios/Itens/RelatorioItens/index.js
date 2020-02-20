import React, { Component } from "react";
import "./index.css";
import "../../../../global.css";
import { Select, Icon } from "antd";
import { GetAllContractItem } from "../../../../services/contract";
import { GetAllItens } from "../../../../services/item";
import { pdfRelatorioItems } from "../../../../services/utils/pdf";

const { Option } = Select;

class RelatorioItens extends Component {
  state = {
    item: "",
    rows: [],
    codigo: "",
    total: 10,
    count: 0,
    page: 1,
    allItens: []
  };

  componentDidMount = async () => {
    await this.setState({ allItens: (await GetAllItens()).data });
  };

  onChangeSelect = (value, option) => {
    this.setState({
      item: option.props.item.name,
      codigo: option.props.item.code
    });
    const query = {
      filters: {
        item: {
          specific: {
            id: option.props.item.id
          }
        }
      }
    };

    GetAllContractItem(query)
      .then(resp => {
        console.log(resp);
        this.setState({ rows: resp.data });
      })
      .catch(err => console.error(err));
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  tableRelatorioItens = () => (
    <div className="div-table">
      <div className="div-main-table">
        <div className="div-line-table">
          <label className="label-nContrato-table">N Cont.</label>
          <label className="label-razao-table">RAZÃO SOCIAL</label>
          <label className="label-cnpj-table">CNPJ / CPF</label>
          <label className="label-valor-table">Preço</label>
          <label className="label-tipo-table">Tipo</label>
        </div>
        <br />
        {this.state.rows.map(line => (
          <div className="div-line-table">
            <label className="label-nContrato-table">{line.contractCode}</label>
            <label className="label-razao-table">
              {line.contract.client.razaosocial}
            </label>
            <label className="label-cnpj-table">
              {line.contract.client.cnpj}
            </label>
            <label className="label-valor-table">{line.price.toFixed(2)}</label>
            <label className="label-tipo-table">{line.contract.type}</label>
          </div>
        ))}
      </div>
    </div>
  );

  changePages = async pages => {
    await this.setState(
      {
        page: pages
      }
      // () => {
      //   this.getAllContract();
      // }
    );
  };

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
        <div
          className="div-titulo"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h1 className="h1-titulo">Relatorio Itens</h1>
          <Icon
            style={{ fontSize: "32px" }}
            type="printer"
            onClick={() => pdfRelatorioItems()}
          />
        </div>

        <div className="div-inputs-flex">
          <Select
            className="input-item-relatorioItens"
            style={{ width: "75%", marginRight: "10px" }}
            size="large"
            showSearch
            placeholder="ITEM"
            optionFilterProp="children"
            value={this.state.item}
            onChange={this.onChangeSelect}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.state.allItens.map(value => (
              <Option key={value.id} value={value.name} item={value}>
                {value.name}
              </Option>
            ))}
          </Select>

          <Select
            className="input-codigo-relatorioItens"
            style={{ width: "25%" }}
            size="large"
            showSearch
            placeholder="CÓDIGO"
            optionFilterProp="children"
            value={this.state.codigo}
            onChange={this.onChangeSelect}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.state.allItens.map(value => (
              <Option key={value.id} value={value.code} item={value}>
                {value.code}
              </Option>
            ))}
          </Select>
          {/* <input
            className="input-item-relatorioItens"
            placeholder="ITEM"
            onChange={this.onChange}
            name="item"
            value={this.state.item}
          ></input> */}
          {/* <input
            className="input-codigo-relatorioItens"
            placeholder="CODIGO"
            onChange={this.onChange}
            name="codigo"
            value={this.state.codigo}
          ></input> */}
        </div>

        <this.tableRelatorioItens />
        <div className="div-main-pages">
          <this.Pages />
        </div>
      </div>
    );
  }
}

export default RelatorioItens;
