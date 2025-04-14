# Reveal BI SDK Node.js Server Integration

This document provides an overview of integrating the Reveal BI SDK into a Node.js application using Express. It outlines the key components and configurations required to serve dashboards and handle data source interactions.

## Dependencies

This server implementation relies on the following core Node.js packages:

* **express**: A minimal and flexible Node.js web application framework used to create the server and handle HTTP requests.
* **reveal-sdk-node**: The official Reveal BI SDK package for Node.js, providing the necessary functions and middleware to integrate Reveal functionality.
* **cors**: Middleware to enable Cross-Origin Resource Sharing, allowing requests from different origins (like a front-end application).

## Integrating Reveal

Reveal is integrated into the Express application as middleware. The core configuration is managed through an `revealOptions` object, which bundles various provider functions responsible for handling specific aspects of the Reveal integration.

```javascript
const revealOptions = {
  userContextProvider: userContextProvider,
  authenticationProvider: authenticationProvider,
  dataSourceProvider: dataSourceProvider,
  dataSourceItemProvider: dataSourceItemProvider,
  localFileStoragePath: "data" // Example: Specifies local path for dashboard files
}

// Initialize Reveal middleware with the defined options
app.use('/', reveal(revealOptions));
```