import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { partService } from "../../services/partService";
import { Part, PartsProps } from "../../types/workOrderTypes";
import { TrashBinIcon } from "../../icons";

export default function Parts({
  selectedParts,
  setSelectedParts,
  onDeletePart,
}: PartsProps) {
  const [partOptions, setPartOptions] = useState<Array<{ value: string; label: string; id?: number; [key: string]: unknown }>>([]);
  const [isLoadingParts, setIsLoadingParts] = useState(false);

  const fetchParts = useCallback(async (search: string = "") => {
    setIsLoadingParts(true);
    try {
      const response = await partService.getAll({ search });
      const data = response.data as { status: boolean; parts?: { data: Array<{ id: number; part_name: string; part_code?: string; description?: string; unit_price?: number }> } };
      
      if (data.status && data.parts?.data) {
        setPartOptions(
          data.parts.data.map((part) => ({
            value: part.id.toString(),
            label: `${part.part_name}${part.part_code ? ` (${part.part_code})` : ''}`,
            ...part,
          }))
        );
      }
    } catch {
      setPartOptions([]);
    } finally {
      setIsLoadingParts(false);
    }
  }, []);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const handlePartSearch = (inputValue: string) => {
    fetchParts(inputValue);
  };

  const handlePartChange = (selectedOptions: readonly { value: string; label: string; id?: number; [key: string]: unknown }[] | null) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      return;
    }

    const existingIds = new Set(selectedParts.map((part) => part.id));
    const newParts: Part[] = [];
    
    selectedOptions.forEach((option) => {
      const partId = (option.id as number) || parseInt(option.value);
      if (!existingIds.has(partId)) {
        newParts.push({
          id: partId,
          part_name: (option.part_name as string) || option.label,
          part_code: (option.part_code as string) || undefined,
          value: option.value,
          label: option.label,
          description: (option.description as string) || undefined,
          unit_price: (option.unit_price as number) || undefined,
          purchase_price: (option.purchase_price as number) || undefined,
        });
      }
    });

    if (newParts.length > 0) {
        setSelectedParts([...selectedParts, ...newParts]);
    }
  };

  const handleDeletePart = (partId: number) => {
    const updatedParts = selectedParts.filter((part) => part.id !== partId);
    setSelectedParts(updatedParts);
    if (onDeletePart) {
      onDeletePart(partId);
    }
  };

  return (
    <>
      <div className="mb-6">
        <Select
          isMulti
          isClearable
          isSearchable
          isLoading={isLoadingParts}
          options={partOptions}
          onChange={handlePartChange}
          onInputChange={handlePartSearch}
          placeholder="Search parts"
          noOptionsMessage={({ inputValue }) =>
            inputValue ? `No parts found for "${inputValue}"` : "No parts available"
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
        {selectedParts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-center mb-4">No Parts line items added</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedParts.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {item.part_name} {" "} 
                      {item.part_code && (
                        <span className="!text-xs text-gray-500">
                          ({item.part_code})
                        </span>
                      )}
                    </h3>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {item.quantity && <span>Qty: {item.quantity}</span>}
                      {item.unit_price !== undefined && item.unit_price !== null && (
                        <span>Unit Price: ${parseFloat(String(item.unit_price)).toFixed(2)}</span>
                      )}
                      {item.purchase_price !== undefined && item.purchase_price !== null && (
                        <span>Purchase Price: ${parseFloat(String(item.purchase_price)).toFixed(2)}</span>
                      )}
                      {item.total !== undefined && item.total !== null && (
                        <span className="font-semibold">Total: ${parseFloat(String(item.total)).toFixed(2)}</span>
                      )}
                      {item.created_at && (
                        <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDeletePart(item.id)}
                      className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded transition-colors"
                      title="Delete"
                    >
                      <TrashBinIcon className="w-4 h-4" />
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

