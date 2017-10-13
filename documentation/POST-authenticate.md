# User Resources

    POST authenticate

## Description
Create a new JSON Web Token for a new user.

***

## Requires authentication
This endpoint requires the user to submit their email and app name in order to receive a JSON Web Token.  If the user has an email with the Turing School of Software and Design ending in `@turing.io` then they will be given administrative access.
***

## Parameters
none
## Return format

Will return a status code of 201, along with a JSON object with the JWT

**token** - JSON Web Token

***

## Errors
This endpoint will throw a 422

```
{ 
    error: 'Error message will be here.'
}
```

***

## Example

    POST /api/v1/authenticate

**Return**

```
    {
       "token": "-token-"
    }
```