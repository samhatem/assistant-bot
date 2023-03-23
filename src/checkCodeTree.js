const Bottleneck = require("bottleneck");

const { getAIVulnerabilityCheck } = require("./getVulnerabilityCheck");
const { getVulnerabilityFix } = require("./getVulnerabilityFix");
const { createJiraTickets } = require("./createJiraTickets");

/**
 * If we try sending too many concurrent requests then we'll get rate-limited.
 * "bottleneck" is a task scheduler that caps the number of concurrent requests we'll send.
 */
const limiter = new Bottleneck({
  // maximum concurrent requests
  maxConcurrent: 40, 
});

function scheduleRequest(asyncFunction) {
  return limiter.schedule(()=>{
    return asyncFunction();
  })
}

async function checkNodeOfTree({ data, getChildren, getCode, dirPath }) {
    if (data.type === "tree") {
        const getAndCheckTree = async () => {
          const subtree = await getChildren(data.sha);
          return checkCodeTree({ tree: subtree, getChildren, getCode, dirPath: dirPath + "/" + data.path });
        }
  
        return scheduleRequest(getAndCheckTree);
      } else if (data.type === "blob") {
        const checkCode = async () => {
          const code = await getCode(data.sha);
  
          const filePath = dirPath + "/" + data.path;
  
          // check for vulnerabilities
          const { hasVulnerability } = await getAIVulnerabilityCheck({ code, data, filePath });
  
          if (hasVulnerability) {
              const { fixBranchName, message } = await getVulnerabilityFix({ filePath });
  
              return {
                  fixBranchName,
                  message,
              }
          }
        }
  
        return scheduleRequest(checkCode)
      }
}

async function checkCodeTree({ tree, getChildren, getCode, dirPath }) {
  const promises = tree.map(async data => {
    return checkNodeOfTree({ data, getChildren, getCode, dirPath });
  });

  const result = await Promise.all(promises);

  /*
   * if there's more than 20 directories in a repo this will miss some result but that
   * seems unlikely enough
   */
  const filteredResult = result.filter(data => !!data).flat(20);

  await createJiraTickets(filteredResult);

  return filteredResult;
}

module.exports = {
    checkCodeTree,
}