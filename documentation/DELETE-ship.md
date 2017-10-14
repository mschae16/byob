# User Resources

    DELETE ships

## Description
Delete a vessel from the database

***

## Requires authentication
This endpoint requires the user to have submitted their email and application name.  In order to delete from the database, the user must have an email issued by Turing School of Software and Design, ending in `@turing.io`.  This will create a JSON Web Token with administrative access that can then be used to authenticate the user.

***

## Parameters
This endpoint will accept a JSON Web Token query parameter in the url.

    /api/v1/ships/:id?token=(jwt goes here)

**id** - This endpoint must contain an id that associates it with a specific vessel

***

## Return format

Will return a status code of 204
***

## Errors
This endpoint will throw a 404  and 500 error

```
{
	error: 'Error message will be here'
}
```

***

## Example

    /api/v1/ships/6

**Return**

`204 No Content`
