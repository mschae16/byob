# User Resources

    PATCH ships

## Description
Update the ship database with current information about a specific vessel

***

## Requires authentication
This endpoint requires the user to have submitted their email and app name.  In order to post to the database, the user must have an email issued by Turing School of Software and Design ending in `@turing.io`.  This will create a JSON Web Token with administrative access that will be used to authenticate the user.

***

## Parameters
This endpoint will accept a Jason Web Token query parameter in the url

    /api/v1/ships/:id?token=(jwt goes here)
    
**id** - This endpoint must contain an id that associates it with a specific vessel

***

## Required format
Object

  -- should contain one or any combination of the following keys:
  
- **ship_country** - The country this vessel's home port is in.
- **ship_type** - The type of vessel.
- **ship_status** - The current status of the vessel.
- **ship_current_port** - The current port where the vessel is located if any.

  
-- example

```
{
    ship_country: "Japan",
    ship_type: "Tug",
    ship_status: "moored",
    ship_current_port: 10
}
```

## Return format

Will return a status code of 200 along with a JSON array of the object that was sent with key-value pairs

- **ship_country** - The country this vessel's home port is in.
- **ship_type** - The type of vessel.
- **ship_status** - The current status of the vessel.
- **ship_current_port** - The current port where the vessel is located if any.



***

## Errors
This endpoint will throw a 422  and 500 error

```
{ 
	error: 'Error message will be here'
}
```

***

## Example

    /api/v1/ships/6

**Return**

``` 
[
	{
	    ship_country: "Japan",
	    ship_type: "Tug",
	    ship_status: "moored",
	    ship_current_port: 10
	}
]
```