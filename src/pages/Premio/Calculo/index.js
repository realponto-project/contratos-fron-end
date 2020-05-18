import React, { Component } from "react";
import "./index.css";
import { Input, Button, Tooltip, Select, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { NewTypeAccount } from "../../../services/typeAccount";
import { validator, masks } from "./validator";
import { GetAllContract, GetAllContractItem } from "../../../services/contract";

const { Option } = Select;

export default class CalculoContainer extends Component {
  state = {
    grupo: "",
    equacao: "",
    fieldErrors: {
      grupo: false,
      equacao: false,
    },
    contracts: [],
    contractItems: [],
    code: undefined,
  };

  componentDidMount = async () => {
    await this.getAllContract();
  };

  getAllContractItem = async () => {
    const query = {
      contractCode: this.state.code,
      filters: {
        contractItem: {
          specific: {
            contractCode: this.state.code,
          },
        },
      },
      attributes: {
        contractItem: ["id", "contractCode", "itemId"],
      },
    };
    const { status, data } = await GetAllContractItem(query);

    if (status === 200) this.setState({ contractItems: data });
  };

  getAllContract = async () => {
    const { status, data } = await GetAllContract();
    if (status === 200) {
      this.setState({ contracts: data.rows });
    }
  };

  newPremission = async () => {
    const { grupo: group, equacao: equation } = this.state;

    const { status } = await NewTypeAccount({ group, equation });

    if (status === 200) {
      this.setState({
        grupo: "",
        equacao: "",
        fieldErrors: {
          grupo: false,
          equacao: false,
        },
      });
      message.success("sucesso");
    }
  };

  onChange = (e) => {
    const { name, value } = masks(e.target.name, e.target.value);

    this.setState({ [name]: value });
  };

  onBlur = (e) => {
    const { value, name } = e.target;
    const { fieldErrors } = this.state;

    fieldErrors[name] = validator(name, value);

    this.setState({
      fieldErrors,
    });
  };

  onFocus = (e) => {
    const { name } = e.target;
    const { fieldErrors } = this.state;

    fieldErrors[name] = false;

    this.setState({
      fieldErrors,
    });
  };

  render() {
    return (
      <div className="div-main-premio">
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          Prêmio
        </h1>
        <div className="div-block-cards-premio">
          <div className="div-card-premio">
            <h2>Cadastro</h2>
            <div className="div-block-input-premio">
              <label>Grupo</label>
              <Input
                name="grupo"
                className={`${
                  this.state.fieldErrors.grupo ? "input-error" : null
                }`}
                value={this.state.grupo}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              />
            </div>
            <div className="div-block-input-premio">
              <label>
                Equeção{" "}
                <Tooltip
                  mouseEnterDelay={0.2}
                  trigger={["click"]}
                  placement="right"
                  title={`São aceitos apenas numeros, "+" para soma, "-" para subtração, "*" para multiplicação, "/" para divisão, "^" para exponeciação, "(" e ")" para indicar a importância da operação e "x" para representar o valor do item`}
                >
                  <InfoCircleOutlined style={{ fontSize: "10px" }} />
                </Tooltip>
              </label>
              <Input
                name="equacao"
                className={`${
                  this.state.fieldErrors.equacao ? "input-error" : null
                }`}
                value={this.state.equacao}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              />
            </div>
            <div className="button-save-premio">
              <Button onClick={this.newPremission}>Salvar</Button>
            </div>
          </div>

          <div className="div-card-premio">
            <h2>Calculo</h2>
            <div className="div-block-input-premio">
              <label>Contrato</label>
              <Select
                onChange={async (value) => {
                  await this.setState({ code: value });
                  await this.getAllContractItem();
                }}
                // placeholder="TIPO"
                // value={this.state.tipo}
                // size="large"
                style={{ width: "100%" }}
              >
                {this.state.contracts.map((contract) => (
                  <Option value={contract.code}>{contract.code}</Option>
                ))}
              </Select>
            </div>
            <div className="div-block-input-premio">
              <label>Item</label>
              <Select
                // onChange={value => this.setState({ tipo: value })}
                // placeholder="TIPO"
                // value={this.state.tipo}
                // size="large"
                style={{ width: "100%" }}
              >
                {this.state.contractItems.map((contractItem) => (
                  <Option value={contractItem.id}>
                    {contractItem.item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}