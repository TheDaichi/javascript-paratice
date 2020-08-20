#!/usr/bin/env node

/**
 * * Watching the folder to change by chokidar module
 * * CLI tool
 * * child_process for executing code within program
 */

const fs = require("fs");
const { spawn } = require("child_process");
const chalk = require("chalk");
const chokidar = require("chokidar");
const debounce = require("lodash.debounce");
const prog = require("caporal");

prog
  .version("0.0.0")
  .argument("[filename]", "Name of file to execute")
  .action(async ({ filename }) => {
    const name = filename || "index.js";
    try {
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(`Could not find file ${name}`);
    }
    let proc;
    const start = debounce(() => {
      console.log(chalk.bold.red("[Starting Program]"));
      if (proc) {
        proc.kill();
      }
      proc = spawn("node", [name], { stdio: "inherit" });
    }, 500);

    chokidar
      .watch(".")
      .on("add", start)
      .on("unlink", start)
      .on("change", start);
  });

prog.parse(process.argv);
