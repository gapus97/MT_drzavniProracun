// probably should remove this....

// create popup contents
var customPopup = "Mozilla Toronto Offices<br/><img src='http://joshuafrazier.info/images/maptime.gif' alt='maptime logo gif' width='100px'/>";
        
//  popup options 
var customOptions = {
    'maxWidth': '200',
    'className' : 'custom'
}

function customPopupDialog(text, money, data) {
    // there should be something else....just for basic example
    // TODO
    return `Občina: ${text} </br><img src='http://joshuafrazier.info/images/maptime.gif' alt='maptime logo gif' width='100px'/></br> <p>Proračun: ${money}</p>
    </br> <a href="/about"> Prikaži več </a>`;
}


export { customPopup, customOptions, customPopupDialog };