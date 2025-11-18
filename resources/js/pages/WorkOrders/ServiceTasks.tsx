import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { serviceTaskService } from "../../services/serviceTaskService";

interface ServiceTask {
  id: number;
  name: string;
  description?: string;
  type: "Service Tasks" | "Parts";
  value?: string;
  label?: string;
  quantity?: number;
  unit_price?: number;
  total?: number;
  created_at?: string;
}

interface ServiceTasksProps {
  selectedTasks: ServiceTask[];
  setSelectedTasks: (tasks: ServiceTask[]) => void;
  onEditTask?: (taskId: number) => void;
  onDeleteTask?: (taskId: number) => void;
}

export default function ServiceTasks({
  selectedTasks,
  setSelectedTasks,
  onEditTask,
  onDeleteTask,
}: ServiceTasksProps) {
  const [serviceTaskOptions, setServiceTaskOptions] = useState<Array<{ value: string; label: string; id?: number; [key: string]: unknown }>>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

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
    const newTasks: ServiceTask[] = [];
    
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
          <div className="space-y-4">
            {selectedTasks.map((item) => (
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
                      <span>Qty: 6</span>
                      <span>Unit Price: 33.00</span>
                      <span className="font-semibold">Total: 12.00</span>
                      {item.created_at && (
                        <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {onEditTask && (
                      <button
                        onClick={() => onEditTask(item.id)}
                        className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(item.id)}
                      className="text-sm text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

