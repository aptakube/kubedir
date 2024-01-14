import { gitHubRequest, listProjects } from "./utils.mjs";

async function listIssues() {
  const issues = await gitHubRequest(
    "GET",
    `/repos/aptakube/kubedir/issues?per_page=100&labels=project`
  );

  if (issues.length >= 100) {
    throw new Error("More than 100 issues found, need to implement paging!");
  }

  return issues;
}

async function createIssue(title, body) {
  const issue = await gitHubRequest("POST", `/repos/aptakube/kubedir/issues`, {
    title,
    body,
    labels: ["project"],
  });

  return issue;
}

async function updateIssueBody(issueNumber, body) {
  const issue = await gitHubRequest(
    "PATCH",
    `/repos/aptakube/kubedir/issues/${issueNumber}`,
    {
      body,
    }
  );

  return issue;
}

async function getReactions(issueNumber) {
  const reactions = await gitHubRequest(
    "GET",
    `/repos/aptakube/kubedir/issues/${issueNumber}/reactions`
  );

  return reactions.map((r) => ({
    login: r.user.login,
    content: r.content,
    avatar_url: r.user.avatar_url,
    created_at: r.created_at,
  }));
}

async function getReviews(issueNumber) {
  const comments = await gitHubRequest(
    "GET",
    `/repos/aptakube/kubedir/issues/${issueNumber}/comments`
  );

  return comments.map((c) => ({
    login: c.user.login,
    avatar_url: c.user.avatar_url,
    html_url: c.html_url,
    rating: c.body.split("\r\n")[0].match(/⭐️/g)?.length || 0,
    body: c.body.split("\r\n").slice(1).join("\r\n").replace(/^\s+/g, ""),
    created_at: c.created_at,
  }));
}

const issues = await listIssues();
const projects = listProjects();
for (const project of projects) {
  console.log(`Processing ${project.name}.`);

  const issueBody = `Project: ${project.url}

1️⃣ **Like this project?** Upvote this issue with a 👍 reaction

2️⃣ **Have you used it before?** Add a comment on this issue with your review. The first line must include between 1 and 5 ⭐️ emojis, the other lines are free text.

3️⃣ **Found something out-of-date?** Modify [${project.id}.json](https://github.com/aptakube/kubedir/blob/main/projects/${project.id}.json) and send us a PR!

Upvotes and reviews may take up to 24h before showing up on [kubedir.com](https://kubedir.com)

☸️`;

  let issue = issues.find((i) => i.title === project.name);
  if (issue) {
    if (issue.body !== issueBody) {
      console.log(`❌ Issue is out-of-date, updating...`);
      await updateIssueBody(issue.number, issueBody);
      console.log(`✅ Updated issue #${issue.number}`);
    }
  } else {
    console.log(`❌ Issue not found, creating one...`);
    issue = await createIssue(project.name, issueBody);
    console.log(`✅ Created issue #${issue.number}`);
  }

  const reviews = await getReviews(issue.number);
  const reactions = await getReactions(issue.number);
  console.log(`⭐️ Found ${reviews.length} reviews.`);
  console.log(`👍 Found ${reactions.length} reactions.`);

  console.log("");
}
