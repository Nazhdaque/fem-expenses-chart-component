import "./style.css";
import Chart from "chart.js/auto";

const data = [
	{
		day: "mon",
		amount: 17.45,
	},
	{
		day: "tue",
		amount: 34.91,
	},
	{
		day: "wed",
		amount: 52.36,
	},
	{
		day: "thu",
		amount: 31.07,
	},
	{
		day: "fri",
		amount: 23.39,
	},
	{
		day: "sat",
		amount: 43.28,
	},
	{
		day: "sun",
		amount: 25.48,
	},
];

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
	getValues = () => {
		return {
			tooltipTitle_hidden: () => "",
			label: "$",
			labels: this.getlabels(),
			data: this.getAmounts(),
			backgroundColor: this.getMainBgColor(),
			hoverBackgroundColor: this.getHoverBgColor(),
			chartColors: this.chartColors,
			borderRadius: 5,
		};
	};
}

const values = new chartValues(data);
const expensesChart = values.getValues();

new Chart(document.getElementById("expenses-chart"), {
	type: "bar",
	options: {
		aspectRatio: 1.1,
		maintainAspectRatio: false,
		animation: true,
		scales: {
			x: {
				grid: {
					display: false,
				},
				ticks: {
					color: expensesChart.chartColors.xTicksColor,
					font: {
						size: 18,
					},
				},
				border: {
					display: false,
				},
			},
			y: {
				display: false,
				grace: 15,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				caretSize: 0,
				caretPadding: 8,
				yAlign: "bottom",
				xAlign: "center",
				displayColors: false,
				callbacks: {
					title: expensesChart.tooltipTitle_hidden,
				},
				bodyColor: expensesChart.chartColors.tooltipBodyColor,
				backgroundColor: expensesChart.chartColors.tooltipBgColor,
				bodyFont: {
					size: 16,
					weight: "500",
				},
				padding: 10,
				cornerRadius: 7,
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
				borderRadius: expensesChart.borderRadius,
				hoverBackgroundColor: expensesChart.hoverBackgroundColor,
				borderSkipped: false,
			},
		],
	},
});
