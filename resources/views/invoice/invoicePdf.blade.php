<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Shiva Transport</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }

        p {
            margin: 0;
        }
    </style>
</head>
@php
$invoiceMeta = $invoiceData['transformed_meta'];
$route = $invoiceData['routes_id'];
$start_date = $invoiceData['start_date'];
$end_date = $invoiceData['end_date'];
$company = $invoiceData['company'];

// Decode JSON fields
$routes = isset($invoiceMeta['routes']) && !is_null($invoiceMeta['routes'])
? json_decode($invoiceMeta['routes'], true) ?? []
: [];
$fuelExp = isset($invoiceMeta['fuelExp']) && !is_null($invoiceMeta['fuelExp'])
? json_decode($invoiceMeta['fuelExp'], true) ?? []
: [];
$invoiceTax = isset($invoiceMeta['invoiceTax']) && !is_null($invoiceMeta['invoiceTax'])
? json_decode($invoiceMeta['invoiceTax'], true) ?? []
: [];

$termCondition = isset($invoiceMeta['termAndCondition']) && !is_null($invoiceMeta['termAndCondition'])
? json_decode($invoiceMeta['termAndCondition'], true) ?? []
: [];

// Calculate totals
$totalRoutesAmount = array_sum(array_column($routes, 'total_amount'));
$totalFuelAmount = array_sum(array_column($fuelExp, 'fuel_total_amt'));
$totalTaxAmount = array_sum(array_column($invoiceTax, 'tax_amount'));

$subTotal = $totalRoutesAmount + $totalFuelAmount;
$sub_total = number_format($subTotal, 2);

$grandTotal = $subTotal + $totalTaxAmount;
$grand_total = number_format($grandTotal, 2);
$position = count($routes) > 2 && count($fuelExp) > 2 ? 'unset' : 'relative';
$top = count($routes) > 2 && count($fuelExp) > 2 ? '20%' : '10%';
@endphp

