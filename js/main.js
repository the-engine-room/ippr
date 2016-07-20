'use strict';
(function (U, $) {


    var IPPR = {
        header: $('.Header'),
        states: {
            loading: 'is-loading'
        },
        data: {},
        dataGroups: {
            licenses: $('#licenses .List-licenses .collection'),
            companies: $('#companies .List-companies .collection')
        },
        main: $('.Data'),
        groupBy: function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        },
        appState: {
            mobile: false,
            desktop: false
        }
    };


    IPPR.loading = function(){
        IPPR.main.toggleClass(IPPR.states.loading);
    };

    IPPR.getData = function(){


        var licensesSql = "SELECT MAX(companies.company_name) as company_name, MAX(companies.company_address) as company_address, license_number, array_to_string(array_agg(concession_number), ',') as concessions FROM hydrocarbon_licences_latest_clean JOIN companies ON (hydrocarbon_licences_latest_clean.company_id = companies.company_id) GROUP BY license_number, companies.company_id ORDER BY license_number", // jshint ignore:line
            // companiesSql = 'SELECT * FROM companies ORDER BY company_name',
            licensesMarkup = '';

        $.getJSON('https://namibmap.carto.com/api/v2/sql/?q='+licensesSql, function(data) {

            IPPR.data.licenses = IPPR.groupBy(data.rows, 'license_number');

            $.each(IPPR.data.licenses, function(key, value){
                licensesMarkup += '<li class="collection-item"><p class="List-title">' + key + '</p>';

                $.each(value, function(k,v){
                    var concessions = v.concessions.split(',');

                    $.each(concessions, function(kk,vv){
                        licensesMarkup += '<span class="ConcessionNumber">' + vv + '</span>';
                    });

                });

                licensesMarkup += '</li>';
            });

            IPPR.dataGroups.licenses.html(licensesMarkup);
            IPPR.loading();

        });

    };


    IPPR.initMap = function(){

        $.getJSON('data/data.json', function(data){

            var map = L.map('map',{
                scrollWheelZoom: false
            }).setView([-23.534, 6.172], 6);

            L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
                maxZoom: 18
            }).addTo(map);


            function onEachFeature(feature, layer) {
                var popupContent = '<p>I started out as a GeoJSON ' +
                        feature.geometry.type + ', but now I\'m a Leaflet vector!</p>';

                if (feature.properties) {
                    popupContent += feature.properties.concession_number; // jshint ignore:line
                }

                layer.bindPopup(popupContent);
            }

            L.geoJson([data], {

                style: function (feature) {
                    return feature.properties && feature.properties.style;
                },

                onEachFeature: onEachFeature
            }).addTo(map);

        });


    };



    // Mobile behaviour of the app
    IPPR.mobile = function(){
        IPPR.appState.desktop = false;
        console.log('mobile');

        var _self = {
            fakeTabs: $('.Header-tabs a'),
            content: $('.Content'),
            contentStates: {
                active: 'is-active',
                animate: 'has-animation'
            },
            dataHolderStates: {

            },
            items: {
                licenses: $('.List-licenses'),
                companies: $('.List-companies')
            },
            levels: $('div[data-level]'),
            bindEvents: function(){

                _self.fakeTabs.on('click.mobile', function(){
                    _self.content.addClass(_self.contentStates.active);
                    setTimeout(function(){
                        _self.content.addClass(_self.contentStates.animate);
                    }, 100);
                });

                $.each(_self.levels, function(key, value){
                    var level = $(this).data('level');
                    $(value).find('.List-header').on('click', function(){
                        if (level === 0){
                            _self.content.removeClass(_self.contentStates.animate);
                            setTimeout(function(){
                                _self.content.removeClass(_self.contentStates.active);
                            }, 100);
                        } else if (level === 1){

                        }
                    });
                });

                $.each(_self.items, function(key, value){
                    value.on('click', '.collection-item', function(){
                        $('.Data-holder').css({transform: 'translate(-50%,0)'});
                        $('.Search').css({transform: 'translate(-100%,0)'});
                        $('.Search-field').css({transform: 'translate(0%,0)'});
                    });
                });

            }
        };

        _self.bindEvents();
        IPPR.appState.mobile = true;
    };

    // Desktop behaviour of the app
    IPPR.desktop = function(){
        IPPR.appState.mobile = false;
        console.log('desktop');
        IPPR.appState.desktop = true;
    };

    IPPR.initApp = function(){
        if(U.vw() < 600){
            if (!IPPR.appState.mobile){
                IPPR.mobile();
            }
        } else {
            if (!IPPR.appState.desktop){
                IPPR.desktop();
            }
        }
    };


    IPPR.getData();
    IPPR.initMap();
    IPPR.initApp();
    U.addEvent(window, 'resize', U.debounce(function () {
        IPPR.initApp();
    }, 200));


    // google.charts.load('current', {'packages':['sankey']});

    // function drawChart() {
    //     var data = new google.visualization.DataTable();
    //     data.addColumn('string', 'From');
    //     data.addColumn('string', 'To');
    //     data.addColumn('number', 'Weight');
    //     data.addRows([
    //         [ 'A', 'X', 5 ],
    //         [ 'A', 'Y', 7 ],
    //         [ 'A', 'Z', 6 ],
    //         [ 'B', 'X', 2 ],
    //         [ 'B', 'Y', 9 ],
    //         [ 'B', 'Z', 4 ]
    //     ]);

    //     // Sets chart options.
    //     var options = {
    //     };

    //     // Instantiates and draws our chart, passing in some options.
    //     var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));

    //     chart.draw(data, options);
    // }

    // google.charts.setOnLoadCallback(drawChart);


    // $(window).resize(function(){
    //     drawChart();
    // });

})(window.burza.utils, jQuery);
