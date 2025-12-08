import { useState, useEffect, useCallback } from "react";
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
  const [editingPrice, setEditingPrice] = useState<{ [key: number]: { labor?: string } }>({});

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
          labor_cost: (option.labor_cost as number) || undefined,
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
        return { ...task, labor_cost: laborPrice };
      }
      return task;
    });
    setSelectedTasks(updatedTasks);
  };

  const handleLaborFocus = (taskId: number) => {
    const task = selectedTasks.find((t) => t.id === taskId);

    const rawValue = task?.labor_cost ? String(task.labor_cost) : '';
    setEditingPrice({ ...editingPrice, [taskId]: { ...editingPrice[taskId], labor: rawValue } });
  };

  const handlePriceBlur = (taskId: number) => {
    const rest = { ...editingPrice };
    delete rest[taskId];
    setEditingPrice(rest);
  };


  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00';
    }
    return parseFloat(String(value)).toFixed(2);
  };

  const getLaborPrice = (task: ServiceItem): number => {
    return task.labor_cost || 0;
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

      <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-2">
        {selectedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-center mb-4">No Service Task line items added</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 w-[70%]">Service Task</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">Labor</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {selectedTasks.filter((item) => item.id !== undefined).map((item) => {
                  const taskId = item.id!;
                  return (
                    <tr
                      key={taskId}
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
                          name="labor_cost_"
                          type="number"
                          value={editingPrice[taskId]?.labor !== undefined ? editingPrice[taskId].labor! : ''}
                          onChange={(e) => handleLaborChange(taskId, e.target.value)}
                          onFocus={() => handleLaborFocus(taskId)}
                          onBlur={() => handlePriceBlur(taskId)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900"
                          placeholder={`$${formatCurrency(getLaborPrice(item))}`}
                          min={0.00}
                          step={0.10}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteTask(taskId)}
                          className="p-2 text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
                          title="Delete"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}