<?php

namespace App\Exports;

use App\Models\ExpenseHistory;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ExpenseHistoryExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $search;

    public function __construct($search = '')
    {
        $this->search = $search;
    }

    public function collection()
    {
        $query = ExpenseHistory::with(['vehicle', 'vendor', 'user'])->orderBy('date', 'desc');

        if (!empty($this->search)) {
            $tableColumns = \Illuminate\Support\Facades\Schema::getColumnListing('expense_histories');
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
            'Expense ID',
            'Date',
            'Vehicle ID',
            'Vehicle Name',
            'Expense Type',
            'Amount',
            'Vendor',
            'Frequency',
            'Recurrence Period',
            'Notes',
            'Recorded By',
            'Created At',
        ];
    }

    public function map($expense): array
    {
        $vehicleName = $expense->vehicle ? $expense->vehicle->vehicle_name : '';
        $vendorName = $expense->vendor ? $expense->vendor->name : '';
        $userName = $expense->user ? $expense->user->name : '';
        $date = $expense->date
            ? \Carbon\Carbon::parse($expense->date)->format('Y-m-d')
            : '';
        $createdAt = $expense->created_at
            ? \Carbon\Carbon::parse($expense->created_at)->format('Y-m-d H:i:s')
            : '';
        $expenseType = $expense->expense_type
            ? ucwords(str_replace('_', ' ', $expense->expense_type))
            : '';
        $frequency = $expense->frequency
            ? ucfirst($expense->frequency)
            : '';
        $recurrencePeriod = $expense->recurrence_period
            ? ucfirst($expense->recurrence_period)
            : '';

        return [
            $expense->id,
            $date,
            $expense->vehicle_id ?? '',
            $vehicleName,
            $expenseType,
            number_format($expense->amount, 2),
            $vendorName,
            $frequency,
            $recurrencePeriod,
            $expense->notes ?? '',
            $userName,
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
