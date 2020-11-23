import action from "../../../../store/actions";

export function setContractCode(value) {
  return dispatch => {
    dispatch({
      type: action.CONTRACTCODE,
      payload: value
    });
  };
}
