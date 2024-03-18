var filterStateMapForCardsData = new Map();
filterStateMapForCardsData.set('bankName', ['All']);
filterStateMapForCardsData.set('cardName', ['All']);
filterStateMapForCardsData.set('cardType', ['All']);
filterStateMapForCardsData.set('period', moment(new Date(Math.max(...cardsData.map(row => new Date(row.Date))))).format('MMM YYYY'));
filterStateMapForCardsData.set('status', ['All']);

function setfilterStateMapForCardsData(filterName, filterValue) {
    filterStateMapForCardsData.set(filterName, filterValue);
};

function filterDataForCardsData() {
    var newData = cardsData;
    var bankName = filterStateMapForCardsData.get('bankName');
    var cardName = filterStateMapForCardsData.get('cardName');
    var cardType = filterStateMapForCardsData.get('cardType');
    var month = filterStateMapForCardsData.get('period');
    var status = filterStateMapForCardsData.get('status');
    if (!bankName.includes('All')) {
        newData = newData.filter((row) => {
            return bankName.includes(row.CreditCard.split(' ')[0].trim());
        });
    }
    if (!cardName.includes('All')) {
        newData = newData.filter((row) => {
            return cardName.includes(row.CreditCard);
        });
    }
    if (!cardType.includes('All')) {
        newData = newData.filter((row) => {
            return cardType.includes(row.CardType);
        });
    }
    newData = newData.filter((row) => row.monthFormatted == month);
    if (!status.includes('All')) {
        newData = newData.filter((row) => {
            return status.includes(row.Status);
        });
    }
    agGridApiCards.setGridOption('rowData', newData);
    plotChartForCardsTab(true, cardsData.filter((row) => row.monthFormatted == month));
    // Set all local variables to null
    newData = null;
    bankName = null;
    cardName = null;
    cardType = null;
    month = null;
    status = null;
};

