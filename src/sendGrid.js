const axios = require("axios");

async function sendSummaryEmail(result, { ownerName, ownerEmail }) {
    console.log({ result, ownerName, ownerEmail });

    const numOfVulnerabilities = result.length;

    const message = `We discovered ${numOfVulnerabilities} vulnerabilities.
    
    Here is your summary:
    
    ${result.map(res => `${res.message}\n`)}`

    console.log({ message });

    await axios.post("https://api.sendgrid.com/v3/mail/send", {
        "personalizations": [
            { 
                "to":[
                    {
                        "email": "sahatem14@gmail.com",
                        "name": ownerName, 
                    }
                ],
                "subject":"Your AI Assistant Summary!"
            }
        ],
        "content": [
            {
                "type": "text/plain",
                "value": message
            }
        ],
        "from": {
            "email": "sam@slide.so",
            "name": "Sam"
        },
        "reply_to": {
            "email": "sam@slide.so",
            "name": "Sam"
        }
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`
        }
    });
}

module.exports = {
    sendSummaryEmail,
}