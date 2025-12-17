<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Maintenance Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
        }

        p {
            margin: 0;
        }

        table {
            border-collapse: collapse;
        }
    </style>
</head>

<body style="padding: 0; margin: 0; font-family: Arial, sans-serif;">
    <div style="max-width: 100%; margin: 0 auto;">
        <div id="maintenance-form-container" style="width: 100%; font-family: Arial, sans-serif; background-color: #fff;">
            <table style="width: 100%; border-collapse: collapse;" cellPadding="0" cellSpacing="0">
                <thead>
                    <tr>
                        <td style="padding: 0; vertical-align: top;">
                            <table style="width: 100%; border-collapse: collapse;" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td style="padding: 0 0 10px 0; vertical-align: top; width: 60%;">
                                            <table style="width: 100%; border-collapse: collapse;" cellPadding="0" cellSpacing="0">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <img src="{{ public_path('images/pdf-logo.png') }}" alt="Logo" style="max-width: 350px; height: auto; margin-bottom: 5px;" />
                                                            <div style="font-size: 14px; font-weight: bold; margin-top: 10px; letter-spacing: 2px;">DEDICATED TO THE PROFESSIONAL</div>
                                                            <div style="font-size: 14px; margin-top: 3px; line-height: 1.4;">
                                                                <div>Store 464, 11448 AIRLINE HIGHWAY,</div>
                                                                <div>BATON ROUGE, LA 70816 <span style="margin-left: 10px;">(225) 292-8930</span></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 10px 0; vertical-align: top;">
                                                            <div style="font-size: 18px; line-height: 1.5;">
                                                                <div style="font-weight: bold; margin-bottom: 3px; padding-bottom: 2px;">Bill To:</div>
                                                                <div style="margin-top: 5px; font-weight: bold;">
                                                                    {{ $maintenanceRecord->vendor->name ?? 'N/A' }}
                                                                </div>
                                                                @if(isset($maintenanceRecord->vendor))
                                                                <div style="margin-top: 5px; font-size: 16px; line-height: 1.4;">
                                                                    <div>{{ $maintenanceRecord->vendor->address ?? '.' }}</div>
                                                                    <div>{{ $maintenanceRecord->vendor->city ?? '.' }}, {{ $maintenanceRecord->vendor->state ?? '' }} {{ $maintenanceRecord->vendor->zip ?? '' }}</div>
                                                                    <div><span style="font-weight: bold;">Email:</span> {{ $maintenanceRecord->vendor->email ?? '' }}</div>
                                                                </div>
                                                                @endif
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>

                                        <td style="padding: 0 0 10px 0; vertical-align: top; width: 40%; text-align: right;">
                                            <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; max-width: 310px; margin-left: auto;" cellPadding="2" cellSpacing="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000; width: 103px;">Invoice:</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $maintenanceRecord->invoice_number ?? '' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000;">Sale Type</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $maintenanceRecord->sale_type ?? '' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000;">Date</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $maintenanceRecord->date ? \Carbon\Carbon::parse($maintenanceRecord->date)->format('m/d/Y') : '' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000;">Ship Via</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $maintenanceRecord->ship_via ?? '' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000;">PO Number</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $maintenanceRecord->po_number ?? '' }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px 0 0 0; height:57%; vertical-align:top;">
                            <table style="width: 100%; border-collapse: collapse; border: none;" cellPadding="0" cellSpacing="0">
                                <tr>
                                    <td colSpan="2" style="padding: 10px 0;">
                                        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin-top: 10px;" cellPadding="5" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td style="border: 1px solid #000; font-size: 18px; padding: 3px; width: 25%; text-align: center;">Counter #</td>
                                                    <td style="border: 1px solid #000; font-size: 18px; padding: 3px; width: 25%; text-align: center;">Customer Account</td>
                                                    <td style="border: 1px solid #000; font-size: 18px; padding: 3px; width: 25%; text-align: center;">Ordered By</td>
                                                    <td style="border: 1px solid #000; font-size: 18px; padding: 3px; width: 25%; text-align: center;">Special Instructions</td>
                                                </tr>
                                                <tr>
                                                    <td style="border: 1px solid #000; padding: 5px; font-size: 16px; text-align: center;">
                                                        {{ $maintenanceRecord->counter_number ?? '' }}
                                                    </td>
                                                    <td style="border: 1px solid #000; padding: 5px; font-size: 16px; text-align: center;">
                                                        {{ $maintenanceRecord->customer_account ?? '' }}
                                                    </td>
                                                    <td style="border: 1px solid #000; padding: 5px; font-size: 16px; text-align: center;">
                                                        {{ $maintenanceRecord->ordered_by ?? '' }}
                                                    </td>
                                                    <td style="border: 1px solid #000; padding: 5px; font-size: 16px; text-align: center;">
                                                        {{ $maintenanceRecord->special_instructions ?? '' }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table style="width: 100%; border-collapse: collapse; border: none;" cellPadding="0" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Qty</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Line</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Item Number</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: left;">Description</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Warr</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Unit</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Tax</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: right;">List</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: right;">Net</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: right;">Extended</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @if(isset($maintenanceRecord->line_items) && is_array($maintenanceRecord->line_items) && count($maintenanceRecord->line_items) > 0)
                                    @foreach($maintenanceRecord->line_items as $item)
                                    <tr>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['qty'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['line'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['item_number'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: left;">{{ $item['description'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['warr'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['unit'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['tax'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: right;">{{ isset($item['list']) ? number_format($item['list'], 2) : '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: right;">{{ isset($item['net']) ? number_format($item['net'], 2) : '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: right;">{{ isset($item['extended']) ? number_format($item['extended'], 2) : '' }}</td>
                                    </tr>

                                    @endforeach
                                    @endif
                                    <tr>
                                        <td style="width: 100%; text-align:center;" colspan="10">

                                            <div style="text-align: center; font-size: 16px; font-weight: bold; margin-top: 20px">**Historical Reprint**</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td style="padding: 15px 0 0 0;">
                            <table style="width: 100%; border-collapse: collapse;" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div style="font-size: 16px; margin-bottom: 5px; border-bottom: 1px solid #000;">
                                                {{ isset($maintenanceRecord->line_items) ? count($maintenanceRecord->line_items) : 0 }} Items
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style="font-size: 14px; border-top: 2px solid #000; padding-top:5px; text-align: right">
                                                Chip Used: N {{ $maintenanceRecord->payment_reference ?? '' }} AUTH CD: 175275
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <!-- <td>
                                            <div style="font-size: 16px; padding: 10px 0;">
                                                <div style="margin-bottom: 5px;">
                                                    <strong>Payment Method:</strong> {{ $maintenanceRecord->payment_method ?? '' }}
                                                </div>
                                                <div>
                                                    <strong>Payment Reference:</strong> {{ $maintenanceRecord->payment_reference ?? '' }}
                                                </div>
                                            </div>
                                        </td> -->
                                    </tr>
                                </tbody>
                            </table>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 21px;" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td style="vertical-align: bottom; width: 35%;">
                                            <img src="{{ public_path('images/qr-code-img.jpg') }}" alt="QR code" style="width: 100%; max-width: 65%; height: 75px;" />
                                        </td>
                                        <td style="vertical-align: bottom; width: 35%;">
                                            <img src="{{ public_path('images/bar-code-img.jpg') }}" alt="Bar Code" style="width: 100%; max-width: 63%; height: auto;" />
                                        </td>
                                        <td style="vertical-align: top; text-align: right; width: 30%;">
                                            <table style="width: 100%; border-collapse: collapse; margin-left: auto;" cellPadding="2" cellSpacing="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 2px 5px;">Sub-Total</td>
                                                        <td style="font-size: 16px; text-align: right; padding: 2px 0;">
                                                            {{ isset($maintenanceRecord->sub_total) ? number_format($maintenanceRecord->sub_total, 2) : '0.00' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 2px 5px; border-bottom: 1px solid #000;">Sales Tax</td>
                                                        <td style="font-size: 16px; text-align: right; padding: 2px 0; border-bottom: 1px solid #000;">
                                                            {{ isset($maintenanceRecord->sales_tax) ? number_format($maintenanceRecord->sales_tax, 2) : '0.00' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 2px 5px; font-weight: bold;">Total</td>
                                                        <td style="font-size: 16px; text-align: right; padding: 2px 0; font-weight: bold;">
                                                            {{ isset($maintenanceRecord->total_value) ? number_format($maintenanceRecord->total_value, 2) : '0.00' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 2px 5px;">
                                                            {{ $maintenanceRecord->payment_method ?? '' }}
                                                        </td>
                                                        <td style="font-size: 16px; text-align: right; padding: 2px 0;">
                                                            {{ isset($maintenanceRecord->total_value) ? number_format($maintenanceRecord->total_value, 2) : '0.00' }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table style="width: 100%; border-collapse: collapse;" cellPadding:0; cellSpacing:0>
                                <tbody>
                                    <tr>
                                        <td style="width:65%; padding: 15px 0 5px 0">
                                            <div style="font-size: 19px; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 2px;">WWW.OREILLYPRO.COM</div>
                                            <div style="font-size:12px; margin-bottom:8px;">Warranty/Garantia: www.oreillypro.com/warranty</div>
                                        </td>
                                        <td sstyle="width:25%; padding: 15px 0 5px 0">
                                            <div style="font-size: 19px; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 2px;">WE APPRECIATE YOUR BUSINESS!</div>
                                            <div style="font-size:12px; margin-bottom:8px;">464WS167 Remit To: PO BOX 9464, SPRINGFIELD, MO 65801-9464</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</body>

</html>
