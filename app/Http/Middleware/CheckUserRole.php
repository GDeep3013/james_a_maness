<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    private $rolePermissions = [
        'Admin' => [
            'dashboard', 'drivers', 'vehicles', 'routes', 'vendors', 
            'location', 'expense', 'invoice', 'maintenance', 'insurance', 
            'reminder', 'settings', 'staff', 'reports', 'company'
        ],
        'Manager' => [
            'dashboard', 'drivers', 'vehicles', 'routes', 'vendors',
            'location', 'expense', 'invoice', 'maintenance', 'insurance',
            'reminder', 'reports'
        ],
        'Driver' => [
            'dashboard', 'profile'
        ],
    ];

    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthenticated',
                    'error' => null
                ], 401);
            }
            return redirect()->route('login');
        }

        $user = Auth::user();

        if ($user->status !== 1) {
            Auth::logout();
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Account is inactive',
                    'error' => null
                ], 403);
            }
            return redirect()->route('login');
        }

        if (!empty($roles) && !in_array($user->type, $roles)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Insufficient permissions.',
                    'error' => null
                ], 403);
            }
            return redirect()->route('home')->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }

    public static function hasPermission($userType, $permission): bool
    {
        $instance = new self();
        return isset($instance->rolePermissions[$userType]) && 
               in_array($permission, $instance->rolePermissions[$userType]);
    }

    public static function getAllowedPages($userType): array
    {
        $instance = new self();
        return $instance->rolePermissions[$userType] ?? [];
    }
}
