//////////////////////////////////////////
// First Graphic Suspension Line Chart //
//////////////////////////////////////////

var susLineChart_months,
    susLineChart_monthKeys,
    susLineChart_monthParse = d3.timeParse("%Y");

var susLineChart_svg = d3.select(".vorLineChart svg svg"),
    susLineChart_margin = {top: 60, right: 30, bottom: 30, left: 40},
    susLineChart_width = susLineChart_svg.attr("width") - susLineChart_margin.left - susLineChart_margin.right,
    susLineChart_height = susLineChart_svg.attr("height") - susLineChart_margin.top - susLineChart_margin.bottom,
    susLineChart_g = susLineChart_svg.append("g").attr("transform", "translate(" + susLineChart_margin.left + "," + susLineChart_margin.top + ")");

var susLineChart_x = d3.scaleTime()
    .range([0, susLineChart_width]);

var susLineChart_y = d3.scaleLinear()
    .range([susLineChart_height, 0]);

var susLineChart_voronoi = d3.voronoi()
    .x(function(d) { return susLineChart_x(d.date); })
    .y(function(d) { return susLineChart_y(d.value); })
    .extent([[-susLineChart_margin.left, -susLineChart_margin.top], [susLineChart_width + susLineChart_margin.right, susLineChart_height + susLineChart_margin.bottom]]);

var susLineChart_line = d3.line()
    .x(function(d) { return susLineChart_x(d.date); })
    .y(function(d) { return susLineChart_y(d.value); });

d3.csv("https://gist.githubusercontent.com/JesseCHowe/8cf49494978a39ce938560d6dd664a55/raw/8f3f74e9e0fb6a12fc76fcdb738d914eac7b704f/districtline.csv", susLineChart_type, function(susLineChart_error, susLineChart_data) {
  if (susLineChart_error) throw susLineChart_error;

  susLineChart_x.domain(d3.extent(susLineChart_months));
  susLineChart_y.domain([0, d3.max(susLineChart_data, function(c) { return d3.max(c.values, function(d) { return d.value; }); })]).nice();
  
  //Dot notation at the top of the chart
  susLineChart_g.append("circle")
    .attr("cx", 20)
    .attr("cy", 5)
    .attr("r", 10)
    .style("fill","#d77e7e");
  susLineChart_g.append("text")
    .attr("x", 40)
    .attr("y", 5)
    .attr("class","lineGraph_desc")
    .attr("dy", ".35em")
    .text("School Districts with high black suspension rates in 2011");
  
  susLineChart_g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(susLineChart_y).ticks(4, "%"))
    .append("text")
    .attr("x", 4)
    .attr("y", 0.5)
    .attr("dy", "0.32em")
    .style("text-anchor", "start")
    .style("fill", "#000")
    .style("font-weight", "bold");
  
  var susLineChart_cities = susLineChart_g.append("g")
    .attr("class", "cities")
    .selectAll("path")
    .data(susLineChart_data)
    .enter().append("path")
      .attr("d", function(d) { d.line = this; return susLineChart_line(d.values); })
      .attr("id", function(d) { return d.name.split(" ").join("_") });
  
  //School District Labels
  susLineChart_g.append("text")
    .attr("x", 620)
    .attr("y", 40)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("Hickman Mills");
  susLineChart_g.append("text")
    .attr("x", 740)
    .attr("y", 250)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("KCK");
  susLineChart_g.append("text")
    .attr("x", 290)
    .attr("y", 90)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("KCPS");
  susLineChart_g.append("text")
    .attr("x", 40)
    .attr("y", 190)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("Center");
  susLineChart_g.append("text")
    .attr("x", 480)
    .attr("y", 360)
    .attr("class","labels")
    .attr("dy", ".35em")
    .text("Independence");
  susLineChart_g.append("text")
    .attr("x", 290)
    .attr("y", 385)
    .attr("class","avglabels")
    .attr("dy", ".35em")
    .text("Average");  
  
  var susLineChart_focus = susLineChart_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");
  var susLineChart_focusTwo = susLineChart_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus2");
  var susLineChart_focuscirc = susLineChart_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");
  susLineChart_focuscirc.append("circle")
      .attr("r", 3.5);

  //Voronoi for hover optimization
  var susLineChart_voronoiGroup = susLineChart_g.append("g")
      .attr("class", "voronoi");

  susLineChart_voronoiGroup.selectAll("path")
    .data(susLineChart_voronoi.polygons(d3.merge(susLineChart_data.map(function(d) { return d.values; }))))
    .enter().append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .on("mouseover", susLineChart_mouseover)
      .on("mouseout", susLineChart_mouseout);

  d3.select("#show-voronoi")
    .property("disabled", false)
    .on("change", function() { susLineChart_voronoiGroup.classed("voronoi--show", this.checked); });
  
  susLineChart_g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + susLineChart_height + ")")
    .call(d3.axisBottom(susLineChart_x));

  function susLineChart_mouseover(d) {
    d3.selectAll(".labels").style("opacity",0.15)
    d3.selectAll(".avglabels").style("opacity",0.15)
    d3.selectAll(".cities path").style("opacity",0.15)
    d3.select(d.data.city.line).classed("city--hover", true);
    susLineChart_focus.append("text").attr("y", -10);
    susLineChart_focusTwo.append("text").attr("y", -10); d.data.city.line.parentNode.appendChild(d.data.city.line);
    susLineChart_focuscirc.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + susLineChart_y(d.data.value) + ")");
    susLineChart_focus.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + (susLineChart_y(d.data.value)-50) + ")");
    susLineChart_focusTwo.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + (susLineChart_y(d.data.value)-25)+ ")");
    
    var susLineChart_w = window.innerWidth;
    var susLineChart_h = window.innerHeight;
    
    //Define where text is anchored to keep tooltips on screen
    if (d3.event.pageX < susLineChart_w / 3) {
      susLineChart_focus.select("text").style("text-anchor", "start");
      susLineChart_focusTwo.select("text").style("text-anchor", "start");
    }else if (d3.event.pageX < susLineChart_w / 1.5){
      susLineChart_focus.select("text").style("text-anchor", "middle");
      susLineChart_focusTwo.select("text").style("text-anchor", "middle");
    }else{
      susLineChart_focus.select("text").style("text-anchor", "end");
      susLineChart_focusTwo.select("text").style("text-anchor", "end");
    }
    
    susLineChart_focus.select("text").text(d.data.city.name+", "+d.data.date.getFullYear());
    susLineChart_focusTwo.select("text").text(Math.round(d.data.value * 1000) / 10 + "%");
    
  }

  function susLineChart_mouseout(d) {
    d3.selectAll(".labels").style("opacity",1)
    d3.selectAll(".avglabels").style("opacity",1)
    d3.select(d.data.city.line).classed("city--hover", false);
    d3.selectAll(".cities path").style("opacity",1)
    susLineChart_focuscirc.attr("transform", "translate(-100,-100)");
    susLineChart_focus.attr("transform", "translate(-100,-100)");
    susLineChart_focusTwo.attr("transform", "translate(-100,-100)");
  }

});

function susLineChart_type(d, i, columns) {
  if (!susLineChart_months) susLineChart_monthKeys = columns.slice(1), susLineChart_months = susLineChart_monthKeys.map(susLineChart_monthParse);
  var c = {name: d.name.replace(/ (msa|necta div|met necta|met div)$/i, ""), values: null};
  c.values = susLineChart_monthKeys.map(function(k, i) { return {city: c, date: susLineChart_months[i], value: d[k] / 100}; });
  return c;
}

/*FILTER FUNCTIONS*/
var suspensionMenu = d3.select("#suspensionMenu1 select").on("change", showDistrict1);

