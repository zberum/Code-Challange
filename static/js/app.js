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
 
    const DUMMY_DATA =data;
    
    const xScale = d3
        .scaleBand()
        .domain(DUMMY_DATA.map((dataPoint) => dataPoint.Name))
        .rangeRound([0, 1000])
        .padding(0.1);
    const yScale = d3.scaleLinear().domain([0, 100]).range([600, 0]);
    
    const container = d3.select('svg').classed('container', true);
    
    const bars = container
        .selectAll('.bar')
        .data(DUMMY_DATA)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', xScale.bandwidth())
        .attr('height', (data) => 600 - yScale(data.Rating))
        .attr('x', data => xScale(data.Name))
        .attr('y', data => yScale(data.Rating));
    
    
    
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
        +=`<table class="styled-table">
        <thead>
            <tr>${column_names}</tr>
        </thead><tbody>
        ${return_data}
        </tbody></table>`;
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

// starting calls
add_dropdown();
get_player_data();
remove_dropdown();