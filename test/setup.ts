// This code helps make sure the test environment is setup
// For example, making sure we connect to the test database

// Manually configure the env file so environment variables
// get loaded from .env.test
import dotenv from "dotenv";

if (process.env.CI !== "true") {  // We don't want this in GitHub Actions workflows
  dotenv.config({ path: ".env.test" });
}