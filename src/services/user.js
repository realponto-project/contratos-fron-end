import api from "./api";
import { store } from "../store";

export const NewUser = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .post("/user", value, { headers })
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

export const UpdateUser = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .put("/user", value, { headers })
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

export const UpdateUserTroll = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .put("/user/troll", value, { headers })
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

export const GetAllUsers = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .get("/user", { headers, params: query })
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

export const VerifyTroll = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  let response = {};
  await api
    .get("/user/verifyTroll", { headers, params: query })
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
