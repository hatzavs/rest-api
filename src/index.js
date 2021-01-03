const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;
    if (req.method === 'PUT' && req.url.includes('/user')) {
        readFile((users) => {
            users.push(query.username);
            saveToFile(users, () => {
                res.write(`User "${query.username}" has been successfully created.`);
                res.write(`\nNew users list is: ${JSON.stringify(users)}.`)
                res.end();
            });
        });
        
    } else if(req.method === 'GET' && req.url.includes('/user')) {
        readFile((users) => {
            res.write(JSON.stringify(users));

            res.end();
        });
    } else if (req.method === 'DELETE' && req.url.includes('/user')) {
        readFile((users) => {
            const index = users.indexOf(query.username);
            if (index === -1) {
                res.write(`User "${query.username}" doesn't exist.`);
                res.write(`\nCurrent users list is: ${JSON.stringify(users)}.`);
                res.end();
                return;
            }
            users.splice(index, 1);
            saveToFile(users, () => {
                res.write(`User "${query.username}" has been successfully deleted.`);
                res.write(`\nNew users list is: ${JSON.stringify(users)}.`);
                res.end();
            
            });
        });
    } else if (req.method === 'POST' && req.url.includes('/user') && req.url.includes('newUsername')) {
        readFile((users) => {
            const index = users.indexOf(query.username);
            if (index === -1) {
                res.write(`User "${query.username}" doesn't exist.`);
                res.write(`\nCurrent users list is: ${JSON.stringify(users)}.`);
                res.end();
                return;
            }
            res.write(`Previus users list is: ${JSON.stringify(users)}.`);
            res.write(`\nQuery is: ${JSON.stringify(query)} - old user is "${query.username}", new user is "${query.newUsername}".`);
            users.splice(index, 1, query.newUsername);
            saveToFile(users, () => {
                res.write(`\nNew users list is: ${JSON.stringify(users)}.`);
                res.end();
            });
            
        });
    } else res.end();
}).listen(4000);

function readFile(cb) {
    fs.readFile('./src/db.json',{encoding: 'utf-8'}, (err, content) => {
        cb(JSON.parse(content));
    });
}

function saveToFile(content, cb) {
    fs.writeFile('./src/db.json', JSON.stringify(content), cb);
}


console.log('Listening on: http://localhost:4000');