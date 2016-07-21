'use strict';
(function (U, $) {


    var IPPR = {
        header: $('.Header'),
        states: {
            loading: 'is-loading'
        },
        data: {},
        dataGroups: {
            licenses: $('#licenses'),
            companies: $('#companies')
        },
        templates: {
            licence: $('#licence-tpl').html(),
            licenceSelected: $('#licenceSelected-tpl').html()
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


        var licensesSql = "SELECT MAX(companies.company_hq) as company_hq, MAX(companies.company_formed) as company_formed, MAX(companies.company_jurisdiction) as company_jurisdiction, MAX(companies.website) as company_website, MAX(companies.company_name) as company_name, MAX(companies.company_address) as company_address, license_number, array_to_string(array_agg(concession_number), ',') as concessions FROM hydrocarbon_licences_latest_clean JOIN companies ON (hydrocarbon_licences_latest_clean.company_id = companies.company_id) GROUP BY license_number, companies.company_id ORDER BY license_number"; // jshint ignore:line
            // companiesSql = 'SELECT * FROM companies ORDER BY company_name',


        var licensesMarkup = '';

        $.getJSON('https://namibmap.carto.com/api/v2/sql/?q='+licensesSql, function(data) {

            IPPR.data.licenses = IPPR.groupBy(data.rows, 'license_number');

            Mustache.parse(IPPR.templates.licence);


            $.each(IPPR.data.licenses, function(key, value){

                var concessions = '';
                $.each(value, function(k,v){
                    concessions += v.concessions;
                });

                licensesMarkup += Mustache.render(
                    IPPR.templates.licence, {
                        title: key,
                        id: key,
                        concessionNumbers: concessions.split(',')
                    }
                );
            });

            IPPR.dataGroups.licenses.find('.List--licenses .collection').html(licensesMarkup);
            IPPR.dataGroups.licenses.find('.List--licenses .List-count').html(Object.keys(IPPR.data.licenses).length);

            IPPR.loading();
            IPPR.filtering();

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
                            $('.Data-holder').css({transform: 'translate(0,0)'});
                        }
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

    IPPR.listDetails = function(){
        Mustache.parse(IPPR.templates.licenceSelected);

        $.each(IPPR.dataGroups, function(key, value){
            value.on('click', '.collection-item', function(){

                $(this).parent().find('li').removeClass('is-active');
                $(this).addClass('is-active');

                if (IPPR.appState.mobile){
                    $('.Data-holder').css({transform: 'translate(-50%,0)'});
                    $(window).scrollTop(0);
                }

                var licensesSelectedMarkup = '',
                    key = $(this).data('id'),
                    body = {};

                $.each(IPPR.data.licenses[key], function(key, company){

                    body.address = company.company_address ? company.company_address : false;
                    body.jurisdiction = company.company_jurisdiction ? company.company_jurisdiction : false;
                    body.headquarters = company.company_hq ? company.company_hq : false;
                    body.formed = company.company_formed ? company.company_formed : false;

                    body.website = company.company_website ? company.company_website : false;

                    licensesSelectedMarkup += Mustache.render(
                        IPPR.templates.licenceSelected, {
                            title: company.company_name,
                            address: body.address,
                            jurisdiction: body.jurisdiction,
                            headquarters: body.headquarters,
                            formed: body.formed,
                            website: body.website
                        }
                    );

                });


                IPPR.dataGroups.licenses.find('.List--selected .collapsible').html(licensesSelectedMarkup);
                IPPR.dataGroups.licenses.find('.List--selected .List-count').html(Object.keys(IPPR.data.licenses[key]).length);

                $('.List-headerActive').removeClass('u-isHidden');
                $('.List-headerInactive').addClass('u-isHidden');
            });
        });
    };


    IPPR.filtering = function(){
        var _self = {
            filters: '.Filters',
            filtersMobile: '.Filters--mobile',
            filterItem: $('.Filters .chip'),
            filtersTrigger: $('.Filters-trigger'),
            filtersActiveHolder: $('.Filters-active'),
            filterRemove: $('Filters-remove'),
            search: $('.Search-field'),
            searchRemove: $('.Search-remove'),
            searchTrigger: $('.Search-trigger'),
            options: {
                valueNames: ['List-title', 'List-number', 'expiration'],
                listClass: 'collection',
                searchClass: 'Search-input'
            },
            clearFilters: function(){
                list.filter(); // jshint ignore:line
                $(_self.filters).find('.chip').removeClass('is-active');
                _self.search.removeClass('u-isHidden');
                _self.filtersActiveHolder.empty();
            }
        };

        var list = new List('data', _self.options);// jshint ignore:line

        _self.filterItem.on('click', function() {

            list.filter();
            list.search();
            $('.'+_self.options.searchClass).val('').trigger('keyup').blur();

            if ($(this).is('.is-active')){
                list.filter();
                $(this).closest(_self.filters).find('.chip').removeClass('is-active');
                if(IPPR.appState.mobile){
                    _self.clearFilters();
                }
            } else {

                var value = $(this).data('filter');

                $(this).closest(_self.filtersMobile).find('.chip').removeClass('is-active');
                $(this).addClass('is-active');

                if(IPPR.appState.mobile){
                    _self.search.addClass('u-isHidden');
                    var clone = $(this).clone();
                    _self.filtersActiveHolder.html(clone);
                }

                list.filter(function (item) {
                    if (item.values()[value]){
                        return true;
                    } else {
                        return false;
                    }
                });

            }
        });

        $('.'+_self.options.searchClass).on('keyup', function(){
            if($(this).val()){
                _self.clearFilters();
                _self.searchTrigger.addClass('is-hidden');
                _self.searchRemove.addClass('is-visible');
            } else {
                _self.searchTrigger.removeClass('is-hidden');
                _self.searchRemove.removeClass('is-visible');
            }
        });

        _self.searchRemove.on('click', function(){
            $('.'+_self.options.searchClass).val('').trigger('keyup').blur();
            list.search();
        });

        if(IPPR.appState.mobile){
            _self.filtersActiveHolder.on('click', '.chip', _self.clearFilters);
        }

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

        IPPR.listDetails();
    };


    IPPR.getData();
    IPPR.initMap();
    IPPR.initApp();
    U.addEvent(window, 'resize', U.debounce(function () {
        IPPR.initApp();
    }, 200));





    $('.js-dropdown-trigger').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'right' // Displays dropdown with edge aligned to the left of button
    });

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
