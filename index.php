<?php
    $URL = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
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
    <meta name="description" content="CHANGEME">

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
    <meta property="og:description" content="CHANGEME" />
    <meta property="og:url" content="<?php echo $URL ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="" />

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="dns-prefetch" href="//gstatic.com">
    <link rel="dns-prefetch" href="//code.jquery.com">
    <link rel="dns-prefetch" href="//www.googletagmanager.com">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- build:css /css/min.css -->
    <link rel="stylesheet" href="/css/global.css" />
    <!-- endbuild -->

</head>
<body>

    <header class="Header center-align">
        <div class="Header-inner">
            <div class="container">

                <div class="row">
                    <div class="col s12">
                        <h1 class="Header-title">Transparent Oil Namibia</h1>
                    </div>
                    <div class="col s12 m8 offset-m2 left-align">
                        <p class="light Header-description">The Transparent Oil Namibia platform maps the details, trends and connections in the allocation of Petroleum Exploration Licences in Namibia. The page lets you search through a collection of information about which companies hold these licenses, who owns and manages them, where are these companies registered and how has license ownership changed over time.</p>
                    </div>
                </div>


                <a href="about.php" class="Header-about">About us</a>
            </div>
        </div>
    </header>



    <div class="Content">

        <div class="row TabsHolder">
            <div class="col s12">
                <ul class="tabs">
                    <li class="tab col"><a class="active" href="#licenses">Licenses</a></li>
                    <li class="tab col"><a href="#companies">Companies</a></li>
                </ul>
            </div>
        </div>

        <div id="licenses" class="col s12">

            <div class="Search row">

                <div class="input-field col s12 m6 right">
                    <input id="search-licenses" class="Search-input Search-input--licenses" />
                    <label for="search-licenses"><i class="material-icons small">search</i></label>
                </div>

            </div>

            <div class="row">
                <div class="col s12 l3">
                    <div class="List List-licenses">

                        <h2 class="List-title">Licenses (34)</h2>

                        <div class="List-holder">
                            <ul class="collection">

                                <?php
                                    $json = file_get_contents('data/data.json');
                                    $data = json_decode($json, true);
                                    $out = [];

                                    foreach ($data as $licenses) {
                                        foreach ($licenses as $licence) {

                                            $out[$licence['properties']['license_number']][] = [
                                                'concession_number' => $licence['properties']['concession_number'],
                                                'company_id' => $licence['properties']['company_id'],
                                                'company_name' => $licence['properties']['company_name']
                                            ];

                                        }
                                    }

                                    foreach ($out as $key => $licence) {
                                ?>
                                    <li class="collection-item">
                                        <?php echo $key; ?>
                                        <ul>
                                            <li>asd</li>
                                            <li>asd</li>
                                            <li>asd</li>
                                            <li>asd</li>
                                        </ul>
                                    </li>
                                <?php
                                    }
                                ?>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col s12 l3">
                    <div class="List List-companies">

                        <h2 class="List-title">Companies in Ownership (34)</h2>

                        <div class="List-holder">
                            <ul class="collapsible z-depth-0" data-collapsible="accordion">
                                <li>
                                    <div class="collapsible-header">First<i class="material-icons">info</i></div>

                                    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col s12 l6">
                    <div class="blue">
                        List 2
                    </div>
                </div>
            </div>


        </div>
        <div id="companies" class="">

            <div class="Search row">

                <div class="input-field col s6 right">
                    <input id="search-companies" class="Search-input Search-input--companies" />
                    <label for="search-companies"><i class="material-icons small">search</i></label>
                </div>

            </div>

        </div>

    </div>






    <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/js/materialize.min.js"></script>
    <script src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.2.0/list.min.js"></script>

    <!-- build:js /js/min.js -->
    <script src="/js/vendor/burza/utils.js"></script>
    <script src="/js/main.js"></script>
    <!-- endbuild -->



    <script>
        (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
        function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        ga('create','UA-XXXXX-X','auto');ga('send','pageview');
    </script>
</body>
</html>
