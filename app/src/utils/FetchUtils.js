
let basicHeader = {
    "Content-Type": "application/json"
};


function logResult(result) {
    console.log(result);
}

function logError(error) {
    console.log('Looks like there was a problem: \n', error);
}

function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function readResponseAsJSON(response) {
    return response.json();
}

function fetchJSON(pathToResource, method) {
    return fetch(pathToResource, {
        method: method,
        headers: basicHeader,
    }) // 1
    .then(validateResponse) // 2
    .then(readResponseAsJSON) // 3
    .then(result => {
        return result;
    }) // 4
    .catch(logError);
}

export { fetchJSON };
