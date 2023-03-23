const nock = require("nock");
// Requiring our app implementation
const myProbotApp = require("../src");
const { Probot, ProbotOctokit } = require("probot");

const payload = require("./fixtures/push.json");
require("dotenv").config();

describe("My Probot app", () => {
  let probot;

  beforeEach(() => {
    // nock.disableNetConnect();
    probot = new Probot({
      appId: process.env.APP_ID,
      privateKey: process.env.PRIVATE_KEY,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    // Load our app into probot
    probot.load(myProbotApp);
  });

  test("creates a comment when an issue is opened", async () => {
    // Receive a webhook event
    await probot.receive({ name: "push", payload });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about testing with Nock see:
// https://github.com/nock/nock
