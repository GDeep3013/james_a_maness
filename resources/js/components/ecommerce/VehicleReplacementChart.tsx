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
    const years = [1, 2, 3, 4, 5, 6, 7, 8];
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
      const totalYears = Math.ceil(parseFloat(formData.estimatedVehicleLife) / 12) || 8;
      return calculateAnnualDepreciation(year, totalYears);
    });
    const serviceCosts = years.map((year) => {
      const yearKey = `year${year}`;
      return parseFloat(formData.serviceCostEstimates[yearKey] || '0');
    });
    const fuelCosts = years.map((year) => {
      const yearKey = `year${year}`;
      const fuelPricePerLiter = parseFloat(formData.fuelCostEstimates[yearKey]?.value || '0');
      const mpgToKmPerLiter = fuelEfficiency * 0.425144;
      const litersPerKm = 1 / mpgToKmPerLiter;
      const annualFuelCost = annualUsage * litersPerKm * fuelPricePerLiter;
      return annualFuelCost;
    });
    const totalCosts = years.map((_, index) => {
      return depreciationCosts[index] + serviceCosts[index] + fuelCosts[index];
    });
    const costPerKm = totalCosts.map((total) => total / annualUsage);
    const minCostIndex = costPerKm.indexOf(Math.min(...costPerKm));
    const optimalReplacementYear = minCostIndex + 1;
    const minCostPerKm = Math.min(...costPerKm);
    const estimatedReplacementYear = Math.ceil(parseFloat(formData.estimatedVehicleLife) / 12) || 8;

    return {
      years,
      depreciationCosts,
      serviceCosts,
      fuelCosts,
      totalCosts,
      costPerKm,
      optimalReplacementYear,
      minCostPerKm,
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
        const serviceCost = (chartData.serviceCosts[dataPointIndex] / annualUsage).toFixed(2);
        const fuelCost = (chartData.fuelCosts[dataPointIndex] / annualUsage).toFixed(2);
        const totalCost = (chartData.costPerKm[dataPointIndex]).toFixed(2);
        const year = dataPointIndex + 1;
        
        return `
          <div class="apexcharts-tooltip-title" style="font-family: Outfit, sans-serif; font-size: 12px;">Year ${year}</div>
          <div class="apexcharts-tooltip-series-group" style="order: 1; display: flex; flex-direction: column; padding: 4px 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="color: #0D9488;">Fixed Costs:</span>
              <span style="font-weight: 600; margin-left: 8px;">$${fixedCost}/km</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="color: #14B8A6;">Service Costs:</span>
              <span style="font-weight: 600; margin-left: 8px;">$${serviceCost}/km</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="color: #5EEAD4;">Fuel Costs:</span>
              <span style="font-weight: 600; margin-left: 8px;">$${fuelCost}/km</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; padding-top: 4px; border-top: 1px solid #e5e7eb;">
              <span style="color: #0D9488; font-weight: 600;">Total Costs:</span>
              <span style="font-weight: 600; margin-left: 8px;">$${totalCost}/km</span>
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
        text: 'Annual Cost per Kilometer',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#374151',
        },
      },
      labels: {
        formatter: (val: number) => {
          return `$${val.toFixed(2)}/km`;
        },
        style: {
          fontSize: '12px',
          colors: ['#6B7280'],
        },
      },
      min: 0,
      max: Math.max(...chartData.costPerKm) * 1.2,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
    },
    annotations: {
      yaxis: [
        {
          y: chartData.minCostPerKm,
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
          x: chartData.optimalReplacementYear - 1,
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
        //   x: chartData.estimatedReplacementYear - 1,
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
          y: chartData.costPerKm[chartData.optimalReplacementYear - 1],
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

  const depreciationPerKm = chartData.depreciationCosts.map((cost) => cost / parseFloat(formData.estimatedAnnualUsage || '1'));
  const servicePerKm = chartData.serviceCosts.map((cost) => cost / parseFloat(formData.estimatedAnnualUsage || '1'));
  const fuelPerKm = chartData.fuelCosts.map((cost) => cost / parseFloat(formData.estimatedAnnualUsage || '1'));
  const cumulativeService = servicePerKm.map((val, idx) => depreciationPerKm[idx] + val);

  const series = [
    {
      name: 'Fixed Costs',
      type: 'area',
      data: depreciationPerKm,
    },
    {
      name: 'Service',
      type: 'area',
      data: servicePerKm.map((val, idx) => depreciationPerKm[idx] + val),
    },
    {
      name: 'Fuel',
      type: 'area',
      data: fuelPerKm.map((val, idx) => cumulativeService[idx] + val),
    },
    {
      name: 'Total Cost',
      type: 'line',
      data: chartData.costPerKm,
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

