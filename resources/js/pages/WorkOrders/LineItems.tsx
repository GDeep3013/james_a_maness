import { useState, useEffect } from "react";
import ServiceTasks from "./ServiceTasks";
import Parts from "./Parts";

interface ServiceItem {
  id: number;
  name: string;
  description?: string;
  type: "Service Tasks" | "Parts";
  quantity?: number;
  unit_price?: number;
  total?: number;
  created_at?: string;
  label?: string;
  value?: string;
}

interface Part {
  id: number;
  part_name: string;
  part_code?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  value?: string;
  label?: string;
}

interface WorkOrderFormData {
  vehicle_id: string;
  status: string;
  repair_priority_class: string;
  issue_date: string;
  issued_by: string;
  scheduled_start_date: string;
  send_scheduled_start_date_reminder: boolean;
  actual_start_date: string;
  expected_completion_date: string;
  actual_completion_date: string;
  use_start_odometer_for_completion_meter: boolean;
  assigned_to: string;
  vendor_id: string;
  invoice_number: string;
  po_number: string;
  service_items: ServiceItem[];
  parts: Part[];
}

interface LineItemsProps {
  setFormData?: React.Dispatch<React.SetStateAction<WorkOrderFormData>>;
  serviceItems?: ServiceItem[];
  parts?: Part[];
  onAddLineItem?: (type: "Service Tasks" | "Parts") => void;
  onEditLineItem?: (lineItemId: number) => void;
  onDeleteLineItem?: (lineItemId: number) => void;
}

export default function LineItems({
  serviceItems,
  parts,
  setFormData,
  onEditLineItem,
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
          onEditTask={onEditLineItem}
          onDeleteTask={onDeleteLineItem}
        />
      )}

      {activeTab === "Parts" && (
        <Parts
          selectedParts={selectedParts}
          setSelectedParts={setSelectedParts}
          onEditPart={onEditLineItem}
          onDeletePart={onDeleteLineItem}
        />
      )}

    </div>
  );
}

