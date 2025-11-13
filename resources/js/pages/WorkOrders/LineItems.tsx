import React, { useState } from "react";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";

interface LineItem {
  id: number;
  name: string;
  description?: string;
  type: "Service Tasks" | "Labor" | "Parts";
  quantity?: number;
  unit_price?: number;
  total?: number;
  created_at?: string;
}

interface LineItemsProps {
  workOrderId?: number;
  lineItems?: LineItem[];
  onAddLineItem?: (type: "Service Tasks" | "Labor" | "Parts") => void;
  onEditLineItem?: (lineItemId: number) => void;
  onDeleteLineItem?: (lineItemId: number) => void;
}

export default function LineItems({
  workOrderId,
  lineItems = [],
  onAddLineItem,
  onEditLineItem,
  onDeleteLineItem,
}: LineItemsProps) {
  const [activeTab, setActiveTab] = useState<"Service Tasks" | "Labor" | "Parts">("Service Tasks");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLineItems = lineItems.filter((item) => {
    const matchesType = item.type === activeTab;
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "Service Tasks":
        return "No Service Task line items added";
      case "Labor":
        return "No Labor line items added";
      case "Parts":
        return "No Parts line items added";
      default:
        return "No line items added";
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "Service Tasks":
        return "Search Service Tasks...";
      case "Labor":
        return "Search Labor...";
      case "Parts":
        return "Search Parts...";
      default:
        return "Search...";
    }
  };

  const getAddButtonLabel = () => {
    switch (activeTab) {
      case "Service Tasks":
        return "Add Service Task";
      case "Labor":
        return "Add Labor";
      case "Parts":
        return "Add Part";
      default:
        return "Add Item";
    }
  };

  return (
    <div className="">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">Line Items</h2>
        
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => {
                setActiveTab("Service Tasks");
                setSearchTerm("");
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "Service Tasks"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Service Tasks
            </button>
            <button
              onClick={() => {
                setActiveTab("Labor");
                setSearchTerm("");
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "Labor"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Labor
            </button>
            <button
              onClick={() => {
                setActiveTab("Parts");
                setSearchTerm("");
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "Parts"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Parts
            </button>
          </nav>
        </div>

        <div className="mb-6">
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <Input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>
      </div>

      <div className="min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
        {filteredLineItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">{getEmptyMessage()}</p>
            {onAddLineItem && (
              <Button
                variant="primary"
                size="md"
                onClick={() => onAddLineItem(activeTab)}
                className=""
              >
                {getAddButtonLabel()}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLineItems.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      {item.quantity !== undefined && (
                        <span>Qty: {item.quantity}</span>
                      )}
                      {item.unit_price !== undefined && (
                        <span>Unit Price: ${item.unit_price.toFixed(2)}</span>
                      )}
                      {item.total !== undefined && (
                        <span className="font-semibold">Total: ${item.total.toFixed(2)}</span>
                      )}
                      {item.created_at && (
                        <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {onEditLineItem && (
                      <button
                        onClick={() => onEditLineItem(item.id)}
                        className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        Edit
                      </button>
                    )}
                    {onDeleteLineItem && (
                      <button
                        onClick={() => onDeleteLineItem(item.id)}
                        className="text-sm text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {onAddLineItem && (
              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onAddLineItem(activeTab)}
                  className=""
                >
                  {getAddButtonLabel()}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

