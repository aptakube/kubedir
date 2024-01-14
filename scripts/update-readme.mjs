import { writeFileSync, readFileSync } from "fs";
import { listProjects } from "./utils.mjs";

const categories = JSON.parse(readFileSync("./categories.json", "utf-8"));
const projects = listProjects();
let readme = `![Kubedir Logo](https://kubedir.com/logo.png)

# Crowd-sourced directory for all things Kubernetes

Visit https://kubedir.com

`;

for (const category of categories) {
  readme += `\r\n## ${category.emoji} ${category.name}\r\n`;
  const projectsInCategory = projects.filter(
    (project) => project.category === category.id
  );

  for (const project of projectsInCategory) {
    readme += `- [${project.name}](https://kubedir.com/${project.id}) - ${project.tagline}\r\n`;
  }
}

writeFileSync("./README.md", readme);
