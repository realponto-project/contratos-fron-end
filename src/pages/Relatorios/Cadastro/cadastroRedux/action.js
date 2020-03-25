import action from "../../../../store/actions";

export function setItem(value) {
  return dispatch => {
    dispatch({
      type: action.SET.ITEM,
      payload: value
    });
  };
}

export function clearItem() {
  return dispatch => {
    dispatch({
      type: action.CLEAR.ITEM,
      payload: null
    });
  };
}

export function setClient(value) {
  return dispatch => {
    dispatch({
      type: action.SET.CLIENT,
      payload: value
    });
  };
}

export function clearClient() {
  return dispatch => {
    dispatch({
      type: action.CLEAR.CLIENT,
      payload: null
    });
  };
}
