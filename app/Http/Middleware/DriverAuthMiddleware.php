<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DriverAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $driver = Auth::guard('driver')->user();
        
        // if (!$driver) {
        //     return response()->json(['error' => 'Unauthorized: Driver not authenticated'], 401);
        // }

        // Check if the driver is inactive
        if ($driver->driver_status === 'Inactive') {
            // return response()->json(['error' => 'Your account is inactive. Please contact the administrator.'], 401);
            return response()->json([
                'status' => false,
                'message' => 'Your account is inactive. Please contact the administrator.',
                'error' => null
            ], 401);
        }

        return $next($request);
    }
}
