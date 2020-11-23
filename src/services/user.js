import api from "./api";
import { store } from "../store";

export const NewUser = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.post("/user", value, { headers });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const UpdateUser = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.put("/user", value, { headers });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const UpdateUserTroll = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.put("/user/troll", value, { headers });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const GetAllUsers = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/user", { headers, params: query });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const VerifyTroll = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/user/verifyTroll", {
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
