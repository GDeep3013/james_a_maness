<?php

namespace App\Exports;

use App\Models\MeterReading;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class MeterReadingExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $search;

    public function __construct($search = '')
    {
        $this->search = $search;
    }

    public function collection()
    {
        $query = MeterReading::with(['vehicle', 'user'])->orderBy('date', 'desc');

        if (!empty($this->search)) {
            $tableColumns = \Illuminate\Support\Facades\Schema::getColumnListing('meter_readings');
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
            'Reading ID',
            'Date',
            'Vehicle ID',
            'Vehicle Name',
            'Meter Reading',
            'Recorded By',
            'Recorded At',
        ];
    }

    public function map($meterReading): array
    {
        $vehicleName = $meterReading->vehicle ? $meterReading->vehicle->vehicle_name : '';
        $userName = $meterReading->user ? $meterReading->user->name : '';
        $date = $meterReading->date
            ? \Carbon\Carbon::parse($meterReading->date)->format('Y-m-d')
            : '';
        $recordedAt = $meterReading->created_at
            ? \Carbon\Carbon::parse($meterReading->created_at)->format('Y-m-d H:i:s')
            : '';

        return [
            $meterReading->id,
            $date,
            $meterReading->vehicle_id ?? '',
            $vehicleName,
            $meterReading->vehicle_meter ?? '',
            $userName,
            $recordedAt,
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
