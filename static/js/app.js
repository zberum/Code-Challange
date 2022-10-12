// columns used for dynaimcally loading columns in table
var columns = ["Name", "Nationality" , "National_Position" , "Club", "Height", "Preffered_Foot", "Rating", "Speed"]
var count = 0;

// used to add dropdown of remaining columns
var add_dropdown =  function () {
    fetch('/player?name=Lionel Messi', { method: 'GET' })
        .then(function (response) { return response.json(); })
        .then(function (data) { return callback(data); })
        .catch(function (error) { return console.log(error); });
};

// callback of dropdown
var callback =  function (data) {
    var options = ""
    let keys = Object.keys(data)
    keys.forEach(function (item, index) {
        if( !columns.includes(item) )
            options+=`<option value="${item}">${item}</option>`
    });
    console.log(columns)

   if( count == 0)
        addColumnsData(options)
    else
        appendColumnsData(options)
    count++;
    
};

// used to add dynamically dropdown for removing columns
function remove_dropdown(){
    var options = ""
    columns.forEach(function (item, index) {
        options+=`<option value="${item}">${item}</option>`
    });
    console.log("here")
    document.getElementById('dropdown').innerHTML
        =`<form id="remove_main">
            <label>Remove Column: </label>
            <select name="columns" id="columns" onChange="removeColumn(this)">
                <option disabled selected>---Select Column---</option>
                ${options}
            </select>
        </form>`
}

// used to append 
function addColumnsData(options){
    document.getElementById('root').innerHTML
        += 
        `<div id="form-div"><form id="main">
            <label>Select Column: </label>
            <select name="columns" id="columns" onChange="leaveChange(this)">
                <option disabled selected>---Add Column---</option>
                ${options}
            </select>
        </form></div>`;
}
function appendColumnsData(options){
    document.getElementById('root').innerHTML
        = 
        `<div id="form-div"><form onSubmit()>
            <label>Select Column: </label>
            <select name="columns" id="columns" onChange="leaveChange(this)">
                <option disabled selected>---Add Column---</option>
                ${options}
            </select>
        </form></div>`;
}

// get players information for table
var get_player_data = function(){
    fetch('/players', { method: 'GET' })
        .then(function (response) { return response.json(); })
        .then(function (data) { return set_player_data(data); })
        .catch(function (error) { return console.log(error); });
}

// sets histogram and players data in the table
var set_player_data = function(data){
    
    showHistogram(data)
    
    let return_data = ""
    let column_names = ""
    columns.forEach(function (item, index) {
        column_names+=`<th>${item}</th>`
    });
    data.map(( values ) => {
        return_data+=`<tr>
            ${getColumnValues(values)}
        </tr>`
    })
   
    console.log(column_names)
    document.getElementById('root').innerHTML
        +=`<table id="dataTable" class="styled-table">
        <thead>
            <tr>${column_names}</tr>
        </thead><tbody>
        ${return_data}
        </tbody></table>`;

    
    setTimeout(() => {
        addRowHandlers()
        sortHeaders()
    }, 2000) 
}

function showHistogram(data){

    const DUMMY_DATA =data;
    console.log(DUMMY_DATA)

    const MARGINS = {top: 20, bottom: 10}
    const CHART_WIDTH = 1200;
    const CHART_HEIGHT = 1200 - MARGINS.top - MARGINS.bottom

    const x = d3.scaleBand()
        .rangeRound([0, CHART_WIDTH])
        .padding(0.1)

    const y = d3.scaleLinear()
        .range([CHART_HEIGHT, 0])

    x.domain(DUMMY_DATA.map( (d) => d.Nationality))
    y.domain([0, d3.max(DUMMY_DATA, d => d.Rating) + 3])


    const chartContainer = d3.select('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom)
    
    const chart = chartContainer.append('g')

    chart.append('g')
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .attr('transform', `translate(0, ${CHART_HEIGHT -5 })`)
        .attr('color','#4f009e');

    chart.selectAll('.bar')
        .data(DUMMY_DATA)    
        .enter()
        .append('rect')
        .classed('bar',true)
        .attr('width', x.bandwidth())
        .attr('height', data => CHART_HEIGHT - y(data.Rating))
        .attr('x', data => x(data.Nationality))
        .attr('y', data => y(data.Rating))

    chart.selectAll('.label')
        .data(DUMMY_DATA)
        .enter()
        .append('text')
        .text((data) => data.Rating )
        .attr('x', data => x(data.Nationality) + x.bandwidth() / 2)
        .attr('y', data => y(data.Rating) - 20)
        .attr('text-anchor', 'middle')
        .classed('label', true)

}

// return rows for table
function getColumnValues(values){
    let columnn_row_values = ""
    columns.forEach( (value, index) => {
        columnn_row_values+= `<td>${values[value]}</td>`
    })
    return columnn_row_values
}

// on change of add column 
function leaveChange(control) {
    console.log("selected value is "+control.value)
    columns.push(control.value)
    add_dropdown()
    get_player_data()
    remove_dropdown()
}

// on change of remove column
function removeColumn(control){
    console.log("selected value is "+control.value)
    let index = columns.indexOf(control.value)
    columns.splice(index,1)
    add_dropdown()
    get_player_data()
    remove_dropdown()
}

// row handler
function addRowHandlers() {
   
    var table = document.getElementById("dataTable");
    console.log(table)
    var tableBody = table.querySelector("tbody")
    var rows = tableBody.querySelectorAll('tr');
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = 
            function(row) 
            {
                return function() { 
                    var cell = row.getElementsByTagName("td")[0];
                    console.log(cell)
                    let name = cell.innerHTML
                        document.getElementById("playerName").innerHTML = `<p>Player Name : ${name}</p>`
                        console.log(cell)
                        window.scrollTo(0, document.body.scrollHeight - 1500);

                    };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}

// sorting handler
function sortHeaders(){
    const table = document.getElementById('dataTable');

    // Query the headers
    const headers = table.querySelectorAll('th');

    // Loop over the headers
    [].forEach.call(headers, function (header, index) {
        header.addEventListener('click', function () {
            // This function will sort the column
            console.log(header);
            sortColumn(index);
        });
    });

}


const sortColumn = function (index) {
    const tableBody = document.getElementById('dataTable').querySelector('tbody');
    const rows = tableBody.querySelectorAll('tr');
    // Clone the rows
    const newRows = Array.from(rows);

    // Sort rows by the content of cells
    newRows.sort(function (rowA, rowB) {
        // Get the content of cells
        const cellA = rowA.querySelectorAll('td')[index].innerHTML;
        const cellB = rowB.querySelectorAll('td')[index].innerHTML;

        switch (true) {
            case cellA > cellB:
                return 1;
            case cellA < cellB:
                return -1;
            case cellA === cellB:
                return 0;
        }
    });

    // Remove old rows
    [].forEach.call(rows, function (row) {
        tableBody.removeChild(row);
    });

    // Append new row
    newRows.forEach(function (newRow) {
        tableBody.appendChild(newRow);
    });
};


// starting calls
document.addEventListener('DOMContentLoaded', fn, false);

function fn() {
    add_dropdown()
    get_player_data()
    remove_dropdown()   
}
 
