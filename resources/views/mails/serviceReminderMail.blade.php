<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Service Reminder - Shiva Transport</title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
</head>

<body style="padding:0; background-color: #000; font-family: 'Open Sans', sans-serif; font-weight: 400;" class="body" marginheight="0" topmargin="0" marginwidth="0" leftmargin="0">
    <div style="padding:20px 0 0 0;font-family:'Open Sans'" marginheight="0" marginwidth="0">

        <table style="background-color:#e3f7ff; padding:19px 0" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td valign="middle" align="left" style="padding-left:40px">
                        <a href="{{ config('app.url') }}">
                            <img src="{{asset('assets/img/logo_new.png')}}" alt="#" style="max-width:137px;" class="CToWUd" data-bit="iit" />
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="background:#fff;padding:30px 0" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td style="padding-bottom:5px;padding-left:40px;padding-right:20px" align="center" valign="top">
                        @if(!empty($mailData['name']))
                        <h2
                            style="font-family: 'Open Sans', sans-serif; color:#26ade1;font-size:14px;font-weight:600;font-style:normal;letter-spacing:normal;line-height:36px;text-transform:none;text-align:left;padding:0;margin:0">
                            Hello, {{$mailData['name']}}
                        </h2>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td style="padding-bottom:30px;padding-left:40px;padding-right:20px" align="center" valign="top">
                        <p style="color:#000;font-size:13px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:left;padding:0;margin:0">
                            @if($mailData['reminder_status'] == 'overdue')
                            <strong style="color:#dc3545;">⚠️ URGENT:</strong> This service reminder is <strong>OVERDUE</strong>. Please schedule the service task as soon as possible to maintain your vehicle's optimal performance and safety.
                            @else
                            🔔 This is a friendly reminder that a service task for your vehicle is <strong>due soon</strong>. Please schedule the service to ensure your vehicle continues to operate safely and efficiently.
                            @endif
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding-bottom:20px;padding-left:40px" valign="top">
                        <h4 style="color:#000;font-size:14px;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:left;padding:0;margin:0">
                            Service Reminder Details:
                        </h4>
                        <ul style="padding-left: 15px;">
                            <li style="list-style: none; line-height: 20px;font-size: 13px;"> <b>Vehicle:</b> {{ $mailData['vehicle_name'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Service Task:</b> {{ $mailData['service_task'] }}</li>
                            @if(isset($mailData['time_interval']))
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Time Interval:</b> Every {{ $mailData['time_interval'] }}</li>
                            @endif
                            @if(isset($mailData['meter_interval']))
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Meter Interval:</b> Every {{ $mailData['meter_interval'] }}</li>
                            @endif
                            @if(isset($mailData['next_due_date']) && $mailData['next_due_date'] != 'N/A')
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Next Due Date:</b> {{ $mailData['next_due_date'] }}</li>
                            @endif
                            @if(isset($mailData['next_due_meter']))
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Next Due Meter:</b> {{ number_format($mailData['next_due_meter']) }} {{ $mailData['meter_unit'] ?? 'hr' }}</li>
                            @endif
                            @if(isset($mailData['current_meter']))
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Current Meter:</b> {{ number_format($mailData['current_meter']) }} {{ $mailData['meter_unit'] ?? 'hr' }}</li>
                            @endif
                            @if($mailData['reminder_status'] == 'overdue')
                            <li style="list-style: none; font-size: 13px; line-height: 20px; color:#dc3545;"><b>Status:</b> <strong>OVERDUE</strong></li>
                            @if(isset($mailData['days_until_due']))
                            <li style="list-style: none; font-size: 13px; line-height: 20px; color:#dc3545;"><b>Days Overdue:</b> {{ $mailData['days_until_due'] }} day(s)</li>
                            @endif
                            @if(isset($mailData['meter_difference']))
                            <li style="list-style: none; font-size: 13px; line-height: 20px; color:#dc3545;"><b>Meter Overdue:</b> {{ number_format($mailData['meter_difference']) }} {{ $mailData['meter_unit'] ?? 'hr' }}</li>
                            @endif
                            @else
                            <li style="list-style: none; font-size: 13px; line-height: 20px; color:#ff9800;"><b>Status:</b> <strong>DUE SOON</strong></li>
                            @if(isset($mailData['days_until_due']))
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Days Until Due:</b> {{ $mailData['days_until_due'] }} day(s)</li>
                            @endif
                            @if(isset($mailData['meter_difference']))
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Meter Until Due:</b> {{ number_format($mailData['meter_difference']) }} {{ $mailData['meter_unit'] ?? 'hr' }}</li>
                            @endif
                            @endif
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="padding-bottom:30px;padding-left:40px;padding-right:20px" align="center" valign="top">
                        <h4 style="color:#000;font-size:13px;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:left;padding:0;margin:0">
                            Thank you for choosing our app. We look forward to helping you maintain your vehicle's optimal performance.</h4>
                    </td>
                </tr>

            </tbody>
        </table>
        <table style="background:#e3f7ff;" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td valign="middle" align="center">
                        <p style="color:#0d2345;font-size:16px; font-weight: 600; font-family: 'Open Sans', sans-serif;">
                            © 2024 - {{date('Y')}} {{config('app.name')}}. All Rights Reserved.</p>
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