<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\Trips;
use App\Models\Routes;
use App\Models\Driver;
use App\Models\Vendor;

class AllReportsController extends Controller
{
    public function getRoutesData(Request $request)
    {
        $input = $request->all(); // Get all input data
        $data = json_decode($input['data'], true);
        $tableColumns = Schema::getColumnListing('trips');
        $searchTerm =  $input['search'];
        $query = trips::with('driver', 'vehicle', 'vendor', 'RoutesTo', 'route_stops');
        $startDate = isset($data['start_date']) ? $data['start_date'] : "";
        $endDate = isset($data['end_date']) ? $data['end_date'] : "";
        $routesId = isset($data['routes_id']) ? (int)$data['routes_id'] : 0;
        $routesType = $data['route_type'] ?? "";
        if (!empty($startDate) && !empty($endDate)) {
            $start_date = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
            $end_date = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();

            if ($routesId > 0) {
                $routesIds = Routes::where('route_ref_id', $routesId)->pluck('id');

                if ($routesType === "complete_line_route") {
                    // Filter using both `routesId` and `routesIds`
                    $query->where(function ($q) use ($routesId, $routesIds) {
                        $q->where('route_id', $routesId)
                            ->orWhereIn('route_id', $routesIds);
                    })->whereBetween('pickup_date', [$start_date, $end_date]);
                } else if ($routesType === "additional_route") {
                    // Filter only using `routesIds`
                    $query->whereIn('route_id', $routesIds)
                        ->whereBetween('pickup_date', [$start_date, $end_date]);
                }
            } elseif ($routesType === "all_routes") {
                $query->whereBetween('pickup_date', [$start_date, $end_date]);
            }
        }

        // if (!empty($startDate) && !empty($endDate) && $routesId > 0) {
        //     $routesIds = Routes::where('route_ref_id', $routesId)->pluck('id');
        //     dd($routesIds, $routesId);
        //     if($routesType === "complete_line_route") {

        //     } else if ($routesType === "additional_route"){
        //         $start_date = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
        //         $end_date = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();
        //         $query->whereIn('route_id', $routesIds)
        //             ->whereBetween('pickup_date', [$start_date, $end_date]);
        //     }
        // } else if (!empty($startDate) && !empty($endDate) && empty($routesId) && $routesType === "all_routes") {
        //     $start_date = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
        //     $end_date = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();
        //     $query->whereBetween('pickup_date', [$start_date, $end_date]);
        // }
        // if (!empty($routesId)) {
        //     $query->where('routes_id', $routesId);
        // }

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                // Make sure the column exists before querying
                if (Schema::hasColumn('trips', $column)) {
                    if ($column !== 'created_at' && $column !== 'updated_at') {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                }
            }
            $query->orWhereHas('driver', function ($subQuery) use ($searchTerm) {
                $subQuery->where('first_name', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('last_name', 'LIKE', '%' . $searchTerm . '%');
            })
                ->orWhereHas('vehicle', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('truck', 'LIKE', '%' . $searchTerm . '%');
                })
                ->orWhereHas('vendor', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('first_name', 'LIKE', '%' . $searchTerm . '%');
                })
                ->orWhereHas('RoutesTo', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('name', 'LIKE', '%' . $searchTerm . '%');
                });
        });
        if (!empty($request->page)) {
            $trips = $query
                ->orderBy('pickup_date', 'desc') // Assuming there's a 'created_at' timestamp field
                ->paginate(20);
            if (!empty($trips)) {
                return response()->json(['status' => true, 'trip' => $trips]);
            } else {
                return response()->json(['status' => false, 'message' => 'Routes not found']);
            }
        }
    }

    public function getVendorRoutes(Request $request)
    {
        $input = $request->all(); // Get all input data
        $data = json_decode($input['data'], true);
        $tableColumns = Schema::getColumnListing('trips'); // Correct column listing based on 'trips' table
        $searchTerm = $input['search'] ?? '';

        $startDate = isset($data['start_date']) ? $data['start_date'] : '';
        $endDate = isset($data['end_date']) ? $data['end_date'] : '';
        $vendorId = isset($data['vendor_id']) ? (int)$data['vendor_id'] : 0;

        // Paginate routes
        $routeQuery = Trips::with(['vendor', 'routesTo', 'driver', 'vehicle', 'route_stops']); // Eager load related data

        // Apply date range filter on routes' pickup date
        if (!empty($startDate) && !empty($endDate)) {
            $start_date = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
            $end_date = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();

            $routeQuery->whereBetween('pickup_date', [$start_date, $end_date]);
        }

        // Apply vendor ID filter if provided

        // Apply search filters on routes and their related data
        $routeQuery->where(function ($query) use ($tableColumns, $searchTerm) {
            // Apply search term to 'trips' columns
            foreach ($tableColumns as $column) {
                if (Schema::hasColumn('trips', $column) && $column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }

            // Apply search to 'driver' relation
            $query->orWhereHas('driver', function ($subQuery) use ($searchTerm) {
                $subQuery->where('first_name', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('last_name', 'LIKE', '%' . $searchTerm . '%');
            });

            // Apply search to 'vehicle' relation
            $query->orWhereHas('vehicle', function ($subQuery) use ($searchTerm) {
                $subQuery->where('truck', 'LIKE', '%' . $searchTerm . '%');
            });

            // Apply search to 'vendor' relation
            $query->orWhereHas('vendor', function ($subQuery) use ($searchTerm) {
                $subQuery->where('first_name', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('last_name', 'LIKE', '%' . $searchTerm . '%');
            });

            // Apply search to 'routesTo' relation
            $query->orWhereHas('routesTo', function ($subQuery) use ($searchTerm) {
                $subQuery->where('name', 'LIKE', '%' . $searchTerm . '%');
            });
        });

        if ($vendorId > 0) {
            $routeQuery->where('vendor_id', $vendorId); // Filter routes by vendor_id
        }
        // dd($routeQuery->get());
        // Paginate the routes
        if (!empty($request->page)) {
            $routes = $routeQuery->paginate(50);
            if ($routes->isNotEmpty()) {
                return response()->json(['status' => true, 'vendor' => $routes]);
            } else {
                return response()->json(['status' => false, 'message' => 'No routes found']);
            }
        }

        return response()->json(['status' => false, 'message' => 'Page parameter is missing']);
    }


    public function getSubContratorRoutes(Request $request)
    {
        $input = $request->all(); // Get all input data
        $data = json_decode($input['data'], true);
        $searchTerm = $input['search'] ?? '';
        $startDate = isset($data['start_date']) ? $data['start_date'] : '';
        $endDate = isset($data['end_date']) ? $data['end_date'] : '';
        $startDate = isset($data['start_date']) ? $data['start_date'] : "";
        $sub_contract_id = isset($data['sub_contract_id']) ? (int)$data['sub_contract_id'] : 0;

        // Start building the Trips query with relationships
        $routeQuery = Trips::with(['vendor', 'routesTo', 'driver.sub_contractor', 'vehicle', 'route_stops'])
            ->whereHas('driver.sub_contractor', function ($query) use ($sub_contract_id) {
                if ($sub_contract_id > 0) {
                    $query->where('sub_contractor_id', $sub_contract_id);
                } else {
                    $query->whereNotNull('sub_contractor_id');
                }
            });

        // Apply date range filter
        if (!empty($startDate) && !empty($endDate)) {
            $start_date = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
            $end_date = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();

            $routeQuery->whereBetween('pickup_date', [$start_date, $end_date]);
        }

        // Apply search term filter
        if (!empty($searchTerm)) {
            $routeQuery->where(function ($query) use ($searchTerm) {
                $query->whereHas('vendor', function ($subQuery) use ($searchTerm) {
                    $subQuery->where('vendor_name', 'LIKE', '%' . $searchTerm . '%');
                })
                    ->orWhereHas('routesTo', function ($subQuery) use ($searchTerm) {
                        $subQuery->where('name', 'LIKE', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('driver', function ($subQuery) use ($searchTerm) {
                        $subQuery->where('first_name', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('last_name', 'LIKE', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('vehicle', function ($subQuery) use ($searchTerm) {
                        $subQuery->where('truck', 'LIKE', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('driver.sub_contractor', function ($subQuery) use ($searchTerm) {
                        $subQuery->where('coporation_name', 'LIKE', '%' . $searchTerm . '%');
                    });
            });
        }

        // Apply pagination
        $trips = $routeQuery->paginate(20);

        // Return response
        if ($trips->isNotEmpty()) {
            return response()->json(['status' => true, 'data' => $trips]);
        } else {
            return response()->json(['status' => false, 'message' => 'No trips found for drivers associated with a subcontractor']);
        }
      
    }
}
