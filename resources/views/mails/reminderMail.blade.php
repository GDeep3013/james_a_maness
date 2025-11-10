<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Shiva Transport</title>
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
                            @if($mailData['type'] == 'Insurance')
                            We hope this message finds you well. As part of our commitment to keeping you informed about your coverage, we'd like to remind you that your vehicle insurance is set to expire on {{$mailData['expire_date']}}.
                            @elseif($mailData['type'] == 'Driver')
                            {{$mailData['reminder_msg']}}
                            @elseif($mailData['type'] == 'Safety')
                            We hope this message finds you well. To ensure your continued safety and vehicle reliability, we'd like to remind you that your vehicle safety inspection is due on {{$mailData['expire_date']}}. 
                            @endif
                        </p>
                    </td>
                </tr>
                <tr>
                <tr>
                    <td style="padding-bottom:20px;padding-left:40px" valign="top">
                        @if($mailData['type'] == 'Insurance')
                        <h4 style="color:#000;font-size:14px;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:left;padding:0;margin:0">
                            Policy Details:
                        </h4>
                        <ul style="padding-left: 15px;">
                            <li style="list-style: none; line-height: 20px;font-size: 13px;"> <b>Policy Number:</b> {{ $mailData['policy_no'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Vehicle:</b> {{ $mailData['truck'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>VIN Number:</b> {{ $mailData['vehicle_vin_no'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Expiration Date:</b> {{ $mailData['expire_date'] }}</li>
                        </ul>
                        @elseif($mailData['type'] == 'Driver' && isset($mailData['reminder_type']) && $mailData['reminder_type'] === "license")
                        <h4 style="color:#000;font-size:14px;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:left;padding:0;margin:0">
                            License Details:
                        </h4>
                        <ul style="padding-left: 15px;">
                            <li style="list-style: none; line-height: 20px;font-size: 13px;"> <b>License Number:</b> {{ $mailData['license_no'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Expiration Date:</b> {{ $mailData['expire_date'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>License Class:</b> {{ $mailData['license_class'] }}</li>
                        </ul>
                        @elseif($mailData['type'] == 'Safety')
                        <h4 style="color:#000;font-size:14px;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:left;padding:0;margin:0">
                        Safety Inspection Details:
                        </h4>
                        <ul style="padding-left: 15px;">
                           <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Vehicle:</b> {{ $mailData['truck'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>VIN Number:</b> {{ $mailData['vehicle_vin_no'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Expiration Date:</b> {{ $mailData['expire_date'] }}</li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Tires:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['tires'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /></li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Brakes:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['brakes'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /></li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Lights:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['lights'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /> </li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Windshield:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['windshield'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /> </li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Windshield Wipers:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['wipers'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /> </li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Mirrors:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['mirrors'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /> </li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Seat Belts:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['seatbelts'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /> </li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Steering and Alignment:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['steering'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /> </li>
                            <li style="list-style: none; font-size: 13px; line-height: 20px;"><b>Suspension:</b> <img src="{{ asset('assets/img/icons8-' . ($mailData['suspension'] == 1 ? 'checkmark' : 'cancel') . '-48.png') }}" alt="#" style="max-width:100px; width:20px; vertical-align: middle;" class="CToWUd" data-bit="iit" /> </li>
                        </ul>
                        @elseif($mailData['type'] == "Others")
                        <p style="color:#000;font-size:13px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:left;padding:0;margin:0">
                        {!! nl2br(e($mailData['message'] ?? '')) !!}
                        </p>
                        @endif
                    </td>
                </tr>
                </tr>
                <tr>
                    <td style="padding-bottom:30px;padding-left:40px;padding-right:20px" align="center" valign="top">
                        <h4 style="color:#000;font-size:13px;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:left;padding:0;margin:0">
                            Thank you for choosing our app. We look forward to helping you reach your goals.</h4>
                    </td>
                </tr>

            </tbody>
        </table>
        <table style="background:#e3f7ff;" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td valign="middle" align="center">
                        <p style="color:#0d2345;font-size:16px; font-weight: 600; font-family: 'Open Sans', sans-serif;">
                            © 2024 - 2025 Shiva Transport. All Rights Reserved.</p>
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