function showDistrict1() {
  
  var districtSelection1 = $("#districtSelection1").val();

  d3.selectAll(".cities").remove();
  d3.selectAll(focus).remove();
  d3.selectAll(".voronoi").remove(); 
  d3.selectAll(".labels").remove();
  d3.selectAll(".avglabels").remove();
  d3.selectAll(".axis--x").remove();
  
  if(districtSelection1 === "all"){
       d3.csv("https://gist.githubusercontent.com/JesseCHowe/8cf49494978a39ce938560d6dd664a55/raw/8f3f74e9e0fb6a12fc76fcdb738d914eac7b704f/districtline.csv", susLineChart_type, function(susLineChart_error, susLineChart_data) {
  if (susLineChart_error) throw susLineChart_error;

 var susLineChart_cities = susLineChart_g.append("g")
    .attr("class", "cities")
    .selectAll("path")
    .data(susLineChart_data)
    .enter().append("path")
      .attr("d", function(d) { d.line = this; return susLineChart_line(d.values); })
      .attr("id", function(d) { return d.name.split(" ").join("_") });
  
  //School District Labels
  susLineChart_g.append("text")
    .attr("x", 620)
    .attr("y", 40)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("Hickman Mills");
  susLineChart_g.append("text")
    .attr("x", 740)
    .attr("y", 250)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("KCK");
  susLineChart_g.append("text")
    .attr("x", 290)
    .attr("y", 90)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("KCPS");
  susLineChart_g.append("text")
    .attr("x", 40)
    .attr("y", 190)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("Center");
  susLineChart_g.append("text")
    .attr("x", 480)
    .attr("y", 360)
    .attr("class","labels")
    .attr("dy", ".35em")
    .text("Independence");
  susLineChart_g.append("text")
    .attr("x", 290)
    .attr("y", 385)
    .attr("class","avglabels")
    .attr("dy", ".35em")
    .text("Average");  
  
  var susLineChart_focus = susLineChart_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");
  var susLineChart_focusTwo = susLineChart_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus2");
  var susLineChart_focuscirc = susLineChart_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");
  susLineChart_focuscirc.append("circle")
      .attr("r", 3.5);

  //Voronoi for hover optimization
  var susLineChart_voronoiGroup = susLineChart_g.append("g")
      .attr("class", "voronoi");

  susLineChart_voronoiGroup.selectAll("path")
    .data(susLineChart_voronoi.polygons(d3.merge(susLineChart_data.map(function(d) { return d.values; }))))
    .enter().append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .on("mouseover", susLineChart_mouseover)
      .on("mouseout", susLineChart_mouseout);

  d3.select("#show-voronoi")
    .property("disabled", false)
    .on("change", function() { susLineChart_voronoiGroup.classed("voronoi--show", this.checked); });
  
  susLineChart_g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + susLineChart_height + ")")
    .call(d3.axisBottom(susLineChart_x));

  function susLineChart_mouseover(d) {
    d3.selectAll(".labels").style("opacity",0.15)
    d3.selectAll(".avglabels").style("opacity",0.15)
    d3.selectAll(".cities path").style("opacity",0.15)
    d3.select(d.data.city.line).classed("city--hover", true);
    susLineChart_focus.append("text").attr("y", -10);
    susLineChart_focusTwo.append("text").attr("y", -10); d.data.city.line.parentNode.appendChild(d.data.city.line);
    susLineChart_focuscirc.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + susLineChart_y(d.data.value) + ")");
    susLineChart_focus.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + (susLineChart_y(d.data.value)-50) + ")");
    susLineChart_focusTwo.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + (susLineChart_y(d.data.value)-25)+ ")");
    
    var susLineChart_w = window.innerWidth;
    var susLineChart_h = window.innerHeight;
    
    //Define where text is anchored to keep tooltips on screen
    if (d3.event.pageX < susLineChart_w / 3) {
      susLineChart_focus.select("text").style("text-anchor", "start");
      susLineChart_focusTwo.select("text").style("text-anchor", "start");
    }else if (d3.event.pageX < susLineChart_w / 1.5){
      susLineChart_focus.select("text").style("text-anchor", "middle");
      susLineChart_focusTwo.select("text").style("text-anchor", "middle");
    }else{
      susLineChart_focus.select("text").style("text-anchor", "end");
      susLineChart_focusTwo.select("text").style("text-anchor", "end");
    }
    
    susLineChart_focus.select("text").text(d.data.city.name+", "+d.data.date.getFullYear());
    susLineChart_focusTwo.select("text").text(Math.round(d.data.value * 1000) / 10 + "%");
    
  }

  function susLineChart_mouseout(d) {
    d3.selectAll(".labels").style("opacity",1)
    d3.selectAll(".avglabels").style("opacity",1)
    d3.select(d.data.city.line).classed("city--hover", false);
    d3.selectAll(".cities path").style("opacity",1)
    susLineChart_focuscirc.attr("transform", "translate(-100,-100)");
    susLineChart_focus.attr("transform", "translate(-100,-100)");
    susLineChart_focusTwo.attr("transform", "translate(-100,-100)");
  }
         
});
     
     }  
  else{
       
      var susLineChart_xtwo = (document.getElementById("districtSelection1").selectedIndex)-1;
      var susLineChart_ytwo = document.getElementById("districtSelection1").options;       
       d3.csv("https://gist.githubusercontent.com/JesseCHowe/8cf49494978a39ce938560d6dd664a55/raw/8f3f74e9e0fb6a12fc76fcdb738d914eac7b704f/districtline.csv", susLineChart_type, function(susLineChart_error, susLineChart_data) {
  if (susLineChart_error) throw susLineChart_error;
  
  susLineChart_g.append("g")
    .attr("class", "cities")
    .selectAll("path")
    .data(susLineChart_data)
    .enter().append("path")
      .style("opacity",0.15)
      .attr("d", function(d) { d.line = this; return susLineChart_line(d.values); })
      .attr("id", function(d) { return d.name.split(" ").join("_") });
         
  var susLineChart_cities = susLineChart_g.append("g")
    .attr("class", "cities")
    .selectAll("path")
    .data(susLineChart_data)
    .enter().append("path")
      .filter(function (d, i) { return i === susLineChart_xtwo;})
      .attr("d", function(d) { d.line = this; return susLineChart_line(d.values); })
      .attr("id", function(d) { return d.name.split(" ").join("_") });
  
  susLineChart_g.append("text")
    .attr("x", 620)
    .attr("y", 40)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("Hickman Mills");
  susLineChart_g.append("text")
    .attr("x", 740)
    .attr("y", 250)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("KCK");
  susLineChart_g.append("text")
    .attr("x", 290)
    .attr("y", 90)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("KCPS");
  susLineChart_g.append("text")
    .attr("x", 40)
    .attr("y", 190)
    .attr("dy", ".35em")
    .attr("class","labels")
    .text("Center");
  susLineChart_g.append("text")
    .attr("x", 480)
    .attr("y", 360)
    .attr("class","labels")
    .attr("dy", ".35em")
    .text("Independence");
  susLineChart_g.append("text")
    .attr("x", 290)
    .attr("y", 385)
    .attr("class","avglabels")
    .attr("dy", ".35em")
    .text("Average"); 
         
  d3.selectAll(".labels").style("opacity",0.15);
  d3.selectAll(".avglabels").style("opacity",0.15);
         
  var susLineChart_focuscirc = susLineChart_g.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus");      
  var susLineChart_focus = susLineChart_g.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus");
  var susLineChart_focusTwo = susLineChart_g.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus2");

  susLineChart_focuscirc.append("circle")
      .attr("r", 3.5);

  var susLineChart_voronoiGroup = susLineChart_g.append("g")
      .attr("class", "voronoi");

  susLineChart_voronoiGroup.selectAll("path")
    .data(susLineChart_voronoi.polygons(d3.merge(susLineChart_data.map(function(d) { return susLineChart_data[susLineChart_xtwo].values; }))))
    .enter().append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .on("mouseover", susLineChart_mouseover)
      .on("mouseout", susLineChart_mouseout);

  d3.select("#show-voronoi")
    .property("disabled", false)
    .on("change", function() { susLineChart_voronoiGroup.classed("voronoi--show", this.checked); });
  
  susLineChart_g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + susLineChart_height + ")")
    .call(d3.axisBottom(susLineChart_x));

  function susLineChart_mouseover(d) {
 
    d3.selectAll(".cities path").style("opacity",0.15)
    d3.select(d.data.city.line).classed("city--hover", true);
    susLineChart_focus.append("text").attr("y", -10);
    susLineChart_focusTwo.append("text").attr("y", -10); d.data.city.line.parentNode.appendChild(d.data.city.line);
    susLineChart_focuscirc.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + susLineChart_y(d.data.value) + ")");
    susLineChart_focus.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + (susLineChart_y(d.data.value)-50) + ")");
    susLineChart_focusTwo.attr("transform", "translate(" + susLineChart_x(d.data.date) + "," + (susLineChart_y(d.data.value)-25)+ ")");
    
    var susLineChart_w = window.innerWidth;
    var susLineChart_h = window.innerHeight;
    
    if (d3.event.pageX < susLineChart_w / 3) {
      susLineChart_focus.select("text").style("text-anchor", "start");
      susLineChart_focusTwo.select("text").style("text-anchor", "start");
    }else if (d3.event.pageX < susLineChart_w / 1.5){
      susLineChart_focus.select("text").style("text-anchor", "middle");
      susLineChart_focusTwo.select("text").style("text-anchor", "middle");
    }else{
      susLineChart_focus.select("text").style("text-anchor", "end");
      susLineChart_focusTwo.select("text").style("text-anchor", "end");
    }
    susLineChart_focus.select("text").text(d.data.city.name+", "+d.data.date.getFullYear());
    susLineChart_focusTwo.select("text").text(Math.round(d.data.value * 1000) / 10 + "%");
  }

  function susLineChart_mouseout(d) {
    susLineChart_focus.attr("transform", "translate(-100,-100)");
    susLineChart_focuscirc.attr("transform", "translate(-100,-100)");
    susLineChart_focusTwo.attr("transform", "translate(-100,-100)");
  }

});
     
     }
  
    }

