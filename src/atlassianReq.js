const moment = require("moment");
const jwt = require("atlassian-jwt");

function createSessionToken(addon, verifiedClaims, clientKey, settings) {
    const now = moment().utc();
  
    const baseJwt = {
      iss: settings.key || addon.key,
      iat: now.unix(),
      sub: verifiedClaims.sub,
      exp: now.add(addon.config.maxTokenAge(), "milliseconds").unix(),
      aud: [clientKey]
    };
  
    // If the context.user exists, then send that too. This is to handle
    // the interim period swapover from userKey to userAccountId.
    if (verifiedClaims.context) {
      baseJwt.context = verifiedClaims.context;
    }
  
    return jwt.encodeSymmetric(
      baseJwt,
      settings.sharedSecret,
      jwt.SymmetricAlgorithm.HS256
    );
  }