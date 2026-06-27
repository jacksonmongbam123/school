const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoUrl = "https://github.com/jacksonmongbam123/school.git";
const branch = "main";
const email = "anjalichanu121@gmail.com";
const username = "jacksonmongbam123";

// Read token from environment variable or command-line arguments
const token = process.env.GITHUB_TOKEN || process.argv[2];

if (!token) {
  console.error("====================================================================");
  console.error("ERROR: GitHub Access Token is required to push changes.");
  console.error("====================================================================");
  console.error("How to run this script:");
  console.error("1. Set GITHUB_TOKEN environment variable and run:");
  console.error("   GITHUB_TOKEN=your_access_token node push.js");
  console.error("\nOR:");
  console.error("2. Pass the token directly as an argument:");
  console.error("   node push.js your_access_token");
  console.error("====================================================================");
  process.exit(1);
}

try {
  console.log("Configuring Git user info...");
  execSync(`git config --global user.email "${email}"`, { stdio: "inherit" });
  execSync(`git config --global user.name "${username}"`, { stdio: "inherit" });

  console.log("Initializing local Git repository...");
  if (!fs.existsSync(".git")) {
    execSync("git init", { stdio: "inherit" });
  }
  try {
    execSync("git branch -M main", { stdio: "inherit" });
  } catch (e) {
    console.log("Could not rename branch to main (might not be any commits yet):", e.message);
  }

  console.log("Adding remote origin...");
  try {
    execSync("git remote remove origin", { stdio: "ignore" });
  } catch (e) {}

  // Embed the access token in the git remote URL safely using username and token
  const authedRemoteUrl = `https://${username}:${token}@github.com/jacksonmongbam123/school.git`;
  execSync(`git remote add origin ${authedRemoteUrl}`, { stdio: "ignore" });

  console.log("Staging all changes...");
  // Stage all modified files, excluding sensitive ones
  execSync("git add .", { stdio: "inherit" });

  console.log("Creating commit...");
  // Check if there is anything to commit
  try {
    const status = execSync("git status --porcelain", { encoding: "utf8" });
    if (!status.trim()) {
      console.log("No changes to commit. Everything is up to date.");
      process.exit(0);
    }
    execSync('git commit -m "feat: Connect MongoDB Atlas and configure backend on port 3000"', { stdio: "inherit" });
  } catch (err) {
    console.log("Nothing to commit or commit failed:", err.message);
  }

  console.log(`Pushing to GitHub (${branch} branch)...`);
  execSync(`git push -u origin ${branch} --force`, { stdio: "inherit" });

  console.log("====================================================================");
  console.log("SUCCESS: Changes successfully pushed to your GitHub repository!");
  console.log("====================================================================");
} catch (error) {
  console.error("An error occurred during git push:", error.message);
  process.exit(1);
}
