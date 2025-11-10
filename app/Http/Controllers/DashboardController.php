<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Auth;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $loggedInUser =Auth::user();
        $users = User::where('id', $loggedInUser->id)->first();
        if (!empty($users)) {
            return response()->json(['status' => true, 'user' => $users]);
        } else {
            return response()->json(['status' => false, 'message' => 'User not found']);
        }
    }


}
