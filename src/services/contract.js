import api from "./api";
import store from "../store";

export const NewContract = async value => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`
  };

  let response = {};
  await api
    .post("/contract", value, { headers })
    .then(resp => {
      response = resp;
    })
    .catch(err => {
      if (err.response) {
        response = err.response;
      } else {
        console.log("Error", err.message);
      }
    });

  return response;
};
