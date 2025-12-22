<?php

namespace App\Exports;

use App\Models\Vehical;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class VehicleExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $search;
    protected $status;
    protected $fuelType;

    public function __construct($search = '', $status = '', $fuelType = '')
    {
        $this->search = $search;
        $this->status = $status;
        $this->fuelType = $fuelType;
    }

    public function collection()
    {
        $query = Vehical::with(['driver:id,first_name,last_name', 'vendor:id,name'])->orderBy('id', 'desc');

        if (!empty($this->search)) {
            $tableColumns = \Illuminate\Support\Facades\Schema::getColumnListing('vehicals');
            $query->where(function ($query) use ($tableColumns) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at') {
                        $query->orWhere($column, 'LIKE', '%' . $this->search . '%');
                    }
                }
            });
        }

        if (!empty($this->status)) {
            $query->where('initial_status', '=', $this->status);
        }

        if (!empty($this->fuelType)) {
            $query->where('fuel_type', '=', $this->fuelType);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Vehicle ID',
            'Vehicle Name',
            'Type',
            'Make',
            'Model',
            'Year',
            'VIN',
            'License Plate',
            'Fuel Type',
            'Status',
            'Current Mileage',
            'Driver',
            'Location',
            'Vendor',
            'Next Service Date',
            'Purchase Date',
            'Purchase Price',
            'Department',
        ];
    }

    public function map($vehicle): array
    {
        $vehicleId = strtoupper($vehicle->type) . '-' . str_pad($vehicle->id, 4, '0', STR_PAD_LEFT);
        $driverName = $vehicle->driver 
            ? trim(($vehicle->driver->first_name ?? '') . ' ' . ($vehicle->driver->last_name ?? ''))
            : '';
        $vendorName = $vehicle->vendor ? $vehicle->vendor->name : '';
        $nextServiceDate = $vehicle->next_service_date 
            ? \Carbon\Carbon::parse($vehicle->next_service_date)->format('Y-m-d')
            : '';
        $purchaseDate = $vehicle->purchase_date 
            ? \Carbon\Carbon::parse($vehicle->purchase_date)->format('Y-m-d')
            : '';

        return [
            $vehicleId,
            $vehicle->vehicle_name ?? '',
            $vehicle->type ?? '',
            $vehicle->make ?? '',
            $vehicle->model ?? '',
            $vehicle->year ?? '',
            $vehicle->vin ?? '',
            $vehicle->license_plate ?? '',
            $vehicle->fuel_type ?? '',
            ucfirst($vehicle->initial_status ?? ''),
            $vehicle->current_mileage ?? '',
            $driverName,
            $vehicle->primary_location ?? '',
            $vendorName,
            $nextServiceDate,
            $purchaseDate,
            $vehicle->purchase_price ?? '',
            $vehicle->department ?? '',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }
}
