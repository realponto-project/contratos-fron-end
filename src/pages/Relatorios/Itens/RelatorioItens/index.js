import React, { Component } from "react";
import "./index.css";
import "../../../../global.css";
import { Select, Icon, Checkbox } from "antd";
import { GetAllContractItem } from "../../../../services/contract";
import { GetAllItens } from "../../../../services/item";
import { AllItems } from "../../../../services/grafic";
import { pdfRelatorioItems } from "../../../../services/utils/pdf";

const { Option } = Select;

class RelatorioItens extends Component {
  state = {
    item: "SELECIONE UM ITEM",
    contractItem: [],
    items: [],
    codigo: "CÓDIGO",
    total: 10,
    count: 0,
    page: 1,
    allItens: [],
    checked: "contractItem"
  };

  componentDidMount = async () => {
    await this.setState({ allItens: (await GetAllItens()).data.rows });
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
        this.setState({ contractItem: resp.data });
      })
      .catch(err => console.error(err));
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  tableRelatorioAllItens = () => (
    <div className="div-table">
      <div className="div-main-table">
        <div className="div-line-table">
          <strong style={{ width: "40%" }}>Item</strong>
          <strong style={{ width: "5%" }}>Qtnd</strong>
          <strong style={{ width: "15%" }}>Custo</strong>
          <strong style={{ width: "10%" }}>N Contratos</strong>
          <strong style={{ width: "10%" }}>Total</strong>
          <strong style={{ width: "20%" }}>Tipo</strong>
        </div>
        {this.state.items.map(item => (
          <div className="div-line-table">
            <strong style={{ width: "40%" }}>{item.item}</strong>
            <strong style={{ width: "5%" }}>{item.quant}</strong>
            <strong style={{ width: "15%" }}>
              {item.cost.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}
            </strong>
            <strong style={{ width: "10%" }}>{item.quantContract}</strong>
            <strong style={{ width: "10%" }}>
              {item.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}
            </strong>
            <strong style={{ width: "20%" }}>{item.type}</strong>
          </div>
        ))}
      </div>
    </div>
  );

  tableRelatorioItens = () => (
    <div className="div-table">
      <div className="div-main-table">
        <div className="div-line-table">
          <strong className="label-nContrato-table">Nº CONT.</strong>
          <strong className="label-razao-table">RAZÃO SOCIAL</strong>
          <strong className="label-cnpj-table">CNPJ / CPF</strong>
          <strong className="label-valor-table">PREÇO</strong>
          <strong className="label-tipo-table">TIPO</strong>
        </div>
        {this.state.contractItem.length !== 0 ? (
          this.state.contractItem.map(line => (
            <div className="div-line-table">
              <label className="label-nContrato-table">
                {line.contractCode}
              </label>
              <label className="label-razao-table">
                {line.contract.client.razaosocial}
              </label>
              <label className="label-cnpj-table">
                {line.contract.client.cnpj}
              </label>
              <label className="label-valor-table">
                {line.price.toFixed(2)}
              </label>
              <label className="label-tipo-table">{line.contract.type}</label>
            </div>
          ))
        ) : (
          <div className="div-seminfo-relatorioItens">
            *** NADA FOI ENCONTRADO ***
          </div>
        )}
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

  Table = () => {
    switch (this.state.checked) {
      case "contractItem":
        return <this.tableRelatorioItens />;
      case "allItem":
        return <this.tableRelatorioAllItens />;
      default:
        return null;
    }
  };

  onChangeChecked = async e => {
    const { name } = e.target;
    await this.setState({ checked: name });

    switch (this.state.checked) {
      case "contractItem":
        this.setState({ contractItem: [] });
        break;
      case "allItem":
        await this.setState({ items: (await AllItems()).data });
        break;
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="card-main">
        <div
          className="div-titulo"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h1 className="h1-titulo">Relatorio Itens</h1>
          <Icon
            style={{ fontSize: "32px", margin: "15px 25px 0 0" }}
            type="printer"
            onClick={() => pdfRelatorioItems()}
          />
        </div>
        <div className="div-info-re-itens">
          <div
            style={{
              marginLeft: "50px",
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              width: "95%"
            }}
          >
            <Checkbox
              checked={this.state.checked === "contractItem"}
              name="contractItem"
              onChange={this.onChangeChecked}
            >
              Item no contrato
            </Checkbox>
            <Checkbox
              checked={this.state.checked === "allItem"}
              name="allItem"
              onChange={this.onChangeChecked}
            >
              Todos itens
            </Checkbox>
          </div>

          <div className="div-inputs-flex">
            <Select
              style={{ width: "75%", marginRight: "10px", marginLeft: "25px" }}
              size="large"
              defaultValue={this.state.item}
              showSearch
              optionFilterProp="children"
              value={this.state.item}
              notFoundContent="NADA ENCONTRADO"
              onChange={this.onChangeSelect}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              getInputElement={() => (
                <input style={{ textTransform: "uppercase" }} />
              )}
            >
              {this.state.allItens.map(value => (
                <Option key={value.id} value={value.name} item={value}>
                  {value.name}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: "25%", marginRight: "25px" }}
              size="large"
              showSearch
              defaultValue={this.state.codigo}
              placeholder="CÓDIGO"
              notFoundContent="NADA ENCONTRADO"
              optionFilterProp="children"
              value={this.state.codigo}
              onChange={this.onChangeSelect}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              getInputElement={() => (
                <input style={{ textTransform: "uppercase" }} />
              )}
            >
              {this.state.allItens.map(value => (
                <Option key={value.id} value={value.code} item={value}>
                  {value.code}
                </Option>
              ))}
            </Select>
          </div>
          <this.Table />
          <div className="div-main-pages">
            <this.Pages />
          </div>
        </div>
      </div>
    );
  }
}

export default RelatorioItens;
