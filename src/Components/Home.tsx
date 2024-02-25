// Home.tsx

import React, { useState, useEffect } from 'react';
import Tab from '../Tab';
import EmployeeDetails from './EmployeeDetails';
// import OfficeDetails from './OfficeDetails';
import SelectDropdown from './SelectDropdown';

interface CustomTab {
  id: number;
  title: string;
}

interface Employee {
  id: number;
  employeeName: string;
  age: number;
}

const Home: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    name: localStorage.getItem('name') || '',
    department: localStorage.getItem('department') || '',
    edropdownOptions: [] as { value: string; label: string }[],
    eselectedDropdownOption: '',
    officedropdownOptions: ['Office 1', 'Office 2', 'Office 3'],
    officeselectedDropdownOption: 'Office1',
    checkboxValue: false,
    radioValue: 'radioOption1',
  });

  const [tabs, setTabs] = useState<CustomTab[]>([
    { id: 1, title: 'Home' },
  ]);

  const [activeTab, setActiveTab] = useState<number>(1); // Default to Home tab

  
  const [employeeDetailsTabs, setEmployeeDetailsTabs] = useState<{ [key: string]: Employee }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? isChecked : value,
    }));

    // Update local storage when the form data changes
    localStorage.setItem(name, type === 'checkbox' ? (isChecked ? 'true' : 'false') : value);
  };

  const handleTextboxDoubleClick = async (fieldName: string) => {
    const newTabTitle =
      fieldName === 'name'
        ? 'EmployeeDetails ' + formData.edropdownOptions.find((option) => option.value === formData.eselectedDropdownOption)?.label || ''
        : 'OfficeDetails';

    const existingTab = tabs.find((tab) => tab.title === newTabTitle);
    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      const newTabId = Math.max(...tabs.map((tab) => tab.id), 0) + 1;
      const newTabTitle =
      fieldName === 'name'
        ? 'EmployeeDetails ' + formData.edropdownOptions.find((option) => option.value === formData.eselectedDropdownOption)?.label || ''
        : 'OfficeDetails';
      // Add the new tab to the tabs array
      setTabs((prevTabs) => [...prevTabs, { id: newTabId, title: newTabTitle }]);

      // Set the new tab as the active tab
      setActiveTab(newTabId);

      if (fieldName === 'name' && formData.eselectedDropdownOption && !employeeDetailsTabs[newTabTitle]) {
        await fetchEmployeeDetails(formData.eselectedDropdownOption, newTabTitle);
      }
    }
  };

  const handleCloseTab = (tabId: number) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));

    if (activeTab === tabId) {
      const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[0].id : 1);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch('https://localhost:44348/Employee/Get');
      const data = await response.json();

      const formattedOptions = data.map((employee: Employee) => ({
        value: employee.id.toString(),
        label: employee.employeeName,
      }));
      console.log(formattedOptions);
      setEmployeeData(data);
      setFormData((prevData) => ({
        ...prevData,
        edropdownOptions: formattedOptions,
      }));
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const fetchEmployeeDetails = async (employeeId: string, tabTitle: string) => {
    try {
      const response = await fetch(`https://localhost:44348/Employee/GetByID?id=${employeeId}`);
      const employeeDetails = await response.json();

      // Ensure that the retrieved data has the expected properties
      if ('id' in employeeDetails && 'employeeName' in employeeDetails && 'age' in employeeDetails) {
        setEmployeeDetailsTabs((prevTabs) => ({
          ...prevTabs,
          [tabTitle]: employeeDetails,
        }));
      } else {
        console.error('Error: Employee details do not have expected properties');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    // Fetch employee data when the "Home" tab is active
    if (activeTab === 1) {
      fetchEmployeeData();
    }
  }, [activeTab]);
  return (
    <div style={{ padding: '20px', maxWidth: '910px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px' }}>
        {tabs.map((tab) => (
          <div key={tab.id} style={{ display: 'flex', backgroundColor: 'dodgerblue', alignItems: 'center', marginRight: '8px', marginBottom: '8px'  }}>
            <Tab tab={tab} isActive={activeTab === tab.id} onTabClick={() => setActiveTab(tab.id)} />

            {tab.title !== 'Home' && (
              <button style={{ backgroundColor: 'dodgerblue', marginLeft: '8px' }} onClick={() => handleCloseTab(tab.id)}>
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      {tabs.map((tab) =>
        activeTab === tab.id ? (
          <div key={tab.id}>
            {tab.title === 'Home' && (
              <div>
                <div style={{ display: 'flex', marginBottom: '8px' }}>
                  <div style={{ marginRight: '8px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '8px' }}>
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '16px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="Department" style={{ display: 'block', marginBottom: '8px' }}>
                      Department:
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '16px' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                  <div style={{ marginRight: '20px' }}>
                    <label htmlFor="dropdown" style={{ display: 'block', marginBottom: '8px' }}>
                      Employees:
                    </label>
                    <SelectDropdown
                      options={formData.edropdownOptions}
                      selectedOption={
                        formData.edropdownOptions.find((option) => option.value === formData.eselectedDropdownOption)?.label || ''
                      }
                      onSelectOption={(option) => setFormData((prevData) => ({ ...prevData, eselectedDropdownOption: option }))}
                      onDoubleClick={() => handleTextboxDoubleClick('name')}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      name="checkboxValue"
                      checked={formData.checkboxValue}
                      onChange={handleInputChange}
                      style={{ marginRight: '8px' }}
                    />
                    IsLiked
                  </label>
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="radioValue"
                      value="radioOption1"
                      checked={formData.radioValue === 'radioOption1'}
                      onChange={handleInputChange}
                      style={{ marginRight: '8px' }}
                    />
                    Type1
                  </label>
                </div>
                <div style={{ display: 'flex' }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="radioValue"
                      value="radioOption2"
                      checked={formData.radioValue === 'radioOption2'}
                      onChange={handleInputChange}
                    />
                    Type2
                  </label>
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: 'dodgerblue', color: '#fff', cursor: 'pointer' }}>
                  Submit
                </button>
              </div>
            )}
            {tab.title.startsWith('EmployeeDetails') && (
              <div>
                <EmployeeDetails
                  selectedEmployee={{
                    value: formData.eselectedDropdownOption,
                    label:
                      formData.edropdownOptions.find((option) => option.value === formData.eselectedDropdownOption)?.label || '',
                  }}
                  employeeDetails={employeeDetailsTabs[tab.title]}
                  onAddOption={(option, id) => {
                    const newOption = {
                      value: id,
                      label: option,
                    };
                    setFormData((prevData) => ({ ...prevData, edropdownOptions: [...prevData.edropdownOptions, newOption] }));
                  }}
                />
              </div>
            )}
            {/* {tab.title.startsWith('OfficeDetails') && (
              <div>
                <OfficeDetails
                  onAddOption={(option) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      officedropdownOptions: [...prevData.officedropdownOptions, option],
                    }))
                  }
                />
              </div>
            )} */}
          </div>
        ) : null
      )}
    </div>
  );
};

export default Home;
