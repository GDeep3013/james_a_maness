import React, { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Button from '../ui/button/Button';

interface VehicleReplacementChartProps {
  formData: {
    estimatedVehicleLife: string;
    estimatedAnnualUsage: string;
    estimatedFuelEfficiency: string;
    purchasePrice: string;
    estimatedDisposalCost: string;
    estimatedSalvageValue: string;
    methodOfDepreciation: string;
    serviceCostEstimates: Record<string, string>;
    fuelCostEstimates: Record<string, { value: string }>;
  };
}

export default function VehicleReplacementChart({ formData }: VehicleReplacementChartProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const chartData = useMemo(() => {
    const vehicleLifeMonths = parseFloat(formData.estimatedVehicleLife) || 96;
    const numberOfYears = Math.max(1, Math.ceil(vehicleLifeMonths / 12));
    const years = Array.from({ length: numberOfYears }, (_, i) => i + 1);
    const purchasePrice = parseFloat(formData.purchasePrice) || 0;
    const disposalCost = parseFloat(formData.estimatedDisposalCost) || 0;
    const salvageValuePercent = parseFloat(formData.estimatedSalvageValue) || 0;
    const salvageValue = (purchasePrice * salvageValuePercent) / 100;
    const annualUsage = parseFloat(formData.estimatedAnnualUsage) || 1;
    const fuelEfficiency = parseFloat(formData.estimatedFuelEfficiency) || 1;
    const method = formData.methodOfDepreciation;
    const calculateAnnualDepreciation = (year: number, totalYears: number): number => {
      const depreciableAmount = purchasePrice - salvageValue + disposalCost;
      
      if (method === 'Sum of Years') {
        const sumOfYears = (totalYears * (totalYears + 1)) / 2;
        // For Sum of Years, year N gets (totalYears - N + 1) / sumOfYears fraction
        // Year 1 gets the highest fraction, Year 8 gets the lowest
        const yearFraction = (totalYears - year + 1) / sumOfYears;
        return yearFraction * depreciableAmount;
      } else {
        // Double Declining Balance
        const rate = 2 / totalYears;
        let bookValue = purchasePrice;
        let cumulativeDepreciation = 0;
        
        // Calculate cumulative depreciation up to previous year
        for (let i = 1; i < year; i++) {
          const yearDepreciation = Math.min(bookValue * rate, depreciableAmount - cumulativeDepreciation);
          cumulativeDepreciation += yearDepreciation;
          bookValue -= yearDepreciation;
        }
        
        // Calculate this year's depreciation
        const yearDepreciation = Math.min(
          bookValue * rate, 
          depreciableAmount - cumulativeDepreciation
        );
        
        // Ensure we don't exceed depreciable amount
        return Math.max(yearDepreciation, 0);
      }
    };
    const depreciationCosts = years.map((year) => {
      return calculateAnnualDepreciation(year, numberOfYears);
    });
    
    const serviceCosts = years.map((year) => {
      const yearKey = `year${year}`;
      // Service costs from form are annual costs, convert to per-mile
      return parseFloat(formData.serviceCostEstimates[yearKey] || '0');
    });

    const gallonsNeeded = annualUsage / fuelEfficiency;
    const fuelCosts = years.map((year) => {
      const yearKey = `year${year}`;
      const fuelPricePerGallon = parseFloat(formData.fuelCostEstimates[yearKey]?.value || '0');
      // Annual usage is in miles, fuel efficiency is in mpg (miles per gallon)
      // Calculate gallons needed: miles / mpg = gallons
    
      // Annual fuel cost = gallons needed * price per gallon
      const annualFuelCost = gallonsNeeded * fuelPricePerGallon;
  
      return annualFuelCost;
    });
    const totalCosts = years.map((_, index) => {
      return depreciationCosts[index] + serviceCosts[index] + fuelCosts[index];
    });

    const costPerMi = totalCosts.map((total) => total / annualUsage);
    const minCostIndex = costPerMi.indexOf(Math.min(...costPerMi));
    const optimalReplacementYear = minCostIndex + 1;
    const minCostPerMi = Math.min(...costPerMi);
    const estimatedReplacementYear = numberOfYears;

    return {
      years,
      depreciationCosts,
      serviceCosts,
      fuelCosts,
      totalCosts,
      costPerMi,
      optimalReplacementYear,
      minCostPerMi,
      estimatedReplacementYear,
    };
  }, [formData]);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: 400,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ['#0D9488', '#14B8A6', '#5EEAD4', '#0D9488'],
    stroke: {
      curve: 'smooth',
      width: [0, 0, 0, 3],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function({ dataPointIndex }: { dataPointIndex: number }) {
        const annualUsage = parseFloat(formData.estimatedAnnualUsage) || 1;
        
        const fixedCost = (chartData.depreciationCosts[dataPointIndex] / annualUsage).toFixed(2);
        // serviceCosts are already per-mile (divided by annualUsage in calculation)
        const serviceCost = (chartData.serviceCosts[dataPointIndex] / annualUsage).toFixed(2);
        const fuelCost = (chartData.fuelCosts[dataPointIndex] / annualUsage).toFixed(2);
        const totalCost = (chartData.costPerMi[dataPointIndex]).toFixed(2);
        const year = dataPointIndex + 1;
        
        return `
          <div class="apexcharts-tooltip-title" style="font-family: Outfit, sans-serif; font-size: 12px;">Year ${year}</div>
          <div class="apexcharts-tooltip-series-group" style="order: 1; display: flex; flex-direction: column; padding: 4px 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="color: #0D9488;">Fixed Costs:</span>
              <span style="font-weight: 600; margin-left: 8px;">$${fixedCost}/mi</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="color: #14B8A6;">Service Costs:</span>
              <span style="font-weight: 600; margin-left: 8px;">$${serviceCost}/mi</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="color: #5EEAD4;">Fuel Costs:</span>
              <span style="font-weight: 600; margin-left: 8px;">$${fuelCost}/mi</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; padding-top: 4px; border-top: 1px solid #e5e7eb;">
              <span style="color: #0D9488; font-weight: 600;">Total Costs:</span>
              <span style="font-weight: 600; margin-left: 8px;">$${totalCost}/mi</span>
            </div>
          </div>
        `;
      },
    },
    xaxis: {
      categories: chartData.years.map((y) => `Year ${y}`),
      title: {
        text: 'Vehicle Age',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#374151',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Annual Cost per Mile',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#374151',
        },
      },
      labels: {
        formatter: (val: number) => {
          return `$${val.toFixed(2)}/mi`;
        },
        style: {
          fontSize: '12px',
          colors: ['#6B7280'],
        },
      },
      min: 0,
      max: Math.max(...chartData.costPerMi) * 1.2,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
    },
    annotations: {
      yaxis: [
        {
          y: chartData.minCostPerMi,
          borderColor: '#14B8A6',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            text: 'Minimum Cost of Ownership',
            style: {
              color: '#14B8A6',
              fontSize: '12px',
              fontWeight: 600,
            },
            offsetY: -10,
          },
        },
      ],
      xaxis: [
        {
          x: `Year ${chartData.optimalReplacementYear}`,
          borderColor: '#F97316',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            text: 'Optimal Replacement',
            style: {
              color: '#F97316',
              fontSize: '12px',
              fontWeight: 600,
            },
            offsetX: -10,
            offsetY: 10,
            orientation: 'vertical',
          },
        },
        // {
        //   x: `Year ${chartData.estimatedReplacementYear}`,
        //   borderColor: '#9CA3AF',
        //   borderWidth: 2,
        //   strokeDashArray: 5,
        //   label: {
        //     text: 'Estimated Replacement',
        //     style: {
        //       color: '#9CA3AF',
        //       fontSize: '12px',
        //       fontWeight: 600,
        //     },
        //     offsetX: 10,
        //     offsetY: 10,
        //     orientation: 'vertical',
        //   },
        // },
      ],
      points: [
        {
          x: chartData.optimalReplacementYear - 1,
          y: chartData.costPerMi[chartData.optimalReplacementYear - 1],
          seriesIndex: 3,
          marker: {
            size: 6,
            fillColor: '#F97316',
            strokeColor: '#fff',
            strokeWidth: 2,
          },
        },
      ],
    },
  };

  const depreciationPerMi = chartData.depreciationCosts.map((cost) => cost / parseFloat(formData.estimatedAnnualUsage || '1'));
  const servicePerMi = chartData.serviceCosts.map((cost) => cost / parseFloat(formData.estimatedAnnualUsage || '1'));
  const fuelPerMi = chartData.fuelCosts.map((cost) => cost / parseFloat(formData.estimatedAnnualUsage || '1'));
  const cumulativeService = servicePerMi.map((val, idx) => depreciationPerMi[idx] + val);

  const series = [
    {
      name: 'Fixed Costs',
      type: 'area',
      data: depreciationPerMi,
    },
    {
      name: 'Service',
      type: 'area',
      data: servicePerMi.map((val, idx) => depreciationPerMi[idx] + val),
    },
    {
      name: 'Fuel',
      type: 'area',
      data: fuelPerMi.map((val, idx) => cumulativeService[idx] + val),
    },
    {
      name: 'Total Cost',
      type: 'line',
      data: chartData.costPerMi,
    },
  ];

  if (!formData.estimatedVehicleLife || !formData.estimatedAnnualUsage) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 sm:px-6 sm:pt-6 min-h-[422px]">
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-gray-500">Please fill in the form data to view the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 sm:px-6 sm:pt-6 min-h-[422px]">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Vehicle Replacement Analysis
          </h3>
        </div>
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            Refresh Chart
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart key={refreshKey} options={options} series={series} type="area" height={400} />
        </div>
      </div>
    </div>
  );
}

