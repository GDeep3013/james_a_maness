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
                        <form method="POST" action="{{ route('create.password') }}">
                            @csrf
                            <h4>
                                Create Password
                            </h4>
                            <p>{{ __('Please confirm your password before continuing.') }}</p>
                            <div class="form-group">
                            <input type="hidden" name="val" value="{{$id}}">
                                <label for="">Password</label>
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                                @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                            <div class="form-group">
                                <label for="">Confirm Password</label>
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">   
                            </div>
                            <div class="start_btn login">
                                <button type="submit" class="custom_btn">
                                    Create Password
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    </div>

</div>
@endsection