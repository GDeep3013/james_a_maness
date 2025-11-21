<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Service Reminder</title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
</head>

<body style="padding:0; background-color: #2a2a2a; font-family: 'Open Sans', sans-serif; font-weight: 400; margin: 0;" class="body" marginheight="0" topmargin="0" marginwidth="0" leftmargin="0">
    <div style="padding:20px;font-family:'Open Sans'; background-color: #2a2a2a;" marginheight="0" marginwidth="0">
        <table style="background-color: #2a2a2a; border: 1px solid #000; padding: 0;" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td style="padding: 30px 0 20px 0;" align="center" valign="middle">
                        <a href="{{ config('app.url') }}">
                            <img src="{{asset('assets/img/logo_new.png')}}" alt="#" style="max-width:137px;" class="CToWUd" data-bit="iit" />
                        </a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table style="background:#fff; padding: 30px 40px;" width="100%" border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr>
                                    <td style="padding-bottom: 15px;" valign="top">
                                        @if(!empty($mailData['name']))
                                        <h2 style="font-family: 'Open Sans', sans-serif; color:#000; font-size:18px; font-weight:600; font-style:normal; letter-spacing:normal; line-height:24px; text-transform:none; text-align:left; padding:0; margin:0">
                                            Hello, {{$mailData['name']}}
                                        </h2>
                                        @endif
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;" valign="top">
                                        <p style="color:#000; font-size:14px; font-weight:400; font-style:normal; letter-spacing:normal; line-height:22px; text-transform:none; text-align:left; padding:0; margin:0">
                                            This is a friendly reminder that a service task for your vehicle is due soon. Please schedule the service to ensure your vehicle continues to operate safely and efficiently.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 15px;" valign="top">
                                        <h4 style="color:#000; font-size:16px; font-weight:600; font-style:normal; letter-spacing:normal; line-height:22px; text-transform:none; text-align:left; padding:0; margin:0">
                                            Service Reminder Details:
                                        </h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;" valign="top">
                                        <ul style="padding-left: 0; margin: 0; list-style: none;">
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"> <b>Vehicle:</b> {{ $mailData['vehicle_name'] }}</li>
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Service Task:</b> {{ $mailData['service_task'] }}</li>
                                            @if(isset($mailData['time_interval']))
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Time Interval:</b> Every {{ $mailData['time_interval'] }}</li>
                                            @endif
                                            @if(isset($mailData['meter_interval']))
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Meter Interval:</b> Every {{ $mailData['meter_interval'] }}</li>
                                            @endif
                                            @if(isset($mailData['next_due_date']) && $mailData['next_due_date'] != 'N/A')
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Next Due Date:</b> {{ $mailData['next_due_date'] }}</li>
                                            @endif
                                            @if(isset($mailData['next_due_meter']))
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Next Due Meter:</b> {{ number_format($mailData['next_due_meter']) }} {{ $mailData['meter_unit'] ?? 'hr' }}</li>
                                            @endif
                                            @if(isset($mailData['current_meter']))
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Current Meter:</b> {{ number_format($mailData['current_meter']) }} {{ $mailData['meter_unit'] ?? 'hr' }}</li>
                                            @endif
                                            @if($mailData['reminder_status'] == 'overdue')
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Status:</b> <strong style="color:#7b2cbf;">OVERDUE</strong></li>
                                            @if(isset($mailData['days_until_due']))
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px; color:#dc3545;"><b>Days Overdue:</b> {{ $mailData['days_until_due'] }} day(s)</li>
                                            @endif
                                            @if(isset($mailData['meter_difference']))
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px; color:#dc3545;"><b>Meter Overdue:</b> {{ number_format($mailData['meter_difference']) }} {{ $mailData['meter_unit'] ?? 'hr' }}</li>
                                            @endif
                                            @else
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Status:</b> <strong style="color:#7b2cbf;">DUE SOON</strong></li>
                                            @if(isset($mailData['days_until_due']))
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Days Until Due:</b> {{ $mailData['days_until_due'] }} day(s)</li>
                                            @endif
                                            @if(isset($mailData['meter_difference']))
                                            <li style="list-style: none; line-height: 24px; font-size: 14px; margin-bottom: 8px;"><b>Meter Until Due:</b> {{ number_format($mailData['meter_difference']) }} {{ $mailData['meter_unit'] ?? 'hr' }}</li>
                                            @endif
                                            @endif
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 0;" valign="top">
                                        <p style="color:#000; font-size:14px; font-weight:400; font-style:normal; letter-spacing:normal; line-height:22px; text-transform:none; text-align:left; padding:0; margin:0">
                                            Thank you for choosing our app. We look forward to helping you maintain your vehicle's optimal performance.
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 0;" align="center" valign="middle">
                        <p style="color:#999; font-size:12px; font-weight:400; font-family: 'Open Sans', sans-serif; margin: 0; padding: 0;">
                            ©2024-{{date('Y')}} {{config('app.name')}}. All Rights Reserved.
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="yj6qo"></div>
        <div class="adL">
        </div>
    </div>
</body>

</html>