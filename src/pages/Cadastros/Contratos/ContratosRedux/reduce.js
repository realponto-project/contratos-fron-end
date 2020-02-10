import actions from "../../../../store/actions";

const INICIAL_STATE_CONTRACTCODE = "";

export function contractCode(state = INICIAL_STATE_CONTRACTCODE, action) {
  switch (action.type) {
    case actions.CONTRACTCODE:
      let constractCode = state;

      constractCode = action.payload;

      return constractCode;
    default:
      return state;
  }
}
