import api from "./api";
import { store } from "../store";

export const NewTypeAccount = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .post("/typeAccount", value, { headers })
    .then((resp) => {
      response = resp;
    })
    .catch((err) => {
      if (err.response) {
        response = err.response;
      } else {
        console.log("Error", err.message);
      }
    });

  return response;
};

export const GetAllTypeAccounts = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .get("/typeAccount", { headers, params: query })
    .then((resp) => {
      response = resp;
    })
    .catch((err) => {
      if (err.response) {
        response = err.response;
      } else {
        console.log("Error", err.message);
      }
    });

  return response;
};
