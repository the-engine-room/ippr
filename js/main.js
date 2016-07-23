'use strict';
(function (U, $) {


    var IPPR = {
        dom: {
            header: $('.Header'),
            data: $('.Data'),
            lists: {
                main: '.List--main',
                extra: '.List--extra',
                count: '.List-count',
                header: '.List-header',
                list: '.collection',
                headerActive: '.List-headerActive',
                headerInActive: '.List-headerInactive'
            },
            content: $('.Content'),
            tabs: $('.Header-tabs a'),
            levels: $('div[data-level]'),
            dataHolder: $('.Data-holder'),
        },
        states: {
            loading: 'is-loading',
            active: 'is-active',
            animate: 'has-animation',
            hidden: 'u-isHidden',
            mobile: false,
            desktop: false
        },
        data: {
            data: {},
            tabs: {
                1: {
                    sql: "SELECT MAX(companies.company_hq) as company_hq, MAX(companies.company_formed) as company_formed, MAX(companies.company_jurisdiction) as company_jurisdiction, MAX(companies.website) as company_website, MAX(companies.company_name) as company_name, MAX(companies.company_address) as company_address, license_number, array_to_string(array_agg(concession_number), ',') as concessions FROM hydrocarbon_licences_latest_clean JOIN companies ON (hydrocarbon_licences_latest_clean.company_id = companies.company_id) GROUP BY license_number, companies.company_id ORDER BY license_number",
                    groupBy: 'license_number'
                },
                2: {
                    sql: "SELECT * FROM companies JOIN hydrocarbon_licences_latest_clean ON (companies.company_id = hydrocarbon_licences_latest_clean.company_id) ORDER BY company_name",
                    groupBy: 'company_name'
                }
            },
        },
        map: {
            map: [],
            layers: [],
            styles: {
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
            highlightLayer: function(key,id){
                $.each(IPPR.map.layers[key], function(k,value){
                    IPPR.map.layers[key][k].setStyle(IPPR.map.styles.default);

                    if (value.ID === id || value.company_name === id){
                        IPPR.map.layers[key][k].setStyle(IPPR.map.styles.active);
                    }

                });
            },
            trigger: $('.Map-trigger')
        },
        helpers: {
            groupBy: function(xs, key) {
                return xs.reduce(function(rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            }
        }
    };


    IPPR.loading = function(){
        IPPR.dom.data.toggleClass(IPPR.states.loading);
    };

    IPPR.getData = function(){

        var markup = [],
            mustacheTpl = [];

        $.each(IPPR.data.tabs, function(key, tab){

            markup[key] = '';
            mustacheTpl[key] = $('#tab-'+key).find('.main-tpl').html();

            $.getJSON('https://namibmap.carto.com/api/v2/sql/?q=' + tab.sql, function(data) {
                IPPR.data.data[key] = IPPR.helpers.groupBy(data.rows, tab.groupBy);

                $.each(IPPR.data.data[key], function(k, value){

                    var concessions = '';
                    $.each(value, function(k,v){
                        concessions += v.concessions;
                    });

                    Mustache.parse(mustacheTpl[key]);

                    markup[key] += Mustache.render(
                        mustacheTpl[key], {
                            title: k,
                            id: k,
                            concessionNumbers: concessions ? concessions.split(',') : false
                        }
                    );
                });

                $('#tab-'+key).find(IPPR.dom.lists.main).find(IPPR.dom.lists.list).html(markup[key]);
                $('#tab-'+key).find(IPPR.dom.lists.main).find(IPPR.dom.lists.count).html(Object.keys(IPPR.data.data[key]).length);


                if (Object.keys(IPPR.data.tabs).length === parseInt(key)){
                    IPPR.loading();
                    // FILTERING
                }

            });

        });


    };


    IPPR.initMap = function(){

        $.getJSON('data/data.json', function(data){

            $.each(IPPR.data.tabs, function(key){

                IPPR.map.layers[key] = [];

                IPPR.map.map[key] = L.map($('.Map--'+key)[0],{
                    scrollWheelZoom: false
                }).setView([-23.534, 6.172], 6);

                L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
                    maxZoom: 18
                }).addTo(IPPR.map.map[key]);


                function onEachFeature(feature, layer) {
                    layer.ID = feature.properties.license_number;
                    layer.concession_number = feature.properties.concession_number;
                    layer.company_id = feature.properties.company_id;
                    layer.company_name = feature.properties.company_name;
                    IPPR.map.layers[key].push(layer);
                    layer.on('click', function () {
                        $(IPPR.dom.lists.main).find('li[data-id="'+ feature.properties.license_number +'"]').click();
                        $(IPPR.dom.lists.main).find('li[data-id="'+ feature.properties.company_name +'"]').click();
                    });
                }


                L.geoJson([data], {
                    style: IPPR.map.styles.default,
                    onEachFeature: onEachFeature,
                }).addTo(IPPR.map.map[key]);

            });

        });

    };



    // Mobile behaviour of the app
    IPPR.mobile = function(){
        IPPR.states.desktop = false;

        IPPR.dom.tabs.off('click.mobile');

        IPPR.dom.tabs.on('click.mobile', function(){
            IPPR.dom.content.addClass(IPPR.states.active);
            var that = $(this);

            setTimeout(function(){
                IPPR.dom.content.addClass(IPPR.states.animate);
                IPPR.map.map[that.attr('href').split('-')[1]].invalidateSize();
            }, 100);

            IPPR.map.trigger.addClass(IPPR.states.active);
        });

        $.each(IPPR.dom.levels, function(key, value){
            var level = $(this).data('level');

            $(value).find(IPPR.dom.lists.header).off('click');
            $(value).find(IPPR.dom.lists.header).on('click', function(){
                if (level === 0){
                    IPPR.dom.content.removeClass(IPPR.states.animate);
                    setTimeout(function(){
                        IPPR.dom.content.removeClass(IPPR.states.active);
                    }, 100);
                    IPPR.map.trigger.removeClass(IPPR.states.active);
                } else if (level === 1){
                    IPPR.dom.dataHolder.css({transform: 'translate(0,0)'});
                    IPPR.map.trigger.addClass(IPPR.states.active);
                }
            });
        });


        IPPR.states.mobile = true;
    };

    // Desktop behaviour of the app
    IPPR.desktop = function(){
        IPPR.states.mobile = false;
        IPPR.dom.tabs.off('click.desktop');

        IPPR.dom.tabs.on('click.desktop', function(){
            var that = $(this);
            setTimeout(function(){
                IPPR.map.map[that.attr('href').split('-')[1]].invalidateSize();
            },100);
        });

        IPPR.states.desktop = true;
    };

    IPPR.listDetails = function(){

        var markup = [],
            mustacheTpl = [];

        $.each(IPPR.data.tabs, function(key){

            mustacheTpl[key] = $('#tab-'+key).find('.extra-tpl').html();

            $('#tab-'+key).on('click', '.collection-item', function(){

                markup[key] = '';

                IPPR.map.trigger.removeClass(IPPR.states.active);

                $(this).parent().find('li').removeClass(IPPR.states.active);
                $(this).addClass(IPPR.states.active);

                if (IPPR.states.mobile){
                    IPPR.dom.dataHolder.css({transform: 'translate(-50%,0)'});
                    $(window).scrollTop(0);
                }

                var id = $(this).data('id'),
                    body = {},
                    size = 0;

                IPPR.map.highlightLayer(key,id);

                if(!$(this).closest('.List--extra').size()){

                    var _tmp = [];

                    $.each(IPPR.data.data[key][id], function(k, company){

                        if (company.company_id){
                            _tmp.push(company);
                        } else {

                            body.address = company.company_address ? company.company_address : false;
                            body.jurisdiction = company.company_jurisdiction ? company.company_jurisdiction : false;
                            body.headquarters = company.company_hq ? company.company_hq : false;
                            body.formed = company.company_formed ? company.company_formed : false;

                            body.website = company.company_website ? company.company_website : false;

                            Mustache.parse(mustacheTpl[key]);

                            markup[key] += Mustache.render(
                                mustacheTpl[key], {
                                    active: key <= 2 ? ' active': '',
                                    title: company.company_name,
                                    address: body.address,
                                    jurisdiction: body.jurisdiction,
                                    headquarters: body.headquarters,
                                    formed: body.formed,
                                    website: body.website
                                }
                            );

                        }

                        size++;

                    });

                    if (parseInt(key) === 2){
                        size = 0;
                        $.each(IPPR.helpers.groupBy(_tmp, 'license_number'), function(k, value){

                            var concessions = [];

                            $.each(value, function(k,v){
                                concessions.push(v.concession_number);
                            });

                            Mustache.parse(mustacheTpl[key]);

                            markup[key] += Mustache.render(
                                mustacheTpl[key], {
                                    title: k,
                                    id: k,
                                    concessionNumbers: concessions ? concessions : false
                                }
                            );

                            size++;
                        });
                    }


                    $('#tab-'+key).find(IPPR.dom.lists.extra).find(IPPR.dom.lists.list).html(markup[key]);
                    $('#tab-'+key).find(IPPR.dom.lists.extra).find(IPPR.dom.lists.count).html(size);

                    $('#tab-'+key).find(IPPR.dom.lists.headerActive).removeClass(IPPR.states.hidden);
                    $('#tab-'+key).find(IPPR.dom.lists.headerInActive).addClass(IPPR.states.hidden);

                    $('.collapsible').collapsible({
                        accordion : true
                    });

                }
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


    IPPR.mapTrigger = function(){
        var _self = {
            mapTrigger: $('.Map-trigger'),
            listMain: $('.List--main .List-holder'),
            dataHolder: $('.Data-holder'),
            map: $('.Map'),
            bindEvents: function(){

                _self.mapTrigger.on('click', function(e){
                    e.preventDefault();

                    if (IPPR.appState.mobile){
                        _self.listMain.toggleClass('u-isHidden');
                    } else {
                        _self.dataHolder.toggleClass('u-isHidden');
                        _self.map.toggleClass('is-visible');
                    }

                    if(_self.listMain.is('.u-isHidden') || _self.dataHolder.is('.u-isHidden')){
                        $(this).find('.material-icons').html('view_list');
                    } else {
                        $(this).find('.material-icons').html('map');
                    }
                });

            }
        };
        _self.bindEvents();
    };


    IPPR.initApp = function(){
        if(U.vw() < 600){
            if (!IPPR.states.mobile){
                IPPR.mobile();
            }
        } else {
            if (!IPPR.states.desktop){
                IPPR.desktop();
            }
        }

        IPPR.listDetails();
    };



    IPPR.getData();
    IPPR.initMap();
    IPPR.initApp();
    // IPPR.mapTrigger();
    U.addEvent(window, 'resize', U.debounce(function () {
        IPPR.initApp();
    }, 200));


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
