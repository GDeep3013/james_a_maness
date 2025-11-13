<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPageAccess
{
    private $pagePermissions = [
        'contacts' => ['Admin', 'Manager', 'Contact'],
        'contacts/create' => ['Admin', 'Manager', 'Contact'],
        'contacts/*/edit' => ['Admin', 'Manager', 'Contact'],
        'vehicles' => ['Admin', 'Manager', 'Contact'],
        'vehicles/create' => ['Admin', 'Manager', 'Contact'],
        'vehicles/*/edit' => ['Admin', 'Manager', 'Contact'],
        'profile' => ['Admin', 'Manager', 'Driver'],
    ];

    public function handle(Request $request, Closure $next): Response
    {

        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthenticated',
                    'error' => null
                ], 401);
            }
            return redirect()->to('/login');
        }

         $user = Auth::user();
         $path = $request->path();

        // dd($user->type);

        foreach ($this->pagePermissions as $pattern => $allowedRoles) {
            if ($this->matchPattern($pattern, $path)) {
                if (!in_array($user->type, $allowedRoles)) {
                    if ($request->expectsJson()) {
                        return response()->json([
                            'status' => false,
                            'message' => 'You do not have permission to access this page.',
                            'error' => null
                        ], 403);
                    }
                    return redirect()->route('home')->with('error', 'You do not have permission to access this page.');
                }
                break;
            }
        }

        return $next($request);
    }

    private function matchPattern(string $pattern, string $path): bool
    {
        $pattern = str_replace('*', '.*', $pattern);
        $pattern = '/^' . str_replace('/', '\/', $pattern) . '$/';
        return preg_match($pattern, $path) === 1;
    }
}
