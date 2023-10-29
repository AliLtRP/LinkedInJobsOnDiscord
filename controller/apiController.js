const https = require('https');
const dotenv = require('dotenv').config();



let fetchLinkedInApi = (url) => {

    // options for auth
    const options = {
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': process.env.API_HOST
        }
    }


    try {
        return new Promise((resolve, reject) => {
            const req = https.get(url, options, (res) => {

                res.setEncoding('utf8');
                const { headers, statusCode } = res;

                let responseData = ''
                res.on('data', (data) => {
                    responseData += data;
                });

                res.on('end', () => {
                    try {
                        const parseData = JSON.parse(responseData);
                        resolve({ data: parseData, statusCode });
                    } catch (err) {
                        reject({ err, statusCode })
                    };

                }).on('error', e => {
                    reject(e);
                });

            });
        });

    } catch (err) {
        console.log(err);
    };

};




async function searchJob(params) {

    // api url 
    const api = process.env.API;

    // add the params with the url 
    const url = `${api}?${new URLSearchParams(params).toString()}`;

    // fetch data from the url 
    let res;

    try {
        res = await fetchLinkedInApi(url);
    } catch(err) {
        console.log(err);
    }

    let response = '';

    try {
        // format the response
        const app = res.data.data.map((v, i) => {
            response += `employer name: ${v.employer_name} \n`
            response += `job title: ${v.job_title} \n`
            response += `job apply link: ${v.job_apply_link}\n\n`;
        });

        return response;
    } catch (err) {
        return "there is no jobs available now";
    }

};



module.exports = {
    searchJob
}