function plotChartForCardsTab(isfiltered = false, filteredData = null) {
    if (!isfiltered) {
        filteredData = cardsData;
    }
    latestDate = moment(new Date(Math.max(...filteredData.map(row => new Date(row.Date))))).format('MMM YYYY');
    filteredData = filteredData.filter((row) => {
        return row.monthFormatted == latestDate;
    });
    // Total Spends for latest month
    var totalSpends = filteredData.map(row => row.BillAmount).reduce((a, b) => a + b, 0);
    document.getElementById('total-spend-latest-mmonth').innerHTML = `<div class="row justify-content-center align-self-center mx-2">
                                                                        <p class="badge rounded-pill text-bg-success" style="font-size: 1.4rem;">Total Spend</p>
                                                                        <p class="badge rounded-pill text-bg-light" style="font-size: 1.3rem;">${latestDate}</p>
                                                                        <p class="badge rounded-pill text-bg-primary" style="font-size: 1.15rem;">₹ ${totalSpends.toFixed(0)}</p>
                                                                    </div>`;
    var totalNoOfCards = [...new Set(filteredData.map(row => row.CreditCard))].length;
    var avgSpendPerCard = totalSpends / totalNoOfCards;
    document.getElementById('avg-spend-per-card-latest-month').innerHTML = `<div class="row justify-content-center align-self-center mx-2">
                                                                            <p class="badge rounded-pill text-bg-success" style="font-size: 1.4rem;">Avg. Spend/Card</p>
                                                                            <p class="badge rounded-pill text-bg-light" style="font-size: 1.3rem;">${latestDate}</p>
                                                                            <p class="badge rounded-pill text-bg-warning" style="font-size: 1.15rem;">₹ ${avgSpendPerCard.toFixed(0)}</p>
                                                                        </div>`;


    // Spend Month Wise
    var spendMonthWise = [];
    var months = [...new Set(cardsData.map(row => row.monthFormatted))];
    for (var i = 0; i < months.length; i++) {
        var monthData = cardsData.filter((row) => {
            return row.monthFormatted == months[i];
        });
        var monthSpends = monthData.map(row => row.BillAmount).reduce((a, b) => a + b, 0);
        spendMonthWise.push(monthSpends);
    }
    var trace = {
        x: months.map((val, index) => index + 1),
        y: spendMonthWise,
        mode: 'lines',
        line: {
            color: 'rgba(219, 64, 82, 1.0)',
            width: 3,
        }
    }
    var spendMonthWiseData = [trace];
    var layout = {
        title: '',
        xaxis: {
            title: `${latestDate.split(' ')[1]}`, tickangle: -45, showgrid: false,
            tickmode: "array",
            tickvals: months.map((val, index) => index + 1),
            ticktext: months.map(val => val.split(' ')[0]),
            tickangle: 0,
        },
        yaxis: { title: '', zeroline: false, gridwidth: 2, showgrid: false },
        showlegend: false,
        margin: { "t": 50, "b": 50, "l": 50, "r": 50 },
    }
    var config = {displayModeBar: false};
    Plotly.newPlot('spend-month-wise', spendMonthWiseData, layout, config);


    // Top 5 Spends by Cards
    var names = [filteredData.map(row => row.CreditCard)][0];
    var billAmount = [filteredData.map(row => row.BillAmount)][0];
    var sortedBillAmount = [...billAmount];
    sortedBillAmount.sort((a, b) => { return b - a });
    var sortedNames = [];
    for (var i = 0; i < sortedBillAmount.length; i++) {
        var index = billAmount.indexOf(sortedBillAmount[i]);
        sortedNames.push(names[index]);
    }
    var x = sortedNames.slice(0, 5);
    var y = sortedBillAmount.slice(0, 5);
    var trace1 = {
        x: x,
        y: y,
        name: latestDate,
        type: 'bar',
        marker: {
            color: 'rgba(50,171, 96, 0.7)',
            line: {
                color: 'rgba(50,171,96,1.0)',
                width: 2
            }
        },
        text: y.map(Math.ceil).map(String),
        textposition: 'outside',
    };
    var top10SpendsData = [trace1];
    var layout = {
        title: {
            text: `Top 5 Spends by Card for ${latestDate}`,
            font: {
                family: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                size: 20,
                weight: 'bold',
            },
            xref: 'paper',
            x: 0.05,
        },
        xaxis: {
            title: '', tickangle: -45, showgrid: false,
            tickmode: "array",
            tickvals: x,
            ticktext: x.map(val => val.length > 10 ? val.slice(0, 10) + '...' : val),
        },
        yaxis: { title: '', zeroline: false, gridwidth: 2, range: [0, Math.max(...y) + parseInt(Math.max(...y) * 0.4)], showgrid: false },
        barcornerradius: 15,
        showlegend: false,
        margin: { "t": 50, "b": 100, "l": 50, "r": 50 },
    };
    Plotly.newPlot('card-wise-spends', top10SpendsData, layout, config);


    // Top 5 Spends by Banks
    var bankTypes = [...new Set(filteredData.map(row => row.CreditCard == 'OneCard' ? 'OneCard' : row.CreditCard.split(' ')[0]))];
    var bankWiseSpends = [];
    for (var i = 0; i < bankTypes.length; i++) {
        var bankTypeData = filteredData.filter((row) => {
            return row.CreditCard == 'OneCard' ? 'OneCard' : row.CreditCard.split(' ')[0] == bankTypes[i];
        });
        var bankTypeSpends = bankTypeData.map(row => row.BillAmount).reduce((a, b) => a + b, 0);
        bankWiseSpends.push(bankTypeSpends);
    }
    var sortedSpends = [...bankWiseSpends];
    sortedSpends.sort((a, b) => { return b - a });
    var sortedBankTypes = [];
    for (var i = 0; i < sortedSpends.length; i++) {
        var index = bankWiseSpends.indexOf(sortedSpends[i]);
        sortedBankTypes.push(bankTypes[index]);
    }
    sortedBankTypes = sortedBankTypes.slice(0, 5);
    sortedSpends = sortedSpends.slice(0, 5);
    var trace3 = {
        x: sortedBankTypes,
        y: sortedSpends,
        type: 'bar',
        marker: {
            color: 'rgba(219, 64, 82, 0.7)',
            line: {
                color: 'rgba(219, 64, 82, 1.0)',
                width: 2
            }
        },
        text: sortedSpends.map(Math.ceil).map(String),
        textposition: 'outside',
    };
    var bankWiseSpendsData = [trace3];
    var layout = {
        title: {
            text: `Top 5 Spends by Bank for ${latestDate}`,
            font: {
                family: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                size: 20,
                weight: 'bold',
            },
            xref: 'paper',
            x: 0.05,
        },
        xaxis: { title: '', tickangle: -45, showgrid: false },
        yaxis: { title: '', zeroline: false, gridwidth: 2, range: [0, Math.max(...sortedSpends) + parseInt(Math.max(...sortedSpends) * 0.4)], showgrid: false },
        barcornerradius: 15,
        showlegend: false,
        margin: { "t": 50, "b": 100, "l": 50, "r": 50 },
    };
    Plotly.newPlot('bank-wise-spends', bankWiseSpendsData, layout, config);


    // Card Type Wise Spends
    var cardTypes = [...new Set(filteredData.map(row => row.CardType))];
    var cardTypeWiseSpends = [];
    for (var i = 0; i < cardTypes.length; i++) {
        var cardTypeData = filteredData.filter((row) => {
            return row.CardType == cardTypes[i];
        });
        var cardTypeSpends = cardTypeData.map(row => row.BillAmount).reduce((a, b) => a + b, 0);
        cardTypeWiseSpends.push(cardTypeSpends);
    }
    var sortedSpends = [...cardTypeWiseSpends];
    sortedSpends.sort((a, b) => { return b - a });
    var sortedCardTypes = [];
    for (var i = 0; i < sortedSpends.length; i++) {
        var index = cardTypeWiseSpends.indexOf(sortedSpends[i]);
        sortedCardTypes.push(cardTypes[index]);
    }
    var trace2 = {
        labels: sortedCardTypes,
        values: sortedSpends.map(Math.ceil),
        type: 'pie',
        textinfo: "label+percent+value",
        textposition: 'outside',
        automargin: true,
    };
    var cardTypeWiseSpendsData = [trace2];
    var layout = {
        title: {
            text: `Card Type Wise Spends for ${latestDate}`,
            font: {
                family: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                size: 20,
                weight: 'bold',
            },
            xref: 'paper',
            x: 0.05,
        },
        margin: { "t": 50, "b": 100, "l": 50, "r": 50},
        showlegend: false
    };
    Plotly.newPlot('card-type-wise-spends', cardTypeWiseSpendsData, layout, config);


    // Set all local variables to null
    latestDate = null;
    filteredData = null;
    totalSpends = null;
    totalNoOfCards = null;
    avgSpendPerCard = null;
    names = null;
    billAmount = null;
    sortedBillAmount = null;
    sortedNames = null;
    x = null;
    y = null;
    trace1 = null;
    top10SpendsData = null;
    cardTypes = null;
    cardTypeWiseSpends = null;
    sortedSpends = null;
    sortedCardTypes = null;
    trace2 = null;
    cardTypeWiseSpendsData = null;
    bankTypes = null;
    bankWiseSpends = null;
    sortedSpends = null;
    sortedBankTypes = null;
    trace3 = null;
    bankWiseSpendsData = null;
    layout = null;
    spendMonthWise = null;
    months = null;
    trace = null;
    spendMonthWiseData = null;
    config = null;
};

