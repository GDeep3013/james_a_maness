<?php

namespace App\Exports;

use App\Models\Vendor;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class VendorExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $search;

    public function __construct($search = '')
    {
        $this->search = $search;
    }

    public function collection()
    {
        $query = Vendor::orderBy('name', 'asc');

        if (!empty($this->search)) {
            $tableColumns = \Illuminate\Support\Facades\Schema::getColumnListing('vendors');
            $query->where(function ($query) use ($tableColumns) {
                foreach ($tableColumns as $column) {
                    if (!in_array($column, ['created_at', 'updated_at'])) {
                        $query->orWhere($column, 'LIKE', '%' . $this->search . '%');
                    }
                }
            });
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Vendor ID',
            'Name',
            'Email',
            'Phone',
            'Website',
            'Address',
            'City',
            'State',
            'Country',
            'ZIP',
            'Contact Name',
            'Contact Phone',
            'Contact Email',
            'Charging',
            'Fuel',
            'Service',
            'Vehicle',
            'Notes',
            'Created At',
        ];
    }

    public function map($vendor): array
    {
        $createdAt = $vendor->created_at 
            ? \Carbon\Carbon::parse($vendor->created_at)->format('Y-m-d H:i:s')
            : '';

        return [
            $vendor->id,
            $vendor->name ?? '',
            $vendor->email ?? '',
            $vendor->phone ?? '',
            $vendor->website ?? '',
            $vendor->address ?? '',
            $vendor->city ?? '',
            $vendor->state ?? '',
            $vendor->country ?? '',
            $vendor->zip ?? '',
            $vendor->contact_name ?? '',
            $vendor->contact_phone ?? '',
            $vendor->contact_email ?? '',
            $vendor->charging ? 'Yes' : 'No',
            $vendor->fuel ? 'Yes' : 'No',
            $vendor->service ? 'Yes' : 'No',
            $vendor->vehicle ? 'Yes' : 'No',
            $vendor->notes ?? '',
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
