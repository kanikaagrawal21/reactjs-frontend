// src/services/EmployeeService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/employee';

const addEmployee = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getAllEmployees = () => {
  return axios.get(API_URL);
};

const deleteEmployee = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default { addEmployee, getAllEmployees, deleteEmployee };