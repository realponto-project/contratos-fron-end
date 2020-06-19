import api from "./api";
import { store } from "../store";

export const NewAward = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .post("/award", value, { headers })
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

export const GetAllAwards = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .get("/award", { headers, params: query })
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

export const NewEquation = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .post("/award/equation", value, { headers })
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
