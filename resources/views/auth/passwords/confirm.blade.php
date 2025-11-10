@extends('layouts.without-sidebar')

@section('content')
<div class="startOuter">
    <div class="loginOuter">


        <!-- Nested Row within Card Body -->
        <div class="row">
            <div class="col-lg-6 d-lg-block bg-login-image">
                <div class="form-img">
                    <div class="form-logo">
                        <a href="javascript:;"> <img src="/assets/img/logo.png" alt="logo"> </a>
                    </div>

                    <!-- <div class="verticalCenter">
                    <div class="fortruck">
                        <img src="/assets/img/form-truck.png" alt="form-truck">
                    </div>
                </div> -->
                </div>

            </div>
            <div class="col-lg-6">
                <div class="verticalCenter">
                    <div class="p-5 textCenter">
                        <form method="POST" action="{{ route('password.confirm') }}">
                            @csrf
                            <h4>
                                {{ __('Confirm Password') }}
                            </h4>
                            <p>{{ __('Please confirm your password before continuing.') }}</p>
                            <div class="form-group">
                            <!-- <input type="hidden" name="val" value="{{$id}}"> -->
                                <label for="">{{ __('Password') }}</label>
                                @if (Route::has('password.request'))
                                <div class="forgot-pass">

                                    <a class="btn btn-link" href="{{ route('password.request') }}">
                                        {{ __('Forgot Your Password?') }}
                                    </a>
                                </div>

                                @endif
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>

                            <!-- <div class="form-group">
                                <label for="">{{ __('Password') }}</label>
                                @if (Route::has('password.request'))
                                <div class="forgot-pass">

                                    <a class="btn btn-link" href="{{ route('password.request') }}">
                                        {{ __('Forgot Your Password?') }}
                                    </a>
                                </div>

                                @endif
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror


                            </div> -->
                            <div class="start_btn login">
                                <button type="submit" class="custom_btn">
                                    {{ __('Confirm Password') }}
                                </button>

                                <!-- @if (Route::has('password.request'))
                                <a class="btn btn-link" href="{{ route('password.request') }}">
                                    {{ __('Forgot Your Password?') }}
                                </a>
                                @endif -->


                                <!-- <h5>Don't have an account? <a href="#">Create Account</a> -->

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    </div>

</div>



















<!-- <div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Confirm Password') }}</div>

                <div class="card-body">
                    {{ __('Please confirm your password before continuing.') }}

                    <form method="POST" action="{{ route('password.confirm') }}">
                        @csrf

                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-end">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Confirm Password') }}
                                </button>

                                @if (Route::has('password.request'))
                                <a class="btn btn-link" href="{{ route('password.request') }}">
                                    {{ __('Forgot Your Password?') }}
                                </a>
                                @endif
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div> -->
@endsection