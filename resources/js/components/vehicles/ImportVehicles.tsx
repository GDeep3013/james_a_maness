import React, { useState } from "react";
import { Modal } from "../ui/modal";
import FileInput from "../form/input/FileInput";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { vehicleService } from "../../services/vehicleService";
import { useModal } from "../../hooks/useModal";
import { ExportIcon } from "../../icons";

interface ImportResult {
  imported: number;
  skipped: number;
}

export default function ImportVehicles({ onImportSuccess }: { onImportSuccess?: () => void }) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        setError('Please select a valid Excel file (.xlsx, .xls, or .csv)');
        setFile(null);
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await vehicleService.import(file);

      if (response.data.status) {
        setResult({
          imported: response.data.imported || 0,
          skipped: response.data.skipped || 0,
        });

        if (onImportSuccess) {
          setTimeout(() => {
            onImportSuccess();
            handleClose();
          }, 2000);
        }

      } else {
        setError(response.data.message || 'Failed to import vehicles');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while importing vehicles';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setResult(null);
    closeModal();
  };

  return (
    <>
      <Button size="sm" variant="outline" className="md:min-w-[190px]" onClick={openModal}>
        <ExportIcon /> Import Vehicles
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px] m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Import Vehicles
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload an Excel file (.xlsx, .xls, or .csv) with vehicle details. The system will validate the data and skip duplicate records.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label>Select Excel File</Label>
              <FileInput
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="mt-2"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {result && (
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  Import completed successfully!
                </p>
                <div className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <p>Imported: {result.imported} vehicles</p>
                  <p>Skipped: {result.skipped} duplicate/invalid records</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
              size="sm"
                variant="primary"
                onClick={handleImport}
                disabled={loading || !file}
                className="w-full sm:w-auto"
              >
                {loading ? 'Importing...' : 'Import Vehicles'}
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              <strong>Required columns:</strong> vehicle_name, license_plate, type
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              <strong>Optional columns:</strong> make, model, year, vin, color, fuel_type, transmission, purchase_date, engine_size, current_mileage, purchase_price, initial_status, vendor_name, primary_location, notes, department
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Note:</strong> Duplicate records (based on license_plate or vin) will be automatically skipped.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

