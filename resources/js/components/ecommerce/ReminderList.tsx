import React, { useState, useEffect } from 'react'

const initialReminders = [
  { 
    id: 1, 
    title: "Service Due", 
    vehicle: "TRK-001 - Freightliner", 
    priority: "high", 
    date: "2023-07-15" 
  },
  { 
    id: 2, 
    title: "License Renewal", 
    vehicle: "VAN-002 - Ford Transit", 
    priority: "medium", 
    date: "2023-07-20" 
  },
  { 
    id: 3, 
    title: "Insurance Expiry", 
    vehicle: "TRK-002 - Kenworth T680", 
    priority: "high", 
    date: "2023-08-01" 
  },
  { 
    id: 4, 
    title: "Tire Rotation", 
    vehicle: "CAR-001 - Toyota Camry", 
    priority: "low", 
    date: "2023-07-18" 
  },
  { 
    id: 5, 
    title: "Brake Inspection", 
    vehicle: "SUV-003 - Honda CR-V", 
    priority: "medium", 
    date: "2023-08-05" 
  },
];

// Helper function to get priority tag colors
const getPriorityClasses = (priority: string) => {
  switch (priority) {
    case 'high':
      return "bg-red-500 text-white"; // Red background for high
    case 'medium':
      return "bg-gray-700 text-white"; // Dark background for medium
    case 'low':
      return "bg-gray-300 text-gray-800"; // Light background for low
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function ReminderList() {
     const [reminders] = useState(initialReminders);
  
  // Icon for the notification bell (SVG)
  const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );

  return (
    // Outer container matching the image's overall card
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      
      {/* --- Header Section (Upcoming Reminders & Add Button) --- */}
      <header className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Upcoming Reminders
        </h2>
        <button 
          className="flex items-center space-x-1 px-4 py-2 text-white-600 text-black font-medium rounded-lg hover:text-white-700 transition duration-150 border border-gray-300 hover:bg-gray-50"
        >
          <span className="text-xl">+</span>
          <span>Add Reminder</span>
        </button>
      </header>
      
      {/* --- Reminder Items List --- */}
      <div className="space-y-4">
        {reminders.map((reminder) => (
          // Individual Reminder Item Structure (Matches the screenshot)
          <div 
            key={reminder.id} 
            // Item background and rounded corners to match the internal items
            className="bg-gray-50 p-4 rounded-xl flex items-center justify-between transition duration-150 hover:shadow-md"
          >
            
            {/* Left Section: Icon and Text */}
            <div className="flex items-start space-x-3">
              <div className="pt-1">
                <BellIcon />
              </div>
              
              {/* Reminder Title and Sub-text */}
              <div>
                <p className="text-base font-medium text-gray-900">
                  {reminder.title}
                </p>
                <p className="text-sm text-gray-500">
                  {reminder.vehicle}
                </p>
              </div>
            </div>

            {/* Right Section: Priority Tag and Date */}
            <div className="text-right flex flex-col items-end space-y-1">
              
              {/* Priority Tag */}
              <span 
                className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${getPriorityClasses(reminder.priority)}`}
              >
                {reminder.priority}
              </span>
              
              {/* Due Date */}
              <p className="text-sm text-gray-700">
                {reminder.date}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* --- End of Reminder Items List --- */}

    </div>
  );
}
