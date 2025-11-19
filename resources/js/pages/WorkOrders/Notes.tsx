import React, { useState, useEffect, useMemo } from "react";
import { NotesProps, ServiceItem, Part } from "../../types/workOrderTypes";

export default function Notes({
  notes,
  setNotes,
  serviceItems = [],
  parts = [],
  discountType = "percentage",
  discountValue = 0,
  taxType = "percentage",
  taxValue = 0,
  setDiscountType,
  setDiscountValue,
  setTaxType,
  setTaxValue,
}: NotesProps) {
  const [localNotes, setLocalNotes] = useState<string>(notes || "");
  const [editingDiscount, setEditingDiscount] = useState<string>("");
  const [editingTax, setEditingTax] = useState<string>("");

  useEffect(() => {
    if (notes !== undefined) {
      setLocalNotes(notes);
    }
  }, [notes]);

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    if (setNotes) {
      setNotes(value);
    }
  };

  const getLaborPrice = (item: ServiceItem | Part): number => {
    if ('name' in item) {
      return (item as ServiceItem).labor_cost || 0;
    }
    return (item as Part & { unit_price?: number }).unit_price || 0;
  };

  const getPartsPrice = (item: ServiceItem | Part): number => {
    if ('name' in item) {
      return (item as ServiceItem & { unit_price?: number }).unit_price || 0;
    }
    const part = item as Part;
    const unitPrice = part.unit_price || 0;
    const quantity = part.quantity || 1;
    return unitPrice * quantity;
  };

  const calculateTotals = useMemo(() => {
    let laborTotal = 0;
    let partsTotal = 0;

    serviceItems.forEach((item) => {
      laborTotal += getLaborPrice(item);
    });

    parts.forEach((item) => {
      partsTotal += getPartsPrice(item);
    });

    const subtotal = laborTotal + partsTotal;
    let discountAmount = 0;
    if (discountValue > 0) {
      if (discountType === "percentage") {
        discountAmount = (subtotal * discountValue) / 100;
      } else {
        discountAmount = discountValue;
      }
    }

    const afterDiscount = subtotal - discountAmount;

    let taxAmount = 0;
    if (taxValue > 0) {
      if (taxType === "percentage") {
        taxAmount = (afterDiscount * taxValue) / 100;
      } else {
        taxAmount = taxValue;
      }
    }

    const total = afterDiscount + taxAmount;

    return {
      subtotal,
      laborTotal,
      partsTotal,
      discountAmount,
      taxAmount,
      total,
    };
  }, [serviceItems, parts, discountType, discountValue, taxType, taxValue]);

  const formatCurrency = (value: number): string => {
    return `$${parseFloat(String(value)).toFixed(2)}`;
  };

  const handleDiscountChange = (value: string) => {
    setEditingDiscount(value);
    const numericValue = value.replace(/[^0-9.]/g, '');
    const numValue = numericValue === '' ? 0 : parseFloat(numericValue);
    if (setDiscountValue) {
      setDiscountValue(isNaN(numValue) ? 0 : numValue);
    }
  };

  const handleTaxChange = (value: string) => {
    setEditingTax(value);
    const numericValue = value.replace(/[^0-9.]/g, '');
    const numValue = numericValue === '' ? 0 : parseFloat(numericValue);
    if (setTaxValue) {
      setTaxValue(isNaN(numValue) ? 0 : numValue);
    }
  };

  const handleDiscountFocus = () => {
    setEditingDiscount(discountValue ? String(discountValue) : '');
  };

  const handleTaxFocus = () => {
    setEditingTax(taxValue ? String(taxValue) : '');
  };

  const handleDiscountBlur = () => {
    setEditingDiscount('');
  };

  const handleTaxBlur = () => {
    setEditingTax('');
  };

  return (
    <>
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Notes</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="min-h-[200px]">
        {/* <label className="block text-sm font-semibold text-gray-800 /90 mb-3">
          Description
        </label> */}
        <textarea
          value={localNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Add notes or additional details"
          rows={8}
          className="w-full px-4 py-3 text-sm border border-gray-300  rounded-md bg-white  text-gray-900  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[150px]"
        />
      </div>

      <div className="min-h-[200px]">
        <label className="block text-sm font-semibold text-gray-800 /90 mb-3">
          Cost Summary
        </label>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 0">Subtotal</span>
            <span className="text-gray-900  font-medium">{formatCurrency(calculateTotals.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 0">Labor</span>
            <span className="text-gray-900  font-medium">{formatCurrency(calculateTotals.laborTotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 0">Unit Price</span>
            <span className="text-gray-900  font-medium">{formatCurrency(calculateTotals.partsTotal)}</span>
          </div>

          <div className="flex justify-between items-center text-sm gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-gray-700 0 whitespace-nowrap">Discount</span>
              <select
                value={discountType}
                onChange={(e) => setDiscountType?.(e.target.value as "percentage" | "fixed")}
                className="px-2 py-1 text-xs border border-gray-300  rounded bg-white  text-gray-900  focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
              <input
                type="text"
                value={editingDiscount !== '' ? editingDiscount : (discountValue || '')}
                onChange={(e) => handleDiscountChange(e.target.value)}
                onFocus={handleDiscountFocus}
                onBlur={handleDiscountBlur}
                className="w-16 px-2 py-1 text-xs border border-gray-300  rounded bg-white  text-gray-900  focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <span className="text-gray-900  font-medium">{formatCurrency(calculateTotals.discountAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-sm gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-gray-700 0 whitespace-nowrap">Tax</span>
              <select
                value={taxType}
                onChange={(e) => setTaxType?.(e.target.value as "percentage" | "fixed")}
                className="px-2 py-1 text-xs border border-gray-300  rounded bg-white  text-gray-900  focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
              <input
                type="text"
                value={editingTax !== '' ? editingTax : (taxValue || '')}
                onChange={(e) => handleTaxChange(e.target.value)}
                onFocus={handleTaxFocus}
                onBlur={handleTaxBlur}
                className="w-16 px-2 py-1 text-xs border border-gray-300  rounded bg-white  text-gray-900  focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <span className="text-gray-900  font-medium">{formatCurrency(calculateTotals.taxAmount)}</span>
          </div>

          <div className="border-t border-gray-200  pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900 ">Total</span>
              <span className="text-sm font-semibold text-gray-900 ">{formatCurrency(calculateTotals.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

