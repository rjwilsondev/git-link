import { db } from "./index";
import { users, repositories } from "./schema";

async function main() {
  console.log("Seeding database...");

  // Delete existing data to start fresh
  await db.delete(repositories);
  await db.delete(users);

  // Insert users
  const userList = [
    {
      username: "ryan",
      email: "ryan@example.com",
    },
    {
      username: "rjwilson",
      email: "rjwilson@example.com",
    },
    {
      username: "antigravity",
      email: "ai@example.com",
    },
  ];

  for (const user of userList) {
    await db.insert(users).values(user);
    console.log(`Inserted user: ${user.username}`);
  }

  // Insert repositories
  const repoList = [
    {
      name: "react",
      description: "A simple GitHub clone built with React Router and Go",
      ownerUser: "rjwilson",
    },
    {
      name: "gitea",
      description: "A simple, fast, and easy to deliver self-hosted ",
      ownerUser: "rjwilson",
    },
    {
      name: "core",
      description: "The core engine of everything",
      ownerUser: "antigravity",
    },
  ];

  for (const repo of repoList) {
    await db.insert(repositories).values(repo);
    console.log(`Inserted repository: ${repo.ownerUser}/${repo.name}`);
  }

  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:");
  console.error(err);
  process.exit(1);
});
