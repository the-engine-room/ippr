<?php
    $URL = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

    include dirname(__FILE__) . '/AltoRouter.php';
    $router = new AltoRouter();

    $router->setBasePath('');

    $router->map('GET','/', 'views/homepage.php', 'homepage');
    $router->map('GET','/about/', 'views/about.php', 'about');


    $match = $router->match();
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Transparent Oil Namibia</title>
    <meta name="description" content="The Transparent Oil Namibia platform maps the details, trends and connections in the allocation of Petroleum Exploration Licences in Namibia.">

    <script>
        (function () {

            document.documentElement.className = document.documentElement.className.replace(/(^|\\b)no\-js(\\b|$)/gi, 'has-js');

            svgSupported = (function () {
                var div = document.createElement('div');
                    div.innerHTML = '<svg/>';
                return (typeof SVGRect != 'undefined' && div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
            }());

            if (svgSupported) {
                document.documentElement.className += ' has-svg';
            } else {
                document.documentElement.className += ' no-svg';
            }

            var isMobile = window.matchMedia && window.matchMedia('only screen and (max-width: 767px)').matches;

            if (isMobile) {
                document.documentElement.className += ' is-mobile';
            }

            var canvasSupported = (function () {
                var canvas = document.createElement('canvas');
                return !!(canvas.getContext && canvas.getContext('2d')) && canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
            }());

            if (canvasSupported) {
                document.documentElement.className += ' has-canvas';
            } else {
                document.documentElement.className += ' no-canvas';
            }

        }());
    </script>

    <meta property="og:site_name" content="Transparent Oil Namibia" />
    <meta property="og:title" content="Transparent Oil Namibia" />

    <meta property="og:description" content="Mapping license details, connections, and trends in the allocation of Petroleum Exploration Licences in Namibia." />
    <meta property="og:url" content="<?php echo $URL ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/favicons/ogMain.png" />

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/favicons/manifest.json">
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="theme-color" content="#ffffff">

    <link rel="dns-prefetch" href="//gstatic.com">
    <link rel="dns-prefetch" href="//code.jquery.com">
    <link rel="dns-prefetch" href="//www.googletagmanager.com">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">

    <link rel="stylesheet" href="https://npmcdn.com/leaflet@0.7.7/dist/leaflet.css" />
    <link rel="stylesheet" href="http://libs.cartocdn.com/cartodb.js/v3/3.15/themes/css/cartodb.css" />

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto+Slab" rel="stylesheet">

    <!-- build:css /css/min.css -->
    <link rel="stylesheet" href="/css/global.css" />
    <!-- endbuild -->

</head>
<body<?php if($match[name] == 'homepage'){ echo ' class="App"'; } ?>>

    <header class="Header center-align<?php if($match[name] == 'about'){ ?> Header--plain<?php } ?>">
        <div class="Header-inner">

            <div class="row">
                <div class="col s12">
                    <h1 class="Header-title">
                        <a href="/">
                            <span class="Header-title--secondary">Transparent Oil</span>
                            <span class="Header-title--primary">Namibia</span>
                        </a>
                    </h1>
                </div>
                <div class="col s12 m6 offset-m3">
                    <p class="light Header-description">Mapping license details, connections, and trends in the allocation of Petroleum Exploration Licences in Namibia.</p>
                </div>
            </div>

            <ul class="Header-navigation">
                <li><a href="/about/"<?php if($match[name] == 'about'){ echo ' class="is-active"'; } ?>>About</a></li>
            </ul>

            <?php if($match[name] == 'homepage'){ ?>
                <ul class="tabs Header-tabs">
                    <li class="tab col">
                        <a href="/#tab-0" class="brand blue" data-view="licenses">
                            <span>Browse by licence</span>
                            <i class="material-icons">keyboard_arrow_right</i>
                        </a>
                    </li>
                    <li class="tab col">
                        <a href="/#tab-1" class="brand green" data-view="companies">
                            <span>Browse by company</span>
                            <i class="material-icons">keyboard_arrow_right</i>
                        </a>
                    </li>
                </ul>
            <?php } ?>

        </div>
    </header>

    <?php if($match[name] == 'about'){ ?>
        <div class="Search brand blue"></div>
    <?php } ?>

    <?php

        if($match) {
            require $match['target'];
        }
        else {
            header("HTTP/1.0 404 Not Found");
            require 'views/404.php';
        }

    ?>

    <footer class="Footer">
        <div class="Footer-inner">

            <div class="row center-align">
                <div class="col s12">
                    <p class="Header-title">
                        <span class="Header-title--secondary">Transparent Oil</span>
                        <span class="Header-title--primary">Namibia</span>
                    </p>
                </div>
            </div>

            <div class="row center-align Footer-logos">
                <div class="col s12 m10 offset-m1">
                    <p class="Footer-poweredBy">a project by</p>
                    <a href="http://www.ippr.org.na/">
                        <img src="/images/dist/ippr.png" alt="IPPR" width="1841" height="156" class="Footer--ippr" />
                        <img src="/images/dist/ippr-small.png" alt="IPPR" width="707" height="273" class="Footer--ipprSmall" />
                    </a>
                </div>
                <div class="col s12 m10 offset-m1">
                    <p class="Footer-poweredBy">powered by</p>
                    <a href="https://www.theengineroom.org/" title="The engine room - Accelerating social change">
                        <img src="/images/dist/matchbox.png" alt="The engine room" width="844" height="261" class="Footer--matchbox" />
                    </a>
                </div>
                <div class="col s12 m10 offset-m1 Footer-info">
                    <a href="https://creativecommons.org/licenses/by-sa/4.0/" title="Creative Commons licence">
                        <img src="/images/dist/cc.png" alt="" width="117" height="33" class="Footer--cc" />
                    </a>
                    <a href="https://github.com/the-engine-room/ippr/" title="IPPR Github repo">
                        <img src="/images/dist/github.png" alt="" width="126" height="32" class="Footer--github" />
                    </a>
                </div>
            </div>
        </div>
    </footer>



    <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.2.0/list.min.js"></script>
    <script src="http://libs.cartocdn.com/cartodb.js/v3/3.15/cartodb.js"></script>
    <script src="https://npmcdn.com/leaflet@0.7.7/dist/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js"></script>

    <!-- build:js /js/min.js -->
    <script src="/js/vendor/burza/utils.js"></script>
    <script src="/js/main.plain.js"></script>
    <!-- endbuild -->

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-82268240-1', 'auto');
      ga('send', 'pageview');

    </script>
</body>
</html>
