<?php

namespace App\Http\Controllers;

use App\Models\TimeLine;
use Illuminate\Http\Request;

class TimeLineController extends Controller
{
    /**
     * Display timeline for all or specific records
     */
    public function index(Request $request)
    {
        $query = TimeLine::with(['user', 'vehicle', 'vendor'])
            ->orderBy('created_at', 'desc');

        // Filter by module
        if ($request->has('module')) {
            $query->where('module', $request->module);
        }

        // Filter by vehicle
        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Filter by action
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        $timelines = $query->paginate(50);

        return view('timelines.index', compact('timelines'));
    }

    /**
     * Get timeline for specific vehicle
     */
    public function vehicle($vehicleId)
    {
        $timelines = TimeLine::with(['user', 'vendor'])
            ->where('vehicle_id', $vehicleId)
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return view('timelines.vehicle', compact('timelines', 'vehicleId'));
    }

    /**
     * Get timeline for specific module
     */
    public function module($moduleName)
    {
        $timelines = TimeLine::with(['user', 'vehicle', 'vendor'])
            ->where('module', $moduleName)
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return view('timelines.module', compact('timelines', 'moduleName'));
    }

    /**
     * Show detailed timeline entry
     */
    public function show(TimeLine $timeLine)
    {
        $timeLine->load(['user', 'vehicle', 'vendor', 'trackable']);

        return view('timelines.show', compact('timeLine'));
    }
}
