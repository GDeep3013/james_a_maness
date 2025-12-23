<?php

namespace App\Exports;

use App\Models\Service;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ServiceExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $search;

    public function __construct($search = '')
    {
        $this->search = $search;
    }

    public function collection()
    {
        $query = Service::with([
            'vehicle:id,vehicle_name,make,model,year,license_plate,current_mileage',
            'vendor:id,name',
            'user:id,name'
        ])->orderBy('id', 'desc');

        if (!empty($this->search)) {
            $tableColumns = \Illuminate\Support\Facades\Schema::getColumnListing('services');
            $query->where(function ($query) use ($tableColumns) {
                foreach ($tableColumns as $column) {
                    if (!in_array($column, ['created_at', 'updated_at', 'service_items', 'parts'])) {
                        $query->orWhere($column, 'LIKE', '%' . $this->search . '%');
                    }
                }
            });

            $query->orWhereHas('vehicle', function ($q) {
                $q->where('vehicle_name', 'LIKE', '%' . $this->search . '%');
            });

            $query->orWhereHas('vendor', function ($q) {
                $q->where('name', 'LIKE', '%' . $this->search . '%');
            });
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Service ID',
            'Vehicle',
            'Vehicle Make/Model',
            'Repair Priority Class',
            'Primary Meter (mi)',
            'Completion Date',
            'Start Date',
            'Vendor',
            'Labor Total',
            'Parts Total',
            'Subtotal',
            'Discount Type',
            'Discount Value',
            'Discount Amount',
            'Tax Type',
            'Tax Value',
            'Tax Amount',
            'Total',
            'Notes',
            'Created At',
        ];
    }

    public function map($service): array
    {
        $serviceId = 'SVC-' . str_pad($service->id, 4, '0', STR_PAD_LEFT);
        $vehicleName = $service->vehicle ? $service->vehicle->vehicle_name : '';
        $vehicleMakeModel = '';
        if ($service->vehicle) {
            $make = $service->vehicle->make ?? '';
            $model = $service->vehicle->model ?? '';
            $year = $service->vehicle->year ?? '';
            $vehicleMakeModel = trim("$year $make $model");
        }
        $vendorName = $service->vendor ? $service->vendor->name : '';

        $completionDate = $service->completion_date
            ? \Carbon\Carbon::parse($service->completion_date)->format('Y-m-d')
            : '';
        $startDate = $service->start_date
            ? \Carbon\Carbon::parse($service->start_date)->format('Y-m-d')
            : '';
        $createdAt = $service->created_at
            ? \Carbon\Carbon::parse($service->created_at)->format('Y-m-d H:i:s')
            : '';

        $discountType = $service->discount_type ? ucfirst($service->discount_type) : '';
        $discountValue = '';
        if ($service->discount_value) {
            $discountValue = $service->discount_type === 'percentage'
                ? $service->discount_value . '%'
                : '$' . number_format($service->discount_value, 2);
        }

        $taxType = $service->tax_type ? ucfirst($service->tax_type) : '';
        $taxValue = '';
        if ($service->tax_value) {
            $taxValue = $service->tax_type === 'percentage'
                ? $service->tax_value . '%'
                : '$' . number_format($service->tax_value, 2);
        }

        return [
            $serviceId,
            $vehicleName,
            $vehicleMakeModel,
            $service->repair_priority_class ?? '',
            $service->primary_meter ?? '',
            $completionDate,
            $startDate,
            $vendorName,
            $service->labor_total ? '$' . number_format($service->labor_total, 2) : '$0.00',
            $service->parts_total ? '$' . number_format($service->parts_total, 2) : '$0.00',
            $service->subtotal ? '$' . number_format($service->subtotal, 2) : '$0.00',
            $discountType,
            $discountValue,
            $service->discount_amount ? '$' . number_format($service->discount_amount, 2) : '$0.00',
            $taxType,
            $taxValue,
            $service->tax_amount ? '$' . number_format($service->tax_amount, 2) : '$0.00',
            $service->total ? '$' . number_format($service->total, 2) : '$0.00',
            $service->notes ?? '',
            $createdAt,
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
