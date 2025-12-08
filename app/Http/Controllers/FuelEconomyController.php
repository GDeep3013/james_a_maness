<?php

namespace App\Http\Controllers;

use App\Models\Fuel;
use Illuminate\Http\JsonResponse;

class FuelEconomyController extends Controller
{
    /**
     * Unit conversion constants
     */
    private const UNIT_CONVERSIONS = [
        'us_gallons' => 1.0,
        'liters' => 0.264172,
        'uk_gallons' => 1.20095,
    ];

    /**
     * Get fuel statistics including costs, volume, and economy
     *
     * @return JsonResponse
     */
    public function getStatistics(): JsonResponse
    {
        try {
            // Get total fuel cost
            $totalFuelCost = Fuel::sum('total_cost') ?? 0;

            // Calculate total volume in gallons
            $totalVolumeInGallons = $this->calculateTotalVolume();

            // Calculate fuel economy metrics
            $fuelEconomyData = $this->calculateFuelEconomy();

            return response()->json([
                'status' => true,
                'data' => [
                    'totalFuelForDistance' => round($fuelEconomyData['totalFuelForDistance'], 2),
                    'totalDistance' => round($fuelEconomyData['totalDistance'], 2),
                    'total_fuel_cost' => round($totalFuelCost, 2),
                    'total_volume' => round($totalVolumeInGallons, 0),
                    'avg_fuel_economy_distance' => round($fuelEconomyData['avgFuelEconomyDistance'], 2),
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Fuel statistics error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'Error calculating fuel statistics'
            ], 500);
        }
    }

    /**
     * Calculate total fuel volume converted to gallons
     *
     * @return float
     */
    private function calculateTotalVolume(): float
    {
        $fuels = Fuel::select('units', 'unit_type')->get();
        $totalVolumeInGallons = 0;

        foreach ($fuels as $fuel) {
            $units = (float) $fuel->units;
            $conversionFactor = self::UNIT_CONVERSIONS[$fuel->unit_type] ?? 1.0;
            $totalVolumeInGallons += $units * $conversionFactor;
        }

        return $totalVolumeInGallons;
    }

    /**
     * Calculate fuel economy metrics by vehicle
     *
     * @return array
     */
    private function calculateFuelEconomy(): array
    {
        $totalDistance = 0;
        $totalFuelForDistance = 0;

        // Fetch fuel records ordered by vehicle and date
        $vehicleFuels = Fuel::select('vehicle_id', 'vehicle_meter','previous_meter', 'units', 'unit_type', 'date')
            ->orderBy('vehicle_id')
            ->orderBy('date')
            ->get()
            ->groupBy('vehicle_id');

        // Process each vehicle's fuel records
        foreach ($vehicleFuels as $vehicleFuelEntries) {
            
            $currentEntry = $vehicleFuelEntries->sortBy('date')->values()->first();

            $distance = $this->calculateDistance($currentEntry);

            if ($distance > 0) {
                $fuelInGallons = $this->convertToGallons(
                    (float) $currentEntry->units,
                    $currentEntry->unit_type
                );

                if ($fuelInGallons > 0) {
                    $totalDistance += $distance;
                    $totalFuelForDistance += $fuelInGallons;
                }
            }
            
        }

        // Calculate average fuel economy
        $avgFuelEconomyDistance = $this->calculateAvgFuelEconomy($totalDistance, $totalFuelForDistance);

        return [
            'totalFuelForDistance' => $totalFuelForDistance,
            'totalDistance' => $totalDistance,
            'avgFuelEconomyDistance' => $avgFuelEconomyDistance,
        ];
    }

    /**
     * Calculate distance between two meter readings
     *
     * @param object $currentEntry  
     * @return float
     */
    private function calculateDistance($currentEntry): float
    {
        $currentMeter = (float) $currentEntry->vehicle_meter;
        $previousMeter = (float) ($currentEntry->previous_meter ?? 0);

        // Only count valid distance increases
        if ($currentMeter > $previousMeter && $currentMeter > 0) {
            return $currentMeter - $previousMeter;
        }

        return 0;
    }

    /**
     * Convert fuel units to gallons
     *
     * @param float $units
     * @param string $unitType
     * @return float
     */
    private function convertToGallons(float $units, string $unitType): float
    {
        $conversionFactor = self::UNIT_CONVERSIONS[$unitType] ?? 1.0;
        return $units * $conversionFactor;
    }

    /**
     * Calculate average fuel economy (distance per gallon)
     *
     * @param float $totalDistance
     * @param float $totalFuel
     * @return float
     */
    private function calculateAvgFuelEconomy(float $totalDistance, float $totalFuel): float
    {
        if ($totalFuel > 0 && $totalDistance > 0) {
            return $totalDistance / $totalFuel;
        }

        return 0;
    }
}