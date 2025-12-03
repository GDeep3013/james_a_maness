<?php

namespace App\Imports;

use App\Models\Vehical;
use App\Models\Contact;
use App\Models\Vendor;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class VehicleImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure, WithBatchInserts, WithChunkReading
{
    use SkipsFailures;

    protected $imported = 0;
    protected $skipped = 0;
    protected $errors = [];

    public function model(array $row)
    {
        $vehicleName = $this->getValue($row, 'vehicle_name');
        $licensePlate = $this->getValue($row, 'license_plate');
        $vin = $this->getValue($row, 'vin');
        $type = $this->getValue($row, 'type');

        if (empty($vehicleName) || empty($licensePlate) || empty($type)) {
            $this->skipped++;
            return null;
        }

        $existingVehicle = Vehical::where('license_plate', $licensePlate)->first();

        if ($existingVehicle) {
            $this->skipped++;
            return null;
        }

        if (!empty($vin)) {
            $existingByVin = Vehical::where('vin', $vin)->first();
            if ($existingByVin) {
                $this->skipped++;
                return null;
            }
        }

        $vendorId = null;
        if (!empty($this->getValue($row, 'vendor_name'))) {
            $vendor = Vendor::where('name', $this->getValue($row, 'vendor_name'))->first();
            if ($vendor) {
                $vendorId = $vendor->id;
            }
        }

        $assignedDriver = null;
        if (!empty($this->getValue($row, 'driver_email'))) {
            $contact = Contact::where('email', $this->getValue($row, 'driver_email'))->first();
            if ($contact) {
                $assignedDriver = $contact->id;
            }
        }

        $purchaseDate = null;
        if (!empty($this->getValue($row, 'purchase_date'))) {
            try {
                $purchaseDate = Carbon::parse($this->getValue($row, 'purchase_date'))->format('Y-m-d');
            } catch (\Exception $e) {
                $purchaseDate = null;
            }
        }

        $initialStatus = $this->getValue($row, 'initial_status');
        if (!in_array($initialStatus, ['available', 'assigned', 'maintenance', 'inactive'])) {
            $initialStatus = 'available';
        }

        $this->imported++;

        return new Vehical([
            'vehicle_name' => $vehicleName,
            'type' => $type,
            'make' => $this->getValue($row, 'make'),
            'model' => $this->getValue($row, 'model'),
            'year' => $this->getValue($row, 'year'),
            'vin' => $vin,
            'license_plate' => $licensePlate,
            'color' => $this->getValue($row, 'color'),
            'fuel_type' => $this->getValue($row, 'fuel_type'),
            'transmission' => $this->getValue($row, 'transmission'),
            'purchase_date' => $purchaseDate,
            'engine_size' => $this->getValue($row, 'engine_size'),
            'current_mileage' => $this->getValue($row, 'current_mileage'),
            'purchase_price' => $this->getValue($row, 'purchase_price'),
            'initial_status' => $initialStatus,
            'vendor_id' => $vendorId,
            'primary_location' => $this->getValue($row, 'primary_location'),
            'notes' => $this->getValue($row, 'notes'),
            'assigned_driver' => $assignedDriver,
            'department' => $this->getValue($row, 'department'),
        ]);
    }

    public function rules(): array
    {
        return [
            'vehicle_name' => 'required',
            'license_plate' => 'required',
            'type' => 'required',
        ];
    }

    public function batchSize(): int
    {
        return 100;
    }

    public function chunkSize(): int
    {
        return 100;
    }

    protected function getValue(array $row, $key)
    {
        $key = strtolower(str_replace(' ', '_', $key));
        
        if (isset($row[$key])) {
            $value = $row[$key];
            return is_null($value) || $value === '' ? null : trim((string) $value);
        }

        $variations = [
            'vehicle_name' => ['vehicle name', 'vehiclename', 'name'],
            'license_plate' => ['license plate', 'licenseplate', 'plate'],
            'vin' => ['vin number', 'vinnumber'],
            'fuel_type' => ['fuel type', 'fueltype'],
            'purchase_date' => ['purchase date', 'purchasedate'],
            'engine_size' => ['engine size', 'enginesize'],
            'current_mileage' => ['current mileage', 'currentmileage', 'mileage'],
            'purchase_price' => ['purchase price', 'purchaseprice', 'price'],
            'initial_status' => ['initial status', 'initialstatus', 'status'],
            'vendor_name' => ['vendor name', 'vendorname', 'vendor'],
            'driver_email' => ['driver email', 'driveremail', 'driver'],
            'primary_location' => ['primary location', 'primarylocation', 'location'],
        ];

        if (isset($variations[$key])) {
            foreach ($variations[$key] as $variation) {
                if (isset($row[$variation])) {
                    $value = $row[$variation];
                    return is_null($value) || $value === '' ? null : trim((string) $value);
                }
            }
        }

        return null;
    }

    public function getImportedCount()
    {
        return $this->imported;
    }

    public function getSkippedCount()
    {
        return $this->skipped;
    }
}

