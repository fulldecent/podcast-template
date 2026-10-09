#!/usr/bin/env node
// Parse committed YAML and episode front matter. Fail on the first syntax error.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

const root = process.cwd();
const errors = [];

function load(path, text) {
  try {
    yaml.load(text, { filename: path });
  } catch (error) {
    errors.push(`${path}: ${error.message}`);
  }
}

function frontMatter(path) {
  const text = readFileSync(path, "utf8");
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) {
    errors.push(`${path}: missing YAML front matter`);
    return;
  }
  const end = text.indexOf("\n---", 4);
  if (end === -1) {
    errors.push(`${path}: unclosed YAML front matter`);
    return;
  }
  load(path, text.slice(4, end));
}

for (const name of ["_config.yml"]) {
  load(name, readFileSync(join(root, name), "utf8"));
}

for (const name of readdirSync(join(root, "_data"))) {
  if (name.endsWith(".yml") || name.endsWith(".yaml")) {
    const path = join("_data", name);
    load(path, readFileSync(join(root, path), "utf8"));
  }
}

for (const name of readdirSync(join(root, "_episodes"))) {
  if (name.endsWith(".md")) {
    frontMatter(join("_episodes", name));
  }
}

if (errors.length) {
  for (const line of errors) {
    console.error(line);
  }
  process.exit(1);
}

console.log("YAML ok: _config.yml, _data/, _episodes/ front matter");
