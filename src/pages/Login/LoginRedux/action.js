import action from "../../../store/actions";

export function onSubmit(value) {
  return dispatch => {
    dispatch({
      type: action.LOGIN.AUTH,
      payload: value
    });
  };
}
