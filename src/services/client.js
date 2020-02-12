import api from "./api";
import store from "../store";

export const NewClient = async value => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`
  };

  let response = {};
  await api
    .post("/client", value, { headers })
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

export const UpdateClient = async value => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`
  };

  let response = {};
  await api
    .put("/client", value, { headers })
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

export const DeleteClient = async id => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`
  };

  let response = {};
  await api
    .delete("/client", { headers, params: { id } })
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

export const GetClientByParams = async query => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`
  };

  let response = {};
  await api
    .get("/client", { headers, params: query })
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
