# User Resources

    PATCH ports

## Description
Update the port database with current information about a specific port

***

## Requires authentication
This endpoint requires the user to have submitted their email and app name.  In order to patch to the database, the user must have an email issued by Turing School of Software and Design ending in `@turing.io`.  This will create a JSON Web Token with administrative access that will be used to authenticate the user.

***

## Parameters
This endpoint will accept a Jason Web Token query parameter in the url

    /api/v1/ports/:id?token=(jwt goes here)
    
**id** - This endpoint must contain an id that associates it with a specific port

***

## Required format
Object

  -- Should contain one or both of the following keys of `port_max_vessel_size` with a string value and/or `port_total_ships` with an integer value
  
  -- example

```
{ 
	port_max_vessel_size: "120m",
	port_total_ships: 247 
}
```

## Return format

A JSON array of objects with key-value pairs

- **port_max_vessel_size** - If there is a limit to the vessel size the port can contain, it is found here in meters.
- **port_total_ships** - The total number of ships currently at the port.

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

    /api/v1/ports/10

**Return**

``` 
[
	{ 
	    port_max_vessel_size: "120m",
	    port_total_ships: 247 
	}
]
```