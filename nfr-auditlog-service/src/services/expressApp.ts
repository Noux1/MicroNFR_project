import express, {Request,Response,Application } from 'express';
import cors from "cors";
export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // app.use(cors({
    //     origin: '*', // Remplacez '*' par l'origine spécifique si nécessaire
    //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
    //   }));





return app;}
