const fetch = require('node-fetch');

/**
 * Just create some dummy tickets for now. We'd fill in the data with actual data if
 * we wanted to make this production ready.
 */
const bodyData = `{
  "issueUpdates": [
    {
      "fields": {
        "assignee": {
          "id": "5b109f2e9729b51b54dc274d"
        },
        "components": [
          {
            "id": "10000"
          }
        ],
        "customfield_10000": "09/Jun/19",
        "customfield_20000": "06/Jul/19 3:25 PM",
        "customfield_30000": [
          "10000",
          "10002"
        ],
        "customfield_40000": "Occurs on all orders",
        "customfield_50000": "Could impact day-to-day work.",
        "customfield_60000": "jira-software-users",
        "customfield_70000": [
          "jira-administrators",
          "jira-software-users"
        ],
        "customfield_80000": {
          "value": "red"
        },
        "description": "Order entry fails when selecting supplier.",
        "duedate": "2019-03-11",
        "environment": "UAT",
        "fixVersions": [
          {
            "id": "10001"
          }
        ],
        "issuetype": {
          "id": "10000"
        },
        "labels": [
          "bugfix",
          "blitz_test"
        ],
        "parent": {
          "key": "PROJ-123"
        },
        "priority": {
          "id": "20000"
        },
        "project": {
          "id": "10000"
        },
        "reporter": {
          "id": "5b10a2844c20165700ede21g"
        },
        "security": {
          "id": "10000"
        },
        "summary": "Main order flow broken",
        "timetracking": {
          "originalEstimate": "10",
          "remainingEstimate": "5"
        },
        "versions": [
          {
            "id": "10000"
          }
        ]
      },
      "update": {
        "worklog": [
          {
            "add": {
              "started": "2019-07-05T11:05:00.000+0000",
              "timeSpent": "60m"
            }
          }
        ]
      }
    },
    {
      "fields": {
        "assignee": {
          "id": "5b109f2e9729b51b54dc274d"
        },
        "components": [
          {
            "id": "10000"
          }
        ],
        "customfield_10000": "09/Jun/19",
        "customfield_20000": "06/Jul/19 3:25 PM",
        "customfield_30000": [
          "10000",
          "10002"
        ],
        "customfield_40000": "Occurs on all orders",
        "customfield_50000": "Could impact day-to-day work.",
        "customfield_60000": "jira-software-users",
        "customfield_70000": [
          "jira-administrators",
          "jira-software-users"
        ],
        "customfield_80000": {
          "value": "red"
        },
        "description": "Order remains pending after approved.",
        "duedate": "2019-04-16",
        "environment": "UAT",
        "fixVersions": [
          {
            "id": "10001"
          }
        ],
        "issuetype": {
          "id": "10000"
        },
        "labels": [
          "new_release"
        ],
        "parent": {
          "id": "10034"
        },
        "priority": {
          "id": "20000"
        },
        "project": {
          "id": "1000"
        },
        "reporter": {
          "id": "5b10a2844c20165700ede21g"
        },
        "security": {
          "id": "10000"
        },
        "summary": "Order stuck in pending",
        "timetracking": {
          "originalEstimate": "15",
          "remainingEstimate": "5"
        },
        "versions": [
          {
            "id": "10000"
          }
        ]
      },
      "update": {}
    }
  ]
}`;

async function createJiraTickets(issues) {
    return new Promise((res, rej) => {
        fetch('https://ai-assistant.atlassian.net/rest/api/2/issue/bulk', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(
                'email@example.com:<api_token>'
              ).toString('base64')}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: bodyData
          })
            .then(response => {
              console.log(
                `Response: ${response.status} ${response.statusText}`
              );
              return response.text();
            })
            .then(text => { res(text) })
            .catch(err => { rej(err) });
    });
}

module.exports = {
    createJiraTickets,
}