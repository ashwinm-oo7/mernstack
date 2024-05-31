import React, { useState, useEffect } from "react";

function StatisticsGUI() {
  const [statistics, setStatistics] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);

  useEffect(() => {
    if (selectedMonth) {
      fetchStatistics(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchStatistics = async (month) => {
    try {
      const response = await fetch(
        `http://localhost:5000/statistics?month=${month}`
      );
      const data = await response.json();
      // console.log(data);
      setStatistics(data);
      // Initialize statistics for the selected month
      setSelectedMonth(data.month);
      setTotalSaleAmount(data.totalSaleAmount);
      setTotalSoldItems(data.totalSoldItems);
      setTotalNotSoldItems(data.totalNotSoldItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);
  };

  return (
    <div>
      <h2>Statistics for Selected Month</h2>
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
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3>Total Sale Amount: {totalSaleAmount}</h3>
        <h3>Total Sold Items: {totalSoldItems}</h3>
        <h3>Total Not Sold Items: {totalNotSoldItems}</h3>
      </div>
    </div>
  );
}

export default StatisticsGUI;
