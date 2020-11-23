import api from "./api";
import { store } from "../store";

export const NewAward = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.post("/award", value, { headers });

    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const GetAllAwards = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/award", { headers, params: query });

    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const NewEquation = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.post("/award/equation", value, { headers });

    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const UpdateEquation = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.put("/award/equation", value, { headers });

    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const DeleteEquation = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.delete("/award/equation", {
      headers,
      params: value,
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
