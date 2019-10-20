sendGetRequest = (url) => {
    $.ajax({
        url: url,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data, status) { getOnSuccessResponse(data, status); },
        error: function(data, status) { getOnErrorResponse(data, status); },
        headers: {
            "Access-Control-Allow-Origin": "*" ,
            "Content-Type": "application/json"
        }
    });
};

getOnSuccessResponse = (data,status) => {
    console.log(data);
}

getOnErrorResponse = (data, status) => {
    console.log(data);
}

sendPOSTRequest = (url, data) => {
    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data, status) { getOnSuccessResponse(data, status); },
        error: function(data, status) { getOnErrorResponse(data, status); },
        headers: {
            "Access-Control-Allow-Origin": "*" ,
            "Content-Type": "application/json"
        }
    });
};

function send() {
    // example; TODO -> remove
    sendGetRequest("https://jsonplaceholder.typicode.com/todos/1");
}