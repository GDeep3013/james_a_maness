<?php

namespace App\Exports;

use App\Models\WorkOrder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class WorkOrderExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $search;
    protected $status;

    public function __construct($search = '', $status = '')
    {
        $this->search = $search;
        $this->status = $status;
    }

    public function collection()
    {
        $query = WorkOrder::with([
            'vehicle:id,vehicle_name,type,make,model,year,license_plate',
            'assignedTo:id,first_name,last_name',
            'vendor:id,name',
            'user:id,name'
        ])->orderBy('id', 'desc');

        if (!empty($this->search)) {
            $tableColumns = \Illuminate\Support\Facades\Schema::getColumnListing('work_orders');
            $query->where(function ($query) use ($tableColumns) {
                foreach ($tableColumns as $column) {
                    if (!in_array($column, ['created_at', 'updated_at', 'labels', 'service_items', 'parts'])) {
                        $query->orWhere($column, 'LIKE', '%' . $this->search . '%');
                    }
                }
            });

            $query->orWhereHas('vehicle', function ($q) {
                $q->where('vehicle_name', 'LIKE', '%' . $this->search . '%');
            });

            $query->orWhereHas('assignedTo', function ($q) {
                $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ['%' . $this->search . '%']);
            });

            $query->orWhereHas('vendor', function ($q) {
                $q->where('name', 'LIKE', '%' . $this->search . '%');
            });
        }

        if (!empty($this->status)) {
            $query->where('status', '=', $this->status);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Work Order ID',
            'Vehicle',
            'Status',
            'Priority',
            'Issue Date',
            'Scheduled Start',
            'Actual Start',
            'Expected Completion',
            'Actual Completion',
            'Assigned To',
            'Vendor',
            'Invoice Number',
            'PO Number',
            'Base Value',
            'Discount',
            'Tax',
            'Total Value',
            'Created At',
        ];
    }

    public function map($workOrder): array
    {
        $workOrderId = 'WO-' . str_pad($workOrder->id, 4, '0', STR_PAD_LEFT);
        $vehicleName = $workOrder->vehicle ? $workOrder->vehicle->vehicle_name : '';
        $assignedToName = $workOrder->assignedTo
            ? trim(($workOrder->assignedTo->first_name ?? '') . ' ' . ($workOrder->assignedTo->last_name ?? ''))
            : '';
        $vendorName = $workOrder->vendor ? $workOrder->vendor->name : '';

        $issueDate = $workOrder->issue_date
            ? \Carbon\Carbon::parse($workOrder->issue_date)->format('Y-m-d')
            : '';
        $scheduledStartDate = $workOrder->scheduled_start_date
            ? \Carbon\Carbon::parse($workOrder->scheduled_start_date)->format('Y-m-d')
            : '';
        $actualStartDate = $workOrder->actual_start_date
            ? \Carbon\Carbon::parse($workOrder->actual_start_date)->format('Y-m-d')
            : '';
        $expectedCompletionDate = $workOrder->expected_completion_date
            ? \Carbon\Carbon::parse($workOrder->expected_completion_date)->format('Y-m-d')
            : '';
        $actualCompletionDate = $workOrder->actual_completion_date
            ? \Carbon\Carbon::parse($workOrder->actual_completion_date)->format('Y-m-d')
            : '';
        $createdAt = $workOrder->created_at
            ? \Carbon\Carbon::parse($workOrder->created_at)->format('Y-m-d H:i:s')
            : '';

        $discount = '';
        if ($workOrder->discount_value) {
            $discount = $workOrder->discount_type === 'percentage'
                ? $workOrder->discount_value . '%'
                : '$' . number_format($workOrder->discount_value, 2);
        }

        $tax = '';
        if ($workOrder->tax_value) {
            $tax = $workOrder->tax_type === 'percentage'
                ? $workOrder->tax_value . '%'
                : '$' . number_format($workOrder->tax_value, 2);
        }

        return [
            $workOrderId,
            $vehicleName,
            ucfirst($workOrder->status ?? ''),
            $workOrder->repair_priority_class ?? '',
            $issueDate,
            $scheduledStartDate,
            $actualStartDate,
            $expectedCompletionDate,
            $actualCompletionDate,
            $assignedToName,
            $vendorName,
            $workOrder->invoice_number ?? '',
            $workOrder->po_number ?? '',
            $workOrder->base_value ? '$' . number_format($workOrder->base_value, 2) : '',
            $discount,
            $tax,
            $workOrder->total_value ? '$' . number_format($workOrder->total_value, 2) : '',
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
