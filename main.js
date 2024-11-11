var express = require('express');
var reveal = require('reveal-sdk-node');
var cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Step 0 - Create API to Retrieve Dashboards - this is only necessary if you want to list dashboards in your client UI
app.get('/dashboards', (req, res) => {
  const directoryPath = './dashboards';
  fs.readdir(directoryPath, (err, files) => {
    const fileNames = files.map((file) => {
    const { name } = path.parse(file);
    return { name };
    });
    res.send(fileNames);
  });
});

// Step 1 - Optional, userContext
const userContextProvider = (request) => {
  const userId = request.headers['x-header-one']; 
  console.log("in userContextProvider " + userId);  
  var props = new Map();
  props.set("userId", userId); 
  return new reveal.RVUserContext(userId, props);
};

// Step 2 - Set up your Authentication Provider
  const authenticationProvider = async (userContext, dataSource) => {
    if (dataSource instanceof reveal.RVODataDataSource) {
      return new reveal.RVUsernamePasswordDataSourceCredential("", ""); 
    }
  }

// Step 3 - Set up your Data Source Provider
const dataSourceProvider = async (userContext, dataSource) => {
  if (dataSource instanceof reveal.RVRESTDataSource) {
    if (dataSource.id === "Invoices") {
      dataSource.url = `https://northwindcloud.azurewebsites.net/api/invoices/customer/${userContext.userId}`;
    }

    if (dataSource.id === "SalesByCategory") {
      dataSource.url = "https://excel2json.io/api/share/6e0f06b3-72d3-4fec-7984-08da43f56bb9/";
    }

    if (dataSource.id === "CustomerOrders") {
      dataSource.url = `https://northwindcloud.azurewebsites.net/api/customers_orders_min/${userContext.userId}`;
    }
  }
  return dataSource;
}

// Step 4 - Set up your Data Source Item Provider
const dataSourceItemProvider = async (userContext, dataSourceItem) => {
  if (dataSourceItem instanceof reveal.RVJsonDataSourceItem && 
        dataSourceItem.resourceItem instanceof reveal.RVRESTDataSourceItem) {
    await dataSourceProvider(userContext, dataSourceItem.resourceItem.dataSource);
  } else {
    await dataSourceProvider(userContext, dataSourceItem.dataSource);
  }
  return dataSourceItem;
};

// Step 5 - Set up your Reveal Options
const revealOptions = {
    userContextProvider: userContextProvider,
    authenticationProvider: authenticationProvider,
    dataSourceProvider: dataSourceProvider,
    dataSourceItemProvider: dataSourceItemProvider,
    localFileStoragePath: "data"
}

// Step 6 - Initialize Reveal with revealOptions
app.use('/', reveal(revealOptions));

// Step 7 - Start your Node Server
app.listen(7006, () => {
    console.log(`Reveal server accepting http requests`);
});
