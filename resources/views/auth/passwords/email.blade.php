@extends('layouts.without-sidebar')

@section('content')


<div class="startOuter">
    <div class="loginOuter">


        <!-- Nested Row within Card Body -->
        <div class="row">
            <div class="col-lg-7 d-lg-block bg-login-image">
                <div class="form-img">
                    <div class="form-logo">
                        <a href="javascript:;"> <img src="/assets/img/logo.png" alt="logo"> </a>
                    </div>

                    <div class="text-center">
                        <h1 class="text-white">“Driven by Trust. Delivered with Precision”</h1>
                    </div>

                    <!-- <div class="verticalCenter">
                    <div class="fortruck">
                        <img src="/assets/img/form-truck.png" alt="form-truck">
                    </div>
                </div> -->
                </div>

            </div>
            <div class="col-lg-5">
                <div class="verticalCenter">
                    <div class="p-5 textCenter">
                        <form method="POST" action="{{ route('password.email') }}">
                            @csrf
                            <h4>
                                Forgot Your Password?
                            </h4>
                            <p>No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</p>
                            <div class="form-group">
                                <label for="">Email Address</label>
                                <img src="/assets/img/Profile.svg" />
                                <span class="input-divider"></span>
                                <input id="email" type="email" placeholder="Please enter your email..." class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>

                            <a href="/login" class="back-to-login text-white">back to login</a>

                            <div class="start_btn login">
                                <button type="submit" class="custom_btn">
                                   Send Link
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>


</div>

</div>




<!-- <div class="startOuter">
    <div class="loginOuter">
        <div class="container">
          
            <div class="row justify-content-center">

                <div class="col-xl-10 col-lg-12 col-md-9">

                    <div class="card o-hidden border-0 shadow-lg my-5">
                        <div class="card-body p-0">
                           
                            <div class="row">
                                <div class="col-lg-6 d-none d-lg-block bg-login-image">
                                    <div class="login_image_text">
                                        <a href="javascript:;"> <img src="/assets/img/logo.png" alt="logo"> </a>
                                        <div class="welcomeBox">
                                            <h2>Welcome Back!</h2>
                                            <p>To keep connected with us please
                                                login with your personal Info.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="verticalCenter">
                                        <div class="p-5 textCenter">
                                            <form method="POST" action="{{ route('password.email') }}">
                                                @csrf
                                                <h4>
                                                    Reset Password
                                                </h4>
                                                <div class="form-group">
                                                    <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                                    @error('email')
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                    @enderror
                                                </div>
                                                <div class="start_btn login">
                                                    <button type="submit" class="custom_btn">
                                                        {{ __('Send Password Reset Link') }}
                                                    </button>
                                                    </h5>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div> -->
<!-- <div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Reset Password') }}</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    <form method="POST" action="{{ route('password.email') }}">
                        @csrf

                        <div class="row mb-3">
                            <label for="email" class="col-md-4 col-form-label text-md-end">{{ __('Email Address') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Send Password Reset Link') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div> -->
@endsection