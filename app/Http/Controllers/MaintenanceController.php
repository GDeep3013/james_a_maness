<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use Illuminate\Http\Request;
use App\Models\WorkOrder;
use Auth;
use Illuminate\Support\Facades\Schema;
class MaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index(Request $request)
    {
        $workOrders = WorkOrder::with(['vehicle', 'vendor', 'issues'])
            ->where('vehicle_id', $request->vehicle_id)
            ->get();
            //    $IssueOrder = Issue::where('vehicle_id', $request->vehicle_id)
            // ->get();


        return response()->json([
            'status' => true,
            'maintenance' => [
                'data' => $workOrders,
                // 'issue' => $IssueOrder,
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => $workOrders->count(),
                'total' => $workOrders->count(),
            ]
        ]);
    }
}
