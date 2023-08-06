import axios from 'axios'
import authHeader from './auth.header'

const upload = data => {
  return axios.post(`/upload`, data, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
  })
}

const getFiles = () => {
  return axios.get(`/file`, {
    headers: { ...authHeader() }
  })
}

const UserService = {
  upload,
  getFiles
}

export default UserService
