const showToken = (token) => {
    $('.token').css('display', 'unset')
    $('.token').append(`<h4>Your JWT is: ${token.token}</h4>`)
}

const getToken = (e) => {
    e.preventDefault();
    console.log('email', $('.email').val());
    console.log('name', $('.name').val());
    

    fetch('/api/v1/user/authenticate', {
        method: 'POST',
        body: JSON.stringify({ email: $('.email').val(), app_name: $('.name').val() }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( data => data.json())
    .then( response => showToken(response))
}

$('.submit').on('click', (e) => getToken(e))