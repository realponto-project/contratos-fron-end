import actions from "../../../../store/actions";

const INICIAL_STATE_ITEM = {
  itemId: "",
  name: "",
  custoAnual: undefined,
  custoMensal: undefined,
  tipo: undefined,
  codigo: "",
  descricao: "",
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
  observacoes: "",
};

const INICIAL_STATE_USER = {
  deletedAt: false,
  userId: "",
  username: "",
  email: "",
  telphone: "",
  description: "",
  awardBoolean: false,
  award: { name: "", id: "" },
  resource: {
    addClient: false,
    addItem: false,
    addContract: false,
    addUser: false,
    addIgpm: false,
  },
  typeAccount: { id: "", group: "" },
};

const INICIAL_STATE_CONTRACT = {
  code: "",
};

export function itemValue(state = INICIAL_STATE_ITEM, action) {
  switch (action.type) {
    case actions.SET.ITEM:
      let item = {
        ...state,
      };
      item = {
        ...item,
        ...action.payload,
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
        ...state,
      };
      client = {
        ...client,
        ...action.payload,
      };

      return client;
    case actions.CLEAR.CLIENT:
      return INICIAL_STATE_CLIENT;
    default:
      return state;
  }
}

export function userValue(state = INICIAL_STATE_USER, action) {
  switch (action.type) {
    case actions.SET.USER:
      let user = {
        ...state,
      };
      user = {
        ...user,
        ...action.payload,
      };

      return user;
    case actions.CLEAR.USER:
      return INICIAL_STATE_USER;
    default:
      return state;
  }
}

export function contractValue(state = INICIAL_STATE_CONTRACT, action) {
  switch (action.type) {
    case actions.SET.CONTRACT:
      let contract = {
        ...state,
      };
      contract = {
        ...contract,
        ...action.payload,
      };

      return contract;
    case actions.CLEAR.CONTRACT:
      return INICIAL_STATE_CONTRACT;
    default:
      return state;
  }
}
