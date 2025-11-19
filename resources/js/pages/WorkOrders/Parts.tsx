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
  const [editingPrice, setEditingPrice] = useState<{ [key: number]: { labor?: string; parts?: string } }>({});

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

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00';
    }
    return parseFloat(String(value)).toFixed(2);
  };

  const getLaborPrice = (part: Part): number => {
    return (part as Part & { labor_price?: number }).labor_price || 0;
  };

  const getPartsPrice = (part: Part): number => {
    const unitPrice = part.unit_price || 0;
    const quantity = part.quantity || 1;
    return unitPrice * quantity;
  };

  const getSubtotal = (part: Part): number => {
    return getLaborPrice(part) + getPartsPrice(part);
  };

  const handleQuantityChange = (partId: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const quantity = numericValue === '' ? undefined : parseInt(numericValue);
    
    const updatedParts = selectedParts.map((part) => {
      if (part.id === partId) {
        const updatedPart = { ...part, quantity: isNaN(quantity as number) ? undefined : quantity } as Part & { labor_price?: number };
        const laborPrice = getLaborPrice(updatedPart);
        const partsPrice = getPartsPrice(updatedPart);
        return { ...updatedPart, total: laborPrice + partsPrice };
      }
      return part;
    });
    setSelectedParts(updatedParts);
  };

  const handlePartsChange = (partId: number, value: string) => {
    setEditingPrice({ ...editingPrice, [partId]: { ...editingPrice[partId], parts: value } });
    const numericValue = value.replace(/[^0-9.]/g, '');
    const price = numericValue === '' ? 0 : parseFloat(numericValue);
    
    const updatedParts = selectedParts.map((part) => {
      if (part.id === partId) {
        const laborPrice = getLaborPrice(part);
        const partsPrice = isNaN(price) ? 0 : price;
        return { ...part, unit_price: partsPrice, total: laborPrice + partsPrice } as Part & { labor_price?: number };
      }
      return part;
    });
    setSelectedParts(updatedParts);
  };

  const handlePartsFocus = (partId: number) => {
    const part = selectedParts.find((p) => p.id === partId);
    const rawValue = part?.unit_price ? String(part.unit_price) : '';
    setEditingPrice({ ...editingPrice, [partId]: { ...editingPrice[partId], parts: rawValue } });
  };

  const handlePriceBlur = (partId: number, field: 'labor' | 'parts') => {
    if (field === 'parts') {
      const rest = { ...editingPrice };
      delete rest[partId];
      setEditingPrice(rest);
    } else {
      const current = editingPrice[partId];
      if (current) {
        const updated = { ...current };
        delete updated[field];
        if (Object.keys(updated).length === 0) {
          const rest = { ...editingPrice };
          delete rest[partId];
          setEditingPrice(rest);
        } else {
          setEditingPrice({ ...editingPrice, [partId]: updated });
        }
      }
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

      <div className="min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-2">
        {selectedParts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">No Parts line items added</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 w-[50%]">Parts</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[100px]">Qty</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Unit Price</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Subtotal</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {selectedParts.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">
                          {item.part_name}
                          {item.part_code && (
                            <span className="!text-xs text-gray-500 dark:text-gray-400 ml-1">
                              ({item.part_code})
                            </span>
                          )}
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
                        type="number"
                        value={item.quantity || '1'}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={editingPrice[item.id]?.parts !== undefined ? editingPrice[item.id].parts! : ''}
                        onChange={(e) => handlePartsChange(item.id, e.target.value)}
                        onFocus={() => handlePartsFocus(item.id)}
                        onBlur={() => handlePriceBlur(item.id, 'parts')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`$${formatCurrency(item.unit_price || 0)}`}
                        min={0.00}
                        step={0.10}
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
                        onClick={() => handleDeletePart(item.id)}
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

