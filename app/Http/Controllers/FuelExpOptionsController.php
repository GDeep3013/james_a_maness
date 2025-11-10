<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FuelExpOption;

class FuelExpOptionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $fuelExp = FuelExpOption::get();
        return response()->json(['status' => true, 'data' => $fuelExp]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->type === 'Mileage') {
            // Fetch existing mileage values from the database
            $existingFuelMileageValues = FuelExpOption::where('type', $request->type)->first();
            $existingFuelMileageValues = $existingFuelMileageValues ? json_decode($existingFuelMileageValues->options, true) : []; // Decode JSON string into array
        
            // Get new fuel mileage values from request
            $fuelMileageValues = collect($request->fuelExp)
                ->pluck('fuel_mileage')
                ->filter()
                ->all();
        
            // Merge existing and new values, remove duplicates
            $mergedFuelMileageValues = array_merge($existingFuelMileageValues, $fuelMileageValues);
            $mergedFuelMileageValues = array_unique($mergedFuelMileageValues);
        
            // Store the merged values as JSON in the database
            $fuelExp = FuelExpOption::updateOrCreate(
                ['type' => $request->type],
                ['options' => json_encode($mergedFuelMileageValues)] // Store as a JSON array
            );
        }
        
        if ($request->type === 'Tax') {
            // Fetch existing tax values from the database
            $existingFuelTaxValues = FuelExpOption::where('type', $request->type)->first();
            $existingFuelTaxValues = $existingFuelTaxValues ? json_decode($existingFuelTaxValues->options, true) : []; // Decode JSON string into array
        
            // Get new fuel tax values from request
            $fuelTaxValues = collect($request->fuelExp)
                ->pluck('fuel_tax')
                ->filter()
                ->all();
        
            // Merge existing and new values, remove duplicates
            $mergedFuelTaxValues = array_merge($existingFuelTaxValues, $fuelTaxValues);
            $mergedFuelTaxValues = array_unique($mergedFuelTaxValues);
        
            // Store the merged values as JSON in the database
            $fuelExp = FuelExpOption::updateOrCreate(
                ['type' => $request->type],
                ['options' => json_encode($mergedFuelTaxValues)] // Store as a JSON array
            );
        }
        
        if ($fuelExp) {
            return response()->json([
                'status' => true,
                'message' => $request->type . ' updated or created successfully',
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update or create ' . $request->type,
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
