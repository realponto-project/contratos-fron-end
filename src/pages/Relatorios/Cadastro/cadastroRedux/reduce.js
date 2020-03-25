import actions from "../../../../store/actions";

const INICIAL_STATE_ITEM = {
  itemId: "",
  name: "",
  custoAnual: undefined,
  custoMensal: undefined,
  tipo: undefined,
  codigo: "",
  descricao: ""
};

const INICIAL_STATE_CLIENT = {
  deletedAt: false,
  clientId: "",
  razaosocial: "",
  cnpj: "",
  grupo: "",
  codigo: "",
  nomeContato: "",
  celularContato: "",
  telefoneContato: "",
  emailContato: "",
  rua: "",
  bairro: "",
  cep: "",
  cidade: "",
  uf: "",
  complemento: "",
  observacoes: ""
};

export function itemValue(state = INICIAL_STATE_ITEM, action) {
  switch (action.type) {
    case actions.SET.ITEM:
      let item = {
        ...state
      };
      item = {
        ...item,
        ...action.payload
      };

      return item;
    case actions.CLEAR.ITEM:
      return INICIAL_STATE_ITEM;
    default:
      return state;
  }
}

export function clientValue(state = INICIAL_STATE_CLIENT, action) {
  switch (action.type) {
    case actions.SET.CLIENT:
      let client = {
        ...state
      };
      client = {
        ...client,
        ...action.payload
      };

      return client;
    case actions.CLEAR.CLIENT:
      return INICIAL_STATE_CLIENT;
    default:
      return state;
  }
}
