const { checkCodeTree } = require("./checkCodeTree");

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("App running!");

  // TODO: endpoints to scan code for different issues

  app.on("push", async (context) => {
    console.log({ context, git: context.octokit.git, repo: context.payload.repository });

    try {
      const repo = context.payload.repository;
      const head = context.payload.head_commit;

      const getChildren = async (sha) => {
        const response = await context.octokit.git.getTree({
          owner: repo.owner.name,
          repo: repo.name,
          tree_sha: sha,
        });

        return response.data.tree;
      }

      const getCode = async (sha) => {
        const response = await context.octokit.git.getBlob({
          owner: repo.owner.name,
          repo: repo.name,
          file_sha: sha,
        });

        const blob = Buffer.from(response.data.content, "base64");

        return blob.toString();
      }

      const tree = await getChildren(head.tree_id);

      const result = await checkCodeTree({ tree, getChildren, getCode, dirPath: "." });

      console.log({ result });

      // TODO: check for docuementation + testing changes
    } catch (e) {
      console.error("Error thrown fetching tree");
      console.log({ e });
    }
  });
};
