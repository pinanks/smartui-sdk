const http = require('http');

async function fetchDOM() {
    return new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:8080/dom', res => {
            let rawData = '';
  
            res.on('data', chunk => (rawData += chunk.toString()));
            res.on('end', () => {
                try {
                    const body = JSON.parse(rawData);
                    resolve({
                        status: res.statusCode,
                        statusText: res.statusMessage,
                        headers: res.headers,
                        body
                    });
                } catch (error) {
                    reject(error);
                }         
            })
        })
        .on('error', (error) => {
            reject(error);
        })
    });
}

async function postSnapshot(snapshotDOM, snapshotName) {
    const data = JSON.stringify({
        dom: snapshotDOM,
        name: snapshotName
    });
      
    const options = {
        hostname: '127.0.0.1',
        port: 8080,
        path: '/snapshot',
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json',
        }
    };
      
    return new Promise((resolve, reject) => {
        http.request(options, (res) => {
            let rawData = '';
            res.on('data', chunk => (rawData += chunk.toString()));
            res.on('end', () => {
                try {
                    const body = JSON.parse(rawData);
                    resolve({
                        status: res.statusCode,
                        statusText: res.statusMessage,
                        headers: res.headers,
                        body
                    });
                } catch (error) {
                    reject(error);
                }         
            })
        })
        .on('error', (error) => {
            reject(error);
        })
        .end(data);
    });
}

async function smartuiSnapshot(driver, snapshotName) {
    try {
        let resp = await fetchDOM();
        // console.log(resp);
        await driver.executeScript(resp.body.data.dom);

        // Serialize and capture the DOM
        /* istanbul ignore next: no instrumenting injected code */
        let { domSnapshot, url } = await driver.executeScript(options => ({
        /* eslint-disable-next-line no-undef */
            domSnapshot: SmartUIDOM.serialize(options),
            url: document.URL
        }), {});

        // writeFileSync('guidesly.html', domSnapshot);
        let postResp = await postSnapshot(domSnapshot, snapshotName);
        // console.log(`[smartui] Snapshot taken: ${snapshotName}`);
    } catch (error) {
        console.error(error)
    }
}

module.exports = { smartuiSnapshot }