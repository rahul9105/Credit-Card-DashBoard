function hashValueGetterForCardsTab(params) {
    return params.node ? params.node.rowIndex : null;
};

function createBankNameFilterForCardTab() {
    var bankNameList = [];
    bankNameList.push('All');
    for (var row of cardsData) {
        if (!bankNameList.includes(row.CreditCard.split(' ')[0].trim())) {
            bankNameList.push(row.CreditCard.split(' ')[0].trim());
        }
    }
    var bankNameHtml = `<div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" id="bank-name-dropdown-button" aria-expanded="false" data-bs-auto-close="outside">
                                <strong>Bank Name</strong>: All
                            </button>
                            <ul class="dropdown-menu" id="bank-name-dropdown-menu">`
    for (var i = 0; i < bankNameList.length; i++) {
        if (bankNameList[i] == 'All') {
            bankNameHtml += `<li class="p-1 border-bottom">
                                <div class="dropdown-item">
                                    <div class="form-check d-flex justify-content-start">
                                        <div>
                                            <input class="form-check-input" type="checkbox" value="-1" id="bank-name-all" checked>
                                        </div>
                                        <div>
                                            <label class="form-check-label ms-2" for="bank-name-all">
                                                All
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </li>`
        }
        else {
            if (i == bankNameList.length - 1) {
                bankNameHtml += `<li class="p-1">
                                    <div class="dropdown-item">
                                        <div class="form-check d-flex justify-content-start">
                                            <div>
                                                <input class="form-check-input" type="checkbox" value="-1" id="bank-name" checked>
                                            </div>
                                            <div>
                                                <label class="form-check-label ms-2" for="bank-name">
                                                    ${bankNameList[i]}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </li>`
            }
            else {
                bankNameHtml += `<li class="p-1 border-bottom">
                                    <div class="dropdown-item">
                                        <div class="form-check d-flex justify-content-start">
                                            <div>
                                                <input class="form-check-input" type="checkbox" value="-1" id="bank-name" checked>
                                            </div>
                                            <div>
                                                <label class="form-check-label ms-2" for="bank-name">
                                                    ${bankNameList[i]}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </li>`
            }
        }
    };
    bankNameHtml += `<div class="d-flex justify-content-center mt-2">
                        <button name="" class="btn apply-button align-middle px-4" role="button" id="bank-name-apply-button">
                            Apply
                        </button>
                    </div>`
    bankNameHtml += `</ul>
                </div>
            </div>`
    document.getElementById('bank-name-filter-div').innerHTML = bankNameHtml;
    bankNameList = null;
    bankNameHtml = null;
};

function createCardNameFilterForCardTab() {
    var cardNameList = [];
    cardNameList.push('All');
    for (var row of cardsData) {
        if (!cardNameList.includes(row.CreditCard)) {
            cardNameList.push(row.CreditCard);
        }
    }
    var cardNameHtml = `<div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" id="card-name-dropdown-button" aria-expanded="false" data-bs-auto-close="outside">
                                <strong>Card Name:</strong> All
                            </button>
                            <ul class="dropdown-menu" id="card-name-dropdown-menu">`
    for (var i = 0; i < cardNameList.length; i++) {
        if (cardNameList[i] == 'All') {
            cardNameHtml += `<li class="p-1 border-bottom">
                                <div class="dropdown-item">
                                    <div class="form-check d-flex justify-content-start">
                                        <div>
                                            <input class="form-check-input" type="checkbox" value="-1" id="card-name-all" checked>
                                        </div>
                                        <div>
                                            <label class="form-check-label ms-2" for="card-name-all">
                                                All
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </li>`
        }
        else {
            if (i == cardNameList.length - 1) {
                cardNameHtml += `<li class="p-1">
                                    <div class="dropdown-item">
                                        <div class="form-check d-flex justify-content-start">
                                            <div>
                                                <input class="form-check-input" type="checkbox" value="-1" id="card-name" checked>
                                            </div>
                                            <div>
                                                <label class="form-check-label ms-2" for="card-name">
                                                    ${cardNameList[i]}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </li>`
            }
            else {
                cardNameHtml += `<li class="p-1 border-bottom">
                                    <div class="dropdown-item">
                                        <div class="form-check d-flex justify-content-start">
                                            <div>
                                                <input class="form-check-input" type="checkbox" value="-1" id="card-name" checked>
                                            </div>
                                            <div>
                                                <label class="form-check-label ms-2" for="card-name">
                                                    ${cardNameList[i]}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </li>`
            }
        }
    }
    cardNameHtml += `<div class="d-flex justify-content-center mt-2">
                        <button name="" class="btn apply-button align-middle px-4" role="button" id="card-name-apply-button">
                            Apply
                        </button>
                    </div>`
    cardNameHtml += `</ul>
                </div>
            </div>`
    document.getElementById('card-name-filter-div').innerHTML = cardNameHtml;
    cardNameList = null;
    cardNameHtml = null;
};

