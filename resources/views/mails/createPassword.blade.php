<!DOCTYPE html>
<html>

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
                            <img src="{{asset('assets/img/logo_new.png')}}" alt="#" style="max-width:137px;" class="CToWUd" data-bit="iit">
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="background:#fff;padding:30px 0" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td style="padding-bottom:5px;padding-left:40px;padding-right:20px" align="center" valign="top">
                        <h2 style="font-family: 'Open Sans', sans-serif; color:#26ade1;font-size:28px;font-weight:600;font-style:normal;letter-spacing:normal;line-height:36px;text-transform:none;text-align:left;padding:0;margin:0">
                            Hello, {{$mailData['name']}}</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding-bottom:30px;padding-left:40px;padding-right:20px" align="center" valign="top">
                        <h4 style="color:#505050;font-size:16px;font-style:normal;letter-spacing:normal;line-height:24px;text-transform:none;text-align:left;padding:0;margin:0">
                            Verify your email account and generate password</h4>
                    </td>
                </tr>
                <tr>
                    <td style="padding-bottom:20px;padding-left:40px" align="center" valign="top">
                        <p style="color:#666;font-size:15px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:left;padding:0;margin:0">
                            We have sent you this email in response to your request to create password.</p>

                        <p style="color:#666;font-size:15px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:left;padding:0;margin:0">
                            To create your password, please follow the link below:.</p>
                    </td>
                </tr>
                <tr style="text-align:left">
                    <td style="padding:10px 0 0 40px"> <a href="{{ $mailData['body'] }}" style="background-color:#26ade1;border-radius:50px;padding:12px 35px;color:#fff;font-size:14px; font-family: 'Open Sans', sans-serif; font-weight:600;font-style:normal;line-height:20px;text-transform:capitalize;text-decoration:none;display:inline-block">Create Password</a>
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