//////////////////////////////////////////
// Second Graphic Suspension Bar Chart //
/////////////////////////////////////////

var susBar_margin = { top: 80, right: 30, bottom:0, left: 50 },
    susBar_width = 800 - susBar_margin.left - susBar_margin.right,
    susBar_height =425 - susBar_margin.top - susBar_margin.bottom;

var susBar_x = d3.scaleBand()
  .range([0, susBar_width])
  .padding(0.1);
var susBar_y = d3.scaleLinear()
  .range([susBar_height, 0]);
  
var susBar_svg = d3
  .select("#susBarChart svg")
  .append("svg")
  .attr("height", susBar_height + susBar_margin.top+ susBar_margin.bottom)
  .attr("width", susBar_width + susBar_margin.left + susBar_margin.right)
  .append("g")
  .attr("transform", "translate(" + susBar_margin.left + "," + susBar_margin.top + ")");

  susBar_svg.append("circle")
    .attr("cx", 20)
    .attr("cy", -60)
    .attr("r", 10)
    .style("fill","rgba(103,150,176,1)");

  susBar_svg.append("text")
    .attr("x", 40)
    .attr("y", -60)
    .attr("class","lineGraph_desc")
    .attr("dy", ".35em")
    .text("School Districts with high black suspension rates in 2011");

  susBar_svg.append("g")
    .attr("class", "y axis")
    .append("line")
    .style("stroke","#818181")
    .style("stroke-dasharray", "4, 8")
    .attr("y1", 92)
    .attr("y2", 92)
    .attr("x1", -30)
    .attr("x2", susBar_width);

  susBar_svg.append("g")
    .attr("class", "y axis")
    .append("line")
    .style("stroke","#818181")
    .style("stroke-dasharray", "4, 8")
    .attr("y1", 20)
    .attr("y2", 20)
    .attr("x1", -30)
    .attr("x2", susBar_width);
  susBar_svg
    .append("g")
    .attr("class", "y axis")
    .append("line")
    .style("stroke","#818181")
    .style("stroke-dasharray", "4, 8")
    .attr("y1", 325)
    .attr("y2", 325)
    .attr("x1", -30)
    .attr("x2", susBar_width);
  susBar_svg
    .append("g")
    .attr("class", "y axis")
    .append("line")
    .style("stroke","#818181")
    .style("stroke-dasharray", "4, 8")
    .attr("y1",  250)
    .attr("y2",  250)
    .attr("x1", -30)
    .attr("x2", susBar_width);
