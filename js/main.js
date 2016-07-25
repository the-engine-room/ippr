'use strict';
(function (U, $) {


    var IPPR = {
        dom: {
            header: $('.Header'),
            data: $('.Data'),
            lists: {
                main: '.List--main',
                extra: '.List--extra',
                info: '.List--info',
                count: '.List-count',
                header: '.List-header',
                holder: '.List-holder',
                list: '.collection',
                headerActive: '.List-headerActive',
                headerInActive: '.List-headerInactive',
            },
            content: $('.Content'),
            tabs: $('.Header-tabs a'),
            levels: $('div[data-level]'),
            dataHolder: $('.Data-holder'),
            filters: {
                main: '.Filters',
                mobile: '.Filters--mobile',
                item: '.Filters .chip',
                trigger: $('.Filters-trigger'),
                activeHolder: $('.Filters-active'),
                remove: $('Filters-remove'),
                search: $('.Search-field'),
                searchRemove: $('.Search-remove'),
                searchTrigger: $('.Search-trigger'),
            },
            map: $('.Map'),
            mapTrigger: $('.Map-trigger'),
            mapInline: $('.Map--inline')
        },
        states: {
            loading: 'is-loading',
            active: 'is-active',
            animate: 'has-animation',
            hidden: 'u-isHidden',
            visible: 'is-visible',
            mobile: false,
            desktop: false,
            view: false,
            map: false
        },
        data: {
            data: {},
            tabs: {
                0: {
                    name: 'licenses',
                    sql: "SELECT MAX(companies.company_hq) as company_hq, MAX(companies.company_formed) as company_formed, MAX(companies.company_jurisdiction) as company_jurisdiction, MAX(companies.website) as company_website, MAX(companies.company_name) as company_name, MAX(companies.company_address) as company_address, license_number, array_to_string(array_agg(concession_number), ',') as concessions FROM hydrocarbon_licences_latest_clean JOIN companies ON (hydrocarbon_licences_latest_clean.company_id = companies.company_id) GROUP BY license_number, companies.company_id ORDER BY license_number",
                    groupBy: 'license_number'
                },
                1: {
                    name: 'companies',
                    sql: "SELECT * FROM companies JOIN hydrocarbon_licences_latest_clean ON (companies.company_id = hydrocarbon_licences_latest_clean.company_id) ORDER BY company_name",
                    groupBy: 'company_name'
                }
            },
        },
        map: {
            map: [],
            layers: [],
            markers: [],
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
                    $(IPPR.map.markers[key][k]._icon).removeClass(IPPR.states.active);

                    if (value.ID === id || value.company_name === id){
                        IPPR.map.layers[key][k].setStyle(IPPR.map.styles.active);
                        $(IPPR.map.markers[key][k]._icon).addClass(IPPR.states.active);

                        if(IPPR.states.mobile){
                            setTimeout(function(){
                                if (IPPR.map.markers[key][k]._latlng.lat && IPPR.map.markers[key][k]._latlng.lng){
                                    IPPR.map.map[key].setView(new L.LatLng(IPPR.map.markers[key][k]._latlng.lat, IPPR.map.markers[key][k]._latlng.lng), 6);
                                }
                            },200);
                        }
                    }

                });
            },
            resetLayers: function(){
                $.each(IPPR.map.layers, function(k,v){
                    $.each(v, function(index) {
                       IPPR.map.layers[k][index].setStyle(IPPR.map.styles.default);
                       $(IPPR.map.markers[k][index]._icon).removeClass(IPPR.states.active);
                    });
                });
            },
            searchLayers: function(inputValue){
                if(inputValue){
                    IPPR.filters.clear();
                    IPPR.dom.filters.searchTrigger.addClass(IPPR.states.hidden);
                    IPPR.dom.filters.searchRemove.addClass(IPPR.states.visible);
                    $.each(IPPR.map.layers, function(index, val) {
                        $.each(val, function(key, value) {

                            if(value.ID.search(new RegExp(inputValue, 'ig')) > -1 || value.concession_number.search(new RegExp(inputValue, 'ig')) > -1 || value.company_name.search(new RegExp(inputValue, 'ig')) > -1 || value[inputValue]){
                                IPPR.map.layers[index][key].setStyle(IPPR.map.styles.active);
                                $(IPPR.map.markers[index][key]._icon).addClass(IPPR.states.active);
                            } else {
                                IPPR.map.layers[index][key].setStyle(IPPR.map.styles.default);
                                $(IPPR.map.markers[index][key]._icon).removeClass(IPPR.states.active);
                            }

                        });
                    });

                } else {
                    IPPR.dom.filters.searchTrigger.removeClass(IPPR.states.hidden);
                    IPPR.dom.filters.searchRemove.removeClass(IPPR.states.visible);
                    IPPR.map.resetLayers();
                }
            }
        },
        filters: {
            list: [],
            options: {
                valueNames: ['List-title', 'concessionNumbers', 'expiration'],
                listClass: 'collection',
                searchClass: 'Search-input'
            },
            clear: function(){
                $.each(IPPR.filters.list, function(k){
                    IPPR.filters.list[k].filter();
                });
                $(IPPR.dom.filters.item).removeClass(IPPR.states.active);
                IPPR.dom.filters.search.removeClass(IPPR.states.hidden);
                IPPR.dom.filters.activeHolder.empty();
            }
        },
        helpers: {
            groupBy: function(xs, key) {
                return xs.reduce(function(rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            },
            unique(value, index, self) {
                return self.indexOf(value) === index;
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

                if (Object.keys(IPPR.data.tabs).length === parseInt(key)+1){
                    IPPR.loading();
                    IPPR.filtering();
                }

            });

        });


    };

    IPPR.initMap = function(){

        $.getJSON('data/data.json', function(data){

            $.each(IPPR.dom.map, function(key,val){

                var that = $(val);

                IPPR.map.layers[key] = [];
                IPPR.map.markers[key] = [];

                IPPR.map.map[key] = L.map($('.Map').eq(key)[0],{
                    scrollWheelZoom: false,
                    zoomControl: false
                }).setView([-23.534, 6.172], 6);

                L.control.zoom({
                     position:'bottomleft'
                }).addTo(IPPR.map.map[key]);

                L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
                    maxZoom: 18
                }).addTo(IPPR.map.map[key]);

                var cnt = 0; // TMP, REMOVE ME
                function onEachFeature(feature, layer) {
                    cnt++; // TMP, REMOVE ME
                    layer.ID = feature.properties.license_number;
                    layer.concession_number = feature.properties.concession_number;
                    layer.company_id = feature.properties.company_id;
                    layer.company_name = feature.properties.company_name;

                    // TMP, REMOVE ME
                    if (cnt % 4 === 0){
                        layer.expiration = true;
                    }
                    // TMP, REMOVE ME

                    IPPR.map.layers[key].push(layer);

                    var marker = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'Map-label',
                            html: '<span>' + layer.concession_number + '</span>'
                        })
                    }).addTo(IPPR.map.map[key]);

                    IPPR.map.markers[key].push(marker);

                    function onClick(){
                        $.each(IPPR.filters.list, function(k,v){
                            v.filter();
                            v.search();
                        });

                        $('.'+IPPR.filters.options.searchClass).val('').trigger('keyup').blur();

                        var elem, top;
                        if (that.is('.licenses')){
                            elem = $(IPPR.dom.lists.main).find('li[data-id="'+ feature.properties.license_number +'"]');
                            elem.click();
                            top = elem.position().top;
                            $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).scrollTop(top);
                        } else if (that.is('companies')){
                            elem = $(IPPR.dom.lists.main).find('li[data-id="'+ feature.properties.company_name +'"]');
                            elem.click();
                            top = elem.position().top;
                            $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).scrollTop(top);
                        }
                    }

                    marker.on('click',onClick);
                    layer.on('click',onClick);
                }

                L.geoJson([data], {
                    style: IPPR.map.styles.default,
                    onEachFeature: onEachFeature
                })
                .addTo(IPPR.map.map[key]);

            });

        });

    };

    $(document).on('click', '.List-companyInfo', function(){
        var id = $(this).data('id');
        IPPR.states.view = 'companies';
        IPPR.dom.map.addClass(IPPR.states.hidden);
        $('a[data-view="companies"]').click();
        $('.collection-item[data-id="'+id+'"]').click();
        var top = $('.collection-item[data-id="'+id+'"]').position().top;
        $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).scrollTop(top);
    });

    // Mobile behaviour of the app
    IPPR.mobile = function(){
        IPPR.states.desktop = false;

        IPPR.dom.tabs.off('click.mobile');

        IPPR.dom.tabs.on('click.mobile', function(){
            IPPR.map.resetLayers();
            IPPR.dom.content.addClass(IPPR.states.active);


            setTimeout(function(){
                IPPR.dom.content.addClass(IPPR.states.animate);
                $.each(IPPR.map.map, function(key,value){
                    if(value){
                        value.invalidateSize();
                    }
                });
            }, 100);

            IPPR.states.view = $(this).data('view');

            if(IPPR.states.view === 'licenses'){
                IPPR.dom.mapTrigger.addClass(IPPR.states.active);
            }
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
                    IPPR.dom.mapTrigger.removeClass(IPPR.states.active);

                } else if (level === 1){
                    IPPR.dom.dataHolder.css({transform: 'translate(0,0)'});
                    if(IPPR.states.view === 'licenses'){
                        IPPR.dom.mapTrigger.addClass(IPPR.states.active);
                    }
                    IPPR.dom.map.removeClass(IPPR.states.hidden);
                    $.each(IPPR.map.map, function(key,value){
                        if(value){
                            value.invalidateSize();
                        }
                    });
                    $(IPPR.dom.lists.extra).addClass(IPPR.states.hidden);
                    $(IPPR.dom.lists.info).addClass(IPPR.states.hidden);

                    if (IPPR.dom.mapTrigger.find('.material-icons').html() === 'map'){
                        $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).removeClass(IPPR.states.hidden);
                    }

                } else if (level === 2){
                    IPPR.dom.dataHolder.css({transform: 'translate(-33.3333%,0)'});
                }
            });
        });


        IPPR.states.mobile = true;
    };

    // Desktop behaviour of the app
    IPPR.desktop = function(){
        IPPR.states.mobile = false;
        IPPR.dom.tabs.off('click.desktop');
        $(IPPR.dom.lists.extra).removeClass(IPPR.states.hidden);

        IPPR.dom.tabs.on('click.desktop', function(){
            IPPR.map.resetLayers();
            setTimeout(function(){
                $.each(IPPR.map.map, function(key,value){
                    if(value){
                        value.invalidateSize();
                    }
                });
            },100);
            IPPR.states.view = $(this).data('view');
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

                IPPR.dom.mapTrigger.removeClass(IPPR.states.active);

                $(this).parent().find('li').removeClass(IPPR.states.active);
                $(this).addClass(IPPR.states.active);

                if (IPPR.states.mobile){
                    IPPR.dom.dataHolder.css({transform: 'translate(-33.3333%,0)'});
                    if(IPPR.states.view === 'licenses'){
                        IPPR.dom.map.addClass(IPPR.states.hidden);
                    } else {
                        IPPR.dom.mapInline.removeClass(IPPR.states.hidden);
                    }
                    $(window).scrollTop(0);
                } else {
                    IPPR.dom.map.removeClass(IPPR.states.hidden);
                }

                var id = $(this).data('id'),
                    body = {},
                    size = 0;

                if(IPPR.states.desktop){
                    if (key === '1'){
                        IPPR.map.highlightLayer('2',id);
                    } else {
                        IPPR.map.highlightLayer(key,id);
                    }
                } else {
                    IPPR.map.highlightLayer(key,id);
                }



                if(!$(this).closest(IPPR.dom.lists.extra).size()){

                    if (IPPR.states.mobile){
                        $(this).closest(IPPR.dom.lists.holder).addClass(IPPR.states.hidden);
                    }
                    var companies = [];

                    $.each(IPPR.data.data[key][id], function(k, company){

                        if (IPPR.states.view === 'companies'){
                            companies.push(company);
                        } else {

                            body.address = company.company_address ? company.company_address : false;
                            body.jurisdiction = company.company_jurisdiction ? company.company_jurisdiction : false;
                            body.headquarters = company.company_hq ? company.company_hq : false;
                            body.formed = company.company_formed ? company.company_formed : false;

                            body.website = company.company_website ? company.company_website : false;

                            Mustache.parse(mustacheTpl[key]);

                            markup[key] += Mustache.render(
                                mustacheTpl[key], {
                                    active: key <= 2 ? true : false,
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

                    if (IPPR.states.view === 'companies'){
                        size = 0;
                        $.each(IPPR.helpers.groupBy(companies, 'license_number'), function(k, value){

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

                        $.each(IPPR.map.markers[key], function(index, val) {
                             val.off('click');
                        });

                        $.each(IPPR.map.layers[key], function(index, val) {
                             val.off('click');
                        });
                    }

                    $('#tab-'+key).find(IPPR.dom.lists.extra).removeClass(IPPR.states.hidden);
                    $('#tab-'+key).find(IPPR.dom.lists.extra).find(IPPR.dom.lists.list).html(markup[key]);
                    $('#tab-'+key).find(IPPR.dom.lists.extra).find(IPPR.dom.lists.count).html(size);

                    $('#tab-'+key).find(IPPR.dom.lists.headerActive).removeClass(IPPR.states.hidden);
                    $('#tab-'+key).find(IPPR.dom.lists.headerInActive).addClass(IPPR.states.hidden);

                    IPPR.map.map[key].invalidateSize();

                    $('.collapsible').collapsible({
                        accordion : true
                    });

                }
            });

        });


        $(document).on('click', '.js-info', function(e){
            e.preventDefault();
            $(IPPR.dom.lists.info).removeClass(IPPR.states.hidden);
            IPPR.dom.dataHolder.css({transform: 'translate(-66.6666%,0)'});
            $(window).scrollTop(0);
        });

    };


    IPPR.filtering = function(){

        $.each(IPPR.data.tabs, function(key){
            IPPR.filters.list.push(new List('tab-'+key, IPPR.filters.options));// jshint ignore:line

            $('#tab-'+key).find(IPPR.dom.filters.item).on('click', function() {

                IPPR.filters.list[key].filter();
                IPPR.filters.list[key].search();

                $('.'+IPPR.filters.options.searchClass).val('').trigger('keyup').blur();

                if ($(this).is('.'+IPPR.states.active)){
                    IPPR.filters.list[key].filter();
                    $(this).closest(IPPR.dom.filters.main).find('.chip').removeClass(IPPR.states.active);
                    if(IPPR.states.mobile){
                        IPPR.filters.clear();
                        IPPR.map.resetLayers();
                    }
                } else {

                    var value = $(this).data('filter');

                    IPPR.map.searchLayers(value);

                    $(this).closest(IPPR.dom.filters.main).find('.chip').removeClass(IPPR.states.active);
                    $(this).addClass(IPPR.states.active);

                    if(IPPR.states.mobile){
                        IPPR.dom.filters.search.addClass(IPPR.states.hidden);
                        var clone = $(this).clone();
                        IPPR.dom.filters.activeHolder.html(clone);
                    }

                    IPPR.filters.list[key].filter(function (item) {
                        if (item.values()[value]){
                            return true;
                        }
                        return false;
                    });

                }
            });


        });


        $('.'+IPPR.filters.options.searchClass).on('keyup', function(){
            IPPR.map.searchLayers($(this).val());
        });


        IPPR.dom.filters.searchRemove.on('click', function(){
            IPPR.map.resetLayers();
            $('.'+IPPR.filters.options.searchClass).val('').trigger('keyup').blur();
            $.each(IPPR.filters.list, function(k){
                IPPR.filters.list[k].search();
            });
        });


        if(IPPR.states.mobile){
            IPPR.dom.filters.activeHolder.on('click', '.chip', function(){
                IPPR.filters.clear();
                IPPR.map.resetLayers();
            });
        }
    };


    IPPR.mapTrigger = function(){

        IPPR.dom.mapTrigger.on('click', function(e){
            e.preventDefault();

            if (IPPR.states.mobile){
                $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).toggleClass(IPPR.states.hidden);
            }

            IPPR.dom.map.toggleClass(IPPR.states.visible);

            $.each(IPPR.map.map, function(key,value){
                if(value){
                    value.invalidateSize();
                }
            });

            if($(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).is('.'+IPPR.states.hidden) || IPPR.dom.dataHolder.is('.'+IPPR.states.hidden)){
                IPPR.states.map = true;
                $(this).find('.material-icons').html('view_list');
            } else {
                $(this).find('.material-icons').html('map');
            }
        });

    };


    IPPR.initApp = function(){
        if(U.vw() < 993){
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
    IPPR.mapTrigger();
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
