<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>A Transport Driver Tracking, Invoicing and VMS solution</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito" rel="stylesheet">
    <link rel="icon" href="{{asset('/images/fav.png')}}" type="image/x-icon" />
    <link href="{{url('assets/css/login.css')}}" rel="stylesheet" type="text/css">
    <link href="{{url('assets/css/style.css')}}" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body id="page-top">
    <div id="app">
        <main>
            @yield('content')
        </main>
    </div>
</body>
</html>