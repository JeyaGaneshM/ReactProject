// EmployeeDetails.tsx

import React, { useState, useEffect } from 'react';

interface EmployeeDetailsProps {
  onAddOption: (option: string, id: string) => void;
  selectedEmployee: { value: string; label: string };
  employeeDetails: { id?: number; employeeName?: string; age?: number };
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ onAddOption, selectedEmployee, employeeDetails }) => {
  
  // Separate state for the initial data
  const [initialData, setInitialData] = useState({
    id: employeeDetails?.id || '',
    employeeName: employeeDetails?.employeeName || '',
    age: employeeDetails?.age || '',
  });


  const [formData, setFormData] = useState({
    id: employeeDetails?.id || '',
    employeeName: localStorage.getItem('employeeName') || '',
    age: localStorage.getItem('age') || '',
  });
  
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (selectedEmployee.value) {
          let data;
          console.log('Using selectedEmployee.value:', selectedEmployee.value);
          console.log('Using employeeDetails.id:', employeeDetails.id);
          if (employeeDetails?.id) {
            // If employeeDetails has an id, use it directly
            data = { ...employeeDetails };
          } else {
            // If not, fetch data from the API
            const response = await fetch(`https://localhost:44348/Employee/GetByID?id=${selectedEmployee.value}`);
            data = await response.json();
          }
          setInitialData({
            id: data.id.toString(),
            employeeName: data.employeeName,
            age: data.age.toString(),
          });
          setFormData({
            id: data.id.toString(),
            employeeName: data.employeeName,
            age: data.age.toString(),
          });
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, [selectedEmployee, employeeDetails]);

  useEffect(() => {
    // Set the initial values when the component mounts
    setFormData({
      id: employeeDetails?.id?.toString() || '',
      employeeName: employeeDetails?.employeeName || '',
      age: employeeDetails?.age?.toString() || '',
    });
  }, [employeeDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
  };

  const handleSubmit = () => {
    const baseUrl = 'https://localhost:44348';
    const endpoint = '/Employee/Save';

    const apiUrl = `${baseUrl}${endpoint}?id=${formData.id}&employeename=${formData.employeeName}&age=${formData.age}`;

    // const apiUrl = 'https://your-dotnet-api-url/api/employee/add';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // onAddOption(formData.employeeName, data.id);
        console.log(data);
        setFormData({
          id: data.id.toString(),
          employeeName: data.employeeName,
          age: data.age.toString(),
        });
        // Optionally, you can trigger some action or update state based on the API response
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="employeeName"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '16px' }}
        />

        <label htmlFor="age">Age:</label>
        <input
          type="text"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '16px' }}
        />

        <button type="button" onClick={handleSubmit}
        style={{ padding: '8px', width: '10%', boxSizing: 'border-box', marginBottom: '16px' }}>
          Submit
        </button>

      </div>
    </div>
  );
};

export default EmployeeDetails;
