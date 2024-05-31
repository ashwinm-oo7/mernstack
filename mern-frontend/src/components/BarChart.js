import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const BarChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [barChartData, setBarChartData] = useState(null);

  useEffect(() => {
    if (selectedMonth) {
      fetchData(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchData = async (month) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/barchart?month=${month}`
      );
      const data = response.data;

      if (Array.isArray(data.items)) {
        const processedData = processBarChartData(data.items);
        setBarChartData(processedData);
      } else {
        console.error("Error: Expected an array of items but received:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processBarChartData = (data) => {
    const priceRanges = [];
    const itemCounts = [];

    // Initialize price ranges and item counts arrays
    for (let i = 0; i <= 500; i += 100) {
      priceRanges.push(`${i}-${i + 100}`);
      itemCounts.push(0);
    }

    // Update item counts based on the received data
    data.forEach((item) => {
      const priceRangeIndex = Math.floor(item.price / 100);
      if (priceRangeIndex < itemCounts.length) {
        itemCounts[priceRangeIndex] += item.quantity;
      }
    });

    // Prepare dataset for the chart
    const dataset = {
      labels: priceRanges,
      datasets: [
        {
          label: "Number of Items",
          data: itemCounts,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };

    return dataset;
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const chartOptions = {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Price Range",
          },
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Value",
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div>
      <h2>BarChart Status</h2>
      <div>
        <label htmlFor="monthSelect">Select Month:</label>
        <select
          id="monthSelect"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      {barChartData && (
        <div>
          <Bar data={barChartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default BarChart;
