# Assistant Bot

This proof of concept bot finds vulnerabilities in code whenever code is pushed to a repository using it. The bot currently mocks the functionality for finding vulnerabilities and instead focuses on integrating Github webhooks and email notifications. I explored integrating with Jira, but I ended up descoping it because integration would have taken a couple hours to get working.

## Assumptions

This bot mocks an AI bot under the hood. We've made a number of assumptions about how the AI bot operates:

- Developers can send the bot pieces of code and the AI bot will return whether there is a vulnerability in the code.
- If there is a vulnerability in the previous request, developers can ask the AI bot for the code fix and the bot will remember the previous request and return the code fix.
- The code does not need to be sent in any specific order to find vulnerabilities.

## Future Improvements

- I hacked this together with javascript but I would use typescript for any production application.
- Scanning the entire codebase doesn't make sense on every push because most code in the repository is unlikely to change. It also would create undesired functionality where developers would get the same vulnerability notifications every time they push code without fixing the outstanding vulnerabilities. Instead in a future iteration we could only analyze the code that has changed on every push. We could also give users an API endpoint to analyze the entire codebase if they want to. This functionality would allow a new engineer to a project to quickly get an overview of the codebase.
- Create Jira tickets for all cases where a vulnerability or another issue is found so that a team can track the issue.
- Create a pull request with code fixes when possible and assign the PR to either an engineering manager on the team or to the engineer that originally pushed the code.
- Generating a report and Jira tickets every time someone pushes code could become overwhelming. It may make more sense to only run the bot whenever a PR is created. Then the bot could also comment on the PR as a reviewer.
- Use a database to persist data. Currently we are requiring all information about users to be included in the push but that doesn't allow us to assign PR reviews to others or keep anyone else notified. We could save other user data and preferences in the database to improve user experience and the overall functionality of the app.
- I used [probot](https://probot.github.io/) to set up the github app quickly, but I wouldn't use probot for a production app. While it was great for creating a proof of concept, it didn't give me a lot of flexibility. If I had to make this service production ready, I would create an express.js server and just use Github's [octokit](https://github.com/octokit) SDK without probot.
