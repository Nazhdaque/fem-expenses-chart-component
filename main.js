import "./style.css";
import Chart from "chart.js/auto";

class chartValues {
	constructor(data) {
		this.data = data;
		this.chartColors = {
			main: "hsl(10, 79%, 65%)",
			mainOnHover: "hsl(10, 100%, 76%)",
			accent: "hsl(186, 34%, 60%)",
			accentOnHover: "hsl(187, 49%, 80%)",
			tooltipBgColor: "hsl(25, 47%, 15%)",
			tooltipBodyColor: "hsl(33, 100%, 98%)",
			xTicksColor: "hsl(28, 10%, 53%)",
		};
		this.keys = [...new Set(this.data.flatMap(Object.keys))];
		this.amounts = this.getAmounts();
		this.maxValue = this.getMaxValue();
		this.breakpoint = 450;
	}

	getlabels = () => this.data.map(entry => entry[this.keys[0]]);
	getAmounts = () => this.data.map(entry => entry[this.keys[1]]);
	getMaxValue = () => Math.max(...this.amounts);
	getMainBgColor = () =>
		this.data.map(entry =>
			entry[this.keys[1]] === this.maxValue
				? this.chartColors.accent
				: this.chartColors.main
		);
	getHoverBgColor = () =>
		this.data.map(entry =>
			entry[this.keys[1]] === this.maxValue
				? this.chartColors.accentOnHover
				: this.chartColors.mainOnHover
		);
	getResponsiveParams = () => {
		if (window.outerWidth <= this.breakpoint) {
			Chart.defaults.font.size = 12;
			Chart.defaults.elements.bar.borderRadius = 3;
			Chart.defaults.plugins.tooltip.bodyFont.size = 12;
			Chart.defaults.plugins.tooltip.cornerRadius = 3;
			Chart.defaults.plugins.tooltip.padding = 5;
		} else {
			Chart.defaults.font.size = 18;
			Chart.defaults.elements.bar.borderRadius = 5;
			Chart.defaults.plugins.tooltip.bodyFont.size = 16;
			Chart.defaults.plugins.tooltip.cornerRadius = 5;
			Chart.defaults.plugins.tooltip.padding = 8;
		}
	};
	getValues = () => {
		return {
			tooltipTitle_hidden: () => "",
			label: "$",
			labels: this.getlabels(),
			data: this.getAmounts(),
			backgroundColor: this.getMainBgColor(),
			hoverBackgroundColor: this.getHoverBgColor(),
			chartColors: this.chartColors,
			responsiveParams: this.getResponsiveParams,
		};
	};
}

const getData = async () => {
	const responce = await fetch("data.json");
	const data = await responce.json();
	const values = new chartValues(data);
	return values.getValues();
};

const getChart = async () => {
	const ctx = document.getElementById("expenses-chart");
	const expensesChart = await getData();

	new Chart(ctx, {
		type: "bar",
		options: {
			aspectRatio: 1.25,
			maintainAspectRatio: false,
			animation: true,
			scales: {
				x: {
					grid: { display: false },
					ticks: {
						color: expensesChart.chartColors.xTicksColor,
						font: { size: expensesChart.responsiveParams },
					},
					border: { display: false },
				},
				y: {
					display: false,
					grace: 15,
				},
			},
			plugins: {
				legend: { display: false },
				tooltip: {
					callbacks: { title: expensesChart.tooltipTitle_hidden },
					caretSize: 0,
					caretPadding: 8,
					yAlign: "bottom",
					xAlign: "center",
					displayColors: false,
					bodyColor: expensesChart.chartColors.tooltipBodyColor,
					backgroundColor: expensesChart.chartColors.tooltipBgColor,
					bodyFont: {
						size: expensesChart.responsiveParams,
						weight: "500",
					},
				},
			},
		},

		data: {
			labels: expensesChart.labels,
			datasets: [
				{
					label: expensesChart.label,
					data: expensesChart.data,
					backgroundColor: expensesChart.backgroundColor,
					hoverBackgroundColor: expensesChart.hoverBackgroundColor,
					borderSkipped: false,
				},
			],
		},
	});
};

getChart();
