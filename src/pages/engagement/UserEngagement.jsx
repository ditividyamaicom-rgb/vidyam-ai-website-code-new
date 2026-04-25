import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabaseClinet";

// Multi-select Dropdown Component with Checkboxes matching the example design
const MultiSelectDropdown = ({ label, options, selectedValues, onChange, placeholder = "Select options..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const selectedCount = selectedValues.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-bold text-green-600 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
        {label}
      </label>
      <div className="relative">
        {/* Light blue header bar */}
        <div 
          className="bg-blue-100 rounded-t-md px-3 py-2 flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm font-medium text-gray-800">
            {selectedCount > 0 ? `${selectedCount} Selected` : placeholder}
          </span>
          <div className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center">
            <svg
              className={`text-blue-600 transition-transform ${!isOpen ? "transform rotate-180" : ""}`}
              style={{ width: '0.1rem', height: '0.1rem' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>

        {/* White dropdown body */}
        {isOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOption(option.value)}
                      className="sr-only"
                    />
                    {/* Custom square checkbox */}
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      isChecked 
                        ? "bg-blue-600 border-blue-600" 
                        : "bg-white border-gray-400"
                    }`}>
                      {isChecked && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const UserEngagement = () => {
  const [cohortFilters, setCohortFilters] = useState({
    medium: [],
    school: [],
    role: [],
    gender: [],
    class: [],
    activityStatus: [],
    phoneNumber: [],
    name: [],
  });

  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [cohortResults, setCohortResults] = useState([]);
  const [isCohortGenerated, setIsCohortGenerated] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState({ success: 0, failed: 0, total: 0 });
  const [logs, setLogs] = useState([]);

  const [message, setMessage] = useState("");
  const [isManual, setIsManual] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("reengangement_with_announcement");
  const [templateLanguage, setTemplateLanguage] = useState("hi");
  const [templateImageUrl, setTemplateImageUrl] = useState("");

  // Template management
  const [templateOptions, setTemplateOptions] = useState([
    { 
      value: "reengangement_with_announcement", 
      label: "Reengagement with Announcement", 
      requiresImage: false,
      defaultLanguage: "hi" 
    },
    { 
      value: "winter_rajai_msg2", 
      label: "Winter Rajai Message (Image)", 
      requiresImage: true,
      defaultLanguage: "en_US" 
    },
  ]);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    label: "",
    requiresImage: false,
    defaultLanguage: "hi"
  });

  // User data from Supabase
  const [allUserData, setAllUserData] = useState([]);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState({
    medium: [],
    school: [],
    role: [],
    gender: [],
    class: [],
    activityStatus: [],
  });

  // Helper function to check if selected template requires an image
  const selectedTemplateRequiresImage = () => {
    const template = templateOptions.find(t => t.value === selectedTemplate);
    return template ? template.requiresImage : false;
  };

  // Helper function to get default language for selected template
  const getDefaultLanguageForTemplate = (templateName) => {
    const template = templateOptions.find(t => t.value === templateName);
    return template ? template.defaultLanguage : "hi";
  };

  // Function to handle adding new template
  const handleAddNewTemplate = () => {
    setShowAddTemplateModal(true);
  };

  // Function to save new template
  const handleSaveNewTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.label.trim()) {
      alert("Please fill in all required fields (Template Name and Template Label)");
      return;
    }

    // Check if template name already exists
    if (templateOptions.some(t => t.value === newTemplate.name)) {
      alert("A template with this name already exists. Please use a different name.");
      return;
    }

    // Add new template to the list
    const templateToAdd = {
      value: newTemplate.name.trim(),
      label: newTemplate.label.trim(),
      requiresImage: newTemplate.requiresImage,
      defaultLanguage: newTemplate.defaultLanguage
    };

    setTemplateOptions(prev => [...prev, templateToAdd]);
    
    // Select the newly added template
    setSelectedTemplate(templateToAdd.value);
    setTemplateLanguage(templateToAdd.defaultLanguage);
    
    // Reset form and close modal
    setNewTemplate({
      name: "",
      label: "",
      requiresImage: false,
      defaultLanguage: "hi"
    });
    setShowAddTemplateModal(false);
    
    addLog(`New template "${templateToAdd.label}" added successfully`, 'success');
  };

  // Function to cancel adding new template
  const handleCancelAddTemplate = () => {
    setNewTemplate({
      name: "",
      label: "",
      requiresImage: false,
      defaultLanguage: "en_us"
    });
    setShowAddTemplateModal(false);
  };

  // Function to add log entries
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, type };
    setLogs(prev => [...prev, logEntry]);
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
  };

  // Function to extract unique values from user data for dropdowns
  const extractDropdownOptions = (userData) => {
    const options = {
      medium: new Set(),
      school: new Set(),
      role: new Set(),
      gender: new Set(),
      class: new Set(),
      activityStatus: new Set(),
    };

    userData.forEach((user) => {
      // Map language to medium
      if (user.language) options.medium.add(user.language.toLowerCase());
      
      // Map school
      if (user.school) options.school.add(user.school);
      
      // Map role
      if (user.role) options.role.add(user.role.toLowerCase());
      
      // Map grade to class
      if (user.grade) options.class.add(user.grade);
      
      // Map verified status to activityStatus
      if (user.verified !== undefined && user.verified !== null) {
        options.activityStatus.add(user.verified ? 'active' : 'inactive');
      }
    });

    // Convert Sets to arrays of {value, label} objects
    const formatOptions = (set, capitalize = false) => {
      return Array.from(set)
        .filter(val => val && val.trim() !== '')
        .sort()
        .map(val => ({
          value: val,
          label: capitalize ? val.charAt(0).toUpperCase() + val.slice(1) : val
        }));
    };

    return {
      medium: formatOptions(options.medium, true),
      school: formatOptions(options.school),
      role: formatOptions(options.role, true),
      gender: formatOptions(options.gender, true),
      class: formatOptions(options.class),
      activityStatus: formatOptions(options.activityStatus, true),
    };
  };

  // Function to fetch user data from Supabase
  const fetchUserData = async () => {
    setIsLoadingUserData(true);
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data) {
        setAllUserData(data);
        // Extract dropdown options from the data
        const options = extractDropdownOptions(data);
        setDropdownOptions(options);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      addLog(`Error fetching user data: ${error.message}`, 'error');
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Set default language for initial template on mount and fetch user data
  useEffect(() => {
    const defaultLang = getDefaultLanguageForTemplate(selectedTemplate);
    if (templateLanguage !== defaultLang) {
      setTemplateLanguage(defaultLang);
    }
    // Fetch user data on mount
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleFilterChange = (filterName, value) => {
    setCohortFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl("");
  };

  const handleSendMessages = async () => {
    if (!isCohortGenerated || cohortResults.length === 0) {
      addLog('Cannot send: No cohort generated', 'error');
      return;
    }

    setIsSending(true);
    setLogs([]); // Clear previous logs
    setSendStatus({ success: 0, failed: 0, total: cohortResults.length });

    addLog(`Starting to send messages to ${cohortResults.length} user(s)...`, 'info');

    const backendUrl = "/api/send-message";
    const headers = {
      "Content-Type": "application/json"
    };

    addLog('API Configuration: Backend endpoint configured', 'info');

    let successCount = 0;
    let failedCount = 0;
    const errorDetails = [];

    // Send messages to each user in the cohort
    for (let i = 0; i < cohortResults.length; i++) {
      const user = cohortResults[i];
      addLog(`\n--- Processing user ${i + 1}/${cohortResults.length}: ${user.name || 'Unknown'} ---`, 'info');
      
      try {
        // Step 1: Extract and format phone number
        addLog(`Step 1: Extracting phone number from: "${user.phoneNumber}"`, 'info');
        // Convert to string first in case it's a number
        const phoneNumberStr = String(user.phoneNumber || '');
        let phoneNumber = phoneNumberStr.replace(/\D/g, '');
        addLog(`  → After removing non-digits: "${phoneNumber}"`, 'info');
        
        if (!phoneNumber.startsWith('91') && phoneNumber.length === 10) {
          phoneNumber = '91' + phoneNumber;
          addLog(`  → Added country code: "${phoneNumber}"`, 'info');
        }

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10) {
          failedCount++;
          const errorMsg = `Invalid phone number: "${phoneNumber}" (length: ${phoneNumber.length})`;
          errorDetails.push(`${user.name || user.phoneNumber}: Invalid phone number`);
          addLog(`✗ ERROR: ${errorMsg}`, 'error');
          setSendStatus({ success: successCount, failed: failedCount, total: cohortResults.length });
          continue;
        }

        addLog(`✓ Phone number validated: ${phoneNumber}`, 'success');

        // Step 2: Prepare the message data for backend
        addLog('Step 2: Preparing message data...', 'info');
        
        // Check if manual message or template
        const templateId = isManual ? null : selectedTemplate;
        const manualMessage = isManual ? message.trim() : null;
        
        // Validate: If manual message, ensure it's not empty
        if (isManual && (!manualMessage || manualMessage.length === 0)) {
          failedCount++;
          const errorMsg = 'Manual message cannot be empty';
          errorDetails.push(`${user.name || phoneNumber}: ${errorMsg}`);
          addLog(`✗ ERROR: ${errorMsg}`, 'error');
          setSendStatus({ success: successCount, failed: failedCount, total: cohortResults.length });
          continue;
        }
        
        // Validate: If template, ensure image URL is provided for image-based templates
        if (!isManual && selectedTemplateRequiresImage()) {
          if (!templateImageUrl || templateImageUrl.trim() === '') {
            failedCount++;
            const errorMsg = 'Image URL is required for image-based templates';
            errorDetails.push(`${user.name || user.phoneNumber}: ${errorMsg}`);
            addLog(`✗ ERROR: ${errorMsg}`, 'error');
            setSendStatus({ success: successCount, failed: failedCount, total: cohortResults.length });
            continue;
          }
        }
        
        const payload = {
          userId: user.id || user.phoneNumber, // Use user ID or phone number as fallback
          message: manualMessage,
          templateId: templateId,
          // Add template language if using a template
          ...(!isManual && { templateLanguage: templateLanguage }),
          // Add image URL to payload if it's an image-based template
          ...(selectedTemplateRequiresImage() && templateImageUrl && { imageUrl: templateImageUrl.trim() })
        };

        if (isManual) {
          addLog(`  → Mode: Manual free-form message`, 'info');
          addLog(`  → Message: "${manualMessage}"`, 'info');
        } else {
          addLog(`  → Mode: Template message`, 'info');
          addLog(`  → Template: "${selectedTemplate}"`, 'info');
          addLog(`  → Language: "${templateLanguage}"`, 'info');
          if (selectedTemplateRequiresImage()) {
            addLog(`  → Image URL: "${templateImageUrl}"`, 'info');
          }
        }
        addLog(`  → Full request payload: ${JSON.stringify(payload, null, 2)}`, 'info');

        // Step 3: Send the message to backend
        addLog('Step 3: Sending HTTP request to backend API...', 'info');
        addLog(`  → URL: ${backendUrl}`, 'info');
        addLog(`  → Method: POST`, 'info');
        
        const requestStartTime = Date.now();
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload)
        });
        const requestDuration = Date.now() - requestStartTime;

        addLog(`  → Request completed in ${requestDuration}ms`, 'info');
        addLog(`  → HTTP Status: ${response.status} ${response.statusText}`, response.ok ? 'success' : 'error');

        // Step 4: Parse response
        addLog('Step 4: Parsing API response...', 'info');
        
        // Check content type before parsing
        const contentType = response.headers.get('content-type');
        let responseData;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            responseData = await response.json();
            addLog(`  → Full response: ${JSON.stringify(responseData, null, 2)}`, 'info');
          } catch (jsonError) {
            failedCount++;
            const errorMsg = `Failed to parse JSON response: ${jsonError.message}`;
            errorDetails.push(`${user.name || phoneNumber}: ${errorMsg}`);
            addLog(`✗ ERROR: ${errorMsg}`, 'error');
            addLog(`  → Response may not be valid JSON`, 'error');
            setSendStatus({ success: successCount, failed: failedCount, total: cohortResults.length });
            continue;
          }
        } else {
          // Handle non-JSON responses (like 404 HTML pages)
          const textResponse = await response.text();
          failedCount++;
          let errorMsg;
          
          if (response.status === 404) {
            errorMsg = `Backend endpoint not found (404). Please ensure /api/send-message endpoint is implemented on the backend.`;
            addLog(`✗ ERROR: Backend Endpoint Not Found`, 'error');
            addLog(`  → The /api/send-message endpoint does not exist on the backend`, 'error');
            addLog(`  → Please implement the backend endpoint as specified in the requirements`, 'error');
            addLog(`  → Response preview: ${textResponse.substring(0, 200)}...`, 'error');
          } else {
            errorMsg = `Unexpected response format. Expected JSON but received: ${contentType || 'unknown'}`;
            addLog(`✗ ERROR: Invalid Response Format`, 'error');
            addLog(`  → Expected: application/json`, 'error');
            addLog(`  → Received: ${contentType || 'unknown'}`, 'error');
            addLog(`  → Response preview: ${textResponse.substring(0, 200)}...`, 'error');
          }
          
          errorDetails.push(`${user.name || phoneNumber}: ${errorMsg}`);
          addLog(`✗ ERROR: ${errorMsg}`, 'error');
          setSendStatus({ success: successCount, failed: failedCount, total: cohortResults.length });
          continue;
        }

        // Step 5: Check for success
        addLog('Step 5: Validating response...', 'info');
        
        if (!response.ok) {
          failedCount++;
          let errorMsg = responseData.error 
            ? responseData.error
            : `HTTP Error: ${response.status} ${response.statusText}`;
          
          // Handle 24-hour session window error
          if (response.status === 400 && responseData.error && responseData.error.includes('24-hour')) {
            addLog(`✗ ERROR: 24-Hour Session Window`, 'error');
            addLog(`  → User is outside the 24-hour session window`, 'error');
            addLog(`  → Template message is required for users outside session window`, 'error');
            addLog(`  → Action: Clear manual message and use a template instead`, 'error');
          }
          
          errorDetails.push(`${user.name || phoneNumber}: ${errorMsg}`);
          addLog(`✗ ERROR: Request failed - ${errorMsg}`, 'error');
        } else if (responseData.status === 'sent-free-form' || responseData.status === 'sent-template') {
          const statusType = responseData.status === 'sent-free-form' ? 'Free-form message' : 'Template message';
          addLog(`✓ Message sent successfully!`, 'success');
          addLog(`  → Type: ${statusType}`, 'success');
          successCount++;
        } else {
          failedCount++;
          const errorMsg = 'Unexpected response format from backend';
          errorDetails.push(`${user.name || phoneNumber}: ${errorMsg}`);
          addLog(`✗ ERROR: ${errorMsg}`, 'error');
          addLog(`  → Response structure: ${JSON.stringify(responseData, null, 2)}`, 'error');
        }
      } catch (error) {
        failedCount++;
        const errorMsg = error.message || 'Network error';
        errorDetails.push(`${user.name || user.phoneNumber}: ${errorMsg}`);
        addLog(`✗ EXCEPTION: ${errorMsg}`, 'error');
        addLog(`  → Error stack: ${error.stack || 'N/A'}`, 'error');
        console.error(`✗ Error sending to ${user.phoneNumber}:`, error);
      }

      // Update status
      setSendStatus({ success: successCount, failed: failedCount, total: cohortResults.length });
    }

    setIsSending(false);

    // Add final summary logs
    addLog('\n=== MESSAGE SENDING COMPLETE ===', 'info');
    addLog(`Total Users: ${cohortResults.length}`, 'info');
    addLog(`Successfully Sent: ${successCount}`, successCount > 0 ? 'success' : 'info');
    addLog(`Failed: ${failedCount}`, failedCount > 0 ? 'error' : 'info');
    
    if (errorDetails.length > 0) {
      addLog('\n--- ERROR DETAILS ---', 'error');
      errorDetails.forEach((error, index) => {
        addLog(`${index + 1}. ${error}`, 'error');
      });
    }

    // Show completion message with details
    let statusMessage = `Message Sending Complete\n\nSuccess: ${successCount}\nFailed: ${failedCount}\nTotal: ${cohortResults.length}`;
    
    if (errorDetails.length > 0) {
      statusMessage += `\n\nError Details:\n${errorDetails.slice(0, 5).join('\n')}`;
      if (errorDetails.length > 5) {
        statusMessage += `\n... and ${errorDetails.length - 5} more errors`;
      }
      statusMessage += `\n\nPlease check the logs panel below for full details.`;
    }
    
    if (successCount > 0 && failedCount === 0) {
      addLog('✓ All messages sent successfully!', 'success');
      alert(statusMessage);
    } else if (successCount > 0 && failedCount > 0) {
      addLog('⚠ Some messages failed. Check error details above.', 'error');
      alert(statusMessage);
    } else {
      addLog('✗ All messages failed. Check error details above.', 'error');
      alert(statusMessage + `\n\nPossible issues:\n- Phone number format incorrect\n- Template not approved\n- WhatsApp Business API not configured\n- Check logs panel for detailed errors`);
    }
    
    // Log all details to console
    console.log('=== Message Sending Summary ===');
    console.log(`Success: ${successCount}, Failed: ${failedCount}, Total: ${cohortResults.length}`);
    if (errorDetails.length > 0) {
      console.log('Error Details:', errorDetails);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    setPhoneNumberInput(input);
    
    // Parse phone numbers: split by comma, newline, or space, then filter out empty strings
    const phoneNumbers = input
      .split(/[,\n\s]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0);
    
    handleFilterChange("phoneNumber", phoneNumbers);
  };

  const handleNameChange = (e) => {
    const input = e.target.value;
    setNameInput(input);
    
    // Parse names: split by comma, newline, or space, then filter out empty strings
    const names = input
      .split(/[,\n\s]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    handleFilterChange("name", names);
  };

  const handleGenerateCohort = () => {
    // Start with all user data
    let filteredData = [...allUserData];

    // Filter by medium (language)
    if (cohortFilters.medium.length > 0) {
      filteredData = filteredData.filter(user => 
        user.language && cohortFilters.medium.includes(user.language.toLowerCase())
      );
    }

    // Filter by school
    if (cohortFilters.school.length > 0) {
      filteredData = filteredData.filter(user => 
        user.school && cohortFilters.school.includes(user.school)
      );
    }

    // Filter by role
    if (cohortFilters.role.length > 0) {
      filteredData = filteredData.filter(user => 
        user.role && cohortFilters.role.includes(user.role.toLowerCase())
      );
    }

    // Filter by class (grade)
    if (cohortFilters.class.length > 0) {
      filteredData = filteredData.filter(user => 
        user.grade && cohortFilters.class.includes(user.grade)
      );
    }

    // Filter by activityStatus (verified)
    if (cohortFilters.activityStatus.length > 0) {
      filteredData = filteredData.filter(user => {
        if (user.verified === undefined || user.verified === null) return false;
        const status = user.verified ? 'active' : 'inactive';
        return cohortFilters.activityStatus.includes(status);
      });
    }

    // Filter by manually entered phone numbers
    if (cohortFilters.phoneNumber.length > 0) {
      const phoneNumbers = cohortFilters.phoneNumber.map(phone => 
        phone.replace(/\D/g, '') // Remove non-digits
      );
      filteredData = filteredData.filter(user => {
        if (!user.mobile_no) return false;
        const userPhone = user.mobile_no.replace(/\D/g, '');
        return phoneNumbers.some(phone => 
          userPhone.includes(phone) || phone.includes(userPhone)
        );
      });
    }

    // Filter by manually entered names
    if (cohortFilters.name.length > 0) {
      const namesLower = cohortFilters.name.map(name => name.toLowerCase().trim());
      filteredData = filteredData.filter(user => {
        if (!user.name) return false;
        return namesLower.some(name => 
          user.name.toLowerCase().includes(name) || name.includes(user.name.toLowerCase())
        );
      });
    }

    // Transform filtered data to cohort results format
    const results = filteredData.map((user, index) => ({
      id: user.id || index + 1,
      name: user.name || "N/A",
      phoneNumber: user.mobile_no || "N/A",
      medium: user.language || "N/A",
      school: user.school || "N/A",
      role: user.role || "N/A",
      gender: user.gender || "N/A",
      class: user.grade || "N/A",
      activityStatus: user.verified !== undefined && user.verified !== null 
        ? (user.verified ? "Active" : "Inactive") 
        : "N/A",
    }));

    setCohortResults(results);
    setIsCohortGenerated(true);
    
    addLog(`Cohort generated: ${results.length} user(s) found`, 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Page Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            User Engagement Dashboard
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Manage cohorts and send targeted messages</p>
        </div>

        {/* 1. Cohort Builder Section */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-xl">👥</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontWeight: 'bold', color: '#16a34a' }}>Cohort Builder</h2>
            </div>
            <button
              onClick={fetchUserData}
              disabled={isLoadingUserData}
              className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center gap-2"
            >
              <span>{isLoadingUserData ? "🔄" : "🔄"}</span>
              {isLoadingUserData ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>

          {isLoadingUserData && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="text-blue-700 text-sm font-medium">Loading user data from Supabase...</p>
              </div>
            </div>
          )}

          {!isLoadingUserData && allUserData.length === 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <p className="text-yellow-800 text-sm font-medium">No user data available. Click "Refresh Data" to load data from Supabase.</p>
              </div>
            </div>
          )}

          {!isLoadingUserData && allUserData.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <p className="text-green-800 text-sm font-semibold">
                  <span className="font-bold">Loaded:</span> {allUserData.length} user(s) from database
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {/* Medium Multi-select */}
            <MultiSelectDropdown
              label="Medium"
              options={dropdownOptions.medium}
              selectedValues={cohortFilters.medium}
              onChange={(values) => handleFilterChange("medium", values)}
              placeholder="Select medium..."
            />

            {/* School Multi-select */}
            <MultiSelectDropdown
              label="School"
              options={dropdownOptions.school}
              selectedValues={cohortFilters.school}
              onChange={(values) => handleFilterChange("school", values)}
              placeholder="Select school..."
            />

            {/* Role Multi-select */}
            <MultiSelectDropdown
              label="Role"
              options={dropdownOptions.role}
              selectedValues={cohortFilters.role}
              onChange={(values) => handleFilterChange("role", values)}
              placeholder="Select role..."
            />

            {/* Gender Multi-select */}
            <MultiSelectDropdown
              label="Gender"
              options={dropdownOptions.gender}
              selectedValues={cohortFilters.gender}
              onChange={(values) => handleFilterChange("gender", values)}
              placeholder="Select gender..."
            />

            {/* Class Multi-select */}
            <MultiSelectDropdown
              label="Class"
              options={dropdownOptions.class}
              selectedValues={cohortFilters.class}
              onChange={(values) => handleFilterChange("class", values)}
              placeholder="Select class..."
            />

            {/* Activity Status Multi-select */}
            <MultiSelectDropdown
              label="Activity Status"
              options={dropdownOptions.activityStatus}
              selectedValues={cohortFilters.activityStatus}
              onChange={(values) => handleFilterChange("activityStatus", values)}
              placeholder="Select activity status..."
            />

            {/* Phone Number Filter */}
            <div>
              <label className="block text-sm font-bold text-green-600 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                Phone Number
              </label>
              <textarea
                type="tel"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
                placeholder="Enter phone numbers (one per line or comma-separated)..."
                value={phoneNumberInput}
                onChange={handlePhoneNumberChange}
              />
              {cohortFilters.phoneNumber.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {cohortFilters.phoneNumber.length} phone number(s) entered
                </p>
              )}
            </div>

            {/* Name Filter */}
            <div>
              <label className="block text-sm font-bold text-green-600 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                Name
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
                placeholder="Enter names (one per line or comma-separated)..."
                value={nameInput}
                onChange={handleNameChange}
              />
              {cohortFilters.name.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {cohortFilters.name.length} name(s) entered
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-start mb-6">
            <button 
              onClick={handleGenerateCohort}
              className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
            >
              <span className="text-lg">🚀</span>
              Generate Cohort
            </button>
          </div>

          {/* Results Table */}
          {isCohortGenerated ? (
            <div className="border border-gray-200 rounded-xl mb-4 overflow-x-auto shadow-inner bg-gray-50">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-green-700">
                    <th className="border border-green-600 px-4 py-4 text-left text-sm font-bold text-white">
                      👤 Name
                    </th>
                    <th className="border border-green-600 px-4 py-4 text-left text-sm font-bold text-white">
                      📱 Phone Number
                    </th>
                    <th className="border border-green-600 px-4 py-4 text-left text-sm font-bold text-white">
                      📚 Medium
                    </th>
                    <th className="border border-green-600 px-4 py-4 text-left text-sm font-bold text-white">
                      🏫 School
                    </th>
                    <th className="border border-green-600 px-4 py-4 text-left text-sm font-bold text-white">
                      👔 Role
                    </th>
                    <th className="border border-green-600 px-4 py-4 text-left text-sm font-bold text-white">
                      ⚧️ Gender
                    </th>
                    <th className="border border-green-600 px-4 py-4 text-left text-sm font-bold text-white">
                      📖 Class
                    </th>
                    <th className="border border-green-600 px-4 py-4 text-left text-sm font-bold text-white">
                      ✅ Activity Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cohortResults.map((result, index) => (
                    <tr key={result.id} className={`hover:bg-green-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800 font-medium">
                        {result.name}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        {result.phoneNumber}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        {result.medium}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        {result.school}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        {result.role}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        {result.gender}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        {result.class}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          result.activityStatus === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {result.activityStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-4 bg-gray-50">
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-gray-500 text-sm font-medium">
                  No cohort results yet. Select filters and click "Generate Cohort" to see results.
                </p>
              </div>
            </div>
          )}

          {/* User Count */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span className="text-sm font-semibold text-gray-700">Total Users:</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {isCohortGenerated ? cohortResults.length : 0}
              </span>
            </div>
          </div>
        </section>

        {/* 2. Message Composer Section */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl">✉️</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontWeight: 'bold', color: '#16a34a' }}>Message Composer</h2>
          </div>
          
          <div className="space-y-5">
            {/* Message Textarea */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                💬 Message <span className="text-gray-500 font-normal text-xs">(Optional - Template will be used if empty)</span>
              </label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px] transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Type your custom message here (optional). If left empty, the template message will be sent..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setIsManual(e.target.value.trim().length > 0);
                }}
              />
            </div>

            {/* Image Upload (Optional) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                🖼️ Image Upload <span className="text-gray-500 font-normal text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
              {selectedImage && (
                <div className="mt-2 relative inline-block">
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md transition-colors z-10"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="max-w-xs h-auto rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Video URL Input (Optional) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                🎥 Video URL <span className="text-gray-500 font-normal text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                {videoUrl && (
                  <button
                    onClick={handleRemoveVideo}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg transition-all hover:scale-110"
                    title="Remove video URL"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Template Selection Section */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl">📋</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontWeight: 'bold', color: '#16a34a' }}>Template Selection</h2>
          </div>
          
          <div className="space-y-5">
            {/* Template Name Dropdown */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                📝 Select Template <span className="text-red-500">*</span>
              </label>
              <select
                disabled={isManual}
                value={selectedTemplate}
                onChange={(e) => {
                  const newTemplateValue = e.target.value;
                  
                  // Check if "Add New Template" was selected
                  if (newTemplateValue === "add_new_template") {
                    handleAddNewTemplate();
                    // Reset select dropdown to previous value immediately
                    setTimeout(() => {
                      e.target.value = selectedTemplate;
                    }, 0);
                    return;
                  }
                  
                  setSelectedTemplate(newTemplateValue);
                  
                  // Set default language for the selected template
                  const defaultLang = getDefaultLanguageForTemplate(newTemplateValue);
                  setTemplateLanguage(defaultLang);
                  
                  // Clear image URL if switching to non-image template
                  const newTemplate = templateOptions.find(t => t.value === newTemplateValue);
                  if (!newTemplate || !newTemplate.requiresImage) {
                    setTemplateImageUrl("");
                  }
                }}
                className={`w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200 shadow-sm hover:shadow-md ${
                  isManual ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
              >
                {templateOptions.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
                <option value="add_new_template" style={{ fontStyle: 'italic', color: '#16a34a' }}>
                  + Add New Template
                </option>
              </select>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>💡</span> {isManual 
                  ? 'Template selection is disabled when a manual message is entered. Clear the message to enable template selection.'
                  : 'The selected template will be used to send messages to the cohort.'}
              </p>
            </div>

            {/* Template Image URL Input (shown only for image-based templates) */}
            {selectedTemplateRequiresImage() && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                  🖼️ Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={templateImageUrl}
                  onChange={(e) => setTemplateImageUrl(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Enter the URL of the image to be sent with the template message.
                </p>
                {templateImageUrl && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-700 mb-2 font-semibold">Image Preview:</p>
                    <img
                      src={templateImageUrl}
                      alt="Template preview"
                      className="max-w-full h-auto rounded-lg border-2 border-gray-200 shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const errorMsg = e.target.nextElementSibling;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                    />
                    <p className="text-xs text-red-500 mt-2 font-medium" style={{ display: 'none' }}>
                      ❌ Failed to load image. Please check the URL.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Template Info Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-5 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <p className="text-sm text-gray-800">
                    <span className="font-bold">Selected Template:</span>{" "}
                    <span className="text-gray-700 font-semibold">{selectedTemplate}</span>
                  </p>
                </div>
                {selectedTemplateRequiresImage() && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🖼️</span>
                    <p className="text-sm text-gray-800">
                      <span className="font-bold">Template Type:</span>{" "}
                      <span className="text-gray-700 font-semibold">Image-based (requires image URL)</span>
                    </p>
                  </div>
                )}
                <div className="pt-2 border-t border-blue-200">
                  <p className="text-xs text-gray-700 mb-2">
                    The template will include the user's name as a parameter in the message body.
                  </p>
                  {selectedTemplateRequiresImage() && (
                    <div className="mb-2">
                      {templateImageUrl ? (
                        <span className="text-green-700 font-semibold flex items-center gap-1">
                          <span>✅</span> Image URL provided
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold flex items-center gap-1">
                          <span>⚠️</span> Image URL is required
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-3 p-2 bg-white rounded border border-blue-200">
                    💡 <span className="font-medium">Tip:</span> The language code is automatically set based on the selected template. Ensure the template name matches your approved templates in Meta Business Manager.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add New Template Modal */}
        {showAddTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-green-600 mb-4" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                Add New Template
              </h3>
              
              <div className="space-y-4">
                {/* Template Name */}
                <div>
                  <label className="block text-sm font-bold text-green-600 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., welcome_message"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use lowercase with underscores (e.g., welcome_message)
                  </p>
                </div>

                {/* Template Label */}
                <div>
                  <label className="block text-sm font-bold text-green-600 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                    Template Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTemplate.label}
                    onChange={(e) => setNewTemplate({ ...newTemplate, label: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Welcome Message"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Display name for the template
                  </p>
                </div>

                {/* Default Language */}
                <div>
                  <label className="block text-sm font-bold text-green-600 mb-2" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                    Default Language Code
                  </label>
                  <select
                    value={newTemplate.defaultLanguage}
                    onChange={(e) => setNewTemplate({ ...newTemplate, defaultLanguage: e.target.value })}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                  isManual ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
                  >
                    <option value="hi">Hindi</option>
                    <option value="en">English</option>
                    <option value="en_US">English (US)</option>
                    <option value="ta">Tamil</option>
                  </select>
                </div>

                {/* Requires Image */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTemplate.requiresImage}
                      onChange={(e) => setNewTemplate({ ...newTemplate, requiresImage: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-bold text-green-600" style={{ fontWeight: 'bold', color: '#16a34a' }}>
                      Requires Image (Image-based template)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Check this if the template requires an image URL in the header
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveNewTemplate}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={handleCancelAddTemplate}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Message Preview & Send Section */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl">📱</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontWeight: 'bold', color: '#16a34a' }}>Message Preview / Send</h2>
          </div>
          
          <div className="space-y-5">
            {/* WhatsApp-style Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200 shadow-inner">
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-md space-y-4">
                {/* Template Image Preview (for image-based templates) */}
                {selectedTemplateRequiresImage() && templateImageUrl && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Template Image:</p>
                    <img
                      src={templateImageUrl}
                      alt="Template preview"
                      className="max-w-full h-auto rounded-md border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const errorMsg = e.target.nextElementSibling;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                    />
                    <p className="text-xs text-red-500 mt-1" style={{ display: 'none' }}>
                      Failed to load image. Please check the URL.
                    </p>
                  </div>
                )}
                
                {/* Message Text */}
                {message ? (
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{message}</p>
                ) : (
                  <div>
                    <p className="text-gray-400 text-sm italic mb-2">No custom message entered</p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Template Message:</span> The template <span className="font-semibold text-gray-800">"{selectedTemplate}"</span> will be sent with the user's name as a parameter.
                      {selectedTemplateRequiresImage() && (
                        <span className="block mt-1 text-xs text-gray-500">
                          {templateImageUrl ? `Image will be included: ${templateImageUrl}` : '⚠️ Image URL is required for this template'}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                {/* Image Preview (Optional - from Message Composer) */}
                {selectedImage && (
                  <div className="mt-3 relative inline-block">
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md transition-colors z-10"
                      title="Remove image"
                    >
                      ×
                    </button>
                    <img
                      src={selectedImage}
                      alt="Message attachment"
                      className="max-w-full h-auto rounded-md border border-gray-200"
                    />
                  </div>
                )}
                
                {/* Video Preview (Optional) */}
                {videoUrl && (
                  <div className="mt-3 relative">
                    <button
                      onClick={handleRemoveVideo}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md transition-colors z-10"
                      title="Remove video URL"
                    >
                      ×
                    </button>
                    <div className="bg-gray-100 rounded-md p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Video URL:</p>
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline break-all"
                      >
                        {videoUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cohort Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <p className="text-sm font-semibold text-gray-700">Cohort Summary:</p>
                </div>
                {isCohortGenerated && cohortResults.length > 0 ? (
                  <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {cohortResults.length} user(s) selected
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 font-medium">No cohort generated yet</span>
                )}
              </div>
            </div>

            {/* Send Status */}
            {isSending && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                    <p className="text-sm font-semibold text-gray-800">Sending messages...</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {sendStatus.success + sendStatus.failed} / {sendStatus.total} sent
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${((sendStatus.success + sendStatus.failed) / sendStatus.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Logs Panel */}
            {(logs.length > 0 || isSending) && (
              <div className="bg-gray-900 border border-gray-700 rounded-md p-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-green-400 font-bold text-sm" style={{ fontWeight: 'bold', color: '#16a34a' }}>Message Sending Logs</h3>
                  <button
                    onClick={() => setLogs([])}
                    className="bg-black hover:bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md transition-colors font-semibold"
                  >
                    Clear Logs
                  </button>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  {logs.length === 0 ? (
                    <p className="text-gray-500">Waiting for logs...</p>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className={`${
                          log.type === 'error' ? 'text-red-400' :
                          log.type === 'success' ? 'text-green-400' :
                          'text-gray-300'
                        }`}
                      >
                        <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                        <span className={`${
                          log.type === 'error' ? 'text-red-400 font-bold' :
                          log.type === 'success' ? 'text-green-400 font-bold' :
                          ''
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Send Messages Button */}
            <button 
              onClick={handleSendMessages}
              disabled={
                (!isCohortGenerated || cohortResults.length === 0) || 
                isSending ||
                (!isManual && selectedTemplateRequiresImage() && (!templateImageUrl || templateImageUrl.trim() === ''))
              }
              className={`w-full font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-base ${
                isCohortGenerated && 
                cohortResults.length > 0 && 
                !isSending &&
                (!selectedTemplateRequiresImage() || (templateImageUrl && templateImageUrl.trim() !== ''))
                  ? "bg-black hover:bg-gray-800 text-white cursor-pointer transform hover:-translate-y-0.5 hover:shadow-xl"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending... ({sendStatus.success + sendStatus.failed}/{sendStatus.total})</span>
                </>
              ) : selectedTemplateRequiresImage() && (!templateImageUrl || templateImageUrl.trim() === '') ? (
                <>
                  <span>⚠️</span>
                  <span>Send Messages (Image URL Required)</span>
                </>
              ) : (
                <>
                  <span>📤</span>
                  <span>Send Messages</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 5. Campaign History Section */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl">📈</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontWeight: 'bold', color: '#16a34a' }}>Campaign History</h2>
          </div>
          
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-inner bg-gray-50">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-orange-600 to-orange-700">
                  <th className="border border-orange-600 px-4 py-4 text-left text-sm font-bold text-white">
                    📝 Campaign Name
                  </th>
                  <th className="border border-orange-600 px-4 py-4 text-left text-sm font-bold text-white">
                    👥 Cohort
                  </th>
                  <th className="border border-orange-600 px-4 py-4 text-left text-sm font-bold text-white">
                    📤 Sent
                  </th>
                  <th className="border border-orange-600 px-4 py-4 text-left text-sm font-bold text-white">
                    ✅ Delivered
                  </th>
                  <th className="border border-orange-600 px-4 py-4 text-left text-sm font-bold text-white">
                    👁️ Read
                  </th>
                  <th className="border border-orange-600 px-4 py-4 text-left text-sm font-bold text-white">
                    📅 Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-8 text-sm text-gray-500 text-center bg-white" colSpan="6">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📊</span>
                      <p className="font-medium">No campaign history available</p>
                      <p className="text-xs text-gray-400">Campaigns will appear here after sending messages</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserEngagement;


