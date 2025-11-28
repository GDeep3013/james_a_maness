<?php

namespace App\Http\Controllers;

use App\Models\ServiceReminder;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;
use App\Models\WorkOrder;
use Illuminate\Support\Facades\Schema;

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


    function getTotalCosts(){



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
            'serviceTask:id,name',
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
}