<body style="padding: 0; margin:0; font-family: 'Poppins', sans-serif;">
    <div style="max-width:1236px; margin:0 auto; padding:20px">
        <table style="max-width: 100%;width: 100%; margin-top:10px; text-align:left;" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td>
                        <!-- <img src="{{'data:image/png;base64,'.base64_encode(file_get_contents(public_path('assets/img/logo_new.png')))}}" width="240px"> -->
                        <img src="data:image/png;base64,{{$invoiceData['logo_image']}}" style="max-width: 240px;">

                    </td>
                    <td></td>
                    <td>
                        <h1 style="color: #28abe5; text-transform: uppercase; letter-spacing: 1.5px; font-size: 25px; margin-bottom:0;text-align:right;">Invoice</h1>
                        <p style="color:rgba(0, 0, 0, 0.87); font-size:19px; text-align:right;">{{"#". $invoiceData['custom_invoice_id']}}</p>
                        <p style="color:rgba(0, 0, 0, 0.87); font-size:19px; text-align:right;">{!! $invoiceData['gst_no'] ? "<strong>GST No:</strong> " . $invoiceData['gst_no'] : "" !!}</p>
                        <p style="color:rgba(0, 0, 0, 0.87); font-size:19px; text-align:right;">{{$invoiceData['invoice_date']}}</p>
                    </td>

                </tr>
                <tr>
                    <td style="margin-top:20px">
                        <h2 style="font-size: 25px; color:rgba(0, 0, 0, 0.87); margin: 0 0 5px;">{{ $company['name'] }}</h2>
                        @if(!empty($invoiceData['vendor_no']))
                        <p style="margin: 0;"><b style="font-size: 19px; line-height: 1; font-weight: 600;">Vendor: {{ '#' . $invoiceData['vendor_no'] }}</b></p>
                        @endif
                        <p style="margin: 0 0 8px; padding: 0px; font-size:19px;line-height:1;">{{ $company['address'] }}</p>
                        <p style="margin: 0;"><b style="font-size:19px;line-height:1; margin: 0; padding: 0px; font-weight: 600;">PH: {{ $company['phone'] }}</b></p>
                        <p style="margin: 0;"><b style="font-size: 19px; line-height: 1; font-weight: 600;">EMAIL: {{ $company['email'] }}</b></p>
                        <p style="font-size: 17px; color:rgba(0, 0, 0, 0.87); margin-top:0x; padding-top:20px; font-weight:600;">#Due Date: <span style=" font-weight: 400;">{{$invoiceData['due_date']}}</span></p>
                    </td>
                    <td style="padding-top:20px"></td>
                    <td style="padding-top:20px">
                        <h2 style="font-size: 21px; color:rgba(0, 0, 0, 0.87); margin: 0 0 5px;">To</h2>
                        <p style="font-size:19px;line-height:1;">{{$invoiceData['vendor_name']}}</p>
                        <p style="font-size:19px;line-height:1;">{{$invoiceData['vendor_address']}}</p>
                        <p style="margin-top: 0;"><b style="font-size:19px;line-height:1; font-weight: 600;">PH: {{$invoiceData['vendor_phone']}}</b></p>
                        <p style="margin-top: 0;"><b style="font-size: 19px; line-height: 1; font-weight: 600;">EMAIL: {{$invoiceData['vendor_email']}}</b></p>
                    </td>
                </tr>
                <tr>
                    <td style="height: 20px;"></td>
                </tr>
                <tr style="vertical-align: bottom;">
                    <td style="width:30%; font-size: 21px; color:rgba(0, 0, 0, 0.87); margin-top:70px; text-align:left;font-weight:600;">Invoice Details </td>
                    <td style="width:35%; font-size: 16px; color:rgba(0, 0, 0, 0.87); margin-top:70px; text-align: center; font-weight:600;">#Tenure: <span style=" font-weight: 400;">{{$invoiceData['start_date']." To ".$invoiceData['end_date']}}</span></td>
                    <!-- <td style="width:30%; font-size: 16px; color:rgba(0, 0, 0, 0.87); margin-top:70px; text-align: center; font-weight:600;">#PO: <span style=" font-weight: 400;">{{$invoiceData['po_number']}}</span></td> -->
                    <td style="width:35%; font-size: 16px; color:rgba(0, 0, 0, 0.87); margin-top:70px; text-align: left; font-weight:600;">
                        #PO: <span style="font-weight: 400;">{{$invoiceData['po_number']}}</span>
                        <br> <!-- Line break to display the route name on a new line -->
                        #Contract Name: <span style="font-weight: 400;">{{$invoiceData['routes_name']}}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">

                        <table style="max-width: 100%;width: 100%; margin-top:20px; text-align:left;" cellpadding="0" cellspacing="0">
                            <thead>
                                <tr>
                                    <th style="background: #0c2345; font-size: 19px; color: #fff; padding: 8px 7px; text-align: left;">Sr.No.</th>
                                    <th style="background: #0c2345; font-size: 19px; color: #fff; padding: 8px 7px; text-align: left;">Date</th>
                                    <th style="background: #0c2345; font-size: 19px; color: #fff; padding: 8px 7px; text-align: left;">Auth # </th>
                                    <th style="background: #0c2345; font-size: 19px; color: #fff; padding: 8px 7px; text-align: left;">Routes</th>
                                    <th style="background: #0c2345; font-size: 19px; color: #fff; padding: 8px 7px; text-align: left;">Rate($)</th>
                                    <th style="background: #0c2345; font-size: 19px; color: #fff; padding: 8px 7px; text-align: left;">KMs/Stops</th>
                                    <th style="background: #0c2345; font-size: 19px; color: #fff; padding: 8px 7px; text-align: left;">Hours</th>
                                    <th style="background: #0c2345; font-size: 19px; color: #fff; padding: 8px 7px 8px 23px; text-align: left; width: 130px;">Amount($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for ($i = 0; $i < count($routes); $i++) <tr>
                                    <td style="{{ !$routes[$i]['is_added'] 
    ? 'border-top: 2px solid #c4c4c4; padding: 8px 7px; font-size: 19px;' 
    : 'padding: 8px 7px; font-size: 19px;' }}">{{$i + 1}}</td>
                                    <td style="{{ !$routes[$i]['is_added'] 
    ? 'border-top: 2px solid #c4c4c4; padding: 8px 7px; font-size: 19px; width:100px;' 
    : 'padding: 8px 7px; font-size: 19px; width:100px;' }}">{{\Carbon\Carbon::parse($routes[$i]['routes_date'])->format('d-m-y')}}</td>
                                    <td style="{{ !$routes[$i]['is_added'] 
    ? 'border-top: 2px solid #c4c4c4; padding: 8px 7px; font-size: 19px; width:fit-content;' 
    : 'padding: 8px 7px; font-size: 19px; width:fit-content;' }}">{{$routes[$i]['auth_code'] ?? ""}}</td>
                                    <td style="{{ !$routes[$i]['is_added'] 
    ? 'border-top: 2px solid #c4c4c4; padding: 8px 7px; font-size: 19px; width:fit-content;' 
    : 'padding: 8px 7px; font-size: 19px; width:fit-content;' }}">{{$routes[$i]['routes_name']}}</td>
                                    <td style="{{ !$routes[$i]['is_added'] 
    ? 'border-top: 2px solid #c4c4c4; padding: 8px 7px; font-size: 19px;' 
    : 'padding: 8px 7px; font-size: 19px;' }}">{{$routes[$i]['route_rate']}}</td>
                                    <td style="{{ !$routes[$i]['is_added'] 
    ? 'border-top: 2px solid #c4c4c4; padding: 8px 7px; font-size: 19px;' 
    : 'padding: 8px 7px; font-size: 19px;' }}">
                                        @if($routes[$i]['is_kms'] == 'kms')
                                        <b>{{$routes[$i]['route_km_stop'] ?? 0}}</b>
                                        @elseif($routes[$i]['is_added'])
                                        <b>{{$routes[$i]['route_km_stop'] ?? 0}}</b>
                                        @else
                                        {{$routes[$i]['route_km_stop'] ?? 0}}
                                        @endif
                                    </td>
                                    <td style="{{ !$routes[$i]['is_added'] 
    ? 'border-top: 2px solid #c4c4c4; padding: 8px 7px; font-size: 19px;' 
    : 'padding: 8px 7px; font-size: 19px;' }}">
                                        @if($routes[$i]['is_hours'] == 'hours')
                                        <b>{{$routes[$i]['route_hours'] ?? 0}}</b>
                                        @else
                                        {{$routes[$i]['route_hours'] ?? 0}}
                                        @endif
                                    </td>
                                    <td style="{{ !$routes[$i]['is_added'] 
    ? 'border-top: 2px solid #c4c4c4; padding: 8px 7px; font-size: 19px;' 
    : 'padding: 8px 7px; font-size: 19px;' }}">{{$routes[$i]['total_amount']}}</td>
                </tr>
                @endfor
            </tbody>
        </table>
        </td>
        </tr>
        <tr>
            <td colspan="3">
                @if($invoiceData['enable'] === 1)
                <table style="width:100%; margin-top:18px; text-align:left !important;" cellpadding="0" cellspacing="0">
                    <thead>
                        <tr>
                            <th style="text-align: left; font-size: 21px; color: rgba(0, 0, 0, 0.87); margin-top: 70px; font-weight: 600;"></th>
                            <th colspan="5" style="font-size: 18px; color: rgba(0, 0, 0, 0.87); margin-top: 70px; font-weight: 600;"></th>

                        </tr>
                        <tr>
                            <th style="font-size: 19px; color: #000; padding: 5px 0px; text-align: left;">Fuel Expense</th>
                            <th style="font-size: 19px; color: #000; padding: 5px 7px; text-align: left;">KMs</th>
                            <th style="font-size: 19px; color: #000; padding: 5px 7px; text-align: left;">Fuel Price</th>
                            <th style="font-size: 19px; color: #000; padding: 5px 7px; text-align: left;">Mileage</th>
                            <th style="font-size: 19px; color: #000; padding: 5px 7px; text-align: left;">Tax(%)</th>
                            <th style="font-size: 19px; color: #000; padding: 5px 0px 5px 23px; text-align: left; width: 130px;">Amount($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for ($i = 0; $i < count($fuelExp); $i++)
                            <tr>
                            <td style="border-bottom: 2px solid #c4c4c4; padding: 5px 0px;font-size:19px;">
                                {{ $fuelExp[$i]['fuel_type'] === "Adjustment" ? 'Fuel Adjustment' : 'Fuel Charges' }}
                            </td>
                            <td style="border-bottom: 2px solid #c4c4c4; padding: 5px 7px;font-size:19px;">{{$fuelExp[$i]['fuel_kms']}}</td>
                            <td style="border-bottom: 2px solid #c4c4c4; padding: 5px 7px;font-size:19px;">{{$fuelExp[$i]['fuel_price']}}</td>
                            <td style="border-bottom: 2px solid #c4c4c4; padding: 5px 7px;font-size:19px;">{{$fuelExp[$i]['fuel_mileage']}}</td>
                            <td style="border-bottom: 2px solid #c4c4c4; padding: 5px 0px 5px 23px; font-size:19px;">{{$fuelExp[$i]['fuel_tax']}}</td>
                            <td style="border-bottom: 2px solid #c4c4c4; padding: 5px 0px 5px 23px; font-size:19px;">{{$fuelExp[$i]['fuel_total_amt']}}</td>
        </tr>
        @endfor
        </tbody>
        </table>
        @endif
        </td>
        </tr>

        <tr>
            <td style="vertical-align: top; width: 100%; max-width: 300px; padding-top: 10px;" colspan="2">
                <div style=" border: 1px solid #c4c4c4; border-radius: 0px; padding:0px 17px 17px; width: 70%;">
                    <b>Note</b>
                    <p style="vertical-align: bottom; width: 100%; max-width: 500px; text-align: justify; font-size: 13px; line-height: 1; margin-top: 5px;">
                        {!! nl2br(e($invoiceData['note'] ?? '')) !!}
                    </p>
            </td>

            <td>

                <table style="max-width: 100%;width: 100%; margin-top:10px; text-align:left;" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td style="background-color: #f1f8fb; padding: 0px 12px; border-radius: 5px 0 0 0; color: #26ace4; font-size: 16px; font-weight: 600; text-transform: capitalize; width:40%;">SUB TOTAL:</td>
                            <td style="background-color: #f1f8fb; padding:0px 0px; border-radius:0 5px 0 0;font-size:14px; width:20%;"></td>
                            <td style="background-color: #f1f8fb; padding:0px 0px; border-radius:0 5px 0 0;font-size:14px; width:40%;">{{$sub_total}}</td>
                        </tr>

                        @for($i = 0; $i < count($invoiceTax); $i++)
                            @if (!empty($invoiceTax[$i]['fuel_type_tax']) && !empty($invoiceTax[$i]['tax_percentage']))
                            <tr>
                            <td style="background-color: #f1f8fb; padding: 0px 12px; border-radius: 5px 0 0 0; color: #26ace4; font-size: 16px; font-weight: 600; text-transform: capitalize;">{{$invoiceTax[$i]['fuel_type_tax']}}({{ $invoiceTax[$i]['tax_percentage'] }}%):</td>
                            <td style="background-color: #f1f8fb; padding: 0px 12px; border-radius: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: capitalize;"></td>
                            <td style="background-color: #f1f8fb; padding:0px 12px; border-radius: 5px 0 0 0; font-size:14px;">{{$invoiceTax[$i]['tax_amount']}}</td>
        </tr>
        @endif
        @endfor

        <!-- <tr>
            <td style="height: 6px; background: #f1f8fb;" colspan="2"></td>
        </tr> -->
        <tr>
            <td style="height:2px; width:100%; background:#a4a4a4;" colspan="3"></td>
        </tr>
        <tr>
            <td style="background-color: #f1f8fb; padding: 0px 12px; border-radius: 5px 0 0 0; color: #26ace4; font-size: 21px; font-weight: 600; text-transform: capitalize;">
                Total:
            </td>
            <td style="background-color: #f1f8fb; padding:0px 0px; border-radius:0 5px 0 0;font-size:19px;"></td>
            <td style="background-color: #f1f8fb; padding:0px 0px; border-radius:0 5px 0 0;font-size:19px;">
                {{$grand_total}}
            </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        <tr>
            <td style="height: 20px;" colspan="3"></td>
        </tr>
        <tr>
            <td style="height:2px; width:100%; background:#ddd;" colspan="3"></td>
        </tr>
        <tr>
            <td colspan="3">
                @if($invoiceData['is_term_condition'] === 1)
                <table style="max-width: 100%; width: 100%; left:0; text-align: left;">
                    <td style="width:33.33%; vertical-align: top;">
                        <table style="max-width: 100%;width: 100%; margin-top:10px; text-align:left;" cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr>
                                    <td conspan="2" style="margin: 0 0 6px 0; font-weight: 600; font-size: 18px; color: #26ace4;">Questions?</td>
                                </tr>
                                <tr>
                                    <td style="font-size:16px; line-height:15px;">Email us : {{$termCondition[0]['email']}}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:16px; line-height:15px;">Call us : {{$termCondition[0]['phone']}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td style="width:33.33%; vertical-align: top;">
                        <table style="max-width: 100%;width: 100%; margin-top:10px; text-align:left;" cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr>
                                    <td style="margin: 0 0 6px 0; font-weight: 600; font-size: 18px; color: #26ace4;">Payment Info</td>
                                </tr>
                                <tr>
                                    <td style="font-size:16px; line-height:15px;">Account : {{$termCondition[0]['account']}}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:16px; line-height:15px;">A/c Name : {{$termCondition[0]['accountName']}}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:16px; line-height:15px;">Bank Detail : {{$termCondition[0]['bankDetail']}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td style="width:33.33%; vertical-align: top;">
                        <table style="max-width: 100%;width: 100%; margin-top:10px; text-align:left;" cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr>
                                    <td conspan="2" style="margin: 0 0 6px 0; font-weight: 600; font-size: 18px; color: #26ace4;">Terms &amp; Conditions</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="font-size:16px; line-height:15px;">{{$termCondition[0]['terms']}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </table>
                @endif
            </td>
        </tr>
        </tbody>
        </table>
    </div>
</body>

</html>