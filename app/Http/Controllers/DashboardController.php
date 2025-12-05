<?php

namespace App\Http\Controllers;

use App\Models\ServiceReminder;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;
use App\Models\WorkOrder;
use App\Models\Fuel;
use App\Models\Issue;
use App\Models\Contact;
use App\Models\Vendor;
use App\Models\Part;
use App\Models\Vehical;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $loggedInUser = Auth::user();
        $users = User::where('id', $loggedInUser->id)->first();
        if (!empty($users)) {
            return response()->json(['status' => true, 'user' => $users]);
        } else {
            return response()->json(['status' => false, 'message' => 'User not found']);
        }
    }


    public function getTotalCosts(Request $request)
    {
        try {
            $year = $request->input('year', date('Y'));
            
            $workOrders = WorkOrder::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(COALESCE(total_value, 0)) as total')
            )
            ->whereYear('created_at', $year)
            ->whereNotNull('total_value')
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->get();

            $fuels = Fuel::select(
                DB::raw('MONTH(date) as month'),
                DB::raw('SUM(COALESCE(total_cost, 0)) as total')
            )
            ->whereYear('date', $year)
            ->whereNotNull('total_cost')
            ->groupBy(DB::raw('MONTH(date)'))
            ->get();

            $monthlyData = [];
            for ($month = 1; $month <= 12; $month++) {
                $workOrderTotal = $workOrders->where('month', $month)->first();
                $fuelTotal = $fuels->where('month', $month)->first();
                
                $workOrderAmount = $workOrderTotal ? (float)$workOrderTotal->total : 0;
                $fuelAmount = $fuelTotal ? (float)$fuelTotal->total : 0;
                
                $monthlyData[] = [
                    'month' => $month,
                    'work_orders_total' => $workOrderAmount,
                    'fuels_total' => $fuelAmount,
                    'total' => $workOrderAmount + $fuelAmount,
                ];
            }

            $yearToDateTotal = array_sum(array_column($monthlyData, 'total'));

            return response()->json([
                'status' => true,
                'data' => $monthlyData,
                'year_to_date_total' => $yearToDateTotal,
                'year' => $year,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch total costs',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getDashboardWorkOrder(Request $request)
    {
        $workOrders = WorkOrder::with([
            'vehicle:id,vehicle_name',
            'assignedTo:id,first_name,last_name',
            'vendor:id,name',
            'user:id,name'
        ])
            ->whereNotIn('status', ['Completed', 'Cancelled'])
            ->orderBy('id', 'desc')->limit(10)->get();


        return response()->json([
            'status' => true,
            'work_orders' => $workOrders
        ]);
    }

    public function getDashboardReminders(Request $request)
    {
        $serviceReminders = ServiceReminder::with([
            'vehicle:id,vehicle_name',
            'user:id,name'
        ])
            ->whereDate('next_due_date', '>=', today())
            ->orderBy('next_due_date', 'asc')->limit(10)
            ->get();

        return response()->json([
            'status' => true,
            'service_reminders' => $serviceReminders
        ]);
    }

    public function getFleetPerformance(Request $request)
    {
        try {
            $vehicleId = $request->input('vehicle_id');
            $year = $request->input('year', date('Y'));

            if (!$vehicleId) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vehicle ID is required'
                ], 400);
            }

            $issues = Issue::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->where('vehicle_id', $vehicleId)
            ->whereYear('created_at', $year)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->get();

            $workOrders = WorkOrder::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->where('vehicle_id', $vehicleId)
            ->whereYear('created_at', $year)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->get();

            $monthlyData = [];
            for ($month = 1; $month <= 12; $month++) {
                $issueCount = $issues->where('month', $month)->first();
                $workOrderCount = $workOrders->where('month', $month)->first();
                
                $monthlyData[] = [
                    'month' => $month,
                    'issues_count' => $issueCount ? (int)$issueCount->count : 0,
                    'work_orders_count' => $workOrderCount ? (int)$workOrderCount->count : 0,
                ];
            }

            return response()->json([
                'status' => true,
                'data' => $monthlyData,
                'year' => $year,
                'vehicle_id' => $vehicleId,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch fleet performance data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMaintenanceCosts(Request $request)
    {
        try {
            $year = $request->input('year', date('Y'));
            $vehicleId = $request->input('vehicle_id');

            $workOrdersQuery = WorkOrder::whereYear('created_at', $year);
            if ($vehicleId) {
                $workOrdersQuery->where('vehicle_id', $vehicleId);
            }
            $workOrders = $workOrdersQuery->get();

            $totalLaborCost = 0;
            $totalPartsCost = 0;

            foreach ($workOrders as $workOrder) {
                $serviceItems = $workOrder->service_items ?? [];
                $parts = $workOrder->parts ?? [];

                if (is_array($serviceItems)) {
                    foreach ($serviceItems as $item) {
                        if (isset($item['labor_cost'])) {
                            $totalLaborCost += (float)$item['labor_cost'];
                        }
                    }
                }

                if (is_array($parts)) {
                    foreach ($parts as $part) {
                        $unitPrice = isset($part['unit_price']) ? (float)$part['unit_price'] : 0;
                        $quantity = isset($part['quantity']) ? (float)$part['quantity'] : 1;
                        $totalPartsCost += $unitPrice * $quantity;
                    }
                }
            }

            $fuelQuery = Fuel::whereYear('date', $year)->whereNotNull('total_cost');
            if ($vehicleId) {
                $fuelQuery->where('vehicle_id', $vehicleId);
            }
            $totalFuelCost = $fuelQuery->sum('total_cost');

            $totalFuelCost = (float)$totalFuelCost;

            return response()->json([
                'status' => true,
                'data' => [
                    'labor_cost' => round($totalLaborCost, 2),
                    'parts_cost' => round($totalPartsCost, 2),
                    'fuel_cost' => round($totalFuelCost, 2),
                ],
                'year' => $year,
                'vehicle_id' => $vehicleId,
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch maintenance costs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getDashboardStatistics(Request $request)
    {
        try {
            $vehicles = Vehical::all();
            
            $totalVehicles = $vehicles->count();
            $activeCount = 0;
            $inMaintenanceCount = 0;
            $availableCount = 0;
            $outOfServiceCount = 0;

            foreach ($vehicles as $vehicle) {
                $status = strtolower($vehicle->initial_status ?? $vehicle->status ?? '');
                
                if ($status === 'maintenance') {
                    $inMaintenanceCount++;
                } else if (in_array($status, ['inactive', 'out_of_service', 'out of service'])) {
                    $outOfServiceCount++;
                } else if ($status === 'active') {
                    $activeCount++;
                } else if ($status === 'available') {
                    $availableCount++;
                } else {
                    $availableCount++;
                }
            }

            $totalContacts = Contact::count();
            $totalVendors = Vendor::count();
            $totalParts = Part::count();

            return response()->json([
                'status' => true,
                'data' => [
                    'vehicles' => [
                        'total' => $totalVehicles,
                        'active' => $activeCount,
                        'in_maintenance' => $inMaintenanceCount,
                        'available' => $availableCount,
                        'out_of_service' => $outOfServiceCount,
                    ],
                    'contacts' => [
                        'total' => $totalContacts,
                    ],
                    'vendors' => [
                        'total' => $totalVendors,
                    ],
                    'parts' => [
                        'total' => $totalParts,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
