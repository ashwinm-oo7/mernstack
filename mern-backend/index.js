const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 5000;

const API_URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

// Use CORS middleware
app.use(cors());
// Utility function to paginate results
const paginate = (array, page, perPage) => {
  return array.slice((page - 1) * perPage, page * perPage);
};

const categorizePrice = (price) => {
  if (price <= 100) return "0-100";
  if (price <= 200) return "101-200";
  if (price <= 300) return "201-300";
  if (price <= 400) return "301-400";
  if (price <= 500) return "401-500";
  if (price <= 600) return "501-600";
  if (price <= 700) return "601-700";
  if (price <= 800) return "701-800";
  if (price <= 900) return "801-900";
  return "901-above";
};

app.get("/barchart", async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).send({ error: "Month is required" });
  }

  const monthNumber = monthToNumber(month);
  if (monthNumber === undefined) {
    return res.status(400).send({ error: "Invalid month value" });
  }

  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    // Initialize the price range counters
    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    data.forEach((transaction) => {
      const date = new Date(transaction.dateOfSale);
      if (date.getMonth() === monthNumber) {
        const range = categorizePrice(transaction.price);
        priceRanges[range] += 1;
      }
    });

    res.json(priceRanges);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/statistics", async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).send({ error: "Month is required" });
  }

  const monthNumber = monthToNumber(month);
  if (monthNumber === undefined) {
    return res.status(400).send({ error: "Invalid month value" });
  }

  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    let totalSaleAmount = 0;
    let totalSoldItems = 0;
    let totalNotSoldItems = 0;

    data.forEach((transaction) => {
      const date = new Date(transaction.dateOfSale);
      if (date.getMonth() === monthNumber) {
        if (transaction.sold) {
          totalSaleAmount += transaction.price;
          totalSoldItems += 1;
        } else {
          totalNotSoldItems += 1;
        }
      }
    });

    res.json({
      month,
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/allTransactions", async (req, res) => {
  const { search = "", page = 1, perPage = 10 } = req.query;

  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    // Filter data based on search parameters
    const filteredData = data.filter((transaction) => {
      const searchText = search.toLowerCase();
      return (
        transaction.title.toLowerCase().includes(searchText) ||
        transaction.description.toLowerCase().includes(searchText) ||
        transaction.price.toString().includes(searchText)
      );
    });

    // Paginate filtered data
    const paginatedData = paginate(filteredData, Number(page), Number(perPage));

    res.json({
      page: Number(page),
      perPage: Number(perPage),
      total: filteredData.length,
      totalPages: Math.ceil(filteredData.length / perPage),
      data: paginatedData,
    });
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Utility function to convert month name to number
const monthToNumber = (month) => {
  const months = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };
  return months[month.toLowerCase()];
};

app.get("/transactions", async (req, res) => {
  const { search, month, page = 1, perPage = 10 } = req.query;

  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    const monthNumber = monthToNumber(month);
    const filteredData = data.filter((transaction) => {
      const date = new Date(transaction.dateOfSale);
      return date.getMonth() === monthNumber;
    });

    const searchedData = search
      ? filteredData.filter(
          (transaction) =>
            transaction.title.toLowerCase().includes(search.toLowerCase()) ||
            transaction.description
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            transaction.price.toString().includes(search)
        )
      : filteredData;

    const startIndex = (page - 1) * perPage;
    const paginatedData = searchedData.slice(startIndex, startIndex + perPage);

    res.json({
      data: paginatedData,
      total: searchedData.length,
      page,
      perPage,
    });
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