function createPeriodFilterForCardTab() {
    var periodList = [];
    for (var row of cardsData) {
        if (!periodList.includes(moment(row.Date).format('MMM YYYY'))) {
            periodList.push(moment(row.Date).format('MMM YYYY'));
        }
    }
    var periodHtml = `<div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" id="period-dropdown-button" aria-expanded="false" data-bs-auto-close="outside">
                            <strong>Period:</strong> ${periodList[periodList.length - 1]}
                        </button>
                        <ul class="dropdown-menu" id="period-dropdown-menu">`
    for (var i = 0; i < periodList.length; i++) {
        if (i == periodList.length - 1) {
            periodHtml += `<li class="p-1">
                            <div class="dropdown-item">
                                <div class="form-check d-flex justify-content-start">
                                    <div>
                                        <input class="form-check-input" name="periodFlexRadioDefault" type="radio" id="periodCheckbox-${periodList[i]}" checked>
                                    </div>
                                    <div>
                                        <label class="form-check-label ms-2" for="period">
                                            ${periodList[i]}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </li>`
        }
        else {
            periodHtml += `<li class="p-1 border-bottom">
                            <div class="dropdown-item">
                                <div class="form-check d-flex justify-content-start">
                                    <div>
                                        <input class="form-check-input" name="periodFlexRadioDefault" type="radio" id="periodCheckbox-${periodList[i]}">
                                    </div>
                                    <div>
                                        <label class="form-check-label ms-2" for="period">
                                            ${periodList[i]}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </li>`
        }
    }
    periodHtml += `</ul>
            </div>
        </div>`
    document.getElementById('period-filter-div').innerHTML = periodHtml;
    periodList = null;
    periodHtml = null;
}

