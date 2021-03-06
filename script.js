console.log("Assignment 3");

//Set up drawing environment with margin conventions
var margin = {t:20,r:20,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.l - margin.r,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width + margin.l + margin.r)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plot-area')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Initialize axes
//Consult documentation here https://github.com/mbostock/d3/wiki/SVG-Axes
var scaleX,scaleY;

var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(-height)
    .tickValues([10000,50000,100000]);
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width)
    .tickValues([0,25,50,75,100]);

//var axisX;
//var axisY;


//Start importing data
d3.csv('/data/world_bank_2012.csv', parse, dataLoaded);

function parse(d){

    //Eliminate records for which gdp per capita isn't available

    /*(boolean value) ? a : b
     If boolean value is true, return a; otherwise, return b.*/

    if(d['GDP per capita, PPP (constant 2011 international $)']=='..'){
        return;
    }

    //Check "primary completion" and "urban population" columns
    //if figure is unavailable and denoted as "..", replace it with undefined
    //otherwise, parse the figure into numbers


    return {
        cName: d['Country Name'],
        cCode: d['Country Code'],
        gdpPerCap: d['GDP per capita, PPP (constant 2011 international $)']!='..'?+d['GDP per capita, PPP (constant 2011 international $)']:undefined,
        primaryCompletion: d['Primary completion rate, total (% of relevant age group)']!='..'?+d['Primary completion rate, total (% of relevant age group)']:undefined,
        urbanPop: d['Urban population (% of total)']!='..'?+d['Urban population (% of total)']:undefined

    };
}

function dataLoaded(error, rows){
    //with data loaded, we can now mine the data
    var gdpPerCapMin = d3.min(rows, function(d){return d.gdpPerCap}),
        gdpPerCapMax = d3.max(rows, function(d){return d.gdpPerCap}),
        primaryCompletionMax = d3.max(rows, function(d){return d.primaryCompletion}),
        urbanPopMax = d3.max(rows, function(d){return d.urbanPop});

    console.log(gdpPerCapMin);
    console.log(gdpPerCapMax);
    console.log(primaryCompletionMax);
    console.log(urbanPopMax);

    //with mined information, set up domain and range for x and y scales
    //Log scale for x, linear scale for y
    //scaleX = d3.scale.log()...
    scaleX = d3.scale.log().domain([gdpPerCapMin,gdpPerCapMax]).range([0,width]),
        scaleY = d3.scale.linear().domain([0,150]).range([height,0]);


    //Draw axisX and axisY
    axisX.scale(scaleX);
    axisY.scale(scaleY);

    plot.append('g')
        .attr('class','axis axis-x')
        .attr('transform','translate(0,'+height+')')
        .call(axisX);

    plot.append('g')
        .attr('class','axis axis-y')
        .call(axisY);



    //draw <line> elements to represent countries
    //each country should have two <line> elements, nested under a common <g> element

    var countries = plot.selectAll('.country')//this return an empty selection
        .data(rows)//we are creating a one to one relationship between <circle> and an element in array
        .enter()//
        .append('g')
        .attr('class','country')//"countries variable holds a selection of 188 <g> elements

    countries
        .append('line')
        .attr('x1',function(d){
            return scaleX(d.gdpPerCap)
        })
        .attr('y1',height)
        .attr('x2',function(d){
            return scaleX(d.gdpPerCap)
        })
        .attr('y2',function(d){
            if (d.primaryCompletion == undefined) {
                return height;
            } else {
                return scaleY(d.primaryCompletion);
            }
        })
        .style('stroke','hsl(0,80%,80%)')
        .style('stroke-width','1px')


    countries
     .append('line')
       .attr('x1',function(d){
           return scaleX(d.gdpPerCap)
        })
        .attr('y1',height)
        .attr('x2',function(d){
            return scaleX(d.gdpPerCap)
        })
        .attr('y2',function(d){
            if (d.urbanPop == undefined) {
                return height;
            } else {
                return scaleY(d.urbanPop);
            }
        })
        .style('stroke','hsl(200,80%,80%')
        .style('stroke-width','1px')



}

