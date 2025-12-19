<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Fuel Report</title>
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
        <div id="fuel-form-container" style="width: 100%; font-family: Arial, sans-serif; background-color: #fff;">
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
                                                                    {{ $fuelReport->vendor->name ?? 'N/A' }}
                                                                </div>
                                                                @if(isset($fuelReport->vendor))
                                                                <div style="margin-top: 5px; font-size: 16px; line-height: 1.4;">
                                                                    <div>{{ $fuelReport->vendor->address ?? '.' }}</div>
                                                                    <div>{{ $fuelReport->vendor->city ?? '.' }}, {{ $fuelReport->vendor->state ?? '' }} {{ $fuelReport->vendor->zip ?? '' }}</div>
                                                                    <div><span style="font-weight: bold;">Email:</span> {{ $fuelReport->vendor->email ?? '' }}</div>
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
                                                            {{ $fuelReport->invoice_number ?? '' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000;">Sale Type</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $fuelReport->sale_type ?? '' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000;">Date</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $fuelReport->date ? \Carbon\Carbon::parse($fuelReport->date)->format('m/d/Y') : '' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000;">Ship Via</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $fuelReport->ship_via ?? '' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000;">PO Number</td>
                                                        <td style="font-size: 16px; padding: 8px; border-bottom: 1px solid #000;">
                                                            {{ $fuelReport->po_number ?? '' }}
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
                                                        {{ $fuelReport->counter_number ?? '' }}
                                                    </td>
                                                    <td style="border: 1px solid #000; padding: 5px; font-size: 16px; text-align: center;">
                                                        {{ $fuelReport->customer_account ?? '' }}
                                                    </td>
                                                    <td style="border: 1px solid #000; padding: 5px; font-size: 16px; text-align: center;">
                                                        {{ $fuelReport->ordered_by ?? '' }}
                                                    </td>
                                                    <td style="border: 1px solid #000; padding: 5px; font-size: 16px; text-align: center;">
                                                        {{ $fuelReport->special_instructions ?? '' }}
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
                                        <!-- <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Qty</th> -->
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: left;">Vehicle</th>
                                        <!-- <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Line</th> -->
                                        <!-- <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Fuel Type</th> -->
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: left;">Meter Reading</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: left;">Unit Type</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Unit</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Tax</th>
                                        <!-- <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: right;">List</th> -->
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: center;">Price Per Unit</th>
                                        <th style="border-top: 2px solid #000; border-bottom: 1px solid #000; font-size: 18px; font-weight: bold; padding: 2px; text-align: right;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @if(isset($fuelReport->line_items) && is_array($fuelReport->line_items) && count($fuelReport->line_items) > 0)
                                    @foreach($fuelReport->line_items as $item)
                                    <tr>
                                        <!-- <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['qty'] ?? '' }}</td> -->
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: left;">{{ $item['vehicle_name'] ?? '' }}</td>
                                        <!-- <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['line'] ?? '' }}</td> -->
                                        <!-- <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['fuel_type'] ?? '' }}</td> -->
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: left;">{{ $item['meter_reading'] ?? '' }}</td>
                                        <td style="border: none; font-size: 15px; padding: 4px 2px; text-align: left;">{{ strtoupper($item['unit_type'] ?? '') }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['unit'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">{{ $item['tax'] ?? '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: center;">$ {{ isset($item['per_unit_price']) ? number_format($item['per_unit_price'], 2) : '' }}</td>
                                        <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: right;">$ {{ isset($item['net']) ? number_format($item['net'], 2) : '' }}</td>
                                        <!-- <td style="border: none; font-size: 16px; padding: 4px 2px; text-align: right;">$ {{ isset($item['extended']) ? number_format($item['extended'], 2) : '' }}</td> -->
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
                                                {{ isset($fuelReport->line_items) ? count($fuelReport->line_items) : 0 }} Items
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style="font-size: 14px; border-top: 2px solid #000; padding-top:5px; text-align: right">
                                                Chip Used: N {{ $fuelReport->payment_reference ?? '' }} AUTH CD: 175275
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
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
                                                            $ {{ isset($fuelReport->sub_total) ? number_format($fuelReport->sub_total, 2) : '0.00' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 2px 5px; border-bottom: 1px solid #000;">Sales Tax</td>
                                                        <td style="font-size: 16px; text-align: right; padding: 2px 0; border-bottom: 1px solid #000;">
                                                            $ {{ isset($fuelReport->sales_tax) ? number_format($fuelReport->sales_tax, 2) : '0.00' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 2px 5px; font-weight: bold;">Total</td>
                                                        <td style="font-size: 16px; text-align: right; padding: 2px 0; font-weight: bold;">
                                                            $ {{ isset($fuelReport->total_value) ? number_format($fuelReport->total_value, 2) : '0.00' }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 18px; text-align: right; padding: 2px 5px;">
                                                            {{ $fuelReport->payment_method ?? '' }}
                                                        </td>
                                                        <td style="font-size: 16px; text-align: right; padding: 2px 0;">
                                                            {{ isset($fuelReport->total_value) ? number_format($fuelReport->total_value, 2) : '0.00' }}
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
