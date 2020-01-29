import actions from "../../../store/actions";

const INICIAL_STATE_LOGIN = {
  user: {
    id: "",
    username: ""
  },
  token: ""
};

export function login(state = INICIAL_STATE_LOGIN, action) {
  switch (action.type) {
    case actions.LOGIN.AUTH:
      let auth = {
        ...state
      };
      auth = {
        ...auth,
        ...action.payload
      };

      return auth;
    default:
      return state;
  }
}
