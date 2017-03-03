d3.csv("data.csv", function(data){

  // a little helper function to change the color of the dots
  function color(id, v, f){

    dots.style("fill", function(d){return f(d[v])})
    dots.style("opacity", 1)

    d3.selectAll("button")
      .classed("button-primary", false);

    d3.select(id)
      .classed("button-primary", true);
  }

  data = data.map(function(d){
    d.PC1 = parseFloat(d.PC1);
    d.PC2 = parseFloat(d.PC2);
    d.days_to_death = parseFloat(d.days_to_death);
    d.case_id = parseInt(d.case_id);
    return d
  });

  console.log(data)

  var codes = _.uniq(data.map(function(d){
    return d.disease_code
  }));

  var sites = _.uniq(data.map(function(d){
    return d.site
  }));

  var statuses = _.uniq(data.map(function(d){
    return d.vital_status
  }));

  var margin = {top: 50, right: 5, bottom: 5, left: 5},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var zoom = d3.zoom()
    .scaleExtent([-8, 8])
    .on("zoom", function(){
      svg.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')')
    });

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Case ID:</strong> " + d.case + "<br/>" +
             "<strong>Disease Code:</strong> " + d.disease_code + "<br/>" +
             "<strong>Site:</strong> " + d.site + "<br/>" +
             "<strong>Status:</strong> " + d.vital_status;
    })

  var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(zoom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .append("g")

  svg.call(tip);

  svg.append("rect")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", "100%")
    .attr("height", "100%");

  var x = d3.scaleLinear()
    .domain([
      d3.min(data, function(d){return d.PC1}),
      d3.max(data, function(d){return d.PC1})
    ])
    .range([0, width])

  var y = d3.scaleLinear()
    .domain([
      d3.min(data, function(d){return d.PC2}),
      d3.max(data, function(d){return d.PC2})
    ])
    .range([height, 0])

  var site = d3.scaleOrdinal()
    .domain(sites)
    .range(d3.schemeCategory20)

  var code = d3.scaleOrdinal()
    .domain(codes)
    .range(d3.schemeCategory20)

  var status = d3.scaleOrdinal()
    .domain(statuses)
    .range(["#3288bd", "#d53e4f"])

  var days = d3.scaleLinear()
    .domain([
      d3.max(data, function(d){return d.days_to_death}),
      d3.min(data, function(d){return d.days_to_death})
    ])
    .range(["#d53e4f", "#3288bd"])

  var dots = svg.selectAll("circle")
    .data(data, function(d){return d.case_id})
    .enter()
  .append("circle")
    .attr("cx", function(d){return x(d.PC1)})
    .attr("cy", function(d){return y(d.PC2)})
    .attr("r", 1)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  d3.select("#code")
    .on("click", function(){
      color("#code", 'disease_code', code)
    })

  d3.select("#site")
    .on("click", function(){
      color("#site", 'site', site)
    })

  d3.select("#status")
    .on("click", function(){
      color("#status", 'vital_status', status)
    })

  d3.select("#days")
    .on("click", function(){
      dots.style("fill", function(d){
        return isNaN(d.days_to_death) ? "white" : days(d.days_to_death)
      })
      dots.style("opacity", function(d){
        return isNaN(d.days_to_death) ? 0 : 1
      })

      d3.selectAll("button").classed("button-primary", false)
      d3.select("#days").classed("button-primary", true)

    })

    color("#code", 'disease_code', code)

})
