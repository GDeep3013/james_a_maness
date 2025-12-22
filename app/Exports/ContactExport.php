<?php

namespace App\Exports;

use App\Models\Contact;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ContactExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
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
        $query = Contact::with(['user:id,profile_picture'])->orderBy('id', 'desc');

        if (!empty($this->search)) {
            $tableColumns = \Illuminate\Support\Facades\Schema::getColumnListing('contacts');
            $query->where(function ($query) use ($tableColumns) {
                foreach ($tableColumns as $column) {
                    if ($column !== 'created_at' && $column !== 'updated_at') {
                        $query->orWhere($column, 'LIKE', '%' . $this->search . '%');
                    }
                }
                $query->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$this->search}%"]);
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
            'Contact ID',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'License Number',
            'License Class',
            'Designation',
            'Status',
            'Employee Number',
            'Job Title',
            'Hourly Labor Rate',
            'License Issue Country',
            'License Issue State',
            'License Issue Date',
            'License Expire Date',
            'Job Join Date',
            'Emergency Contact Name',
            'Emergency Contact Number',
            'Created At',
        ];
    }

    public function map($contact): array
    {
        $fullName = trim(($contact->first_name ?? '') . ' ' . ($contact->last_name ?? ''));
        $licenseIssueDate = $contact->license_issue_date 
            ? \Carbon\Carbon::parse($contact->license_issue_date)->format('Y-m-d')
            : '';
        $licenseExpireDate = $contact->license_expire_date 
            ? \Carbon\Carbon::parse($contact->license_expire_date)->format('Y-m-d')
            : '';
        $jobJoinDate = $contact->job_join_date 
            ? \Carbon\Carbon::parse($contact->job_join_date)->format('Y-m-d')
            : '';
        $createdAt = $contact->created_at 
            ? \Carbon\Carbon::parse($contact->created_at)->format('Y-m-d H:i:s')
            : '';

        return [
            $contact->id,
            $contact->first_name ?? '',
            $contact->last_name ?? '',
            $contact->email ?? '',
            $contact->phone ?? '',
            $contact->license_no ?? '',
            $contact->license_class ?? '',
            $contact->designation ?? '',
            ucfirst($contact->status ?? ''),
            $contact->employee_number ?? '',
            $contact->job_title ?? '',
            $contact->hourly_labor_rate ?? '',
            $contact->license_issue_country ?? '',
            $contact->license_issue_state ?? '',
            $licenseIssueDate,
            $licenseExpireDate,
            $jobJoinDate,
            $contact->emergency_contact_name ?? '',
            $contact->emergency_contact_no ?? '',
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
