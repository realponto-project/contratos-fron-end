import api from "./api";
import { store } from "../store";

export const NewTypeAccount = async (value) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.post("/typeAccount", value, { headers });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};

export const GetAllTypeAccounts = async (query) => {
  const storeObject = store.getState();

  const headers = {
    authorization: `Bearer ${storeObject.login.token}`,
  };

  try {
    const response = await api.get("/typeAccount", { headers, params: query });
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};
