// src/components/employee-list/EmployeeList.jsx
import React, { useState, useEffect } from 'react';
import EmployeeService from '../../services/EmployeeService';
import './employee-list.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await EmployeeService.getAllEmployees();
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await EmployeeService.deleteEmployee(id);
        setEmployees(employees.filter((employee) => employee.id !== id));
        alert('Employee deleted successfully!');
      } catch (err) {
        alert('Failed to delete employee: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="employee-list-container">
      <h2>Employee List</h2>
      {error && <p className="error">{error}</p>}
      {employees.length === 0 && !error ? (
        <p className="no-employees">No employees found.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Gender</th>
              <th>Start Date</th>
              <th>Notes</th>
              <th>Profile Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.salary}</td>
                <td>{employee.department.join(', ')}</td>
                <td>{employee.gender || 'N/A'}</td>
                <td>{employee.startDate || 'N/A'}</td>
                <td>{employee.notes || 'N/A'}</td>
                <td>
                  {employee.profileImagePath ? (
                    <img
                      src={`http://localhost:8080/${employee.profileImagePath}`}
                      alt="Profile"
                      className="profile-image"
                    />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;