import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { serviceTaskService } from "../../services/serviceTaskService";
import { ServiceItem, ServiceTasksProps } from "../../types/workOrderTypes";
import { TrashBinIcon } from "../../icons";

export default function ServiceTasks({
  selectedTasks,
  setSelectedTasks,
  onDeleteTask,
}: ServiceTasksProps) {
  const [serviceTaskOptions, setServiceTaskOptions] = useState<Array<{ value: string; label: string; id?: number; [key: string]: unknown }>>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [editingPrice, setEditingPrice] = useState<{ [key: number]: { labor?: string; parts?: string } }>({});

  const fetchServiceTasks = useCallback(async (search: string = "") => {
    setIsLoadingTasks(true);
    try {
      const response = await serviceTaskService.getAll({ search });
      const data = response.data as { status: boolean; service_tasks?: { data: Array<{ id: number; name: string }> } };
      
      if (data.status && data.service_tasks?.data) {
        setServiceTaskOptions(
          data.service_tasks.data.map((task) => ({
            value: task.id.toString(),
            label: task.name,
            ...task,
          }))
        );
      }
    } catch {
      setServiceTaskOptions([]);
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchServiceTasks();
  }, [fetchServiceTasks]);

  const handleServiceTaskSearch = (inputValue: string) => {
    fetchServiceTasks(inputValue);
  };

  const handleServiceTaskChange = (selectedOptions: readonly { value: string; label: string; id?: number; [key: string]: unknown }[] | null) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      return;
    }

    const existingIds = new Set(selectedTasks.map((task) => task.id));
    const newTasks: ServiceItem[] = [];
    
    selectedOptions.forEach((option) => {
      const taskId = (option.id as number) || parseInt(option.value);
      if (!existingIds.has(taskId)) {
        newTasks.push({
          id: taskId,
          name: option.label,
          type: "Service Tasks",
          value: option.value,
          label: option.label,
          description: (option.description as string) || undefined,
        });
      }
    });

    if (newTasks.length > 0) {
        setSelectedTasks([...selectedTasks, ...newTasks]);
    }
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = selectedTasks.filter((task) => task.id !== taskId);
    setSelectedTasks(updatedTasks);
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  const handleLaborChange = (taskId: number, value: string) => {
    setEditingPrice({ ...editingPrice, [taskId]: { ...editingPrice[taskId], labor: value } });
    const numericValue = value.replace(/[^0-9.]/g, '');
    const price = numericValue === '' ? 0 : parseFloat(numericValue);
    
    const updatedTasks = selectedTasks.map((task) => {
      if (task.id === taskId) {
        const laborPrice = isNaN(price) ? 0 : price;
        const partsPrice = (task as ServiceItem & { parts_price?: number }).parts_price || 0;
        return { ...task, unit_price: laborPrice, total: laborPrice + partsPrice } as ServiceItem & { parts_price?: number };
      }
      return task;
    });
    setSelectedTasks(updatedTasks);
  };

  const handlePartsChange = (taskId: number, value: string) => {
    setEditingPrice({ ...editingPrice, [taskId]: { ...editingPrice[taskId], parts: value } });
    const numericValue = value.replace(/[^0-9.]/g, '');
    const price = numericValue === '' ? 0 : parseFloat(numericValue);
    
    const updatedTasks = selectedTasks.map((task) => {
      if (task.id === taskId) {
        const laborPrice = task.unit_price || 0;
        const partsPrice = isNaN(price) ? 0 : price;
        return { ...task, parts_price: partsPrice, total: laborPrice + partsPrice } as ServiceItem & { parts_price?: number };
      }
      return task;
    });
    setSelectedTasks(updatedTasks);
  };

  const handleLaborFocus = (taskId: number) => {
    const task = selectedTasks.find((t) => t.id === taskId);
    const rawValue = task?.unit_price ? String(task.unit_price) : '';
    setEditingPrice({ ...editingPrice, [taskId]: { ...editingPrice[taskId], labor: rawValue } });
  };

  const handlePartsFocus = (taskId: number) => {
    const task = selectedTasks.find((t) => t.id === taskId) as ServiceItem & { parts_price?: number };
    const rawValue = task?.parts_price ? String(task.parts_price) : '';
    setEditingPrice({ ...editingPrice, [taskId]: { ...editingPrice[taskId], parts: rawValue } });
  };

  const handlePriceBlur = (taskId: number, field: 'labor' | 'parts') => {
    const current = editingPrice[taskId];
    if (current) {
      const updated = { ...current };
      delete updated[field];
      if (Object.keys(updated).length === 0) {
        const { [taskId]: _, ...rest } = editingPrice;
        setEditingPrice(rest);
      } else {
        setEditingPrice({ ...editingPrice, [taskId]: updated });
      }
    }
  };

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00';
    }
    return parseFloat(String(value)).toFixed(2);
  };

  const getLaborPrice = (task: ServiceItem): number => {
    return task.unit_price || 0;
  };

  const getPartsPrice = (task: ServiceItem): number => {
    return (task as ServiceItem & { parts_price?: number }).parts_price || 0;
  };

  const getSubtotal = (task: ServiceItem): number => {
    return getLaborPrice(task) + getPartsPrice(task);
  };

  return (
    <>
      <div className="mb-6">
        <Select
          isMulti
          isClearable
          isSearchable
          isLoading={isLoadingTasks}
          options={serviceTaskOptions}
          onChange={handleServiceTaskChange}
          onInputChange={handleServiceTaskSearch}
          placeholder="Search service tasks"
          noOptionsMessage={({ inputValue }) =>
            inputValue ? `No service tasks found for "${inputValue}"` : "No service tasks available"
          }
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              minHeight: "44px",
              borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
              boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
              "&:hover": {
                borderColor: "#3b82f6",
              },
            }),
            multiValue: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#f3f4f6",
            }),
            multiValueLabel: (baseStyles) => ({
              ...baseStyles,
              color: "#1f2937",
            }),
            multiValueRemove: (baseStyles) => ({
              ...baseStyles,
              color: "#6b7280",
              "&:hover": {
                backgroundColor: "#e5e7eb",
                color: "#374151",
              },
            }),
          }}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <div className="min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-2">
        {selectedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">No Service Task line items added</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 w-[50%]">Service Task</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Labor</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Unit Price</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Subtotal</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {selectedTasks.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={editingPrice[item.id]?.labor !== undefined ? editingPrice[item.id].labor! : `$${formatCurrency(getLaborPrice(item))}`}
                        onChange={(e) => handleLaborChange(item.id, e.target.value)}
                        onFocus={() => handleLaborFocus(item.id)}
                        onBlur={() => handlePriceBlur(item.id, 'labor')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="$0.00"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={editingPrice[item.id]?.parts !== undefined ? editingPrice[item.id].parts! : `$${formatCurrency(getPartsPrice(item))}`}
                        onChange={(e) => handlePartsChange(item.id, e.target.value)}
                        onFocus={() => handlePartsFocus(item.id)}
                        onBlur={() => handlePriceBlur(item.id, 'parts')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="$0.00"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={`$${formatCurrency(getSubtotal(item))}`}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white cursor-not-allowed"
                        placeholder="$0.00"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteTask(item.id)}
                        className="p-2 text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
                        title="Delete"
                      >
                        <TrashBinIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

