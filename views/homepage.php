    <div class="Content" id="data">

        <div id="tab-0" class="col s12">


            <div class="Search z-depth-1 hide-on-med-and-down brand blue">

                <div class="input-field Search-field">
                    <i class="material-icons small prefix Search-trigger">search</i>
                    <i class="material-icons small prefix Search-remove">close</i>
                    <input id="search-tab-1" type="text" class="Search-input" />
                    <label for="search-tab-1">Filter by licence</label>
                </div>

                <div class="Filters">
                    <ul class="Filters-list">
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter" data-filter="expiration">Soon to expire</span>
                        </li>
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter">Without ownership</span>
                        </li>
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter">Recently changed ownership</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="Data is-loading">

                <div class="Data-holder">

                    <div class="List List--main z-depth-1" data-level="0">
                        <div class="List-header brand blue">
                            <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                            <span>Licenses (<span class="List-count"></span>)</span>
                        </div>


                        <div class="Search Search--mobile hide-on-large-only brand blue">

                            <div class="Filters Filters--mobile">
                                <i class="material-icons small Filters-trigger js-dropdown-trigger" data-beloworigin="true" data-activates='filters1'>filter_list</i>
                                <ul class="Filters-list z-depth-1" id="filters1">
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="expiration">Soon to expire <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="ownership">Without ownership <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="changedOwnership">Recently changed ownership <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                </ul>
                            </div>

                            <div class="Filters-active"></div>

                            <div class="input-field Search-field">
                                <i class="material-icons small prefix Search-trigger">search</i>
                                <i class="material-icons small prefix Search-remove">close</i>
                                <input id="search-tab-1" type="text" class="Search-input" />
                                <label for="search-tab-1">Filter by licence</label>
                            </div>

                        </div>

                        <div class="List-holder is-filterable">
                            <ul class="collection">
                            </ul>
                        </div>

                    </div>

                    <div class="List List--extra z-depth-1 u-isHidden" data-level="1">
                        <div class="List-header brand green">
                            <div class="List-headerActive">
                                <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                                <span>Companies in ownership (<span class="List-count"></span>)</span>
                            </div>
                        </div>

                        <a class="List-infoLink orange js-showAdditionalInfo hide-on-large-only"><i class="material-icons right">arrow_right</i>Transaction history</a>


                        <div class="List-holder">
                            <p class="List-headerInactive">
                                Select a license on the left to see ownership information
                            </p>
                            <ul class="collection collapsible" data-collapsible="accordion">
                            </ul>
                        </div>
                    </div>

                    <div class="List List--info z-depth-1 hide-on-large-only" data-level="2">
                        <div class="List-header brand green">
                            <div class="List-headerActive">
                                <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                                <span>Transaction history for <span class="List-infoName"></span></span>
                            </div>
                        </div>

                        <div class="List-holder">
                            <div class="Sankey">
                                <div class="Sankey-mobile"></div>
                            </div>
                            <div class="Table row"></div>
                        </div>
                    </div>

                </div>

                <div class="Map Map--0 licenses"></div>

                <div class="Loader">
                    <div class="Loader-holder">
                        <div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div>
                    </div>
                </div>

            </div>

            <script type="x-tmpl-mustache" class="main-tpl">
                <li class="collection-item" data-id="{{ id }}" data-sankey="{{ sankey }}" data-table="{{ table }}">
                    <p class="List-title">{{ title }}</p>
                    {{#concessionNumbers}}
                        <span class="List-number brand blue">{{.}}</span>
                    {{/concessionNumbers}}
                    <span class="u-isHidden concessionNumbers">
                        {{#concessionNumbers}}
                            {{.}}
                        {{/concessionNumbers}}
                    </span>
                </li>
            </script>

            <script type="x-tmpl-mustache" class="extra-tpl">
                <li{{#active}} class="active"{{/active}}>
                    {{#companyInfo}}
                        <div class="collapsible-header{{#active}} active{{/active}}">
                            <div class="List-title">{{ company_name }}</div>
                            <i class="material-icons">keyboard_arrow_down</i>
                        </div>
                        <div class="collapsible-body"{{#active}} style="display: block;"{{/active}}>

                            <ul>
                                <li>
                                    {{#company_address}}<p><strong>Address:</strong> {{company_address}}</p>{{/company_address}}
                                    {{#company_jurisdiction}}<p><strong>Jurisdiction:</strong> {{company_jurisdiction}}</p>{{/company_jurisdiction}}
                                    {{#company_hq}}<p><strong>Headquarters:</strong> {{company_hq}}</p>{{/company_hq}}
                                    {{#company_formed}}<p><strong>Formed on:</strong> {{company_formed}}</p>{{/company_formed}}
                                    {{#company_website}}<p><strong>Website:</strong> <a href="{{company_website}}">{{company_website}}</a></p>{{/company_website}}
                                </li>
                            </ul>
                            <p class="List-companyInfo" data-id="{{ company_id }}"><i class="material-icons">info</i></p>
                        </div>
                    {{/companyInfo}}
                </li>
            </script>

        </div>

        <div id="tab-1" class="col s12">

            <div class="Search z-depth-1 hide-on-med-and-down brand green">

                <div class="input-field Search-field">
                    <i class="material-icons small prefix Search-trigger">search</i>
                    <i class="material-icons small prefix Search-remove">close</i>
                    <input id="search-tab-2" type="text" class="Search-input" />
                    <label for="search-tab-2">Filter by Company name</label>
                </div>

                <div class="Filters">
                    <ul class="Filters-list">
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter" data-filter="expiration">Soon to expire</span>
                        </li>
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter">Without ownership</span>
                        </li>
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter">Recently changed ownership</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="Data is-loading">

                <div class="Data-holder">

                    <div class="List List--main z-depth-1" data-level="0">
                        <div class="List-header brand green">
                            <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                            <span>Companies (<span class="List-count"></span>)</span>
                        </div>


                        <div class="Search Search--mobile hide-on-large-only brand green">

                            <div class="Filters Filters--mobile">
                                <i class="material-icons small Filters-trigger js-dropdown-trigger" data-beloworigin="true" data-activates='filters2'>filter_list</i>
                                <ul class="Filters-list z-depth-1" id="filters2">
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="expiration">Soon to expire <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="ownership">Without ownership <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="changedOwnership">Recently changed ownership <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                </ul>
                            </div>

                            <div class="Filters-active"></div>

                            <div class="input-field Search-field">
                                <i class="material-icons small prefix Search-trigger">search</i>
                                <i class="material-icons small prefix Search-remove">close</i>
                                <input id="search-tab-1" type="text" class="Search-input" />
                                <label for="search-tab-1">Filter by Company name</label>
                            </div>

                        </div>

                        <div class="List-holder">
                            <ul class="collection">
                            </ul>
                        </div>

                    </div>

                    <div class="List List--extra z-depth-1 u-isHidden" data-level="1">
                        <div class="List-header brand blue">
                            <div class="List-headerActive">
                                <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                                <span>Licenses in ownership (<span class="List-count"></span>)</span>
                            </div>
                        </div>

                        <div class="List-holder is-filterable">
                            <p class="List-headerInactive">
                                Select a company on the left to see licenses information
                            </p>
                            <ul class="collection collapsible" data-collapsible="accordion">
                            </ul>
                            <div class="Map Map--1 Map--inline companies hide-on-large-only"></div>
                            <div class="Table row"></div>
                            <div class="OwnedLicenses row"></div>
                            <div class="Hierarchy row"></div>
                        </div>
                    </div>

                </div>

                <div class="Map Map--1 companies"></div>


                <div class="Loader">
                    <div class="Loader-holder">
                        <div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div>
                    </div>
                </div>

            </div>


            <script type="x-tmpl-mustache" class="main-tpl">
                <li class="collection-item" data-id="{{ id }}" data-table="{{table}}" data-hierarchy="{{ hierarchy }}" data-ownedLicenses="{{ ownedLicenses }}">
                    <p class="List-title">{{ title }}</p>
                </li>
            </script>

            <script type="x-tmpl-mustache" class="extra-tpl">
                <li class="collection-item" data-id="{{ id }}">
                    <p class="List-title List-title--full">{{ title }}</p>
                    {{#concessionNumbers}}
                        <span class="List-number brand blue">{{.}}</span>
                    {{/concessionNumbers}}
                    <span class="u-isHidden concessionNumbers">
                        {{#concessionNumbers}}
                            {{.}}
                        {{/concessionNumbers}}
                    </span>
                </li>
            </script>


        </div>

        <div class="AdditionalInfo u-isHidden">

            <div class="AdditionalInfo-header brand blue u-cf">

                <h2 class="AdditionalInfo-title">Transaction history for Licence number <span></span></h2>

                <a class="waves-effect waves-light btn orange AdditionalInfo-download"><i class="material-icons right">file_download</i>Download data</a>

            </div>

            <div class="row AdditionalInfo-data">

                <div class="col s12">
                    <div class="Sankey Sankey-desktop"></div>
                </div>

                <div class="col s12">
                    <div class="Table"></div>
                </div>

                <div class="col s12">
                    <div class="OwnedLicenses row"></div>
                </div>

                <div class="col s12">
                    <div class="Hierarchy row"></div>
                </div>
            </div>

        </div>

    </div>

    <a class="Map-trigger btn-floating btn-large waves-effect waves-light red"><i class="material-icons">map</i></a>

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
