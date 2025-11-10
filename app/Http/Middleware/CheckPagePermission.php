<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPagePermission
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
        $page = $request->route('any'); // Get the dynamic parameter
        // dd($page);

        if (!Auth::check()) {
            return redirect()->to('/login');
        }

        // Define page-to-column mapping
        $permissions = [
            'routes'          => 'routes',
            'main-routes'     => 'routes',
            'vendor'          => 'vendors',
            'sub-contractor'  => 'scontractor',
            'employees'       => 'drivers',
            'location'        => 'location',
            'expense'         => 'expense',
            'invoice'         => 'invoice',
            'vehicle-panel'   => 'vehicle_mgmt',
            'vehicle'         => 'vehicle',
            'maintenance'     => 'maintenance',
            'insurance'       => 'insurance',
            'reminder'        => 'reminder',
            'reports'         => 'reports',
            'settings'        => 'settings',
            'staff'           => 'staff',
            'company'        => 'company'
        ];

        // Check if the requested page exists in the mapping
        if (array_key_exists($page, $permissions)) {
            $column = $permissions[$page];

            // If user does NOT have permission for this page, find the first allowed page
            if (Auth::user()->$column != 1) {
                return $this->redirectToFirstAllowedPage($permissions);
            }
        } else {
            // If page is not found in mapping, find the first allowed page
            return $this->redirectToFirstAllowedPage($permissions);
        }

        return $next($request);
    }
    private function redirectToFirstAllowedPage($permissions)
    {
        foreach ($permissions as $key => $value) {
            if (Auth::user()->$value == 1) {
                return redirect()->to('/pages/' . $key);
            }
        }

        // If user has no permissions at all, send them to home
        return redirect()->to('/');
    }
}
