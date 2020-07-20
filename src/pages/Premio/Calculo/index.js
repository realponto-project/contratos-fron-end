import React, { Component } from "react";
import "./index.css";
import {
  Input,
  Button,
  Select,
  message,
  Modal,
  DatePicker,
  InputNumber,
  Progress
} from "antd";
import {
  MailOutlined,
  BellOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import {
  NewAward,
  GetAllAwards,
  NewEquation,
  DeleteEquation,
  UpdateEquation
} from "../../../services/award";
import { validator, masks } from "./validator";
import { GetAllContract, GetAllContractItem } from "../../../services/contract";
import moment from "moment";
import * as R from "ramda";

const { Option } = Select;

export default class PremiacaoContainer extends Component {
  state = {
    contracts: [],
    contractItems: [],
    fieldErrors: { name: false, initialDate: false },
    code: undefined,
    visible: false,
    visibleEquations: false,
    valor2: 0,
    name: undefined,
    initialDate: undefined,
    operator: undefined,
    value: undefined,
    rows: [],
    index: -1,
    equationId: ""
  };

  componentDidMount = async () => {
    await this.getAllContract();
    await this.getAllAwards();
  };

  getAllAwards = async () => {
    const { status, data } = await GetAllAwards();

    if (status === 200) this.setState({ rows: data });
  };

  getAllContractItem = async () => {
    const query = {
      contractCode: this.state.code,
      filters: {
        contractItem: {
          specific: {
            contractCode: this.state.code
          }
        }
      },
      attributes: {
        contractItem: [
          "id",
          "contractCode",
          "itemId",
          "quantidade",
          "costPrice",
          "price"
        ]
      }
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

  NewAward = async () => {
    const { name, initialDate } = this.state;

    const { status } = await NewAward({ name, initialDate });

    if (status === 200) {
      this.setState({
        name: undefined,
        initialDate: undefined,
        fieldErrors: { name: false, initialDate: false },
        visible: false
      });
      this.getAllAwards();

      message.success("sucesso");
    } else {
      message.error("erro");
    }
  };

  onChange = e => {
    const { name, value } = masks(e.target.name, e.target.value);

    this.setState({ [name]: value });
  };

  onBlur = e => {
    const { value, name } = e.target;
    const { fieldErrors } = this.state;

    fieldErrors[name] = validator(name, value);

    this.setState({
      fieldErrors
    });
  };

  onFocus = e => {
    const { name } = e.target;
    const { fieldErrors } = this.state;

    fieldErrors[name] = false;

    this.setState({
      fieldErrors
    });
  };

  newEquation = async () => {
    const { value, operator, rows, index } = this.state;

    const { status } = await NewEquation({
      value,
      operator,
      awardId: rows[index].id
    });

    if (status === 200) {
      message.success("sucesso");
      this.setState({
        value: undefined,
        operator: undefined,
        awardId: "",
        visibleEquations: false
      });
      this.getAllAwards();
    }
  };

  updateEquation = async () => {
    const { value, operator, equationId: id } = this.state;

    const { status } = await UpdateEquation({
      value,
      operator,
      id
    });

    if (status === 200) {
      message.success("sucesso");
      this.setState({
        value: undefined,
        operator: undefined,
        equationId: "",
        visibleEquations: false
      });
      this.getAllAwards();
    } else {
      message.error("erro");
    }
  };

  deleteEquation = async id => {
    const { status } = await DeleteEquation({ id });
    if (status === 200) this.getAllAwards();
  };

  ModalEquations = () => {
    return (
      <Modal
        title="equações"
        visible={this.state.visibleEquations}
        onOk={this.state.equationId ? this.updateEquation : this.newEquation}
        // width={700}
        onCancel={() =>
          this.setState({ visibleEquations: false, equationId: "" })
        }
      >
        <div className="div-block-row-premio">
          <Select
            placeholder="operator"
            style={{ width: "30%" }}
            value={this.state.operator}
            onChange={operator => this.setState({ operator })}
          >
            {["SOMA", "SUBTRAÇÃO", "MULTIPLICAÇÃO", "DIVISÃO"].map(item => (
              <Option value={item}>{item}</Option>
            ))}
          </Select>
          <InputNumber
            placeholder="valor"
            onChange={value => this.setState({ value })}
            value={this.state.value}
          />
        </div>
      </Modal>
    );
  };

  ModalPremiacao = () => {
    return (
      <Modal
        title="Premiação"
        visible={this.state.visible}
        onOk={this.NewAward}
        onCancel={() => this.setState({ visible: false })}
      >
        <Input
          placeholder="nome"
          value={this.state.name}
          name="name"
          onChange={this.onChange}
        />
        <DatePicker
          style={{ width: "280px", marginTop: "20px" }}
          placeholder="data inicial"
          value={this.state.initialDate}
          onChange={initialDate => {
            this.setState({ initialDate });
          }}
        />
      </Modal>
    );
  };

  render() {
    return (
      <div className="card-main">
        <div className="div-titulo">
          <h1 className="h1-titulo">Premio</h1>
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
        <div className="div-main-premio">
          <this.ModalPremiacao />
          <this.ModalEquations />
          <div className="div-card-premio">
            <div className="div-block-row-premio">
              <Button
                type="primary"
                onClick={() => this.setState({ visible: true })}
              >
                <PlusOutlined />
              </Button>
            </div>
            {/* <div className="div-block-row-premio">
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
                style={{ width: "100%" }}
                onChange={(value) => this.setState({ contractItemId: value })}
              >
                {this.state.contractItems.map((contractItem) => (
                  <Option value={contractItem.id}>
                    {contractItem.item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="div-block-row-premio">
            <div className="div-block-input-premio">
              <label>Valor 1</label>
              <InputNumber
                style={{ width: "100%" }}
                onChange={() =>
                  console.log(
                    R.find(R.propEq("id", this.state.contractItemId))(
                      this.state.contractItems
                    ).price
                  )
                }
                disabled={
                  !R.find(R.propEq("id", this.state.contractItemId))(
                    this.state.contractItems
                  )
                }
                value={
                  R.find(R.propEq("id", this.state.contractItemId))(
                    this.state.contractItems
                  )
                    ? R.find(R.propEq("id", this.state.contractItemId))(
                        this.state.contractItems
                      ).price
                    : 0
                }
              />
            </div>

            <div className="div-block-input-premio">
              <label>Base calculo</label>
              <Select
                style={{ width: "100%" }}
                // onChange={(value) => this.setState({ contractItemId: value })}
              >
                {["SOMA", "SUBTRAÇÃO", "MULTIPLICAÇÃO", "DIVISÃO"].map(
                  (item) => (
                    <Option value={item}>{item}</Option>
                  )
                )}
              </Select>
            </div>
          </div>

          <div className="div-block-row-premio">
            <div className="div-block-input-premio">
              <label>Valor 1</label>
              <InputNumber
                style={{ width: "100%" }}
                step={0.05}
                onChange={(valor2) => this.setState({ valor2 })}
                disabled={
                  !R.find(R.propEq("id", this.state.contractItemId))(
                    this.state.contractItems
                  )
                }
                value={this.state.valor2}
              />
            </div>
          </div> */}
            <div className="div-block-row-premio">
              <div className="div-title-premio-name">
                <strong>Grupo</strong>
              </div>
              <div className="div-title-premio-initialDate">
                <strong>Data Inicial</strong>
              </div>
              <div className="div-title-premio-icons">
                <strong>Ações</strong>
              </div>
            </div>
            {this.state.rows.map((row, index) => (
              <>
                <div className="div-block-row-premio">
                  <div className="div-title-premio-name">{row.name}</div>
                  <div className="div-title-premio-initialDate">
                    {moment(row.initialDate).format("LL")}
                  </div>
                  <div className="div-title-premio-icons">
                    {this.state.index === index ? (
                      <UpOutlined
                        onClick={() => this.setState({ index: -1 })}
                      />
                    ) : (
                      <DownOutlined onClick={() => this.setState({ index })} />
                    )}

                    <EditOutlined />
                    <DeleteOutlined />
                  </div>
                </div>
                {this.state.index === index && (
                  <div className="div-block-row-premio">
                    <div className="div-up-premio">
                      <div className="div-cabecalho-up-premio">
                        <label>operação</label>
                        <label>valor</label>
                        <label>ações</label>
                        {this.state.rows[index].equations.length < 4 && (
                          <PlusCircleOutlined
                            onClick={() =>
                              this.setState({ visibleEquations: true })
                            }
                          />
                        )}
                      </div>
                      {this.state.rows[index].equations.map(equation => (
                        <div className="div-content-up-premio">
                          <label>{equation.operator}</label>
                          <label>{equation.value}</label>
                          <div>
                            <EditOutlined
                              onClick={() =>
                                this.setState({
                                  visibleEquations: true,
                                  operator: equation.operator,
                                  value: equation.value,
                                  equationId: equation.id
                                })
                              }
                            />
                            <DeleteOutlined
                              onClick={() => this.deleteEquation(equation.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ))}
            {/* <div className="div-block-input-premio">
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
            </div> */}
            {/* <div className="button-save-premio">
              <Button onClick={this.newPremission}>Salvar</Button>
            </div>
          </div>

          <div className="div-card-premio">
            <h2>Calculo</h2>
            <div className="div-block-input-premio">
              <label>Contrato</label>
              <Select
                onChange={async value => {
                  await this.setState({ code: value });
                  await this.getAllContractItem();
                }}
                // placeholder="TIPO"
                // value={this.state.tipo}
                // size="large"
                style={{ width: "100%" }}
              >
                {this.state.contracts.map(contract => (
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
                {this.state.contractItems.map(contractItem => (
                  <Option value={contractItem.id}>
                    {contractItem.item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
