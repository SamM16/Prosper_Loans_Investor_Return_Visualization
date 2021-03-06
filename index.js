
d3.select('#chartContainer')
    	.append('h3')
    	.text("Actual vs. Estimated Median Returns According To Prosper Loan Credit Rating After USA 2008 Economic Crisis", 
    		"Recession of 2008");


d3.select('#chartContainer')
		.append('h4')
		.style("width", "20")
		.text("As shown in the bubble chart below, all loans gave a lower " +
			"return than what was predict by Prosper Loans on the loan creation date. The larger " +
			"difference between the actual return and the expected return for 2008-2012 as compared to 2013 could be " +
			"related to the fact that there was a financial crisis in the USA in 2008 and it took until 2013 for the " +
			"loan market to recover. In recovery more people were able to pay off there loans and interest as expected " +
			"leading to the actual loan returns being more intune with the expected return. Also when loans recovered " +
			"from the financial crisis they lined up in prosper loan loan rating which is to be expected based " +
			"upon interest rates for loans being correlated to ones prosper loan credit rating.");


d3.select('body')
    .append('h4')
    .text("Footnotes:");

d3.select('body')
    .append('h5')
    .text("* Data excludes loans which do not have prosper loan credit ratings and estimated returns");

        
d3.select('body')
    .append('h5')
    .text("* Bubble size equals total loans granted for specific prosper credit rating");    

