import { combineReducers } from "redux";

import { login } from "../pages/Login/LoginRedux/reduce";
import { contractCode } from "../pages/Cadastros/Contratos/ContratosRedux/reduce";
import {
  itemValue,
  clientValue,
  userValue,
  contractValue,
} from "../pages/Relatorios/Cadastro/cadastroRedux/reduce";

const appReducer = combineReducers({
  login,
  contractCode,
  itemValue,
  clientValue,
  userValue,
  contractValue,
  // auth,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_AUTH") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
