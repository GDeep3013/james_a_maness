import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Select from '../../components/form/Select';
import Button from '../../components/ui/button/Button';
import { ChevronLeftIcon, TickIcon, AngleRightIcon } from '../../icons';
import TextArea from '../../components/form/input/TextArea';

interface FormData {
  type: string;
  make: string;
  model: string;
  year: string;
  vin: string;
  license_plate: string;
  color: string;
  fuel_type: string;
  transmission: string;
  purchase_date: string;
  engine_size: string;
  current_mileage: string;
  purchase_price: string;
  initial_status: string;
  primary_location: string;
  notes: string;
  assigned_driver: string;
  department: string;
}

export default function AddVehicle() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    type: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    license_plate: '',
    color: '',
    fuel_type: '',
    transmission: '',
    purchase_date: '',
    engine_size: '',
    current_mileage: '',
    purchase_price: '',
    initial_status: 'available',
    primary_location: '',
    notes: '',
    assigned_driver: '',
    department: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const vehicleTypeOptions = [
    { value: 'truck', label: 'Truck' },
    { value: 'car', label: 'Car' },
    { value: 'van', label: 'Van' },
    { value: 'suv', label: 'SUV' },
  ];

  const fuelTypeOptions = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const transmissionOptions = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'cvt', label: 'CVT' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'In Maintenance' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTextAreaChange = (name: keyof FormData) => (value: string) => {
    handleInputChange(name, value);
  };

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    handleInputChange(name, value);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) newErrors.type = 'Vehicle type is required';
    if (!formData.make) newErrors.make = 'Make is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.vin) newErrors.vin = 'VIN is required';
    if (!formData.license_plate) newErrors.license_plate = 'License plate is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fuel_type) newErrors.fuel_type = 'Fuel type is required';
    if (!formData.current_mileage) newErrors.current_mileage = 'Current mileage is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      console.log('Form submitted:', formData);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Basic Information',
      description: 'Vehicle details and identification',
    },
    {
      number: 2,
      title: 'Specifications',
      description: 'Technical specifications',
    },
    {
      number: 3,
      title: 'Assignment',
      description: 'Driver and location details',
    },
  ];

  return (
    <>
      <PageMeta title="Add New Vehicle" description="Add a new vehicle to your fleet" />
      
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Add New Vehicle
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter vehicle details to add to your fleet
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 p-3 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        currentStep > step.number
                          ? 'bg-[#00C950] text-white'
                          : currentStep === step.number
                          ? 'bg-[#5321B1] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <TickIcon className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p
                        className={`text-sm font-semibold ${
                          currentStep >= step.number
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 mt-[-20px] ${
                        currentStep > step.number
                          ? 'bg-[#00A63E]'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="type">
                      Vehicle Type <span className="text-error-500">*</span>
                    </Label>
                    <Select
                      options={vehicleTypeOptions}
                      placeholder="Select vehicle type"
                      onChange={handleSelectChange('type')}
                      defaultValue={formData.type}
                    />
                    {errors.type && (
                      <p className="mt-1 text-xs text-error-500">{errors.type}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="make">
                      Make <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="make"
                      name="make"
                      placeholder="e.g., Freightliner, Ford, Toyota"
                      value={formData.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                    />
                    {errors.make && (
                      <p className="mt-1 text-xs text-error-500">{errors.make}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="model">
                      Model <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="model"
                      name="model"
                      placeholder="e.g., Cascadia, Transit, Camry"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                    />
                    {errors.model && (
                      <p className="mt-1 text-xs text-error-500">{errors.model}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="year">
                      Year <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="e.g., 2023"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                    />
                    {errors.year && (
                      <p className="mt-1 text-xs text-error-500">{errors.year}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="vin">
                      VIN (Vehicle Identification Number) <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="vin"
                      name="vin"
                      placeholder="17-character VIN"
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value)}
                    />
                    {errors.vin && (
                      <p className="mt-1 text-xs text-error-500">{errors.vin}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="license_plate">
                      License Plate <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="license_plate"
                      name="license_plate"
                      placeholder="e.g., TX-12345"
                      value={formData.license_plate}
                      onChange={(e) => handleInputChange('license_plate', e.target.value)}
                    />
                    {errors.license_plate && (
                      <p className="mt-1 text-xs text-error-500">{errors.license_plate}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      type="text"
                      id="color"
                      name="color"
                      placeholder="e.g., White, Black, Blue"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Technical Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fuel_type">
                      Fuel Type <span className="text-error-500">*</span>
                    </Label>
                    <Select
                      options={fuelTypeOptions}
                      placeholder="Select fuel type"
                      onChange={handleSelectChange('fuel_type')}
                      defaultValue={formData.fuel_type}
                    />
                    {errors.fuel_type && (
                      <p className="mt-1 text-xs text-error-500">{errors.fuel_type}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="engine_size">Engine Size (L)</Label>
                    <Input
                      type="text"
                      id="engine_size"
                      name="engine_size"
                      placeholder="e.g., 6.7, 3.5, 2.0"
                      value={formData.engine_size}
                      onChange={(e) => handleInputChange('engine_size', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      options={transmissionOptions}
                      placeholder="Select transmission"
                      onChange={handleSelectChange('transmission')}
                      defaultValue={formData.transmission}
                    />
                  </div>

                  <div>
                    <Label htmlFor="current_mileage">
                      Current Mileage <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="current_mileage"
                      name="current_mileage"
                      placeholder="e.g., 50000"
                      value={formData.current_mileage}
                      onChange={(e) => handleInputChange('current_mileage', e.target.value)}
                    />
                    {errors.current_mileage && (
                      <p className="mt-1 text-xs text-error-500">{errors.current_mileage}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="purchase_date">Purchase Date</Label>
                    <Input
                      type="date"
                      id="purchase_date"
                      name="purchase_date"
                      value={formData.purchase_date}
                      onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="purchase_price">Purchase Price ($)</Label>
                    <Input
                      type="text"
                      id="purchase_price"
                      name="purchase_price"
                      placeholder="e.g., 75000"
                      value={formData.purchase_price}
                      onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Assignment & Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="initial_status">Initial Status</Label>
                    <Select
                      options={statusOptions}
                      placeholder="Select status"
                      onChange={handleSelectChange('initial_status')}
                      defaultValue={formData.initial_status}
                    />
                  </div>

                  <div>
                    <Label htmlFor="assigned_driver">Assigned Driver</Label>
                    <Input
                      type="text"
                      id="assigned_driver"
                      name="assigned_driver"
                      placeholder="Select driver (optional)"
                      value={formData.assigned_driver}
                      onChange={(e) => handleInputChange('assigned_driver', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="primary_location">Primary Location</Label>
                    <Input
                      type="text"
                      id="primary_location"
                      name="primary_location"
                      placeholder="e.g., New York, NY"
                      value={formData.primary_location}
                      onChange={(e) => handleInputChange('primary_location', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      type="text"
                      id="department"
                      name="department"
                      placeholder="Select department (optional)"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <TextArea
                      placeholder="Any additional information about the vehicle..."
                      rows={4}
                      value={formData.notes}
                      onChange={handleTextAreaChange('notes')}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
              >
                <ChevronLeftIcon />
                Previous
              </button>

              <span className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep} of {steps.length}
              </span>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition bg-[#5321B1] text-white shadow-theme-xs hover:bg-brand-600 next-button"
                >
                  Next
                  <span className="">
                  <AngleRightIcon />
                  </span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition bg-[#00C950] text-white shadow-theme-xs hover:bg-[#008A33]"
                >
                  <TickIcon className="w-5 h-5" />
                  Add Vehicle
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
