import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Select from '../../components/form/Select';
import Radio from '../../components/form/input/Radio';
import Button from '../../components/ui/button/Button';
import VehicleReplacementChart from '../../components/ecommerce/VehicleReplacementChart';
import { vehicleService } from '../../services/vehicleService';
import { vehicleReplacementService } from '../../services/vehicleReplacementService';

interface FormData {
  vehicleId: string;
  estimatedVehicleLife: string;
  estimatedAnnualUsage: string;
  estimatedFuelEfficiency: string;
  purchasePrice: string;
  estimatedDisposalCost: string;
  estimatedSalvageValue: string;
  methodOfDepreciation: string;
  serviceCostEstimates: Record<string, string>;
  fuelCostEstimates: Record<string, { value: string }>;
}

interface VehicleReplacementFormData {
  vehicle_id: number;
  estimated_vehicle_life: number;
  estimated_annual_usage: number;
  estimated_fuel_efficiency: number;
  purchase_price: number;
  estimated_disposal_cost: number;
  estimated_salvage_value: number;
  method_of_depreciation: string;
  service_cost_estimates: Record<string, string>;
  fuel_cost_estimates: Record<string, { value: string }>;
}

interface Vehicle {
  id: number;
  vehicle_name?: string;
  name?: string;
}

export default function VehicleReplacement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    vehicleId: '',
    estimatedVehicleLife: '96',
    estimatedAnnualUsage: '20000',
    estimatedFuelEfficiency: '15',
    purchasePrice: '50000',
    estimatedDisposalCost: '1000',
    estimatedSalvageValue: '20',
    methodOfDepreciation: 'Sum of Years',
    serviceCostEstimates: {
      year1: '1500',
      year2: '1500',
      year3: '1500',
      year4: '300',
      year5: '1350',
      year6: '2500',
      year7: '2000',
      year8: '10000',
    },
    fuelCostEstimates: {
      year1: { value: '1.5' },
      year2: { value: '1.6' },
      year3: { value: '1.75'},
      year4: { value: '1.9' },
      year5: { value: '2'   },
      year6: { value: '2.1' },
      year7: { value: '2.3' },
      year8: { value: '2.5' },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vehicles, setVehicles] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [replacementId, setReplacementId] = useState<number | null>(null);
  const [isLoadingReplacement, setIsLoadingReplacement] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoadingVehicles(true);
    try {
      const response = await vehicleService.getAll();
      const vehicleOptions = (response.data?.vehical || response.data?.vehicles || []).map((vehicle: Vehicle) => ({
        value: String(vehicle.id),
        label: vehicle.vehicle_name || vehicle.name || `Vehicle #${vehicle.id}`,
      }));
      setVehicles(vehicleOptions);
    } catch {
      // Error handling is silent
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const fetchVehicleReplacement = async (vehicleId: string) => {
    if (!vehicleId) {
      setReplacementId(null);
      return;
    }

    setIsLoadingReplacement(true);
    try {
      const response = await vehicleReplacementService.getById(parseInt(vehicleId));
      if (response.data?.status) {
        const replacement = response.data.vehicle_replacement;
        setReplacementId(replacement.id);

        const vehicleLife = String(replacement.estimated_vehicle_life || '96');
        const numYears = getNumberOfYears(vehicleLife);
        const savedServiceCosts = replacement.service_cost_estimates || {};
        const savedFuelCosts = replacement.fuel_cost_estimates || {};

        // Initialize cost estimates based on number of years, using saved values if available
        const serviceCosts: Record<string, string> = {};
        const fuelCosts: Record<string, { value: string }> = {};
        for (let i = 1; i <= numYears; i++) {
          const yearKey = `year${i}`;
          serviceCosts[yearKey] = savedServiceCosts[yearKey] || '0';
          fuelCosts[yearKey] = savedFuelCosts[yearKey] || { value: '0' };
        }

        setFormData({
          vehicleId: String(replacement.vehicle_id),
          estimatedVehicleLife: vehicleLife,
          estimatedAnnualUsage: String(replacement.estimated_annual_usage || ''),
          estimatedFuelEfficiency: String(replacement.estimated_fuel_efficiency || ''),
          purchasePrice: String(replacement.purchase_price || ''),
          estimatedDisposalCost: String(replacement.estimated_disposal_cost || ''),
          estimatedSalvageValue: String(replacement.estimated_salvage_value || ''),
          methodOfDepreciation: replacement.method_of_depreciation || 'Sum of Years',
          serviceCostEstimates: serviceCosts,
          fuelCostEstimates: fuelCosts,
        });
      } else {
        setReplacementId(null);
        const numYears = getNumberOfYears('96');
        const { serviceCosts, fuelCosts } = initializeCostEstimates(numYears, formData);

        setFormData({
          vehicleId: vehicleId,
          estimatedVehicleLife: '96',
          estimatedAnnualUsage: '20000',
          estimatedFuelEfficiency: '15',
          purchasePrice: '50000',
          estimatedDisposalCost: '1000',
          estimatedSalvageValue: '20',
          methodOfDepreciation: 'Sum of Years',
          serviceCostEstimates: serviceCosts,
          fuelCostEstimates: fuelCosts,
        });
      }
    } catch {
      // Error handling is silent
    } finally {
      setIsLoadingReplacement(false);
    }
  };

  const getNumberOfYears = (vehicleLifeMonths: string): number => {
    const months = parseFloat(vehicleLifeMonths) || 0;
    return Math.max(1, Math.ceil(months / 12));
  };

  const initializeCostEstimates = (numYears: number, currentFormData: FormData) => {
    const serviceCosts: Record<string, string> = {};
    const fuelCosts: Record<string, { value: string }> = {};

    for (let i = 1; i <= numYears; i++) {
      const yearKey = `year${i}`;
      // Use existing value if available, otherwise use default
      serviceCosts[yearKey] = currentFormData.serviceCostEstimates[yearKey] || '0';
      fuelCosts[yearKey] = currentFormData.fuelCostEstimates[yearKey] || { value: '0' };
    }

    return { serviceCosts, fuelCosts };
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'estimatedVehicleLife') {
      setFormData((prev) => {
        const numYears = getNumberOfYears(value);
        const { serviceCosts, fuelCosts } = initializeCostEstimates(numYears, prev);

        return {
          ...prev,
          [field]: value,
          serviceCostEstimates: serviceCosts,
          fuelCostEstimates: fuelCosts,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (field === 'vehicleId') {
      fetchVehicleReplacement(value);
    }
  };

  const handleServiceCostChange = (year: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceCostEstimates: {
        ...prev.serviceCostEstimates,
        [year]: value,
      },
    }));
  };

  const handleFuelCostChange = (year: string, field: 'value' | 'unit', value: string) => {
    setFormData((prev) => ({
      ...prev,
      fuelCostEstimates: {
        ...prev.fuelCostEstimates,
        [year]: {
          ...prev.fuelCostEstimates[year],
          [field]: value,
        },
      },
    }));
  };

  const formatCurrency = (value: string): string => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    return numValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const handleCurrencyInput = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    handleInputChange(field, numericValue);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vehicle is required';
    }

    if (!formData.estimatedVehicleLife || parseFloat(formData.estimatedVehicleLife) <= 0) {
      newErrors.estimatedVehicleLife = 'Estimated Vehicle Life is required';
    }

    if (!formData.estimatedAnnualUsage || parseFloat(formData.estimatedAnnualUsage) <= 0) {
      newErrors.estimatedAnnualUsage = 'Estimated Annual Usage is required';
    }

    if (!formData.estimatedFuelEfficiency || parseFloat(formData.estimatedFuelEfficiency) <= 0) {
      newErrors.estimatedFuelEfficiency = 'Estimated Fuel Efficiency is required';
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Purchase Price is required';
    }

    if (!formData.estimatedDisposalCost || parseFloat(formData.estimatedDisposalCost) < 0) {
      newErrors.estimatedDisposalCost = 'Estimated Disposal Cost is required';
    }

    if (!formData.estimatedSalvageValue || parseFloat(formData.estimatedSalvageValue) < 0) {
      newErrors.estimatedSalvageValue = 'Estimated Salvage Value is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        vehicle_id: parseInt(formData.vehicleId),
        estimated_vehicle_life: parseInt(formData.estimatedVehicleLife),
        estimated_annual_usage: parseInt(formData.estimatedAnnualUsage),
        estimated_fuel_efficiency: parseFloat(formData.estimatedFuelEfficiency),
        purchase_price: parseFloat(formData.purchasePrice),
        estimated_disposal_cost: parseFloat(formData.estimatedDisposalCost),
        estimated_salvage_value: parseFloat(formData.estimatedSalvageValue),
        method_of_depreciation: formData.methodOfDepreciation,
        service_cost_estimates: formData.serviceCostEstimates,
        fuel_cost_estimates: formData.fuelCostEstimates,
      };

      const response = replacementId
        ? await vehicleReplacementService.update(replacementId, submitData as VehicleReplacementFormData)
        : await vehicleReplacementService.create(submitData as VehicleReplacementFormData);

      if (response.data?.status === true || response.status === 200 || response.status === 201) {
        //navigate(-1);
      } else {
        setGeneralError(
          response.data?.message ||
          `Failed to ${replacementId ? 'update' : 'create'} vehicle replacement analysis. Please try again.`
        );
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: {
              message?: string;
              errors?: Record<string, string[]>;
              error?: string;
            };
          };
        };

        if (axiosError.response?.data?.errors) {
          const validationErrors: Record<string, string> = {};
          Object.keys(axiosError.response.data.errors).forEach((key) => {
            const errorMessages = axiosError.response?.data?.errors?.[key];
            if (errorMessages && errorMessages.length > 0) {
              validationErrors[key] = errorMessages[0];
            }
          });
          setErrors(validationErrors);
        } else {
          setGeneralError(
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            'An error occurred while creating the vehicle replacement analysis. Please try again.'
          );
        }
      } else {
        setGeneralError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const numberOfYears = getNumberOfYears(formData.estimatedVehicleLife);
  const years = Array.from({ length: numberOfYears }, (_, i) => i + 1);

  return (
    <>
      <PageMeta
        title="Lifecycle Estimates - Vehicle Replacement Analysis"
        description="Calculate vehicle lifecycle costs and replacement analysis"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Lifecycle Estimates
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{generalError}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <Label htmlFor="vehicleId">Vehicle <span className="text-red-500">*</span></Label>
              <Select
                options={vehicles}
                placeholder={isLoadingVehicles ? 'Loading vehicles...' : isLoadingReplacement ? 'Loading data...' : 'Select a vehicle'}
                defaultValue={formData.vehicleId}
                onChange={(value) => handleInputChange('vehicleId', value)}
                disabled={isLoadingVehicles || isLoadingReplacement}
                className="h-6"
              />
              {errors.vehicleId && (
                <p className="mt-1 text-xs text-error-500">{errors.vehicleId}</p>
              )}
              {isLoadingReplacement && (
                <p className="mt-1 text-xs text-gray-500">Loading saved data...</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Lifecycle Estimates, Acquisition, Disposal */}
            <div className="space-y-6">
              {/* Lifecycle Estimates */}
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                  Lifecycle Estimates
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="estimatedVehicleLife">Estimated Vehicle Life</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        id="estimatedVehicleLife"
                        name="estimatedVehicleLife"
                        value={formData.estimatedVehicleLife || ''}
                        onChange={(e) => handleInputChange('estimatedVehicleLife', e.target.value)}
                        error={!!errors.estimatedVehicleLife}
                        className="flex-1"
                        size="xs"
                        min="1"
                      />
                      <div className="w-32">
                        <p className="text-gray-600 dark:text-gray-400">months</p>
                      </div>
                    </div>
                    {errors.estimatedVehicleLife && (
                      <p className="mt-1 text-xs text-error-500">{errors.estimatedVehicleLife}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="estimatedAnnualUsage">Estimated Annual Usage</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        id="estimatedAnnualUsage"
                        name="estimatedAnnualUsage"
                        value={formData.estimatedAnnualUsage || ''}
                        onChange={(e) => handleInputChange('estimatedAnnualUsage', e.target.value)}
                        error={!!errors.estimatedAnnualUsage}
                        className="flex-1"
                        min="1"
                        size="xs"
                      />
                      <div className="w-40">
                        <p className="text-gray-600 dark:text-gray-400">miles</p>
                      </div>
                    </div>
                    {errors.estimatedAnnualUsage && (
                      <p className="mt-1 text-xs text-error-500">{errors.estimatedAnnualUsage}</p>
                    )}
                  </div>

                    <div>
                        <Label htmlFor="estimatedFuelEfficiency">Estimated Fuel Efficiency</Label>
                        <div className="flex gap-2">
                        <Input
                            type="number"
                            id="estimatedFuelEfficiency"
                            name="estimatedFuelEfficiency"
                            value={formData.estimatedFuelEfficiency || ''}
                            onChange={(e) => handleInputChange('estimatedFuelEfficiency', e.target.value)}
                            error={!!errors.estimatedFuelEfficiency}
                            className="flex-1"
                            size="xs"
                            min="0.01"
                            step={0.01}
                        />
                        <div className="w-32">
                            <p className="text-gray-600">mpg (US)</p>
                        </div>
                        </div>
                        {errors.estimatedFuelEfficiency && (
                        <p className="mt-1 text-xs text-error-500">{errors.estimatedFuelEfficiency}</p>
                        )}
                    </div>

                    <div>
                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                        $
                        </span>
                        <Input
                        type="text"
                        id="purchasePrice"
                        name="purchasePrice"
                        value={formData.purchasePrice ? formatCurrency(formData.purchasePrice) : ''}
                        onChange={(e) => handleCurrencyInput('purchasePrice', e.target.value)}
                        error={!!errors.purchasePrice}
                        className="pl-8"
                        size="xs"
                        placeholder="0"
                        />
                    </div>
                    {errors.purchasePrice && (
                        <p className="mt-1 text-xs text-error-500">{errors.purchasePrice}</p>
                    )}
                    </div>

                    <div>
                        <Label htmlFor="estimatedDisposalCost">Estimated Disposal Cost</Label>
                        <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                            $
                        </span>
                        <Input
                            type="text"
                            id="estimatedDisposalCost"
                            name="estimatedDisposalCost"
                            value={formData.estimatedDisposalCost ? formatCurrency(formData.estimatedDisposalCost) : ''}
                            onChange={(e) => handleCurrencyInput('estimatedDisposalCost', e.target.value)}
                            error={!!errors.estimatedDisposalCost}
                            className="pl-8"
                            size="xs"
                            placeholder="0"
                        />
                        </div>
                        {errors.estimatedDisposalCost && (
                        <p className="mt-1 text-xs text-error-500">{errors.estimatedDisposalCost}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="estimatedSalvageValue">Estimated Salvage Value</Label>
                        <div className="flex gap-2">
                        <Input
                            type="number"
                            id="estimatedSalvageValue"
                            name="estimatedSalvageValue"
                            value={formData.estimatedSalvageValue || ''}
                            onChange={(e) => handleInputChange('estimatedSalvageValue', e.target.value)}
                            error={!!errors.estimatedSalvageValue}
                            className="flex-1"
                            size="xs"
                            min="0"
                            step={0.01}
                        />
                        <div className="w-48">
                            <p className="text-gray-600">% of purchase price</p>
                        </div>
                        {errors.estimatedSalvageValue && (
                        <p className="mt-1 text-xs text-error-500">{errors.estimatedSalvageValue}</p>
                        )}
                        </div>
                    </div>

                  <div>
                    <Label>Method of Depreciation</Label>
                    <div className="space-y-2 mt-2">
                      <Radio
                        id="doubleDeclining"
                        name="methodOfDepreciation"
                        value="Double Declining"
                        checked={formData.methodOfDepreciation === 'Double Declining'}
                        onChange={(value) => handleInputChange('methodOfDepreciation', value)}
                        label="Double Declining"
                      />
                      <Radio
                        id="sumOfYears"
                        name="methodOfDepreciation"
                        value="Sum of Years"
                        checked={formData.methodOfDepreciation === 'Sum of Years'}
                        onChange={(value) => handleInputChange('methodOfDepreciation', value)}
                        label="Sum of Years"
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Middle Column - Service Cost Estimates */}
            <div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Service Cost Estimates
                </h2>

                <div className="space-y-4">
                  {years.map((year) => (
                    <div key={year}>
                      <Label htmlFor={`serviceYear${year}`}>Year {year}</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                          $
                        </span>
                        <Input
                          type="text"
                          id={`serviceYear${year}`}
                          name={`serviceYear${year}`}
                          value={formData.serviceCostEstimates[`year${year}`] ? formatCurrency(formData.serviceCostEstimates[`year${year}`]) : ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                            handleServiceCostChange(`year${year}`, numericValue);
                          }}
                          className="pl-8"
                          size="xs"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Fuel Cost Estimates */}
            <div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Fuel Cost Estimates
                </h2>

                <div className="space-y-4">
                  {years.map((year) => (
                    <div key={year}>
                      <Label htmlFor={`fuelYear${year}`}>Year {year}</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                            $
                          </span>
                          <Input
                            type="number"
                            id={`fuelYear${year}`}
                            name={`fuelYear${year}`}
                            value={formData.fuelCostEstimates[`year${year}`]?.value || ''}
                            onChange={(e) => handleFuelCostChange(`year${year}`, 'value', e.target.value)}
                            className="pl-8"
                            size="xs"
                            placeholder="0"
                            min="0"
                            step={0.01}
                          />
                        </div>
                        <div className="w-32">
                          <p className="text-gray-600 dark:text-gray-400">/gallons</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size='sm'
              onClick={() => {
                navigate(-1);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size='sm' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>

        {formData.vehicleId && (
          <div className="mt-6">
            <VehicleReplacementChart formData={formData} />
          </div>
        )}
      </div>
    </>
  );
}
