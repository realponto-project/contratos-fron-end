import api from "./api";

export const login = async (value) => {
  try {
    const response = await api.post("/sessions", value);
    return response;
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log("Error", err.message);
    }
  }
};
