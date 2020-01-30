import action from "../../../store/actions";

export function onSubmit(value) {
  return dispatch => {
    dispatch({
      type: action.LOGIN.AUTH,
      payload: value
    });
  };
}

export function Logout(value) {
  return dispatch => {
    dispatch({
      type: action.LOGIN.LOGOUT,
      payload: null
    });
  };
}
