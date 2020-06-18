import React, { Component } from "react";
import { Icon } from "antd";

import { PriceByContractType } from "../../services/grafic";
import "./index.css";
// import { Container } from './styles';

export default class GraficoContainer extends Component {
  state = {
    array: [
      ["Task", "Hours per Day"],
      ["Work", 11],
      ["Eat", 2],
      ["Commute", 2],
      ["Watch TV", 2],
    ],
    icon: "pie-chart",
  };

  drawTrendlines = () => {
    var data = new window.google.visualization.DataTable(
      {
        cols: [
          { id: "task", label: "Task", type: "string" },
          { id: "hours", label: "Hours per Day", type: "number" },
        ],
        rows: [
          { c: [{ v: "Work" }, { v: 11 }] },
          { c: [{ v: "Eat" }, { v: 2 }] },
          { c: [{ v: "Commute" }, { v: 2 }] },
          { c: [{ v: "Watch TV" }, { v: 2 }] },
          { c: [{ v: "Sleep" }, { v: 7, f: "7.000" }] },
        ],
      },
      0.6
    );
    // data.addColumn("timeofday", "Time of Day");
    // data.addColumn("number", "Motivation Level");
    // data.addColumn("number", "Energy Level");

    // data.addRows([
    //   [{ v: [8, 0, 0], f: "8 am" }, 1, 0.25],
    //   [{ v: [9, 0, 0], f: "9 am" }, 2, 0.5],
    //   [{ v: [10, 0, 0], f: "10 am" }, 3, 1],
    //   [{ v: [11, 0, 0], f: "11 am" }, 4, 2.25],
    //   [{ v: [12, 0, 0], f: "12 pm" }, 5, 2.25],
    //   [{ v: [13, 0, 0], f: "1 pm" }, 6, 3],
    //   [{ v: [14, 0, 0], f: "2 pm" }, 7, 4],
    //   [{ v: [15, 0, 0], f: "3 pm" }, 8, 5.25],
    //   [{ v: [16, 0, 0], f: "4 pm" }, 9, 7.5],
    //   [{ v: [17, 0, 0], f: "5 pm" }, 10, 10]
    // ]);

    var options = {
      title: "Motivation and Energy Level Throughout the Day",
      trendlines: {
        0: { type: "linear", lineWidth: 5, opacity: 0.3 },
        1: { type: "exponential", lineWidth: 10, opacity: 0.3 },
      },
      hAxis: {
        title: "Time of Day",
        format: "h:mm a",
        viewWindow: {
          min: [7, 30, 0],
          max: [17, 30, 0],
        },
      },
      vAxis: {
        title: "Rating (scale of 1-10)",
      },
    };

    var chart = new window.google.visualization.ColumnChart(
      document.getElementById("chart_div")
    );
    chart.draw(data, options);
  };

  drawChart = () => {
    var data = window.google.visualization.arrayToDataTable(this.state.array);

    var options = {
      title: "My Daily Activities",
      is3D: false,
    };
    var chart = new window.google.visualization.PieChart(
      document.getElementById("piechart_3d")
    );
    chart.draw(data, options);
  };

  drawChartt = () => {
    var data = window.google.visualization.arrayToDataTable([
      ["Label", "Value"],
      ["Viadagem", 0],
    ]);

    var options = {
      width: 400,
      height: 120,
      redFrom: 90,
      redTo: 100,
      yellowFrom: 75,
      yellowTo: 90,
      minorTicks: 5,
    };

    var chart = new window.google.visualization.Gauge(
      document.getElementById("chart_div")
    );

    chart.draw(data, options);

    setInterval(function () {
      data.setValue(0, 1, 5);
      chart.draw(data, options);
    }, 1000);

    setInterval(function () {
      data.setValue(0, 1, 99);
      chart.draw(data, options);
    }, 3000);
  };

  GraficRender = () => {
    switch (this.state.icon) {
      case "pie-chart":
        window.google.charts.load("current", { packages: ["corechart"] });
        window.google.charts.setOnLoadCallback(this.drawChart);
        return (
          <div
            id="piechart_3d"
            style={{ width: "900px", height: "500px" }}
          ></div>
        );
      case "bar-chart":
        window.google.charts.load("current", {
          packages: ["corechart", "bar"],
        });
        window.google.charts.setOnLoadCallback(this.drawTrendlines);
        return (
          <div id="chart_div" style={{ width: "900px", height: "500px" }}></div>
        );
      case "line-chart":
        window.google.charts.load("current", { packages: ["gauge"] });
        window.google.charts.setOnLoadCallback(this.drawChartt);
        return (
          <div id="chart_div" style={{ width: "900px", height: "500px" }}></div>
        );
      default:
        return null;
    }
  };

  componentDidMount = async () => {
    const { status, data } = await PriceByContractType();

    this.setState({ array: data });
  };

  render() {
    return (
      <div className="div-container-main-grafic">
        <div className="div-container-icons-grafic">
          <div>
            <Icon
              type="area-chart"
              onClick={() => this.setState({ icon: "area-chart" })}
            />
          </div>
          <div>
            <Icon
              type="pie-chart"
              onClick={() => this.setState({ icon: "pie-chart" })}
            />
          </div>
          <div>
            <Icon
              type="bar-chart"
              onClick={() => this.setState({ icon: "bar-chart" })}
            />
          </div>
          <div>
            <Icon
              type="line-chart"
              onClick={() => this.setState({ icon: "line-chart" })}
            />
          </div>
        </div>
        <this.GraficRender />
      </div>
    );
  }
}
