document.addEventListener("DOMContentLoaded", function () {
    const widgetContainer = document.getElementById("widgetContainer");
    const addButton = document.getElementById("addButton");
    const removeButton = document.getElementById("removeButton");

    let widgetCounter = 0;

    addButton.addEventListener("click", function () {
        document.getElementById('addWidgetModal').classList.remove('hidden');
    });

    document.getElementById('closeModalBtn').addEventListener("click", function () {
        document.getElementById('addWidgetModal').classList.add('hidden');
    });

    const lineWidgetBtn = document.getElementById('lineWidgetBtn');
    const barWidgetBtn = document.getElementById('barWidgetBtn');
    const pieWidgetBtn = document.getElementById('pieWidgetBtn');
    const sankyWidgetBtn = document.getElementById('sankyWidgetBtn');

    lineWidgetBtn.addEventListener("click", function () {
        addWidget('line');
    });

    barWidgetBtn.addEventListener("click", function () {
        addWidget('bar');
    });

    pieWidgetBtn.addEventListener("click", function () {
        addWidget('pie');
    });

    sankyWidgetBtn.addEventListener("click", function () {
        addWidget('sanky');
    });

    removeButton.addEventListener("click", function () {
        const widgets = widgetContainer.getElementsByClassName("widget");
        if (widgets.length > 0) {
            widgetContainer.removeChild(widgets[widgets.length - 1]);
        }
    });

    function addWidget(widgetType) {
        const widget = createWidget(widgetType);
        widgetContainer.appendChild(widget[0]);
        showchart(widgetType,widget[1],widget[2]);
        document.getElementById('addWidgetModal').classList.add('hidden');
    }

    function createWidget() {
        const widget = document.createElement("div");
        widget.classList.add("widget", "bg-white", "p-4", "rounded", "shadow");
    
        const chartDiv = document.createElement("div");
        const chartDivId = `chart${widgetCounter}`; // Generate unique ID
        chartDiv.setAttribute("id", chartDivId);
        chartDiv.style.width = "100%";
        chartDiv.style.height = "400px"; // Adjust the height as needed
        widget.appendChild(chartDiv);
        widgetCounter++;
        // Create AmCharts chart based on widget type
        return [widget,chartDiv,chartDivId];
    }

    function showchart(widgetType,chartDivId,chartDivId){

        if (widgetType === 'line') {
            createLineChart(chartDivId);
        } else if (widgetType === 'bar') {
            createBarChart(chartDivId);
        } else if (widgetType === 'pie') {
            createPieChart(chartDivId);
        } else if (widgetType === 'sanky') {
            createElectricityConsumptionGaugeChart(chartDivId);
        }
    }

    // Function to create a line chart
    function createLineChart(chartDivId) {
        var chart = am4core.create(chartDivId, am4charts.XYChart);
        chart.paddingRight = 20;
        // Add dummy data
        chart.data = [
            { date: new Date(2022, 0, 1), value: 450 },
            { date: new Date(2022, 1, 1), value: 560 },
            { date: new Date(2022, 2, 1), value: 870 },
            // Add more data points as needed
        ];
        // Create x-axis
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.dateFormats.setKey("month", "MMM");
        // Create y-axis
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.tooltipText = "{value}"
        chart.cursor = new am4charts.XYCursor();
    }

    // Function to create a bar chart
    function createBarChart(chartDivId) {
        var chart = am4core.create(chartDivId, am4charts.XYChart);
        chart.paddingRight = 20;
        // Add dummy data
        chart.data = [
            { category: "Category 1", value: 200 },
            { category: "Category 2", value: 450 },
            { category: "Category 3", value: 600 },
            // Add more data points as needed
        ];
        // Create x-axis
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        // Create y-axis
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "category";
        series.columns.template.tooltipText = "{valueY.value}";
        series.columns.template.fill = am4core.color("#FF6600");
    }

    function createPieChart(chartDivId) {
        // Create chart instance
        var chart = am4core.create(chartDivId, am4charts.PieChart);
    
        // Add dummy data
        chart.data = [
            { category: "Category 1", value: 200 },
            { category: "Category 2", value: 450 },
            { category: "Category 3", value: 600 }
            // Add more data points as needed
        ];
    
        // Add and configure pie series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "category";
    
        // Add labels
        chart.innerRadius = am4core.percent(50);
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;
    
        // Add legend
        chart.legend = new am4charts.Legend();
    }


    function createElectricityConsumptionGaugeChart(chartDivId) {
        // Create chart instance
        var chart = am4core.create(chartDivId, am4charts.GaugeChart);
    
        // Create axis
        var axis = chart.xAxes.push(new am4charts.ValueAxis());
    
        // Set min and max values
        axis.min = 0;
        axis.max = 100;
    
        // Create ranges
        var range = axis.axisRanges.create();
        range.value = 0;
        range.endValue = 50;
        range.axisFill.fillOpacity = 1;
        range.axisFill.fill = am4core.color("#2AC5D9");
        range.axisFill.zIndex = -1;
    
        var range2 = axis.axisRanges.create();
        range2.value = 50;
        range2.endValue = 100;
        range2.axisFill.fillOpacity = 1;
        range2.axisFill.fill = am4core.color("#E04242");
        range2.axisFill.zIndex = -1;
    
        // Add hand
        var hand = chart.hands.push(new am4charts.ClockHand());
    
        // Configure hand
        hand.fill = am4core.color("#3E517A");
        hand.stroke = am4core.color("#3E517A");
        hand.innerRadius = am4core.percent(20);
        hand.radius = am4core.percent(80);
        hand.startWidth = 10;
    
        // Set the value
        hand.showValue(75, 40, am4core.ease.cubicOut);
    }
    

    
    

})