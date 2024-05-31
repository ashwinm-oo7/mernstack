import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import BarChart from "./components/BarChart.js";
import StatisticsGUI from "./components/StatisticsGUI.js";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("March");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, [search, month, page, perPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/transactions", {
        params: { search, month, page, perPage },
      });
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search change
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); // Reset to first page on month change
  };

  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(page > 1 ? page - 1 : 1);

  return (
    <div className="app-container">
      <h1>Transactions Table</h1>
      <div className="dashboard">
        <h2>Transaction Dashboard</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search transaction"
            value={search}
            onChange={handleSearch}
          />
          <select value={month} onChange={handleMonthChange}>
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
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.title}</td>
                <td>{tx.description}</td>
                <td>{tx.price}</td>
                <td>{tx.category}</td>
                <td>{tx.sold ? "Yes" : "No"}</td>
                <td>
                  <img src={tx.image} alt={tx.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <span>Page No: {page}</span>
          <button onClick={handleNextPage}>Next</button>
        </div>
      </div>
      <StatisticsGUI />
      <BarChart />
    </div>
  );
};

export default App;
