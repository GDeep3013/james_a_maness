<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Shiva Transport</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
        body {
            font-family: "Poppins", sans-serif;
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
$ups = isset($invoiceMeta['ups']) && !is_null($invoiceMeta['ups']) 
    ? json_decode($invoiceMeta['ups'], true) ?? [] 
    : [];

$termCondition = isset($invoiceMeta['termAndCondition']) && !is_null($invoiceMeta['termAndCondition'])
? json_decode($invoiceMeta['termAndCondition'], true) ?? []
: [];
$totalRoutesAmount = array_sum(array_column($ups, 'total_amount'));
$grandTotal = number_format($totalRoutesAmount, 2);
@endphp

<body style="padding: 0; margin: 0; font-family: 'Poppins', sans-serif;">
    <div style="max-width: 1236px; margin: 0 auto; padding: 20px;">
        <table style="max-width: 100%; width: 100%; margin-top: 10px; text-align: left;" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td>
                        <img src="data:image/png;base64,{{$invoiceData['logo_image']}}" style="max-width: 240px;">
                    </td>
                    <td></td>
                    <td>
                        <h1 style="color: #28abe5; text-transform: uppercase; letter-spacing: 1.5px; font-size: 25px; margin-bottom: 0; text-align: right;">Invoice</h1>
                        <p style="color:rgba(0, 0, 0, 0.87); font-size:19px; text-align:right;">{{"#". $invoiceData['custom_invoice_id']}}</p>
                        <p style="color:rgba(0, 0, 0, 0.87); font-size:19px; text-align:right;">{!! $invoiceData['gst_no'] ? "<strong>GST No:</strong> " . $invoiceData['gst_no'] : "" !!}</p>
                        <p style="color:rgba(0, 0, 0, 0.87); font-size:19px; text-align:right;">{{$invoiceData['invoice_date']}}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h2 style="font-size: 25px; color: rgba(0, 0, 0, 0.87); margin: 0 0 5px;">{{ $company['name'] }}</h2>
                        <p style="margin: 0 0 8px; font-size: 19px; line-height: 1;">{{ $company['address'] }}</p>
                        <p style="margin: 0;"><b style="font-size: 19px; line-height: 1; font-weight: 600;">PH: {{ $company['phone'] }}</b></p>
                        <p style="margin: 0;"><b style="font-size: 19px; line-height: 1; font-weight: 600;">EMAIL: {{ $company['email'] }}</b></p>
                        <p style="font-size: 17px; color: rgba(0, 0, 0, 0.87); margin-top: 0px; padding-top:20px; font-weight: 600;">#Due Date: <span style="font-weight: 400;">{{$invoiceData['due_date']}}</span></p>
                    </td>
                    <td></td>
                    <td>
                        <h2 style="font-size: 21px; color: rgba(0, 0, 0, 0.87); margin: 0 0 5px;">To</h2>
                        <p style="font-size: 19px; line-height: 1;">{{$invoiceData['vendor_name']}}.</p>
                        <p style="font-size: 19px; line-height: 1;">{{$invoiceData['vendor_address']}}</p>
                        <p style="margin-top: 0;"><b style="font-size: 19px; line-height: 1; font-weight: 600;">PH: {{$invoiceData['vendor_phone']}}</b></p>
                        <p style="margin-top: 0;"><b style="font-size: 19px; line-height: 1; font-weight: 600;">EMAIL: {{$invoiceData['vendor_email']}}</b></p>
                    </td>
                </tr>
                <tr>
                    <td style="height: 20px;"></td>
                </tr>
                <tr>
                    <td style="width:20%;font-size: 21px; color:rgba(0, 0, 0, 0.87); margin-top:70px; text-align:left;font-weight:600;">Invoice Details </td>
                    <td style="width:35%; font-size: 16px; color:rgba(0, 0, 0, 0.87); margin-top:70px; text-align: center; font-weight:600;">#Tenure: <span style=" font-weight: 400;">{{$invoiceData['start_date']." To ".$invoiceData['end_date']}}</span></td>
                    <td style="font-size: 16px; color:rgba(0, 0, 0, 0.87); margin-top:70px; text-align: center; font-weight:600;">#Contract Name: <span style="width:50%; font-weight: 400;">{{$invoiceData['routes_name']}}</span></td>

                </tr>
                <tr>
                    <td style="height: 32px;"></td>
                </tr>
                <tr>
                    <td colspan="3">
                        <table cellpadding="8" style="width: 100%; border: 1px solid #000; border-spacing: 0px;">
                            <thead>
                                <tr>
                                    <th style="font-size: 21px; color: rgba(0, 0, 0, 0.87); text-align: center; border-bottom: 1px solid #000; border-right: 1px solid #000;">Shipper Details</th>
                                    <th style="font-size: 21px; color: rgba(0, 0, 0, 0.87); text-align: center; border-bottom: 1px solid #000;">Consignee Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for ($i = 0; $i < count($ups); $i++)
                                    <tr>
                                    <td valign="top" style="width: 50%; vertical-align: top; border-bottom: 1px solid #000; border-right: 1px solid #000;">
                                        <div style="padding-right: 28px; padding-bottom: 10px">
                                            <p style="margin-top: 0px;"><b style="font-size: 19px; line-height: normal;">{{$ups[$i]['shipper_company_name']}}</b></p>
                                            <p style="font-size: 19px; line-height: normal;">{{$ups[$i]['shipper_address']}}</p>
                                        </div>
                                    </td>
                                    <td valign="top" style="width: 50%; border-bottom: 1px solid #000;">
                                        <div style="padding-left: 18px; padding-bottom: 10px;">
                                            <p style="margin-top: 0px;"><b style="font-size: 19px; line-height: normal;">{{$ups[$i]['consignee_company_name']}}</b></p>
                                            <p style="font-size: 19px; line-height: normal;">{{$ups[$i]['consignee_address']}}</p>
                                        </div>
                                    </td>
                </tr>
                @endfor
            </tbody>
        </table>
        </td>
        </tr>
        <tr>
            <td style="height: 25px;"></td>
        </tr>
        <tr>
        <td style="vertical-align: top; width: 100%; max-width: 300px; padding-top: 10px;" colspan="2">
                <div style="border: 1px solid #c4c4c4; border-radius: 0px; padding:0px 17px 17px; width: 70%;">
                    <b>Note</b>
                    <p style="vertical-align: bottom; width: 100%; max-width: 500px; text-align: justify; font-size: 13px; line-height: 1; margin-top: 5px;">
                        {!! nl2br(e($invoiceData['note'] ?? '')) !!}
                    </p>
            </td>

            <td>
                <table style="max-width: 100%; width: 100%; margin-top: 10px; text-align: left;" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td style="background-color: #f1f8fb; padding: 6px 12px; border-radius: 5px 0 0 0; color: #26ace4; font-size: 21px; font-weight: 600; text-transform: capitalize; width: 50%;">Charges</td>
                            <td style="background-color: #f1f8fb; padding: 6px 12px; border-radius: 5px 0 0 0; color: #26ace4; font-size: 21px; font-weight: 600; text-transform: capitalize; width: 50%; text-align: right;">Amount</td>
                        </tr>
                        <tr>
                            <td style="height: 2px; width: 100%; background: #a4a4a4;" colspan="2"></td>
                        </tr>
                        @for ($i = 0; $i < count($ups); $i++)
                        <tr>
                            <td style="background-color: #f1f8fb; padding: 6px 12px; border-radius: 5px 0 0 0; color: #26ace4; font-size: 19px; font-weight: 600; text-transform: capitalize;">{{$ups[$i]['particulars']}}</td>
                            <td style="background-color: #f1f8fb; padding: 6px 12px; border-radius: 5px 0 0 0; font-size: 19px; text-transform: capitalize; text-align: right;">
                            @if(isset($ups[$i]['total_amount']) && !is_null($ups[$i]['total_amount']))
                                {{ number_format($ups[$i]['total_amount'], 2, '.', ',') }}
                                @else
                                {{ '0.00' }}
                                @endif
                            </td>
                        </tr>
                        @endfor
                        <tr>
                            <td style="height: 2px; width: 100%; background: #a4a4a4;" colspan="2"></td>
                        </tr>
                        <tr>
                            <td style="background-color: #f1f8fb; padding: 6px 12px; border-radius: 5px 0 0 0; color: #26ace4; font-size: 19px; font-weight: 600; text-transform: capitalize;">Total</td>
                            <td style="background-color: #f1f8fb; padding: 6px 12px; border-radius: 0 5px 0 0; font-size: 19px; text-align: right;">{{$grandTotal}}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td style="height: 20px;" colspan="3"></td>
        </tr>
        <tr>
            <td style="height: 2px; width: 100%; background: #ddd;" colspan="3"></td>
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
            <!-- <td style="width: 33.33%; vertical-align: top;">
                <table style="max-width: 100%; width: 100%; margin-top: 10px; text-align: left;" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td conspan="2" style="margin: 0 0 6px 0; font-weight: 600; font-size: 18px; color: #26ace4;">Questions?</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; line-height: normal;">Email us : example@gmail.com</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; line-height: normal;">Call us : 9874561230</td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td style="width: 33.33%; vertical-align: top;">
                <table style="max-width: 100%; width: 100%; margin-top: 10px; text-align: left;" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td style="margin: 0 0 6px 0; font-weight: 600; font-size: 18px; color: #26ace4;">Payment Info</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; line-height: normal;">Account : 123045607890120</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; line-height: normal;">A/c Name : Jhon Deo</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; line-height: normal;">Bank Detail : Branch Mohali</td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td style="width: 33.33%; vertical-align: top;">
                <table style="max-width: 100%; width: 100%; margin-top: 10px; text-align: left;" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td conspan="2" style="margin: 0 0 6px 0; font-weight: 600; font-size: 18px; color: #26ace4;">Terms &amp; Conditions</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="font-size: 16px; line-height: normal;">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                                type and scrambled it to make a type specimen book
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td> -->
        </tr>
        </tbody>
        </table>
    </div>
</body>

</html>