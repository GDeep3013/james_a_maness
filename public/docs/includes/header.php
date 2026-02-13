<!DOCTYPE html>
<html lang="en"> 
<head>
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) : 'Veda Theme Documentation'; ?></title>
    
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <meta name="description" content="Bootstrap Documentation Template For Software Developers">
    <meta name="author" content="610Weblab">    
    <link rel="shortcut icon" href="assets/images/fav.svg">

    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.2/styles/atom-one-dark.min.css">
    <link rel="stylesheet" href="assets/plugins/simplelightbox/simple-lightbox.min.css">

    <link id="theme-style" rel="stylesheet" href="assets/css/theme.css">
    <link id="custom-style" rel="stylesheet" href="assets/css/custom.css">
    <style>
        .image--wrapper {
            padding-top: 15px;
            padding-bottom: 15px;
        }
        .docs-content,
        .docs-content .docs-article,
        .docs-content .docs-heading,
        .docs-content .section-heading,
        .docs-content h1, .docs-content h2, .docs-content h3, .docs-content h4, .docs-content h5, .docs-content h6,
        .docs-content p, .docs-content li, .docs-content td, .docs-content th {
            font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
    </style>
</head> 

<body class="docs-page">    
    <header class="header fixed-top">	    
        <div class="branding docs-branding">
            <div class="container-fluid position-relative py-2">
                <div class="docs-logo-wrapper">
                    <button id="docs-sidebar-toggler" class="docs-sidebar-toggler docs-sidebar-visible me-2 d-xl-none" type="button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <div class="site-logo"><a class="navbar-brand" href="index.php"><img class="logo-icon me-2" src="assets/images/logo.png" alt="logo"></a></div>    
                </div>
                <div class="docs-top-utilities d-flex justify-content-end align-items-center">
                    <div class="top-search-box d-none d-lg-flex">
                        <form autocomplete="off">
                            <div class="autocomplete" style="width:300px;">
                                <input id="myInput" type="text" name="search" placeholder="Search the docs..." class="form-control search-input">
                                <button type="submit" class="btn search-btn" value="Search"><i class="fas fa-search"></i></button>
                            </div>
                        </form>
                    </div> 
                </div>
            </div>
        </div>
    </header>
