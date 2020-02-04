// File: user.js
// Description: Handles API routing for Users.

require("path");
const express = require("express");
const validator = require("validator");

const userModel = require("../models/user");
const {userSchema, getSchemaViolations} = require("../utils/schemaValidation");

const app = express();

app.post("/", async (req, res) => {
  const schemaViolations = getSchemaViolations(req.body, userSchema);
  if (!schemaViolations) {
    try {
      const result = await userModel.createUser(req.body);

      console.log("201: User created\n");
      res.status(201).send({userId: result.insertId});
    } catch (err) {
      console.error("500: Error creating new User\n");
      res.status(500).send("Error creating new User. Please try again later.");
    }
  } else {
    console.error(schemaViolations);
    res.status(400).send({error: schemaViolations});
  }
});

app.get("/:onid", async (req, res) => {
  if (validator.isInt(req.params.onid + "")) {
    try {
      const onid = parseInt(req.params.onid);
      const results = await userModel.getUserByOnid(onid);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: User found\n");
        res.status(200).send(results[0]);
      } else {
        console.error("404: No User found\n");
        res.status(404).send("No User found");
      }
    } catch (err) {
      console.error("500: Error fetching User:", err);
      res.status(500).send("Unable to fetch User. Please try again later.");
    }
  } else {
    console.error("400: Invalid ONID\n");
    res.status(400).send("Invalid ONID");
  }
});

// get all of the plans created by user
app.get("/:onid/plans", async (req, res) => {
  if (validator.isInt(req.params.onid + "")) {
    try {
      const onid = parseInt(req.params.onid);
      const results = await userModel.getUserPlans(onid);

      if (Array.isArray(results) && results.length > 0) {
        console.log("200: Plans found\n");
        res.status(200).send(results);
      } else {
        console.error("404: No plans found\n");
        res.status(404).send("No plans found");
      }
    } catch (err) {
      console.error("500: Error fetching Plans:", err);
      res.status(500).send("Unable to fetch Plans. Please try again later.");
    }
  } else {
    console.error("400: Invalid ONID\n");
    res.status(400).send("Invalid ONID");
  }
});

module.exports = app;
