'use strict';
(function (U, $) {

    var IPPR = {
        header: $('.Header'),
        states: {
            loading: 'is-loading'
        },
        dataGroups: {
            licenses: $('#licenses .List-holder > ul'),
            companies: $('#companies .List-holder > ul')
        },
        main: $('.Data'),
        groupBy: function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        }
    };


    IPPR.loading = function(){
        IPPR.main.toggleClass(IPPR.states.loading);
    };

    IPPR.getData = function(){


        var licensesSql = 'SELECT * FROM hydrocarbon_licences_latest_clean ORDER BY license_number',
            companiesSql = 'SELECT * FROM companies ORDER BY company_name';

        $.getJSON('https://namibmap.carto.com/api/v2/sql/?q='+licensesSql, function(data) {
            var licenses = data;

            $.getJSON('https://namibmap.carto.com/api/v2/sql/?q='+companiesSql, function(data) {

                var companies = data,
                    licensesGrouped = IPPR.groupBy(licenses.rows, 'license_number'),
                    licensesMarkup = '';

                $.each(licensesGrouped, function(k, v) {

                    licensesMarkup += '<li><div class="collapsible-header">' + k + '<span class="Concessions">';

                    var onlyCompanies = [],
                        uniqueCompanies = [];

                    $.each(v, function(kk,vv){

                        licensesMarkup += '<span class="ConcessionNumber">' + vv.concession_number + '</span>';

                        $.each(companies.rows, function(key,value){
                            if (value.company_id === vv.company_id) {
                                onlyCompanies.push(value);
                            }
                        });

                        $.each(onlyCompanies, function(i, el){
                            if($.inArray(el, uniqueCompanies) === -1){ uniqueCompanies.push(el) };
                        });

                    });

                    licensesMarkup += '</span></div><div class="collapsible-body">';

                    $.each(uniqueCompanies, function(key,value){
                        licensesMarkup += 'COM:' + value.company_name + '<br />';
                        $.each(v, function(k,v){
                            if (v.company_id === value.company_id){
                                licensesMarkup += '<span class="ConcessionNumber">' + v.concession_number + '</span>';
                            }
                        });
                    });

                    licensesMarkup += '</p></div></li>';
                });

                IPPR.dataGroups.licenses.html(licensesMarkup);
                IPPR.loading();

            });
        });

    };


    IPPR.initMap = function(){

        var map,
            mapOptions = {
                zoom: 6,
                center: [-23.534, 5.172],
                scrollWheelZoom: false
            };

        map = new L.Map('map', mapOptions);

        cartodb.createLayer(map, {
            user_name: 'namibmap', // jshint ignore:line
            type: 'cartodb',
            sublayers: [
                {
                    type: 'http',
                    urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                },
                {
                    sql: 'SELECT * FROM hydrocarbon_licences_latest_clean',
                    cartocss: '#hydrocarbon_licences_latest_clean{polygon-fill: #FF6600; polygon-opacity: 0.7; line-color: #FFF; line-width: 0.5; line-opacity: 1; } #hydrocarbon_licences_latest_clean::labels {text-name: [concession_number]; text-face-name: "DejaVu Sans Book"; text-size: 10; text-label-position-tolerance: 10; text-fill: #000; text-halo-fill: #FFF; text-halo-radius: 1; text-dy: -10; text-allow-overlap: true; text-placement: point; text-placement-type: simple; }',
                    interactivity: 'cartodb_id'
                },
            ]
        })
        .addTo(map) // add the layer to our map which already contains 1 sublayer
        .done(function(layer) {

            // change the query for the first layer
            //layer.getSubLayer(1).setSQL('SELECT * FROM hydrocarbon_licences_latest_clean limit 10');

            IPPR.layer = layer;

            layer.on('featureClick', function(e, latlng, pos, data, layer) {
                console.log(data);
                console.log(layer);
            });

            cartodb.vis.Vis.addInfowindow(map, layer, ['cartodb_id']);

        });

        // setTimeout(function(){
        //     console.log(IPPR.layer);
        //     IPPR.layer.getSubLayer(1).setSQL('SELECT * FROM hydrocarbon_licences_latest_clean limit 10');
        // }, 1000);

        //IPPR.layer.getSubLayer(1).setSQL('SELECT * FROM hydrocarbon_licences_latest_clean limit 10');

    };

    IPPR.getData();
    IPPR.initMap();




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
