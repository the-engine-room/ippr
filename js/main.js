'use strict';
(function (U, $) {


    var IPPR = {
        header: $('.Header'),
        states: {
            loading: 'is-loading'
        },
        data: {},
        dataGroups: {
            licenses: $('#tab-1'),
            companies: $('#tab-2')
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
        mapHightlight: {
            default: {
                weight: 2,
                color: 'green',
                dashArray: '',
                fillOpacity: 0.5
            },
            active: {
                weight: 2,
                color: '#666',
                dashArray: '',
                fillOpacity: 1
            }
        },
        highlightMapLayer: function(key){
            $.each(IPPR.mapLayers, function(k,value){
                IPPR.mapLayers[k].setStyle(IPPR.mapHightlight.default);
                if (value.ID === key){
                    console.log(IPPR.mapLayers[k]);
                    IPPR.mapLayers[k].setStyle(IPPR.mapHightlight.active);
                }
            });
        },
        highlightMultipleMapLayer: function(array){
            IPPR.highlightMapLayer();
            $.each(array, function(k,value){
                array[k].setStyle(IPPR.mapHightlight.active);
            });
        },
        mapLayers: [],
        map: null,
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

            IPPR.dataGroups.licenses.find('.List--main .collection').html(licensesMarkup);
            IPPR.dataGroups.licenses.find('.List--main .List-count').html(Object.keys(IPPR.data.licenses).length);

            IPPR.loading();
            IPPR.filtering();

        });

    };


    IPPR.initMap = function(){


        $.getJSON('data/data.json', function(data){

            IPPR.map = L.map('map',{
                scrollWheelZoom: false
            }).setView([-23.534, 6.172], 6);

            L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
                maxZoom: 18
            }).addTo(IPPR.map);


            function onEachFeature(feature, layer) {
                layer.ID = feature.properties.license_number;
                layer.concession_number = feature.properties.concession_number;
                IPPR.mapLayers.push(layer);
                layer.on('click', function () {
                    $('.List[data-level=0]').find('li[data-id="'+ feature.properties.license_number +'"]').click();
                });
            }


            L.geoJson([data], {
                style: IPPR.mapHightlight.default,
                onEachFeature: onEachFeature,
            }).addTo(IPPR.map);


        });
    };



    // Mobile behaviour of the app
    IPPR.mobile = function(){
        IPPR.appState.desktop = false;
        var _self = {
            fakeTabs: $('.Header-tabs a'),
            content: $('.Content'),
            contentStates: {
                active: 'is-active',
                animate: 'has-animation'
            },
            levels: $('div[data-level]'),
            mapTrigger: $('.Map-trigger'),
            map: $('.Map'),
            dataHolder: $('.Data-holder'),
            listMain: $('.List--main .List-holder'),
            bindEvents: function(){

                _self.fakeTabs.off('click.mobile');
                _self.fakeTabs.on('click.mobile', function(){
                    _self.content.addClass(_self.contentStates.active);
                    setTimeout(function(){
                        _self.content.addClass(_self.contentStates.animate);
                        IPPR.map.invalidateSize();
                    }, 100);
                    _self.mapTrigger.addClass('is-active');
                });

                $.each(_self.levels, function(key, value){
                    var level = $(this).data('level');
                    $(value).find('.List-header').off('click');
                    $(value).find('.List-header').on('click', function(){
                        if (level === 0){
                            _self.content.removeClass(_self.contentStates.animate);
                            setTimeout(function(){
                                _self.content.removeClass(_self.contentStates.active);
                            }, 100);
                            _self.mapTrigger.removeClass('is-active');
                        } else if (level === 1){
                            _self.dataHolder.css({transform: 'translate(0,0)'});
                            _self.mapTrigger.addClass('is-active');
                        }
                    });
                });

                _self.mapTrigger.off('click');
                _self.mapTrigger.on('click', function(e){
                    e.preventDefault();
                    _self.listMain.toggleClass('u-isHidden');
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

        var _self = {
            mapTrigger: $('.Map-trigger')
        };

        $.each(IPPR.dataGroups, function(key, value){
            value.on('click', '.collection-item', function(){

                _self.mapTrigger.removeClass('is-active');

                $(this).parent().find('li').removeClass('is-active');
                $(this).addClass('is-active');

                if (IPPR.appState.mobile){
                    $('.Data-holder').css({transform: 'translate(-50%,0)'});
                    $(window).scrollTop(0);
                }

                var licensesSelectedMarkup = '',
                    key = $(this).data('id'),
                    body = {};

                IPPR.highlightMapLayer(key);

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


                IPPR.dataGroups.licenses.find('.List--extra .collapsible').html(licensesSelectedMarkup);
                IPPR.dataGroups.licenses.find('.List--extra .List-count').html(Object.keys(IPPR.data.licenses[key]).length);

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
                valueNames: ['List-title', 'concessionNumbers', 'expiration'],
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
                    }
                    return false;

                });

            }
        });

        var mapLayers= [];

        $('.'+_self.options.searchClass).on('keyup', function(){

            var val = $(this).val();

            if(val){
                _self.clearFilters();
                _self.searchTrigger.addClass('is-hidden');
                _self.searchRemove.addClass('is-visible');

                $.each(IPPR.mapLayers, function(k,v){
                    if(v.ID.search(new RegExp(val, 'i')) > -1){
                        mapLayers.push(IPPR.mapLayers[k]);
                    }

                    if (v.concession_number.search(new RegExp(val, 'i')) > -1){
                        mapLayers.push(IPPR.mapLayers[k]);
                    }
                });

                console.log(mapLayers);
                IPPR.highlightMultipleMapLayer(mapLayers);

            } else {
                mapLayers = [];
                _self.searchTrigger.removeClass('is-hidden');
                _self.searchRemove.removeClass('is-visible');
                IPPR.highlightMapLayer();
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


    IPPR.sankey = function(){
        google.charts.load('current', {'packages':['sankey']});

        var _self = {
            draw: function(){

                var data = new google.visualization.DataTable();

                data.addColumn('string', 'From');
                data.addColumn('string', 'To');
                data.addColumn('number', 'Weight');
                data.addRows([
                    [ 'A', 'X', 5 ],
                    [ 'A', 'Y', 7 ],
                    [ 'A', 'Z', 6 ]
                ]);


                // Sets chart options.
                var options = {
                };

                // Instantiates and draws our chart, passing in some options.
                var chart = new google.visualization.Sankey(document.getElementById('sankey'));

                chart.draw(data, options);
            }
        };

        google.charts.setOnLoadCallback(_self.draw);

        U.addEvent(window, 'resize', U.debounce(function () {
            _self.draw();
        }, 200));

    };

    IPPR.sankey();


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


})(window.burza.utils, jQuery);
