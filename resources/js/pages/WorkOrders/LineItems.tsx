import { useState, useEffect } from "react";
import ServiceTasks from "./ServiceTasks";
import Parts from "./Parts";
import {
  ServiceItem,
  Part,
  LineItemsProps,
} from "../../types/workOrderTypes";

export default function LineItems({
  serviceItems,
  parts,
  setFormData,
  onDeleteLineItem,
}: LineItemsProps) {

  const [activeTab, setActiveTab] = useState<"Service Tasks" | "Parts">("Service Tasks");
  const [selectedTasks, setSelectedTasks] = useState<ServiceItem[]>([]);
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);


  useEffect(() => {
    if (serviceItems) {
      setSelectedTasks(serviceItems);
    }
  }, []);

  useEffect(() => {
    if (parts) {
      setSelectedParts(parts);
    }
  }, []);

  useEffect(() => {
    if (setFormData) {
      setFormData((prev) => ({ 
        ...prev, 
        service_items: selectedTasks,
        parts: selectedParts
      }));
    }
  }, [selectedTasks, selectedParts, setFormData]);


  return (
    <div className="">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Line Items</h2>
        
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Service Tasks");
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "Service Tasks"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Service Tasks
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                setActiveTab("Parts");
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "Parts"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Parts
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === "Service Tasks" && (
        <ServiceTasks
          selectedTasks={selectedTasks}
          setSelectedTasks={setSelectedTasks}
          onDeleteTask={onDeleteLineItem}
        />
      )}

      {activeTab === "Parts" && (
        <Parts
          selectedParts={selectedParts}
          setSelectedParts={setSelectedParts}
          onDeletePart={onDeleteLineItem}
        />
      )}

    </div>
  );
}

