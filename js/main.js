'use strict';
(function (U, google, $) {

    var IPPR = {
        header: $('.Header')
    };

    IPPR.animateHeader = function() {
        $('.parallax').parallax();
    };

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


    IPPR.animateHeader();

})(window.burza.utils, google, jQuery, Materialize);