function cardsColDef() {
    return [
        { headerName: "S.No", field: "hash", sortable: true, resizable: true, width: 40, filter: false, headerClass: ['main-header', 'fs-5'], cellClass: ['fs-4', 'fw-bold', 'd-flex', 'justify-content-center'],
            valueGetter: hashValueGetterForCardsTab 
        },
        {
            headerName: "Bank Logo", field: "BankLogoLink", sortable: true, resizable: true, width: 150, filter: false, headerClass: ['main-header', 'fs-5'],
            cellClass: ['d-flex', 'justify-content-center'],
            cellRenderer: (params) => {
                return `<div>
                            <img src="${params.value}" style="width: 100px; height: 30px;"/>
                        </div>`
            },
        },
        {
            headerName: "Bank Name", sortable: true, resizable: true, width: 150, filter: false, headerClass: ['main-header', 'fs-5'],
            valueGetter: (params) => {
                return params.data.CreditCard.split(' ')[0];
            },
        },
        {
            headerName: "Card Name", sortable: true, resizable: true, width: 150, filter: false, headerClass: ['main-header', 'fs-5'],
            cellClass: ['fs-6', 'fw-normal'],
            valueGetter: (params) => {
                return params.data.CreditCard == 'OneCard' ? params.data.CreditCard : params.data.CreditCard.split(' ')[1];
            },
            filterParams: {
                buttons: ['apply', 'cancel', 'clear', 'reset'],
                closeOnApply: true,
            }
        },
        {
            headerName: "Card Number", field: "Last4Digit", sortable: true, resizable: true, width: 150, filter: false, headerClass: ['main-header', 'fs-5'],
            cellClass: ['fs-6', 'fw-normal'],
            filterParams: {
                buttons: ['apply', 'cancel', 'clear', 'reset'],
                closeOnApply: true,
            },
            cellRenderer: (params) => {
                return params.value.toString().includes('`') ? `xxxx-xxxx-xxxx-${params.value.toString().slice(1, params.value.length)}` : `xxxx-xxxx-xxxx-${params.value}`;
            }
        },
        {
            headerName: "Card Type", field: 'CardTypeLogoLink', sortable: true, resizable: true, width: 120, filter: false, headerClass: ['main-header', 'fs-5'],
            cellClass: ['fs-6', 'fw-normal', 'd-flex', 'justify-content-start'],
            cellRenderer: function (params) {
                return `<div>
                            <img loading="lazy" src="${params.value}" style="width: 80px; height: 25px;"/>
                        </div>`
            },
        },
        {
            headerName: 'BillDate', field: 'BillDate', sortable: true, resizable: true, width: 100, filter: false, headerClass: ['main-header', 'fs-5'],
            cellClass: ['fs-6', 'fw-normal'],
        },
        // { headerName: "Card Limit", field: "CardLimit", sortable: true, resizable: true, width: 200, filter: 'agNumberColumnFilter' },
        // { headerName: "Available Limit", field: "AvailableLimit", sortable: true, resizable: true, width: 200, filter: 'agNumberColumnFilter' },
        {
            headerName: "Month", field: "Date", sortable: true, resizable: true, width: 200, filter: false, headerClass: ['main-header', 'fs-5'],
            cellClass: ['fs-6', 'fw-normal'],
            cellRenderer: (params) => {
                return moment(params.value).format('MMM YYYY');
            }
        },
        {
            headerName: "Amount", field: "BillAmount", sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', headerClass: ['main-header', 'fs-5'],
            cellClass: ['fs-6', 'fw-normal'],
            filterParams: {
                buttons: ['apply', 'cancel', 'clear', 'reset'],
                closeOnApply: true,
            },
            cellRenderer: (params) => {
                return `₹ ${params.value.toLocaleString('en-IN')}`;
            }
        },
        {
            headerName: "Status", field: "Status", sortable: true, resizable: true, width: 100, filter: false, headerClass: ['main-header', 'fs-5'],
            cellClass: ['d-flex', 'justify-content-center'],
            cellStyle: (params) => {
                return params.value === 'Paid' ? { 'background-color': 'green', 'color': 'white' } : { 'background-color': 'red', 'color': 'white' };
            },
        }
    ]
};


$(document).ready(() => {
    // Get the data from the server
    $.ajax({
        type: "POST",
        url: "/myCCDashboard/getData",
        success: (response) => {
            document.getElementById('data-div').innerHTML = response.html;

            // For Cards Tab
            cardsData = response.cardsData;
            cardsGridDiv = document.getElementById('cardsMyGrid');
            var gridOptionsForCardsTab = {
                rowHeight: 50,
                columnDefs: cardsColDef(),
                rowData: cardsData,
                suppressMenuHide: true,
                unSortIcon: false,
                autoSizeStrategy: {
                    type: 'fitGridWidth',
                    defaultMinWidth: 50,
                },
                defaultColDef: {
                    flex: 1,
                    minWidth: 50,
                    pinned: false,
                },
                pagination: false,
                // paginationPageSize: 22,
                // paginationPageSizeSelector: [22, 110, 264, 792],
            };
            agGridApiCards = new agGrid.createGrid(cardsGridDiv, gridOptionsForCardsTab);
            createBankNameFilterForCardTab();
            createCardNameFilterForCardTab();
            createPeriodFilterForCardTab();

            var scriptElement = document.createElement('script');
            scriptElement.setAttribute('src', '../static/js/bootstrap.bundle.js');
            document.body.appendChild(scriptElement);
        },
        complete: function () {
            $('.page-loader-div').css("visibility", "hidden");
            var scriptEle = document.createElement("script");
            scriptEle.setAttribute("src", "../static/js/bootstrap.bundle.js");
            document.body.appendChild(scriptEle);
            var scriptEle = document.createElement("script");
            scriptEle.setAttribute("src", "../static/js/myCCDashboard.js");
            document.body.appendChild(scriptEle);
        },
        error: (e) => {
            alert('Error: ' + e.responseText);
            console.log(JSON.parse(e.responseText))
        }
    });
})