$(document).ready(() => {
    // Cards Tab Filters
    filterDataForCardsData();

    // Bank Name
    // Checking/ Uncheking 'All' will check/ uncheck all the bank names
    'click change'.split(' ').forEach((event) => {
        if (event == 'click') {
            document.getElementById('bank-name-all').addEventListener(event, () => {
                if (document.getElementById('bank-name-all').checked) {
                    document.querySelectorAll('#bank-name').forEach((el) => {
                        el.checked = true;
                    });
                }
                else {
                    document.querySelectorAll('#bank-name').forEach((el) => {
                        el.checked = false;
                    });
                }
            });
        }
    });
    // Checking/ Uncheking any other bank name will check if all the bank names are checked or not and will check/ uncheck 'All' accordingly
    'click change'.split(' ').forEach((event) => {
        if (event == 'click') {
            document.querySelectorAll('#bank-name').forEach((el) => {
                el.addEventListener(event, () => {
                    let allChecked = true;
                    document.querySelectorAll('#bank-name').forEach((el) => {
                        if (!el.checked) {
                            allChecked = false;
                        }
                    });
                    document.getElementById('bank-name-all').checked = allChecked;
                });
            });
        }
    });
    // Apply button filters data based on the selected checkboxes
    document.getElementById('bank-name-apply-button').addEventListener('click', () => {
        if (document.getElementById('bank-name-all').checked) {
            var bankName = ['All'];
            document.getElementById('bank-name-dropdown-button').innerHTML = '<strong>Bank Name:</strong> All';
        }
        else {
            var bankName = [];
            document.querySelectorAll('#bank-name').forEach((el) => {
                if (el.checked) {
                    bankName.push(el.parentElement.parentElement.innerText.trim());
                }
            });
            document.getElementById('bank-name-dropdown-button').innerHTML = `<strong>Bank Name:</strong> ${bankName.length > 1 ? bankName.length + ' Selected' : bankName[0]}`;
        }
        setfilterStateMapForCardsData('bankName', bankName);
        filterDataForCardsData();
        document.getElementById('bank-name-dropdown-button').classList.remove('show');
        document.getElementById('bank-name-dropdown-button').setAttribute('aria-expanded', 'false');
        document.getElementById('bank-name-dropdown-menu').classList.remove('show');
    });

    // Card Name
    // Checking/ Uncheking 'All' will check/ uncheck all the card names
    'click change'.split(' ').forEach((event) => {
        if (event == 'click') {
            document.getElementById('card-name-all').addEventListener(event, () => {
                if (document.getElementById('card-name-all').checked) {
                    document.querySelectorAll('#card-name').forEach((el) => {
                        el.checked = true;
                    });
                }
                else {
                    document.querySelectorAll('#card-name').forEach((el) => {
                        el.checked = false;
                    });
                }
            });
        }
    });
    // Checking/ Uncheking any other card name will check if all the card names are checked or not and will check/ uncheck 'All' accordingly
    'click change'.split(' ').forEach((event) => {
        if (event == 'click') {
            document.querySelectorAll('#card-name').forEach((el) => {
                el.addEventListener(event, () => {
                    let allChecked = true;
                    document.querySelectorAll('#card-name').forEach((el) => {
                        if (!el.checked) {
                            allChecked = false;
                        }
                    });
                    document.getElementById('card-name-all').checked = allChecked;
                });
            });
        }
    });
    // Apply button filters data based on the selected checkboxes
    document.getElementById('card-name-apply-button').addEventListener('click', () => {
        if (document.getElementById('card-name-all').checked) {
            var cardName = ['All'];
            document.getElementById('card-name-dropdown-button').innerHTML = '<strong>Card Name:</strong> All';
        }
        else {
            var cardName = [];
            document.querySelectorAll('#card-name').forEach((el) => {
                if (el.checked) {
                    cardName.push(el.parentElement.parentElement.innerText.trim());
                }
            });
            document.getElementById('card-name-dropdown-button').innerHTML = `<strong>Card Name:</strong> ${cardName.length > 1 ? cardName.length + ' Selected' : cardName[0]}`;
        }
        setfilterStateMapForCardsData('cardName', cardName);
        filterDataForCardsData();
        document.getElementById('card-name-dropdown-button').classList.remove('show');
        document.getElementById('card-name-dropdown-button').setAttribute('aria-expanded', 'false');
        document.getElementById('card-name-dropdown-menu').classList.remove('show');
    });

    //Card Type
    // Checking/ Uncheking 'All' will check/ uncheck all the card types
    'click change'.split(' ').forEach((event) => {
        if (event == 'click') {
            document.getElementById('card-type-all').addEventListener(event, () => {
                if (document.getElementById('card-type-all').checked) {
                    document.querySelectorAll('#card-type').forEach((el) => {
                        el.checked = true;
                    });
                }
                else {
                    document.querySelectorAll('#card-type').forEach((el) => {
                        el.checked = false;
                    });
                }
            });
        }
    });
    // Checking/ Uncheking any other card type will check if all the card types are checked or not and will check/ uncheck 'All' accordingly
    'click change'.split(' ').forEach((event) => {
        if (event == 'click') {
            document.querySelectorAll('#card-type').forEach((el) => {
                el.addEventListener(event, () => {
                    let allChecked = true;
                    document.querySelectorAll('#card-type').forEach((el) => {
                        if (!el.checked) {
                            allChecked = false;
                        }
                    });
                    document.getElementById('card-type-all').checked = allChecked;
                });
            });
        }
    });
    // Apply button filters data based on the selected checkboxes
    document.getElementById('card-type-apply-button').addEventListener('click', () => {
        if (document.getElementById('card-type-all').checked) {
            var cardType = ['All'];
            document.getElementById('card-type-dropdown-button').innerHTML = '<strong>Card Type:</strong> All';
        }
        else {
            var cardType = [];
            document.querySelectorAll('#card-type').forEach((el) => {
                if (el.checked) {
                    cardType.push(el.parentElement.parentElement.innerText.trim());
                }
            });
            document.getElementById('card-type-dropdown-button').innerHTML = `<strong>Card Type:</strong> ${cardType.join(', ')}`;
        }
        setfilterStateMapForCardsData('cardType', cardType);
        filterDataForCardsData();
        document.getElementById('card-type-dropdown-button').classList.remove('show');
        document.getElementById('card-type-dropdown-button').setAttribute('aria-expanded', 'false');
        document.getElementById('card-type-dropdown-menu').classList.remove('show');
    });

    // Period
    // Apply button filters data based on the selected radio button
    document.querySelectorAll('input[type=radio][name=periodFlexRadioDefault]').forEach((el) => {
        el.addEventListener('change', () => {
            setfilterStateMapForCardsData('period', el.parentElement.parentElement.innerText.trim());
            filterDataForCardsData();
            document.getElementById('period-dropdown-button').innerHTML = `<strong>Month:</strong> ${el.parentElement.parentElement.innerText.trim()}`;
            document.getElementById('period-dropdown-button').classList.remove('show');
            document.getElementById('period-dropdown-button').setAttribute('aria-expanded', 'false');
            document.getElementById('period-dropdown-menu').classList.remove('show');
        });
    });

    // Status
    // Checking/ Uncheking 'All' will check/ uncheck all the statuses
    'click change'.split(' ').forEach((event) => {
        if (event == 'click') {
            document.getElementById('status-all').addEventListener(event, () => {
                if (document.getElementById('status-all').checked) {
                    document.querySelectorAll('#status').forEach((el) => {
                        el.checked = true;
                    });
                }
                else {
                    document.querySelectorAll('#status').forEach((el) => {
                        el.checked = false;
                    });
                }
            });
        }
    });
    // Checking/ Uncheking any other status will check if all the statuses are checked or not and will check/ uncheck 'All' accordingly
    'click change'.split(' ').forEach((event) => {
        if (event == 'click') {
            document.querySelectorAll('#status').forEach((el) => {
                el.addEventListener(event, () => {
                    let allChecked = true;
                    document.querySelectorAll('#status').forEach((el) => {
                        if (!el.checked) {
                            allChecked = false;
                        }
                    });
                    document.getElementById('status-all').checked = allChecked;
                });
            });
        }
    });
    // Apply button filters data based on the selected checkboxes
    document.getElementById('status-apply-button').addEventListener('click', () => {
        if (document.getElementById('status-all').checked) {
            var status = ['All'];
            document.getElementById('status-dropdown-button').innerHTML = '<strong>Status:</strong> All';
        }
        else {
            var status = [];
            document.querySelectorAll('#status').forEach((el) => {
                if (el.checked) {
                    status.push(el.parentElement.parentElement.innerText.trim());
                }
            });
            document.getElementById('status-dropdown-button').innerHTML = `<strong>Status:</strong> ${status.join(', ')}`;
        }
        setfilterStateMapForCardsData('status', status);
        filterDataForCardsData();
        document.getElementById('status-dropdown-button').classList.remove('show');
        document.getElementById('status-dropdown-button').setAttribute('aria-expanded', 'false');
        document.getElementById('status-dropdown-menu').classList.remove('show');
    });

    // Clear All Filters
    document.getElementById('display-options-dropdown-menu-cards').querySelectorAll('li div').forEach((el) => {
        if (el.innerText == 'Clear Filters') {
            el.addEventListener('click', () => {
                document.getElementById('bank-name-all').checked = true;
                document.querySelectorAll('#bank-name').forEach((el) => {
                    el.checked = true;
                });
                document.getElementById('bank-name-dropdown-button').innerHTML = '<strong>Bank Name:</strong> All';
                document.getElementById('card-name-all').checked = true;
                document.querySelectorAll('#card-name').forEach((el) => {
                    el.checked = true;
                });
                document.getElementById('card-name-dropdown-button').innerHTML = '<strong>Card Name:</strong> All';
                document.getElementById('card-type-all').checked = true;
                document.querySelectorAll('#card-type').forEach((el) => {
                    el.checked = true;
                });
                document.getElementById('card-type-dropdown-button').innerHTML = '<strong>Card Type:</strong> All';
                // document.getElementById('month-all').checked = true;
                // document.querySelectorAll('#month').forEach((el) => {
                //     el.checked = true;
                // });
                // document.getElementById('month-dropdown-button').innerHTML = '<strong>Month:</strong> All';
                document.getElementById('status-all').checked = true;
                document.querySelectorAll('#status').forEach((el) => {
                    el.checked = true;
                });
                document.getElementById('status-dropdown-button').innerHTML = '<strong>Status:</strong> All';
                filterStateMapForCardsData.set('bankName', ['All']);
                filterStateMapForCardsData.set('cardName', ['All']);
                filterStateMapForCardsData.set('cardType', ['All']);
                // filterStateMapForCardsData.set('month', ['All']);
                filterStateMapForCardsData.set('status', ['All']);
                filterDataForCardsData();
            });
        }
    });
});