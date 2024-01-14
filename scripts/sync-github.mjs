import { writeFileSync, readFileSync } from "fs";
import { gitHubRequest, listProjects } from "./utils.mjs";

async function syncReactions(project) {
  let reactions = [];

  if (project.issue) {
    const allReactions = await gitHubRequest(
      `/repos/aptakube/kubedir/issues/${project.issue}/reactions`
    );

    reactions = allReactions.map((r) => ({
      login: r.user.login,
      content: r.content,
      avatar_url: r.user.avatar_url,
      created_at: r.created_at,
    }));
  }

  writeFileSync(
    `./autogen/reactions/${project.id}.json`,
    JSON.stringify(reactions, null, 2),
    { encoding: "utf-8" }
  );

  return reactions;
}

async function syncReviews(project) {
  let reviews = [];

  if (project.issue) {
    const comments = await gitHubRequest(
      `/repos/aptakube/kubedir/issues/${project.issue}/comments`
    );

    reviews = comments.map((c) => ({
      login: c.user.login,
      avatar_url: c.user.avatar_url,
      html_url: c.html_url,
      rating: c.body.split("\r\n")[0].match(/⭐️/g)?.length || 0,
      body: c.body.split("\r\n").slice(1).join("\r\n").replace(/^\s+/g, ""),
      created_at: c.created_at,
    }));
  }

  writeFileSync(
    `./autogen/reviews/${project.id}.json`,
    JSON.stringify(reviews, null, 2),
    { encoding: "utf-8" }
  );

  return reviews;
}

const projects = listProjects();
for (const project of projects) {
  console.log(`Processing ${project}.`);

  const reviews = await syncReviews(project);
  const reactions = await syncReactions(project);
  console.log(`⭐️ Found ${reviews.length} reviews.`);
  console.log(`👍 Found ${reactions.length} reactions.`);
  console.log("");
}
