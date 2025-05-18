import React, { useState } from 'react';
import './payroll-form.css';
import EmployeeService from '../../services/EmployeeService';

const PayrollForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    profileImage: null,
    profileImagePath: null,
    gender: '',
    department: [],
    salary: '',
    startDate: { day: '1', month: 'January', year: '2020' },
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const departments = ['HR', 'Sales', 'Finance', 'Engineer', 'Others'];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 26 }, (_, i) => (2025 - i).toString());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file, profileImagePath: null });
    setErrors({ ...errors, profileImage: '' });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedDepts = checked
        ? [...prev.department, value]
        : prev.department.filter((dept) => dept !== value);
      return { ...prev, department: updatedDepts };
    });
    setErrors({ ...errors, department: '' });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      startDate: { ...prev.startDate, [name]: value }
    }));
    setErrors({ ...errors, startDate: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name || formData.name.trim() === '') {
      setErrors((prev) => ({ ...prev, name: 'Name is required and cannot be empty or whitespace' }));
      return;
    }
    if (!formData.salary || Number(formData.salary) <= 0) {
      setErrors((prev) => ({ ...prev, salary: 'Salary is required and must be greater than 0' }));
      return;
    }
    if (formData.department.length === 0) {
      setErrors((prev) => ({ ...prev, department: 'At least one department must be selected' }));
      return;
    }
    const today = new Date();
    const selectedDate = new Date(
      `${formData.startDate.month} ${formData.startDate.day}, ${formData.startDate.year}`
    );
    if (selectedDate > today) {
      setErrors((prev) => ({ ...prev, startDate: 'Start date cannot be in the future' }));
      return;
    }

    const employeeData = {
      name: formData.name,
      salary: Number(formData.salary),
      department: formData.department,
      gender: formData.gender || null,
      startDate: `${formData.startDate.day} ${formData.startDate.month} ${formData.startDate.year}`,
      notes: formData.notes || null
    };

    const formDataToSend = new FormData();
    formDataToSend.append('employee', JSON.stringify(employeeData));
    if (formData.profileImage) {
      formDataToSend.append('profileImage', formData.profileImage);
    }

    EmployeeService.addEmployee(formDataToSend)
      .then(() => {
        alert('Employee added successfully!');
        handleReset();
      })
      .catch((error) => {
        console.error('Error adding employee:', error);
        alert('Failed to add employee: ' + (error.response?.data?.message || error.message));
      });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      profileImage: null,
      profileImagePath: null,
      gender: '',
      department: [],
      salary: '',
      startDate: { day: '1', month: 'January', year: '2020' },
      notes: ''
    });
    setErrors({});
  };

  return (
    <div className="payroll-form-container">
      <h2>Employee Payroll Form</h2>
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-field">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your name..."
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-field">
          <label>Profile Image</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {formData.profileImagePath ? (
            <div className="image-preview">
              <img src={`http://localhost:8080/${formData.profileImagePath}`} alt="Profile Preview" />
            </div>
          ) : formData.profileImage ? (
            <div className="image-preview">
              <img src={URL.createObjectURL(formData.profileImage)} alt="Profile Preview" />
            </div>
          ) : null}
        </div>

        <div className="form-field">
          <label>Gender</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleInputChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleInputChange}
              />
              Female
            </label>
          </div>
        </div>

        <div className="form-field">
          <label>Department</label>
          <div className="checkbox-group">
            {departments.map((dept) => (
              <label key={dept}>
                <input
                  type="checkbox"
                  name="department"
                  value={dept}
                  checked={formData.department.includes(dept)}
                  onChange={handleCheckboxChange}
                />
                {dept}
              </label>
            ))}
          </div>
          {formData.department.length === 0 ? (
            <p className="warning">Please select at least one department</p>
          ) : null}
          {errors.department && <p className="error">{errors.department}</p>}
        </div>

        <div className="form-field">
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleInputChange}
          />
          {errors.salary && <p className="error">{errors.salary}</p>}
        </div>

        <div className="form-field">
          <label>Start Date</label>
          <div className="date-group">
            <select
              name="day"
              value={formData.startDate.day}
              onChange={handleDateChange}
            >
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              name="month"
              value={formData.startDate.month}
              onChange={handleDateChange}
            >
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              name="year"
              value={formData.startDate.year}
              onChange={handleDateChange}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {errors.startDate && <p className="error">{errors.startDate}</p>}
        </div>

        <div className="form-field">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleReset}>Cancel</button>
          <button type="submit">Submit</button>
          <button type="reset" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default PayrollForm;