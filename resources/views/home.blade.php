<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>KAV EXPEDITING</title>
    <link rel="icon" href="{{asset('assets/img/favicon.jpg')}}" type="image/x-icon" />
    <script>
         var Config={
            user:<?php echo Auth::user() ? Auth::user() : 'null' ?>,
        }
        var api_token = {
        google_api: <?php echo json_encode(config('app.google_map_api_key')); ?>,
    };
    </script>
    @viteReactRefresh
    @vite('resources/js/main.tsx')
</head>

<body>
    <div id="root">
    </div>
</body>
</html>