import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { NotificationRoutes } from "../routes/notificationRoutes";
import { UserRoutes } from "../routes/userRoutes";

export default async (app: Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  
  

  app.use('/notifications', NotificationRoutes);
  app.use('/users', UserRoutes);

  return app;
};