// get the data
d3.csv("https://gist.githubusercontent.com/JesseCHowe/1a0c31a10642fa285c99c4af02ac5efb/raw/756c989ace1e391395b52d0e03d860cde397e871/districtchange.csv", function(error, susBar_data) {
  if (error) throw error;

  // format the data
  susBar_data.forEach(function(d) {
    d.Change = +d.Change;
  });

  // Scale the range of the data in the domains
    susBar_y
      .domain(
        d3.extent(susBar_data, function(d) {
          return d.Change;
        })
      )
      .nice();
    susBar_x.domain(
      susBar_data.map(function(d) {
        return d.District;
      })
    );


  var susBar_one=susBar_svg.selectAll(".bar")
      .data(susBar_data)
    .enter().append("rect")
      .attr("class", "bars")
     .attr("id", function(d) {
        return d.District.split(" ").join("_") 
      })
      .attr("x", function(d) { return susBar_x(d.District); })
      .attr("width", susBar_x.bandwidth())
      .attr("y", function(d) {
        return (susBar_y(Math.max(0, d.Change))+17);
      })
     .attr("height",function(d) {
        return Math.abs(susBar_y(d.Change) - susBar_y(0));})


var susBar_backgroundL = susBar_svg.append("g");
const susBar_context = d3.path();
susBar_context.moveTo(0, 160);
susBar_context.lineTo(0, 140);
  susBar_context.lineTo(270, 140);
  susBar_context.lineTo(270, 160);

susBar_backgroundL.append('path')
    .attr('class', 'link')
    .attr('d', susBar_context.toString());
  const susBar_context2 = d3.path();
susBar_context2.moveTo(270, 180);
susBar_context2.lineTo(270, 200);
  susBar_context2.lineTo(720, 200);
  susBar_context2.lineTo(720, 180);
susBar_backgroundL.append('path')
    .attr('class', 'link')
    .attr('d', susBar_context2.toString());
  susBar_svg.append("rect")
    .attr("x",35)
    .attr("y",120)
    .attr("width", 180)
    .attr("fill","#FFF")
    .attr("height", 50);
    susBar_svg.append("rect")
    .attr("x",390)
    .attr("y",180)
    .attr("width", 230)
    .attr("fill","#fff")
    .attr("height", 40);
  //
   var susBar_backgroundT = susBar_svg.append("g");
     susBar_backgroundT.append("text")
    .attr("x",620)
    .attr("y", 10)
    .attr("class","labels")
    .attr("dy", ".35em")
   //.attr("font-size","0.9em")
   .attr("font-weight","bold")
    .text("Hickman Mills");
      susBar_backgroundT.append("text")
    .attr("x",635)
    .attr("y", 80)
    .attr("class","labels")
  //.attr("font-size","0.8em")
    .attr("dy", ".35em")
   .attr("font-weight","bold")
    .text("KCK");
        susBar_backgroundT.append("text")
    .attr("x",560)
    .attr("y", 105)
    .attr("class","labels")
  //.attr("font-size","0.8em")
  .attr("font-weight","bold")
    .attr("dy", ".35em")
    .text("KCPS");
          susBar_backgroundT.append("text")
    .attr("x",55)
    .attr("y", 295)
    .attr("class","labels")
  //.attr("font-size","0.8em")
  .attr("font-weight","bold")
    .attr("dy", ".35em")
    .text("Center");
            susBar_backgroundT.append("text")
    .attr("x",30)
    .attr("y", 312)
  .attr("class","labels")
  //.attr("font-size","0.8em")
  .attr("font-weight","bold")
    .attr("dy", ".35em")
    .text("Independence");
  //
   susBar_backgroundT.append("text")
    .attr("x",80)
    .attr("y", 135)
    .attr("dy", ".35em")
    .style("text-anchor","middle")
  .attr("font-weight","bold")
    .text("12");
  susBar_backgroundT.append("text")
    .attr("x",140)
    .attr("y", 135)
    .attr("dy", ".35em")
  .style("text-anchor","middle")
    .text("districts have");
      susBar_backgroundT.append("text")
    .attr("x",85)
    .attr("y", 150)
    .attr("dy", ".35em")
  .style("text-anchor","middle")
  .attr("font-weight","bold")
    .text("decreased");
    susBar_backgroundT.append("text")
    .attr("x",170)
    .attr("y", 150)
  .style("text-anchor","middle")
    .attr("dy", ".35em")
    .text("since 2011");
  //
    susBar_backgroundT.append("text")
    .attr("x",405)
    .attr("y", 195)
    .attr("dy", ".35em")
    .attr("font-weight","bold")
    .text("20");
    susBar_backgroundT.append("text")
    .attr("x",430)
    .attr("y", 195)
    .attr("dy", ".35em")
    .text("districts have");
      susBar_backgroundT.append("text")
    .attr("x",530)
    .attr("y", 195)
    .attr("dy", ".35em")
  .attr("font-weight","bold")
    .text("increased");
    susBar_backgroundT.append("text")
    .attr("x",463)
    .attr("y", 210)
    .attr("dy", ".35em")
    .text("since 2011");
  //
      susBar_svg.append("text")
    .attr("x",-30)
    .attr("y", 10)
    .attr("dy", ".35em")
  .attr("font-size","0.8em")
    .text("+2%");
        susBar_svg.append("text")
    .attr("x",-30)
    .attr("y", 80)
    .attr("dy", ".35em")
  .attr("font-size","0.8em")
    .text("+1%");
          susBar_svg.append("text")
    .attr("x",-8)
    .attr("y", 160)
    .attr("dy", ".35em")
  .attr("font-size","0.8em")
  .attr("text-anchor","end")
    .text("0%");
         susBar_svg.append("text")
    .attr("x",-30)
    .attr("y", 235)
    .attr("dy", ".35em")
  .attr("font-size","0.8em")
    .text("-1%");
         susBar_svg.append("text")
    .attr("x",-30)
    .attr("y", 310)
    .attr("dy", ".35em")
  .attr("font-size","0.8em")
    .text("-2%");
 //The data for our line
         susBar_svg
      .append("g")
      .attr("class", "y axis")
      .append("line")
      .style("stroke","#818181")
      .attr("y1", 170)
      .attr("y2", 170)
      .attr("x1", -30)
      .attr("x2", susBar_width);
      var susBar_focus3 = susBar_svg.append("g")
      .attr("class", "focus3")
      .style("display", "none");
      var susBar_focus = susBar_svg.append("g")
      .attr("class", "focus")
      .style("display", "none");
       var susBar_focus2 = susBar_svg.append("g")
      .attr("class", "focus2")
      .style("display", "none");
  susBar_focus3.append("rect")
      .attr("width", 4.5)
  .attr("height", 4.5);
  susBar_focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");
      susBar_focus2.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  susBar_svg.append("rect")
      .attr("class", "overlay")
      .attr("width", susBar_width + susBar_margin.left + susBar_margin.right)
      .attr("height", susBar_height + susBar_margin.top+ susBar_margin.bottom)
      .on("mouseover", function() { susBar_focus3.style("display", null),susBar_focus2.style("display", null),susBar_focus.style("display", null),susBar_backgroundL.style("opacity", 0.2),susBar_backgroundT.style("opacity", 0.2); })
      .on("mouseout", function() { susBar_backgroundL.style("opacity", 1),susBar_backgroundT.style("opacity",   1),susBar_focus.style("display", "none"),susBar_focus2.style("display", "none"),susBar_focus3.style("display", "none"); })
      .on("mousemove", susBar_mousemove);
  
var susBar_tickPos = [0, 40, 55, 75, 105, 125, 145, 165, 195, 205, 240, 260, 280, 300, 330, 350, 370, 390, 420, 440, 460, 480, 500, 530, 545, 575, 595, 615, 640, 660, 685, 705, 800];
  
function susBar_mousemove(d){
  var susBar_m = d3.mouse(this),
      susBar_lowDiff = 1e99,
      susBar_xI = null;

  for (var i = 0; i < susBar_tickPos.length; i++){
    var diff = Math.abs(susBar_m[0] - susBar_tickPos[i]);
    
    if (diff < susBar_lowDiff){
      susBar_lowDiff = diff;
      susBar_xI = i;
      susBar_focus3.select("rect")
        .attr("height",function(d) {return Math.abs(susBar_y(susBar_data[susBar_xI].Change) - susBar_y(0));})
        .attr("width",susBar_x.bandwidth());
      
      if(susBar_data[susBar_xI].Change<0){susBar_focus3
    .attr("transform","translate(" + susBar_x(susBar_data[susBar_xI].District)+ "," + susBar_y(((susBar_data[susBar_xI].Change)-38)/180) + ")");}
      else{susBar_focus3.attr("transform","translate(" + susBar_x(susBar_data[susBar_xI].District)+ "," + susBar_y((susBar_data[susBar_xI].Change)-0.20) + ")");}
      susBar_focus.select("text").html(susBar_data[susBar_xI].District);
      susBar_focus2.select("text").html(susBar_data[susBar_xI].Change + "%");
      
      var w = window.innerWidth;
      var h = window.innerHeight;
      
      if (d3.event.pageX < w / 3) {
      susBar_focus.select("text").style("text-anchor", "start");
      susBar_focus2.select("text").style("text-anchor", "start");
    }
      else if (d3.event.pageX < w / 1.5){
      susBar_focus.select("text").style("text-anchor", "middle");
      susBar_focus2.select("text").style("text-anchor", "middle");
    }
      else{
      susBar_focus.select("text").style("text-anchor", "end");
      susBar_focus2.select("text").style("text-anchor", "end");
    }
  
      if(susBar_data[susBar_xI].Change<0.1){    
    susBar_focus.attr("transform","translate(" + susBar_x(susBar_data[susBar_xI].District)+ "," + 100+ ")");
    susBar_focus2.attr("transform","translate(" +susBar_x(susBar_data[susBar_xI].District)+ "," + 120 + ")");
  }
      else{
    susBar_focus.attr("transform","translate(" + susBar_x(susBar_data[susBar_xI].District)+ "," + susBar_y((susBar_data[susBar_xI].Change)+0.35) + ")");
    susBar_focus2.attr("transform","translate(" +susBar_x(susBar_data[susBar_xI].District)+ "," + susBar_y((susBar_data[susBar_xI].Change)+0.10) + ")");  
  }      
    }    
  }
  
  };
  
});



///////////////////////////////////////////
// Third Graphic: Suspension Gap Chart //
//////////////////////////////////////////

var susGap_months,
    susGap_monthKeys,
    susGap_monthParse = d3.timeParse("%Y");

var susGap_svg = d3.select("#sus_Gap svg svg"),
    susGap_margin = {top: 20, right: 110, bottom: 120, left:110},
    susGap_width = susGap_svg.attr("width") - susGap_margin.left - susGap_margin.right,
    susGap_height = susGap_svg.attr("height") - susGap_margin.top - susGap_margin.bottom,
    susGap_g = susGap_svg.append("g").attr("transform", "translate(" + susGap_margin.left + "," + susGap_margin.top + ")");

var susGap_x = d3.scaleTime()
    .range([0, susGap_width]);

var susGap_y = d3.scaleLinear()
    .range([susGap_height, 0]);

var susGap_voronoi = d3.voronoi()
    .x(function(d) { return susGap_x(d.date); })
    .y(function(d) { return susGap_y(d.value); })
    .extent([[-susGap_margin.left, -susGap_margin.top], [susGap_width + susGap_margin.right, susGap_height + susGap_margin.bottom]]);

var susGap_line = d3.line()
    .x(function(d) { return susGap_x(d.date); })
    .y(function(d) { return susGap_y(d.value); });

