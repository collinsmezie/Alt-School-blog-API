const express = require('express');
const dayOfTheWeek = require('./date');
const getCurrentUTCTime = require('./UTCTime')

const app = express();
app.set('json spaces', 2);
const port = 3000;

app.get('/api/', (req, res) => {
    const { slack_name, track } = req.query;

    if (!slack_name || !track) {

        return res.status(400).json({ error: 'Either "name" or "track" query parameters are missing or incorrect.' });

    } else if (slack_name !== "chime" || track !== "backend") {

        return res.status(400).json({ error: 'Invalid "name" or "track" ' });

    }


    const response = {
        "slack_name": slack_name,
        "current_day": dayOfTheWeek(),
        "utc_time": getCurrentUTCTime(),
        "track": track,
        "github_file_url": "https://github.com/collinsmezie/Backend-Stage-One-Task/blob/prod/index.js",
        "github_repo_url": "https://github.com/collinsmezie/Backend-Stage-One-Task/tree/prod",
        "status_code": 200
    };

    res.status(200).json(response)

});

app.listen(port, () => {
    console.log(`Server is running on ports ${port}`);
});