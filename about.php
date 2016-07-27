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

    <link rel="stylesheet" href="https://npmcdn.com/leaflet@0.7.7/dist/leaflet.css" />
    <link rel="stylesheet" href="http://libs.cartocdn.com/cartodb.js/v3/3.15/themes/css/cartodb.css" />

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <!-- build:css /css/min.css -->
    <link rel="stylesheet" href="/css/global.css" />
    <!-- endbuild -->

</head>
<body>

    <header class="Header center-align">
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
                    <p class="light Header-description">The Transparent Oil Namibia platform maps the details, trends and connections in the allocation of Petroleum Exploration Licences in Namibia.</p>
                </div>
            </div>

            <ul class="Header-navigation">
                <li><a href="about.php" class="is-active">About</a></li>
                <li><a href="faq.php">FAQ</a></li>
            </ul>


            <ul class="Header-tabs">
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

        </div>
    </header>



    <div class="StaticContent About">
        <div class="row">
            <div class="col s12 m6 offset-m3">
                <h1>About</h1>
                <p>Respect; challenges of our times safety immunize foster local achieve billionaire philanthropy. Storytelling; social impact, amplify rights-based approach long-term. Human rights, combat poverty resourceful; economic development peaceful focus on impact outcomes pride. Deep engagement, care committed policymakers beneficiaries, reproductive rights Kony 2012 social responsibility. Pursue these aspirations Angelina Jolie network emergency response raise awareness. Policy medical change catalyze turmoil human potential. Accessibility, liberal United Nations efficient necessities employment. Global network support, improving quality design thinking economic security honor communities organization. Affiliate our grantees and partners participatory monitoring underprivileged diversification. Capacity building; voice legal aid save lives effectiveness activist meaningful work.</p>

                <p>Respect; challenges of our times safety immunize foster local achieve billionaire philanthropy. Storytelling; social impact, amplify rights-based approach long-term. Human rights, combat poverty resourceful; economic development peaceful focus on impact outcomes pride. Deep engagement, care committed policymakers beneficiaries, reproductive rights Kony 2012 social responsibility. Pursue these aspirations Angelina Jolie network emergency response raise awareness.</p>

                <ul>
                    <li>Respect; challenges of our times safety</li>
                    <li>Respect; challenges of our times safety</li>
                </ul>

                <ol>
                    <li>Respect; challenges of our times safety</li>
                    <li>Respect; challenges of our times safety</li>
                </ol>

                <h2>Subtitle</h2>
                <p>Respect; challenges of our times safety immunize foster local achieve billionaire philanthropy. Storytelling; social impact, amplify rights-based approach long-term. Human rights, combat poverty resourceful; economic development peaceful focus on impact outcomes pride. Deep engagement, care committed policymakers beneficiaries, reproductive rights Kony 2012 social responsibility. Pursue these aspirations Angelina Jolie network emergency response raise awareness.</p>

                <h3>Subtitle</h3>
                <p>Global network support, improving quality design thinking economic security honor communities organization. Affiliate our grantees and partners participatory monitoring underprivileged diversification. Capacity building; voice legal aid save lives effectiveness activist meaningful work.</p>

                <blockquote>
                    This is an example quotation that uses the blockquote tag. Capacity building; voice legal aid save lives effectiveness activist meaningful work.
                </blockquote>


            </div>
        </div>
    </div>

    <footer class="Footer">
        <div class="row center-align">
            <div class="col s12">
                <p class="Header-title">
                    <span class="Header-title--secondary">Transparent Oil</span>
                    <span class="Header-title--primary">Namibia</span>
                </p>
            </div>
        </div>
        <div class="row center-align Footer-logos">
            <div class="col s12 m4 l2 offset-l3">
                <a href="#">
                    <img src="images/dist/ippr.png" alt="IPPR" />
                </a>
            </div>
            <div class="col s12 m4 l2">
                <a href="https://www.theengineroom.org/" title="The engine room - Accelerating social change">
                    <img src="images/dist/engineRoom.png" alt="The engine room" />
                </a>
            </div>
            <div class="col s12 m4 l2">
                <a href="http://web.burza.hr/" title="web.burza Digital agency">
                    <img src="images/dist/wb.png" alt="web.burza" />
                </a>
            </div>
        </div>
    </footer>

    <script type="x-tmpl-mustache" class="licenceTable-tpl">
        <div class="col s12">
            <table class="bordered striped highlight responsive-table">
                <thead>
                    <tr>
                        <th data-field="licenceNumber">Licence Number</th>
                        <th data-field="transferDate">Transfer Date</th>
                        <th data-field="transferType">Transfer Type</th>
                        <th data-field="licenceSeller">Licence Seller</th>
                        <th data-field="sellerStakePrior">Seller Stake Prior</th>
                        <th data-field="licenceBuyer">Licence Buyer</th>
                        <th data-field="buyerStakeAfter">Buyer Stake After</th>
                        <th data-field="operatorPrior">Operator Prior</th>
                        <th data-field="operatorAfter">Operator After</th>
                    </tr>
                </thead>

                <tbody>
                    {{#tableRows}}
                        <tr>
                            <td>{{licenceNumber}}</td>
                            <td>{{transferDate}}</td>
                            <td>{{transferType}}</td>
                            <td>{{licenceSeller}}</td>
                            <td>{{sellerStakePrior}}</td>
                            <td>{{licenceBuyer}}</td>
                            <td>{{buyerStakeAfter}}</td>
                            <td>{{operatorPrior}}</td>
                            <td>{{operatorAfter}}</td>
                        </tr>
                    {{/tableRows}}
                </tbody>
            </table>
        </div>
    </script>

    <script type="x-tmpl-mustache" class="companyTable-tpl">
        <div class="col s12">
            <p class="Table-title">Company information</p>
            <table class="bordered striped highlight responsive-table">
                <thead>
                    <tr>
                        <th data-field="name">Name</th>
                        <th data-field="jurisdiction">Jurisdiction</th>
                        <th data-field="registration">Registration</th>
                        <th data-field="headquarters">Headquarters</th>
                        <th data-field="dateOfFormation">Date Of Formation</th>
                        <th data-field="companyInfo">Company Info</th>
                    </tr>
                </thead>

                <tbody>
                    {{#tableRows}}
                        <tr>
                            <td>{{company_name}}</td>
                            <td>{{company_jurisdiction}}</td>
                            <td>{{company_registration}}</td>
                            <td>{{company_hq}}</td>
                            <td>{{company_formed}}</td>
                            <td>{{company_address}}</td>
                        </tr>
                    {{/tableRows}}
                </tbody>
            </table>
        </div>
    </script>

    <script type="x-tmpl-mustache" class="ownedLicenses-tpl">

        <div class="col s12"><p class="OwnedLicenses-title">Company owned licenses</p></div>
        {{#licence}}
            <div class="col s6 m4 l2">
                <div class="Block">
                    <p class="Block-title">{{name}} - {{percent}}</p>
                    {{#numbers}}<span>{{.}}</span>{{/numbers}}
                </div>
            </div>
        {{/licence}}

    </script>

    <script type="x-tmpl-mustache" class="hierarchy-tpl">
        <div class="col s12"><p class="Hierarchy-title">Company hierarchy</p></div>
        {{#hierarchy}}
            <div class="col s6 m4 l2">
                <div class="Block">
                    <p class="Block-title">{{person_name}}</p>
                    {{#person_nationality}}<p>Nationality: {{person_nationality}}</p>{{/person_nationality}}
                    {{#start_date}}<p>Start date: {{start_date}}</p>{{/start_date}}
                    {{#role_title}}<p>Role: {{role_title}}</p>{{/role_title}}
                    {{#percent_interest}}<p class="Block-title">{{percent_interest}}%</p>{{/percent_interest}}
                </div>
            </div>
        {{/hierarchy}}

    </script>

    <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.2.0/list.min.js"></script>


    <script src="http://libs.cartocdn.com/cartodb.js/v3/3.15/cartodb.js"></script>
    <script src="https://npmcdn.com/leaflet@0.7.7/dist/leaflet.js"></script>

    <!-- build:js /js/min.js -->
    <script src="/js/vendor/burza/utils.js"></script>
    <script src="/js/vendor/materialize.js"></script>
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