d3.csv("https://gist.githubusercontent.com/JesseCHowe/476ffcfa96e1edb2e837863e065b5f04/raw/eb3bbf797b1c11ed3d6af0f6cbc47dd3dd1f993f/suspension_gap.csv", susGap_type, function(susGap_error, susGap_data) {
  if (susGap_error) throw susGap_error;

  susGap_x.domain(d3.extent(susGap_months));
  susGap_y.domain([0, d3.max(susGap_data, function(c) { return d3.max(c.values, function(d) { return d.value; }); })]).nice();
  /*g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));*/

  susGap_g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(susGap_y).ticks(5, "%"))

  susGap_g.append("g")
      .attr("class", "susGap_cities")
    .selectAll("path")
    .data(susGap_data)
    .enter().append("path")
   .attr("class", function(d) {
        return d.name.split(" ").join("_");
      })
      .attr("d", function(d) { d.line = this; return susGap_line(d.values); });
  var susGap_ChangeBreak = susGap_g.append("g");
        susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",210)
    .attr("y", 380)
    .attr("dy", ".35em")
  //.attr("font-size","1.1em")
  .attr("text-anchor","middle")
    .text("Excelsior Springs");
          susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",210)
    .attr("y", 400)
    .attr("dy", ".35em")
 // .attr("font-size","1.1em")
  .attr("text-anchor","middle")
    .text("+5.6%");
          susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",250)
    .attr("y", 25)
    .attr("dy", ".35em")
  //.attr("font-size","1.1em")
  .attr("text-anchor","middle")
    .text("Raytown");
            susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",250)
    .attr("y", 45)
    .attr("dy", ".35em")
  //.attr("font-size","1.1em")
  .attr("text-anchor","middle")
    .text("+13.8%");
          susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",290)
    .attr("y", 195)
    .attr("dy", ".35em")
  //.attr("font-size","1em")
  .attr("text-anchor","middle")
    .text("Hickman Mills");
            susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",290)
    .attr("y", 215)
    .attr("dy", ".35em")
  //.attr("font-size","1.1em")
  .attr("text-anchor","middle")
    .text("-7.1%");
            susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",150)
    .attr("y", 320)
    .attr("dy", ".35em")
  //.attr("font-size","1.1em")
  .attr("text-anchor","middle")
    .text("Oak Grove");
              susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",150)
    .attr("y", 340)
    .attr("dy", ".35em")
  .attr("font-size","1.1em")
  .attr("text-anchor","middle")
    .text("+6.9%");
              susGap_ChangeBreak.append("text")
  .attr("class","labels")
    .attr("x",50)
    .attr("y", 255)
    .attr("dy", ".35em")
  //.attr("font-size","1.1em")
  .attr("text-anchor","middle")
    .text("Liberty");
                susGap_ChangeBreak.append("text")
    .attr("class","labels")
    .attr("x",50)
    .attr("y", 275)
    .attr("dy", ".35em")
  //.attr("font-size","1em")
  .attr("text-anchor","middle")
    .text("-5.0%");
    susGap_g.append("text")
    .attr("x",susGap_width/2)
    .attr("y", 470)
    .attr("dy", ".35em")
  .attr("font-size","0.9em")
  .attr("text-anchor","middle")
    .text("Less likely to be suspended than white students");
      susGap_g.append("text")
    .attr("x",susGap_width/2)
    .attr("y", -10)
    .attr("dy", ".35em")
  .attr("font-size","0.9em")
  .attr("text-anchor","middle")
    .text("More likely to be suspended than white students");
  susGap_g.append("text")
    .attr("x",-10)
    .attr("y", 470)
    .attr("dy", ".35em")
  .attr("font-size","0.9em")
    .text("2011");
    susGap_g.append("text")
    .attr("x",360)
    .attr("y", 470)
    .attr("dy", ".35em")
  .attr("font-size","0.9em")
    .text("2013");
  susGap_g.append("text")
    .attr("x",-35)
    .attr("y", 430)
    .attr("dy", ".35em")
  .attr("font-size","0.9em")
    .text("-5%");
 
  var susGap_focus = susGap_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "susGap_focus");
 
  var susGap_focus2 = susGap_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "susGap_focus");
    var susGap_focus3 = susGap_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "susGap_focus");
    var susGap_focus4 = susGap_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "susGap_focus");
    var susGap_focus5 = susGap_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "susGap_focus");
      var susGap_focus6 = susGap_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "susGap_focus");
      var susGap_focus7 = susGap_g.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "susGap_focus");

  susGap_focus.append("text")
      .attr("y", -10);
    susGap_focus2.append("text")
      .attr("y", -40);
  susGap_focus3.append("text")
      .attr("y", -40);
  susGap_focus4.append("text")
      .attr("y", -40);
  susGap_focus5.append("text")
      .attr("y", -40);
    susGap_focus6.append("text")
  .attr("font-size","1.5em")
      .attr("y", -40);
    susGap_focus7.append("text")
  .attr("font-size","1.5em")
      .attr("y", -40);
  var susGap_voronoiGroup = susGap_g.append("g")
      .attr("class", "susGap_voronoi");

  susGap_voronoiGroup.selectAll("path")
    .data(susGap_voronoi.polygons(d3.merge(susGap_data.map(function(d) { return d.values; }))))
    .enter().append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .on("mouseover", susGap_mouseover)
      .on("mouseout", susGap_mouseout);
        susGap_svg
      .append("g")
      .attr("class", "susGap_y susGap_axis")
      .append("line")
      .style("stroke","#000")
  .style("stroke-width","1.8px")
      .attr("y1", 380.5)
      .attr("y2", 380.5)
      .attr("x1", 105)
      .attr("x2", 490);
  d3.select("#show-voronoi")
      .property("disabled", false)
      .on("change", function() { susGap_voronoiGroup.classed("voronoi--show", this.checked); });
var susGap_myNamespace = {};

