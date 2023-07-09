var nodemailer = require('nodemailer');
var fs = require('fs');
const { getConn } = require('./mongo');

function createFile(sentences) {
    var file = fs.createWriteStream('./sentences.pdf');
    file.on('error', function (err) {
        console.log("Error while creating file.")
    });
    sentences.forEach(function (v) {
        console.log(v.description);
        file.write(v.description + '\n');
    });
    file.end();
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shubhamshukla201995@gmail.com',
        pass: ''
    }
});

var mailOptions = {
    from: 'shubhamshukla201995@gmail.com',
    to: 'shubhamshukla201995@gmail.com',
    subject: 'Email notification',
    text: 'Please find attachement.',
    attachments: [
        {
            filename: 'sentences.pdf',
            path: './sentences.pdf'
        }
    ]
};

async function getSentences() {
    const client = await getConn();
    const query = {};
    const options = {
        sort: { title: 1 },
        projection: { _id: 0, id: 1, title: 1, description: 1 },
    };
    const sentences = await client.db("notifier").collection("sentences");
    const cursor = sentences.find(query, options);
    if ((await sentences.countDocuments(query)) === 0) {
        console.log("No documents found!");
    }
    const data = [];
    for await (const doc of cursor) {
        data.push(doc);
    }
    return data
}

function sendMail() {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function send(req, res) {
    createFile(req.body.words);
    // sendMail();
    res.send('Done');
}

module.exports = { send, getSentences };
