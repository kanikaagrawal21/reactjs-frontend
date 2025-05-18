// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PayrollForm from './components/payroll-form/payroll-form.jsx';
import EmployeeList from './components/employee-list/EmployeeList.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Employee Payroll</h1>
        </header>
        <Routes>
          <Route path="/add-employee" element={<PayrollForm />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route
            path="/"
            element={
              <div className="welcome-message">
                Welcome to Employee Payroll!{' '}
                <Link to="/add-employee" className="add-link">
                  Add Employee
                </Link>{' '}
                |{' '}
                <Link to="/employees" className="add-link">
                  View Employees
                </Link>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;