susGap_myNamespace.round = function(number, precision) {
    var susGap_factor = Math.pow(10, precision);
    var susGap_tempNumber = number * susGap_factor;
    var susGap_roundedTempNumber = Math.round(susGap_tempNumber);
    return susGap_roundedTempNumber / susGap_factor;
};
  function susGap_mouseover(d) {
     //console.log(d.data.city.values[0].value)
    d3.selectAll("path").style("opacity", 0.1);
    d3.select(d.data.city.line).classed("susGap_city--hover", true);
    d3.selectAll(".highlight").style("opacity",0.25);
    susGap_ChangeBreak.style("opacity",0)
    d.data.city.line.parentNode.appendChild(d.data.city.line);
    susGap_focus.attr("transform", "translate(" + susGap_width/2 + "," + 100 + ")");
    susGap_focus2.attr("transform", "translate(" + susGap_width/2 + "," + 150 + ")");
    susGap_focus3.attr("transform", "translate(" + susGap_width/2 + "," + 170 + ")");
    susGap_focus4.attr("transform", "translate(" + susGap_width/1.7 + "," + 230 + ")");
    susGap_focus5.attr("transform", "translate(" + susGap_width/2.5 + "," + 230 + ")");
    susGap_focus6.attr("transform", "translate(" + susGap_width/1.7 + "," + 210 + ")");
    susGap_focus7.attr("transform", "translate(" + susGap_width/2.5 + "," + 210 + ")");
    susGap_focus.select("text").text(d.data.city.name);
    if((d.data.city.values[1].value-d.data.city.values[0].value)<0){
    susGap_focus2.select("text").text("has Decreased by "+ Math.round((d.data.city.values[1].value-d.data.city.values[0].value)*1000)/10 +"%");}else{susGap_focus2.select("text").text("has Increased by "+Math.round((d.data.city.values[1].value-d.data.city.values[0].value)*1000)/10+"%");}
    susGap_focus3.select("text").text("since 2011");
    susGap_focus4.select("text").text("2013");
    susGap_focus5.select("text").text("2011");
    susGap_focus6.select("text").text(Math.round((d.data.city.values[1].value)*1000)/10 +"%");
    susGap_focus7.select("text").text(Math.round((d.data.city.values[0].value)*1000)/10 +"%");
  }

  function susGap_mouseout(d) {
    d3.selectAll("path").style("opacity", 1);
    susGap_ChangeBreak.style("opacity",1)
    d3.selectAll(".highlight").style("opacity", 1);
    d3.select(d.data.city.line).classed("susGap_city--hover", false);
    susGap_focus.attr("transform", "translate(-100,-100)");
    susGap_focus2.attr("transform", "translate(-100,-100)");
    susGap_focus3.attr("transform", "translate(-100,-100)");
    susGap_focus4.attr("transform", "translate(-100,-100)");
    susGap_focus5.attr("transform", "translate(-100,-100)");
    susGap_focus6.attr("transform", "translate(-100,-100)");
    susGap_focus7.attr("transform", "translate(-100,-100)");
  }
  
        var susGap_yearMenu = d3.select("#suspensionMenu2 select").on("change", susGap_showGeorge2);

    function susGap_showGeorge2(d) {
        var susGap_georgeSelection = $("#districtSelection2").val();
        var susGap_x = document.getElementById("districtSelection2").selectedIndex -1;
        var susGap_y = document.getElementById("districtSelection2").options;
        //alert("Index: " + susGap_y[susGap_x].index + " is " + susGap_y[susGap_x].text);
        //console.log(susGap_x)
      
        if(susGap_georgeSelection === "all"){
        d3.selectAll(".susGap_cities path").style("opacity", 1).classed("susGap_city--hover", false);
        d3.selectAll(".susGap_voronoi").style("display", "block");
          
        } else{
        d3.selectAll(".susGap_cities path").style("opacity", 0.25);
        d3.selectAll(".susGap_voronoi").style("display", "none");
        d3.selectAll(".susGap_cities ." + susGap_georgeSelection).style("opacity", 1);
        d3.selectAll(".susGap_cities ." + susGap_georgeSelection).classed("susGap_city--hover", true);
        var susGap_test = d3.selectAll(".cities ."+susGap_georgeSelection)
        console.log(susGap_data[susGap_x].values[1].value)
        //focuscirc.style("display", "none");
        //focus.style("display", "none");
        //focus2.style("display", "none");
        //d3.selectAll("rect").style("display", "block");
    //d.data.city.line.parentNode.appendChild(d.data.city.line);
    //d3.selectAll(".highlight").style("opacity",0.25);
    susGap_ChangeBreak.style("opacity",0);
    susGap_focus.attr("transform", "translate(" + susGap_width/2 + "," + 100 + ")");
    susGap_focus2.attr("transform", "translate(" + susGap_width/2 + "," + 150 + ")");
    susGap_focus3.attr("transform", "translate(" + susGap_width/2 + "," + 170 + ")");
    susGap_focus4.attr("transform", "translate(" + susGap_width/1.7 + "," + 230 + ")");
    susGap_focus5.attr("transform", "translate(" + susGap_width/2.5 + "," + 230 + ")");
    susGap_focus6.attr("transform", "translate(" + susGap_width/1.7 + "," + 210 + ")");
    susGap_focus7.attr("transform", "translate(" + susGap_width/2.5 + "," + 210 + ")");
    susGap_focus.select("text").text(susGap_data[susGap_x].name);
    if((susGap_data[susGap_x].values[1].value-susGap_data[susGap_x].values[0].value)<0){
    susGap_focus2.select("text").text("has Decreased by "+ Math.round((susGap_data[susGap_x].values[1].value-susGap_data[susGap_x].values[0].value)*1000)/10 +"%");}else{susGap_focus2.select("text").text("has Increased by "+Math.round((susGap_data[susGap_x].values[1].value-susGap_data[susGap_x].values[0].value)*1000)/10+"%");}
    susGap_focus3.select("text").text("since 2011");
    susGap_focus4.select("text").text("2011");
    susGap_focus5.select("text").text("2013");
    susGap_focus6.select("text").text(Math.round((susGap_data[susGap_x].values[1].value)*1000)/10 +"%");
    susGap_focus7.select("text").text(Math.round((susGap_data[susGap_x].values[0].value)*1000)/10 +"%");
      
    }
    }
});

function susGap_type(d, i, columns) {
  
  if (!susGap_months) susGap_monthKeys = columns.slice(1), susGap_months = susGap_monthKeys.map(susGap_monthParse);
    
  var c = {name: d.name.replace(/ (msa|necta div|met necta|met div)$/i, ""), values: null};
  
  c.values = susGap_monthKeys.map(function(k, i) { return {city: c, date: susGap_months[i], value: d[k] / 100}; });/*console.log(c,"test",c.name,"Test2",c.values[0].value)*/
 
  
  return c;
}


///////////////////////////////////////////
// Fourth Graphic: Suspension Types Chart //
//////////////////////////////////////////

var susType_margin = { top: 100, right:100, bottom: 40, left: 40 },
  susType_width = 960 - susType_margin.left - susType_margin.right,
  susType_height = 400 - susType_margin.top - susType_margin.bottom;

var susType_svg = d3
  .select("#one svg")
  .append("svg")
  .attr("width", susType_width + susType_margin.left + susType_margin.right)
  .attr("height", susType_height + susType_margin.top + susType_margin.bottom)
  .append("g")
  .attr("transform", "translate(" + susType_margin.left + "," + susType_margin.top + ")");

var susType_svg2 = d3
  .select("#two svg")
  .append("svg")
  .attr("width", susType_width + susType_margin.left + susType_margin.right)
  .attr("height", susType_height + susType_margin.top + susType_margin.bottom)
  .append("g")
  .attr("transform", "translate(" + susType_margin.left + "," + susType_margin.top + ")");

var susType_svg3 = d3
  .select("#three svg")
  .append("svg")
  .attr("width", susType_width + susType_margin.left + susType_margin.right)
  .attr("height", susType_height + susType_margin.top + susType_margin.bottom)
  .append("g")
  .attr("transform", "translate(" + susType_margin.left + "," + susType_margin.top + ")");

var susType_svg4 = d3
  .select("#four svg")
  .append("svg")
  .attr("width", susType_width + susType_margin.left + susType_margin.right)
  .attr("height", susType_height + susType_margin.top + susType_margin.bottom)
  .append("g")
  .attr("transform", "translate(" + susType_margin.left + "," + susType_margin.top + ")");

