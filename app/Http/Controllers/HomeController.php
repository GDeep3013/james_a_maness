<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class HomeController extends Controller
{


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index(Request $request)
    {
        // if (Auth::user()->status === 1) {
        // if (Auth::user()->dashboard == 1) {
        return view('home');
        // } else {
        //     return $this->redirectToFirstAllowedPage();
        // }
        // } else {
        //     Auth::logout(); // Logs out the user
        //     return redirect()->to('/login'); // Redirects to login page
        // }
    }
    private function redirectToFirstAllowedPage()
    {
        $permissions = [
            'routes'          => 'routes',
            'main-routes'     => 'routes',
            'vendors'         => 'vendors',
            'fuels'           => 'fuels',
            'meter-history' =>  'meter-history',
            'expense-history' => 'expense-history',
            'meters'         => 'meters',
            'sub-contractor' => 'scontractor',
            'employees'      => 'drivers',
            'location'       => 'location',
            'expense'        => 'expense',
            'invoice'        => 'invoice',
            'vehicle-panel'  => 'vehicle_mgmt',
            'vehicle'        => 'vehicle',
            'maintenance'    => 'maintenance',
            'fuel'           => 'fuel',
            'insurance'      => 'insurance',
            'reminder'       => 'reminder',
            'reports'        => 'reports',
            'settings'       => 'settings',
            'staff'          => 'staff',
            'company'        => 'company'
        ];

        foreach ($permissions as $key => $value) {
            if (Auth::user()->$value == 1) {
                $targetUrl = url('/pages/' . $key);

                // ✅ Prevent infinite redirects
                if (request()->url() !== $targetUrl) {
                    return redirect()->to($targetUrl);
                } else {
                    return view('home'); // Stay on the same page if already there
                }
            }
        }

        return redirect()->to('/'); // Default if no permissions found
    }
}
