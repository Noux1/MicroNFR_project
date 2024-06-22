import express from 'express';
import App from './services/expressApp'
import {consume } from "./services/audit-consumer";
import DBConnection from './config/database'
import AuditRoutes from './routes/audit-routes';
const eurekaHelper = require('./eureka-helper'); // Assuming eureka-helper registers with Eureka
const PORT=3040;
const StartServer = async () => {
  const app = express()
  await DBConnection()
  await App(app)
  app.use('/audit', AuditRoutes);

 
 
  // start the consumer, and log any errors
  consume().catch((err: Error) => {
    console.error("error in consumer: ", err);
  });
  eurekaHelper.registerWithEureka('ms-audit', PORT);
  app.listen(PORT || 3040, () => {
    console.log(`Listening on port ${PORT}`);
  })
}


StartServer()