d3.csv(
  "https://gist.githubusercontent.com/JesseCHowe/c3f1d4c3fb2f4d2b963ed4fe4bda1c29/raw/cf491b42db5d388dd5ab49b01a7fd3f09708567b/Violent_Suspensions.csv",
  function(error, susType_data) {

    var susType_data = susType_data.filter(function(d) {
      return d.Year == "2012";
    });

    var susType_elements = Object.keys(susType_data[0]).filter(function(d) {
      return (d != "Year") & (d != "Violent");
    });
    
    var susType_selection = susType_elements[0];

    var susType_y = d3.scaleLinear()
      .domain([0, 1600])
      .range([susType_height, 0]);

    var susType_x = d3.scaleBand()
      .domain(  susType_data.map( function(d) {  return d.Violent;}))
      .rangeRound([0, susType_width]);

    var susType_focus = susType_svg.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");
   
    var susType_yAxis = susType_svg
      .append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(susType_y).ticks(3))
      .selectAll("text")
      .style("font-size", "18px");

    susType_svg
      .selectAll("rectangle")
      .data(susType_data)
      .enter()
      .append("rect")
      .attr("class", "rectangle")
      .attr("width", susType_width / susType_data.length / 1.25)
      .attr("height", function(d) {
        return susType_height - susType_y(+d[susType_selection]);
      })
      .attr("x", function(d, i) {
        return susType_width / susType_data.length * i;
      })
      .attr("y", function(d) {
        return susType_y(+d[susType_selection]);
      })
      .on("mouseover", susType_mouseover)
      .on("mouseout", susType_mouseout);
    
      function susType_mouseover(d) {
        var susType_districtSelection = $("#dropdown").val();
        if(susType_districtSelection === "All Districts"){
        d3.selectAll("#one .rectangle").style("opacity",0.5)
        d3.select(this).style("opacity",1)
        susType_focus.append("text").attr("text-anchor", "middle");
        susType_focus.attr("transform", "translate(" + susType_width/2  + "," + -60 + ")");
        susType_focus.select("text").text("number of suspensions: "+d[susType_elements[0]]);
        }else{
        d3.selectAll("#one .rectangle").style("opacity",0.5)
        d3.select(this).style("opacity",1)
        susType_focus.append("text").attr("text-anchor", "middle");
        susType_focus.attr("transform", "translate(" + susType_width/2  + "," + -60 + ")");
        susType_focus.select("text").text("number of suspensions: "+d[susType_selection.value]);
        }
      }
      function susType_mouseout(d) {
      d3.selectAll("#one .rectangle").style("opacity",1)
      susType_focus.select("text").remove();
      susType_focus.attr("transform", "translate(-100,-100)");
    }

      var susType_selector = d3
        .select("#drop")
        .append("select")
        .attr("id", "dropdown")
        .attr("class","form-control")
        .on("change", function(d) {
          susType_selection = document.getElementById("dropdown");
          var susType_districtSelection = $("#dropdown").val();
          if (susType_districtSelection === "Blue Springs") {
            susType_y.domain([0, 100]);
          } 
          else if (susType_districtSelection === "Clinton") {
          susType_y.domain([0, 10]);
          } 
          else if (susType_districtSelection === "De Soto") {
          susType_y.domain([0, 50]);
        } 
          else if (susType_districtSelection === "Fort Osage") {
          susType_y.domain([0, 30]);
        } 
          else if (susType_districtSelection === "Grain Valley") {
          susType_y.domain([0, 50]);
        } 
          else if (susType_districtSelection === "Grandview") {
          susType_y.domain([0, 20]);
        } 
          else if (susType_districtSelection === "Independence") {
          susType_y.domain([0, 160]);
        } 
          else if (susType_districtSelection === "Kansas City Public Schools") {
          susType_y.domain([0, 100]);
        } 
          else if (susType_districtSelection === "Kearney") {
          susType_y.domain([0, 30]);
        } 
          else if (susType_districtSelection === "Lawson") {
          susType_y.domain([0, 10]);
        } 
          else if (susType_districtSelection === "Lee's Summit") {
          susType_y.domain([0, 100]);
        } 
          else if (susType_districtSelection === "Liberty") {
          susType_y.domain([0, 50]);
        } 
          else if (susType_districtSelection === "Lone Jack") {
          susType_y.domain([0, 10]);
        } 
          else if (susType_districtSelection === "North Kansas City") {
          susType_y.domain([0, 70]);
        } 
          else if (susType_districtSelection === "North Platte") {
          susType_y.domain([0, 10]);
        } 
          else if (susType_districtSelection === "Oak Grove") {
          susType_y.domain([0, 25]);
        } 
          else if (susType_districtSelection === "Park Hill") {
          susType_y.domain([0, 70]);
        } 
          else if (susType_districtSelection === "Platte") {
          susType_y.domain([0, 15]);
        } 
          else if (susType_districtSelection === "Raytown") {
          susType_y.domain([0, 30]);
        } 
          else if (susType_districtSelection === "Shawnee Mission") {
          susType_y.domain([0, 200]);
        } 
          else if (susType_districtSelection === "Smithville") {
          susType_y.domain([0, 20]);
        } 
          else if (susType_districtSelection === "West Platte") {
          susType_y.domain([0, 10]);
        } 
          else {
          susType_y.domain([
            0,
            d3.max(susType_data, function(d) {
              return +d[susType_selection.value];
            })
          ]);
        }

        d3.selectAll(".rectangle")
          .attr("height", function(d) {
            return susType_height - susType_y(+d[susType_selection.value]);
          })
          .attr("y", function(d) {
            return susType_y(+d[susType_selection.value]);
          });
        
        d3.selectAll("g.yaxis")
          .transition()
          .call(d3.axisLeft(susType_y).ticks(3))
          .style("font-size", "18px");
          
      });

    susType_selector
      .selectAll("option")
      .data(susType_elements)
      .enter()
      .append("option")
      .attr("value", function(d) {
        return d;
      })
      .text(function(d) {
        return d;
      });
    
    susType_svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + susType_height + ")")
      .call(d3.axisBottom(susType_x))
      .selectAll("text")
      .style("font-size", "18px")
      .style("text-anchor", "end")
      .attr("dx", "0.75em")
      .attr("dy", "1.0em");
    
  });

d3.csv(
  "https://gist.githubusercontent.com/JesseCHowe/d786ea8eb4acb85388fad1d26cd51289/raw/0fde0cf6b685c252609f30d0e0d4ee0985482a16/Weapon_Suspensions.csv",
  function(error, susType_data2) {

    var susType_data2 = susType_data2.filter(function(d) {
      return d.Year == "2012";
    });

    var susType_elements2 = Object.keys(susType_data2[0]).filter(function(d) {
      return (d != "Year") & (d != "Weapon");
    });
    var susType_selection2 = susType_elements2[0];

    var susType_y2 = d3.scaleLinear()
      .domain([0, 1600])
      .range([susType_height, 0]);

    var susType_x2 = d3.scaleBand()
      .domain(susType_data2.map(function(d) {
          return d.Weapon;
        }))
      .rangeRound([0, susType_width]);

    var susType_focus2 = susType_svg2.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");

    var susType_yAxis2 = susType_svg2
      .append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(susType_y2).ticks(3))
      .selectAll("text")
      .style("font-size", "18px");

    susType_svg2
      .selectAll("rectangle")
      .data(susType_data2)
      .enter()
      .append("rect")
      .attr("class", "rectangle")
      .attr("width", susType_width / susType_data2.length / 1.25)
      .attr("height", function(d) {
        return susType_height - susType_y2(+d[susType_selection2]);
      })
      .attr("x", function(d, i) {
        return susType_width / susType_data2.length * i;
      })
      .attr("y", function(d) {
        return susType_y2(+d[susType_selection2]);
      })
      .on("mouseover", susType_mouseover2)
      .on("mouseout", susType_mouseout2);
    
    function susType_mouseover2(d) {
      var susType_districtSelection2 = $("#dropdown").val();
      if(susType_districtSelection2 === "All Districts"){
        d3.selectAll("#two .rectangle").style("opacity",0.5)
        d3.select(this).style("opacity",1)
        susType_focus2.append("text").attr("text-anchor", "middle");
        susType_focus2.attr("transform", "translate(" + susType_width/2  + "," + -60 + ")");
        susType_focus2.select("text").text("number of suspensions: "+d[susType_selection2]);
        }
      else{
        var susType_selIndex = $("#dropdown")[0].selectedIndex;
        d3.selectAll("#two .rectangle").style("opacity",0.5)
        d3.select(this).style("opacity",1)
        console.log(susType_y2(+d[susType_selection2.value]))
        susType_focus2.append("text").attr("text-anchor", "middle");
        susType_focus2.attr("transform", "translate(" + susType_width/2  + "," + -60 + ")");
        susType_focus2.select("text").text("number of suspensions: "+d[susType_elements2[susType_selIndex]]);
        }
      }
    function susType_mouseout2(d) {
      d3.selectAll("#two .rectangle").style("opacity",1)
     susType_focus2.select("text").remove();
    }

    var susType_selector2 = d3
      .select("#drop")
      .on("change", function(d) {
        susType_selection2 = document.getElementById("dropdown");
        var susType_districtSelection2 = $("#dropdown").val();

            susType_svg2
      .append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(susType_y2).ticks(3))
      .selectAll("text")
      .style("font-size", "18px");

        d3
          .selectAll(".rectangle")
          .attr("height", function(d) {
            return susType_height - susType_y2(+d[susType_selection2.value]);
          })
          .attr("y", function(d) {
            return susType_y2(+d[susType_selection2.value]);
          });    

        d3
          .selectAll("g.yaxis")
          .transition()
          .call(susType_yAxis2)
        .style("font-size", "18px");
      });

    susType_svg2.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + susType_height + ")")
      .call(d3.axisBottom(susType_x2))
      .selectAll("text")
      .style("font-size", "18px")
      .style("text-anchor", "end")
      .attr("dx", "0.75em")
      .attr("dy", "1.0em");
  
  });

