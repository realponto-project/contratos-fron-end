import api from "./api";
import { store } from "../store";

export const NewContract = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.post("/contract", value, { headers });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const UpdateContract = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.put("/contract", value, { headers });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const GetContractByParams = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/contract", { headers, params: query });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const GetAllContract = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/contract/getAll", {
      headers,
      params: query,
    });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const GetLogsByCode = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/contract/getLogsByCode", {
      headers,
      params: query,
    });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const GetAllContractItem = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/contract/contractItem/getAll", {
      headers,
      params: query,
    });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};
