@extends('layouts.without-sidebar')

@section('content')
<div class="startOuter">
    <div class="loginOuter">


    <!-- Nested Row within Card Body -->
    <div class="row">

          <div class="col-lg-7">
            <div class="verticalCenter">
                <div class="p-5 textCenter">
                    <form id="loginForm" method="POST">
                        @csrf
                       <div class="logo"> <img src="/assets/img/kav-logo.png" alt="logo" /> </div>
                        <p>Sign in to your account</p>
                        <div class="form-outer">
                        <div id="errorMessage" class="alert alert-danger" style="display: none;" role="alert"></div>
                        <div class="form-group">
                            <label for="">Email Address</label>
                            <div class="input-outer">
                            <img src="/assets/img/mail-icon.svg" />
                            <input id="email" type="email" placeholder="Please enter your email..." class="form-control" name="email" value="" required autocomplete="email" autofocus>
                            </div>
                            <span id="emailError" class="invalid-feedback" style="display: none;" role="alert"></span>
                        </div>

                        <div class="form-group">
                            <label for="">Password</label>
                            
                            <div class="input-outer">
                            <input id="password" type="password" placeholder="Please enter your password..." class="form-control" value="" name="password" required autocomplete="current-password">
                            <img class="password-right-img" src="/assets/img/password-eys.svg" />
                            <img class="password-right-img hide-password" src="/assets/img/hide-password.svg" />
                            </div>
                            <span id="passwordError" class="invalid-feedback" style="display: none;" role="alert"></span>
                        </div>

                        <div class="rember-password">
                            <label class="checkbox-containe d-flex align-items-center">
                                <input type="checkbox" name="remember" id="remember">
                                <span class="checkmark"></span>
                                Remember Password
                            </label>
                        </div>
                       
                            
                        <div class="start_btn login">
                            <button type="submit" id="loginButton" class="custom_btn">
                                <span id="loginButtonText">Login</span>
                                <span id="loginButtonLoader" style="display: none;">Loading...</span>
                            </button>
                        </div>
                         @if (Route::has('password.request'))
                            <div class="forgot-pass">
                                <a class="btn btn-link" href="{{ route('password.request') }}">
                                    {{ __('Forgot Your Password?') }}
                                </a>
                            </div>
                            @endif
                        </div>
                    </form>
                </div>
                <p class="copyright-text">© 2025 KAV Expediting. All Rights Reserved</p>
            </div>
        </div>

        <div class="col-lg-5 d-lg-block bg-login-image hide-mobile">
            <div class="form-img">

                    <div class="text-left">
                        <h1 class="text-white">Trusted to 
                        Deliver. Committed 
                        to Precision.</h1>
                        <p>Monitor and manage your entire fleet with real-time status updates and analytics</p>
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
                <div class="card-header">{{ __('Login') }}</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('login') }}">
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

                        <div class="row mb-3">
                            <div class="col-md-6 offset-md-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                    <label class="form-check-label" for="remember">
                                        {{ __('Remember Me') }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Login') }}
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

<script>
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const showPasswordIcon = document.querySelector('.password-right-img:not(.hide-password)');
    const hidePasswordIcon = document.querySelector('.password-right-img.hide-password');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginButton = document.getElementById('loginButton');
    const loginButtonText = document.getElementById('loginButtonText');
    const loginButtonLoader = document.getElementById('loginButtonLoader');
    
    hidePasswordIcon.style.display = 'none';
    
    showPasswordIcon.addEventListener('click', function() {
        passwordInput.type = 'text';
        showPasswordIcon.style.display = 'none';
        hidePasswordIcon.style.display = 'inline-block';
    });
    
    hidePasswordIcon.addEventListener('click', function() {
        passwordInput.type = 'password';
        hidePasswordIcon.style.display = 'none';
        showPasswordIcon.style.display = 'inline-block';
    });
    
    showPasswordIcon.style.cursor = 'pointer';
    hidePasswordIcon.style.cursor = 'pointer';

    function hideErrors() {
        errorMessage.style.display = 'none';
        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        document.getElementById('email').classList.remove('is-invalid');
        document.getElementById('password').classList.remove('is-invalid');
    }

    function showError(message, field = null) {
        if (field === 'email') {
            emailError.textContent = message;
            emailError.style.display = 'block';
            document.getElementById('email').classList.add('is-invalid');
        } else if (field === 'password') {
            passwordError.textContent = message;
            passwordError.style.display = 'block';
            document.getElementById('password').classList.add('is-invalid');
        } else {
            hideErrors();
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    function setLoading(loading) {
        loginButton.disabled = loading;
        if (loading) {
            loginButtonText.style.display = 'none';
            loginButtonLoader.style.display = 'inline';
        } else {
            loginButtonText.style.display = 'inline';
            loginButtonLoader.style.display = 'none';
        }
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideErrors();
        setLoading(true);

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password, _token: '{{ csrf_token() }}' }),
            });

            const result = await response.json();

            if (result.status && result.data) {
                localStorage.setItem('auth_token', result.data.token);
                localStorage.setItem('auth_user', JSON.stringify(result.data.user));
                localStorage.setItem('auth_permissions', JSON.stringify(result.data.permissions || []));
                
                window.location.href = '/home';
            } else {
                hideErrors();
                if (result.error) {
                    if (typeof result.error === 'object') {
                        if (result.error.email) {
                            showError(Array.isArray(result.error.email) ? result.error.email[0] : result.error.email, 'email');
                        }
                        if (result.error.password) {
                            showError(Array.isArray(result.error.password) ? result.error.password[0] : result.error.password, 'password');
                        }
                        if (!result.error.email && !result.error.password) {
                            showError(result.message || 'Login failed');
                        }
                    } else {
                        showError(result.message || 'Login failed');
                    }
                } else {
                    showError(result.message || 'Login failed');
                }
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    });
});
</script>