d3.csv(
  "https://gist.githubusercontent.com/JesseCHowe/dfad58550981a89227831f2e6abd8b0e/raw/897de7179dce848f6812d5f8ff74d70961059ee6/Alcohol_Suspensions.csv",
  function(error, susType_data3) {
    // filter year
    var susType_data3 = susType_data3.filter(function(d) {
      return d.Year == "2012";
    });
    // Get every column value
    var susType_elements3 = Object.keys(susType_data3[0]).filter(function(d) {
      return (d != "Year") & (d != "Alcohol");
    });
    var susType_selection3 = susType_elements3[0];

    var susType_y3 = d3.scaleLinear()
      .domain([0, 1600])
      .range([susType_height, 0]);

    var susType_x3 = d3.scaleBand()
      .domain(
        susType_data3.map(function(d) {
          return d.Alcohol;
        })
      )
      .rangeRound([0, susType_width]);

 var susType_focus3 = susType_svg3.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");

    susType_svg3
      .append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(susType_y3).ticks(3))
      //.call(susType_yAxis3)
      .selectAll("text")
      .style("font-size", "18px");

    susType_svg3
      .selectAll("rectangle")
      .data(susType_data3)
      .enter()
      .append("rect")
      .attr("class", "rectangle")
      .attr("width", susType_width / susType_data3.length / 1.25)
      .attr("height", function(d) {
        return susType_height - susType_y3(+d[susType_selection3]);
      })
      .attr("x", function(d, i) {
        return susType_width / susType_data3.length * i;
      })
      .attr("y", function(d) {
        return susType_y3(+d[susType_selection3]);
      })
      .on("mouseover", susType_mouseover3)
      .on("mouseout", susType_mouseout3);
    
      function susType_mouseover3(d) {
        var susType_districtSelection3 = $("#dropdown").val();
        if(susType_districtSelection3 === "All Districts"){
        d3.selectAll("#three .rectangle").style("opacity",0.5)
        d3.select(this).style("opacity",1)
        susType_focus3.append("text").attr("text-anchor", "middle");
        susType_focus3.attr("transform", "translate(" + susType_width/2  + "," + -60 + ")");
        susType_focus3.select("text").text("number of suspensions: "+d[susType_selection3]);
        }else{
        var susType_selIndex = $("#dropdown")[0].selectedIndex;
        d3.selectAll("#three .rectangle").style("opacity",0.5)
        d3.select(this).style("opacity",1)
        susType_focus3.append("text").attr("text-anchor", "middle");
        susType_focus3.attr("transform", "translate(" + susType_width/2  + "," + -60 + ")");
        susType_focus3.select("text").text("number of suspensions: "+d[susType_elements3[susType_selIndex]]);
        }
      }
    function susType_mouseout3(d) {
      d3.selectAll("#three .rectangle").style("opacity",1)
     susType_focus3.select("text").remove();
    }

    var susType_selector3 = d3
      .select("#drop")
      .on("change", function(d) {
        susType_selection3 = document.getElementById("dropdown");

        var susType_districtSelection = $("#dropdown").val();

        susType_yAxis3.scale(susType_y3);

        d3
          .selectAll(".rectangle")
          .attr("height", function(d) {
            return susType_height - susType_y3(+d[susType_selection3.value]);
          })
          .attr("y", function(d) {
            return susType_y3(+d[susType_selection3.value]);
          });

        d3
          .selectAll("g.yaxis")
          .transition()
          .call(susType_yAxis3)
          .style("font-size", "18px");
      });

        susType_svg3
      .append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + susType_height + ")")
      .call(d3.axisBottom(susType_x3))
      .selectAll("text")
      .style("font-size", "18px")
      .style("text-anchor", "end")
      .attr("dx", "0.75em")
      .attr("dy", "1.0em");
  });

d3.csv(
  "https://gist.githubusercontent.com/JesseCHowe/e0c79bde649cb39a9f5fffa85365a012/raw/13429bd06c8dee9143b4c8da81cf0c569bc4554e/Drug_Suspensions.csv",
  function(error, susType_data4) {
    // filter year
    var susType_data4 = susType_data4.filter(function(d) {
      return d.Year == "2012";
    });
    // Get every column value
    var susType_elements4 = Object.keys(susType_data4[0]).filter(function(d) {
      return (d != "Year") & (d != "Drug");
    });
    var susType_selection4 = susType_elements4[0];

    var susType_y4 = d3.scaleLinear()
      .domain([0, 1600])
      .range([susType_height, 0]);

    var susType_x4 = d3.scaleBand()
      .domain(
        susType_data4.map(function(d) {
          return d.Drug;
        })
      )
      .rangeRound([0, susType_width]);

 var susType_focus4 = susType_svg4.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");

    susType_svg4
      .append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(susType_y4).ticks(3))
      .selectAll("text")
      .style("font-size", "18px");

    susType_svg4
      .selectAll("rectangle")
      .data(susType_data4)
      .enter()
      .append("rect")
      .attr("class", "rectangle")
      .attr("width", susType_width / susType_data4.length / 1.25)
      .attr("height", function(d) {
        return susType_height - susType_y4(+d[susType_selection4]);
      })
      .attr("x", function(d, i) {
        return susType_width / susType_data4.length * i;
      })
      .attr("y", function(d) {
        return susType_y4(+d[susType_selection4]);
      })
      .on("mouseover", susType_mouseover4)
      .on("mouseout", susType_mouseout4);
    
      function susType_mouseover4(d) {
        var susType_districtSelection4 = $("#dropdown").val();
        if(susType_districtSelection4 === "All Districts"){
        d3.selectAll("#four .rectangle").style("opacity",0.5)
        d3.select(this).style("opacity",1)
        susType_focus4.append("text").attr("text-anchor", "middle");
        susType_focus4.attr("transform", "translate(" + susType_width/2  + "," + -60 + ")");
        susType_focus4.select("text").text("number of suspensions: "+d[susType_selection4]);
        }else{
        var susType_selIndex = $("#dropdown")[0].selectedIndex;
        d3.selectAll("#four .rectangle").style("opacity",0.5)
        d3.select(this).style("opacity",1)        
        susType_focus4.append("text").attr("text-anchor", "middle");
        susType_focus4.attr("transform", "translate(" + susType_width/2  + "," + -60 + ")");
        susType_focus4.select("text").text("number of suspensions: "+d[susType_elements4[susType_selIndex]]);
        }
      }
    function susType_mouseout4(d) {
      d3.selectAll("#four .rectangle").style("opacity",1)
     susType_focus4.select("text").remove();
    }

    var susType_selector4 = d3
      .select("#drop")
      .on("change", function(d) {
        susType_selection4 = document.getElementById("dropdown");

        var susType_districtSelection = $("#dropdown").val();

        susType_yAxis4.scale(susType_y4);

        d3
          .selectAll(".rectangle")
          //.transition()
          .attr("height", function(d) {
            return susType_height - susType_y4(+d[susType_selection4.value]);
          })
          .attr("y", function(d) {
            return susType_y4(+d[susType_selection4.value]);
          });

        d3
          .selectAll("g.yaxis")
          .transition()
          .call(susType_yAxis4)
        .style("font-size", "18px");
      });
    

        susType_svg4
      .append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + susType_height + ")")
      .call(d3.axisBottom(susType_x4))
      .selectAll("text")
      .style("font-size", "18px")
      .style("text-anchor", "end")
      .attr("dx", "0.75em")
      .attr("dy", "1.0em");
  });


//////////////////////////////////////////
// Fifth Graphic Dropdown List //
//////////////////////////////////////////


//faq toggle stuff 
$('.togglefaq').click(function(e) {
e.preventDefault();
var notthis = $('.active').not(this);
notthis.find('.icon-minus').addClass('icon-plus').removeClass('icon-minus');
notthis.toggleClass('active').next('.faqanswer').slideToggle(300);
 $(this).toggleClass('active').next().slideToggle("fast");
$(this).children('i').toggleClass('icon-plus icon-minus');
});
$('.togglefaq2').click(function(e) {
e.preventDefault();
var notthis = $('.active').not(this);
notthis.find('.icon-minus').addClass('icon-plus').removeClass('icon-minus');
notthis.toggleClass('active').next('.faqanswer2').slideToggle(300);
 $(this).toggleClass('active').next().slideToggle("fast");
$(this).children('i').toggleClass('icon-plus icon-minus');
});