import axios from "axios";
import authHeader from "./auth.header";

const upload = (data) => {
    return axios.post(`/upload`, data, {
      headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
    });
  };
  
  const UserService = {
    upload,
  };
  
  export default UserService;