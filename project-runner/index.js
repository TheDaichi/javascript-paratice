#!/usr/bin/env node

/**
 * * Watching the folder to change by chokidar module
 * * CLI tool
 * * child_process for executing code within program
 */

const chokidar = require("chokidar");
const debounce = require("lodash.debounce");

const start = debounce(() => {
  console.log("Starting")
}, 100);

chokidar
  .watch(".")
  .on("add", () => start)
  .on("change", () => console.log("File Change"));
