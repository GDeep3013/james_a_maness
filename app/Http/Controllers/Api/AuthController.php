<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', $validator->errors(), 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->error('Invalid credentials', null, 401);
        }

        $user = Auth::user();
        
        if ($user->status !== 1) {
            Auth::logout();
            return $this->error('Account is inactive', null, 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success('Login successful', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'type' => $user->type,
                'status' => $user->status,
            ],
            'permissions' => \App\Http\Middleware\CheckUserRole::getAllowedPages($user->type),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success('Logged out successfully');
    }

    public function user(Request $request)
    {
        $user = $request->user();
        return $this->success('User retrieved', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'type' => $user->type,
            'status' => $user->status,
            'permissions' => \App\Http\Middleware\CheckUserRole::getAllowedPages($user->type),
        ]);
    }

    public function refresh(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success('Token refreshed', [
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