var svg = dimple.newSvg("#chartContainer", 810, 631);
svg.attr("id", "chartContainers");
d3.csv("Prosper_Loans_Actual_Return.csv", function (data) { 
		
// Filter for years
data = dimple.filterData(data, "ListingCreationDateYear", [
  "2009", "2010", "2011", "2012", "2013"
]);


var rectangleData = [
			{ "rx": 625, "ry": 80, "height": 400, "width": 170},
		{ "rx": 90, "ry": 1, "height": 65, "width": 350}];

svg.selectAll("rect_mine")
    .data(rectangleData)
	.enter()
	.append("rect")
	.attr("x", function (d) { return d.rx; })
	.attr("y", function (d) { return d.ry; })
	.attr("height", function (d) { return d.height; })
	.attr("width", function (d) { return d.width; })
	.attr('id', "rectangles")
	.style("stroke", 'black')
	.style("fill", "white");

// Create the indicator chart on the right of the main chart
var indicator = new dimple.chart(svg, data);

// Pick grey as the default and black for the selected year
var defaultColor = indicator.defaultColors[11];

var indicatorColor = indicator.defaultColors[0];

indicatorColor.fill = 'black';

// The frame duration for the animation in milliseconds
var frame = 3000;

var firstTick = true;

// Place the indicator bar chart to the right
indicator.setBounds(634, 165, 153, 311);

// Add dates along the y axis
var y = indicator.addCategoryAxis("y", "ListingCreationDateYear");
y.addOrderRule("Date");

// Use sales for bar size and hide the axis
var x = indicator.addMeasureAxis("x", "Total_Amount_of_Loans");
x.hidden = true;

// Add the bars to the indicator and add event handlers
var s = indicator.addSeries(null, dimple.plot.bar);

s.addEventHandler("click", onClick);
// Draw the side chart
indicator.draw();

// Remove the title from the y axis
y.titleShape.remove();

// Remove the lines from the y axis
y.shapes.selectAll("line,path").remove();

// Move the y axis text inside the plot area
y.shapes.selectAll("text")
    .style("text-anchor", "start")
    .style("font-size", "14px")
    .attr("transform", "translate(12, 0.5)");

// This block simply adds the legend title. I put it into a d3 data
// object to split it onto 2 lines.  This technique works with any
// number of lines, it isn't dimple specific.


svg.selectAll("title_text")
    .data(["Click bar to select",
        "and pause. Click again",
        "to resume animation.",
        "",
        "Bar size equates to total",
        "yearly loans"])
    .enter()
    .append("text")
    .attr("x", 635)
    .attr("y", function (d, i) { return 100 + i * 12; })
	.style("font-family", "sans-serif")
	.style("font-size", "14px")
	.style("color", "Black")
	.text(function (d) { return d; });

svg.selectAll("title_text_prosperrating")
    .data(["Prosper Loan Credit Rating"])
    .enter()
    .append("text")
    .attr("x", 180)
    .attr("y", function (d, i) { return 15 + i * 12; })
	.style("font-family", "sans-serif")
	.style("font-size", "14px")
	.style("color", "Black")
	.text(function (d) { return d; });

svg.selectAll("title_text_prosperrating_below")
    .data(["Best to Worst (AA --> HR)"])
    .enter()
    .append("text")
    .attr("x", 180)
    .attr("y", function (d, i) { return 60 + i * 12; })
	.style("font-family", "sans-serif")
	.style("font-size", "14px")
	.style("color", "Black")
	.text(function (d) { return d; });



// Manually set the bar colors
s.shapes
	.attr("rx", 10)
	.attr("ry", 10)
	.style("fill", function (d) { return (d.y === '2009' ? indicatorColor.fill : defaultColor.fill) })
	.style("stroke", function (d) { return (d.y === '2009' ? indicatorColor.stroke : defaultColor.stroke) })
	.style("opacity", 0.4);

// Draw the main chart
var bubbles = new dimple.chart(svg, data);
bubbles.setBounds(60, 80, 555, 510)
var x = bubbles.addMeasureAxis("x", "Median_Estimated_Return");
x.title = "Median Estimated Return";
x.overrideMax =0.2;
x.fontSize = "14px";
var y = bubbles.addMeasureAxis("y", "Median_Actual_Return");
y.title = "Median Actual Return";
y.overrideMax =0.2;
y.fontSize="14px";


var mySeries1 = bubbles.addSeries("ProsperRating_Alpha", dimple.plot.bubble)


var myLegend = bubbles.addLegend(100, 30, 410, 70);


//Order prosper loan rating legend from worst to best 
myLegend._getEntries = function () {
	var entries = [];
	if (this.series) {
	    this.series.forEach(function (series) {
	        var data = series._positionData;
	        data.forEach(function (row) {
	            var index = -1,
	                j,
	                field = ((series.plot.grouped && !series.x._hasCategories() && !series.y._hasCategories() && 
	                				row.aggField.length < 2 ? "All" : row.aggField.slice(-1)[0]));
	            for (j = 0; j < entries.length; j += 1) {
	                if (entries[j].key === field) {
	                    index = j;
	                    break;
	                }
	            }
	            if (index === -1 && series.chart._assignedColors[field]) {
	                entries.push({
	                    key: field,
	                    fill: series.chart._assignedColors[field].fill,
	                    stroke: series.chart._assignedColors[field].stroke,
	                    opacity: series.chart._assignedColors[field].opacity,
	                    series: series,
	                    aggField: row.aggField
	                });
	                index = entries.length - 1;
	                }
	            });
	        }, this);
	    }

		
        // Sort Alphabetically
        entries.sort(function(a, b){var x = a.key, y = b.key;
        	return y == "AA" ? 1 : x < y ? -1 : x > y ? 1 : 0;
			});
        
        return entries;
    };
// Add a storyboard to the main chart and set the tick event
var story = bubbles.setStoryboard("ListingCreationDateYear", onTick);
// Change the frame duration
story.frameDuration = frame;
// Order the storyboard by date
story.addOrderRule("Date");

// Draw the bubble chart
bubbles.draw();

//Change Tooltip Label Wording
mySeries1.getTooltipText = function(e) {

    // hovering over the chart fires an event
    // which creates an object 'e' 
    // with the information that you want

    // when you hover over different parts of your chart
    // this statement outputs the contents of 'e' to console:
    console.log(e);

    return ["Prosper Loans Credit Rating: " + e.aggField[0], "Median Estimated Return: " + 
    		e.xValue, "Median Actual Return: " + e.yValue];
    };

myLegend.shapes.selectAll("rect").attr("width", "12").attr("height", "12").attr("ry", "50%").attr("rx", "50%");


//Add graph labeling for above 1:1 dashed line
svg.selectAll("classify_text_graph")
    .data(["Actual Return > Estimated Return"])
    .enter()
    .append("text")
    .attr("id", "classify_text_above")
    .attr("x", 70)
    .attr("y", function (d, i) { return 100 + i * 12; })
	.style("font-family", "sans-serif")
	.style("font-size", "16px")
	.style("font-weight", "bold")
	.style("color", "Black")
	.text(function (d) { return d; });



//Add graph labeling for below 1:1 dashed line
svg.selectAll("classify_text_graph")
    .data(["Actual Return < Estimated Return"])
    .enter()
    .append("text")
    .attr("id", "classify_text_below")
    .attr("x", 350)
    .attr("y", function (d, i) { return 580 + i * 12; })
	.style("font-family", "sans-serif")
	.style("font-size", "16px")
	.style("font-weight", "bold")
	.style("color", "Black")
	.text(function (d) { return d; });

var ctx = document.getElementById("chartContainers"),
textElm = ctx.getElementById("classify_text_above"),
SVGRect = textElm.getBBox();

var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rect.setAttribute("x", SVGRect.x);
	rect.setAttribute("y", SVGRect.y);
	rect.setAttribute("width", SVGRect.width);
	rect.setAttribute("height", SVGRect.height);
	rect.setAttribute("fill", "white");
	ctx.insertBefore(rect, textElm);

var ctx = document.getElementById("chartContainers"),
textElm = ctx.getElementById("classify_text_below"),
SVGRect = textElm.getBBox();

var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rect.setAttribute("x", SVGRect.x);
	rect.setAttribute("y", SVGRect.y);
	rect.setAttribute("width", SVGRect.width);
	rect.setAttribute("height", SVGRect.height);
	rect.setAttribute("fill", "white");
	ctx.insertBefore(rect, textElm);


// Orphan the legends as they are consistent but by default they
// will refresh on tick
bubbles.legends = [];
// Remove the storyboard label because the chart will indicate the
// current month instead of the label
story.storyLabel.remove();

// On click of the side chart
function onClick(e) {
	// Pause the animation
	story.pauseAnimation();
	// If it is already selected resume the animation
	// otherwise pause and move to the selected month
	if (e.yValue === story.getFrameValue()) {
		story.startAnimation();
	} else {
		story.goToFrame(e.yValue);
		story.pauseAnimation();
	}
}

// On tick of the main charts storyboard
function onTick(e) {
  if (!firstTick) {
      // Color all shapes the same
    s.shapes
		.transition()
		.duration(frame / 2)
		.style("fill", function (d) { return (d.y === e ? indicatorColor.fill : defaultColor.fill) })
		.style("stroke", function (d) { return (d.y === e ? indicatorColor.stroke : defaultColor.stroke) });
  }

	firstTick = false;

	// Add one to one dashed line to plot
	svg.append("line")
		.attr("x1",x._scale(0))
		.attr("x2", x._scale(1))
		.attr("y1", y._scale(0))
		.attr("y2", y._scale(1))
		.style("stroke", "gray")
		.style("stroke-dasharray", "3");
}
});