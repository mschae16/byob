# User Resources

    POST ships

## Description
Create a new vessel in the database.

***

## Requires authentication
This endpoint requires the user to have submitted their email and app name.  In order to post to the database, the user must have an email issued by Turing School of Software and Design ending in `@turing.io`.  This will create a JSON Web Token with administrative access that will be used to authenticate the user.

***

## Parameters
This endpoint will accept a Jason Web Token query parameter in the url

    /api/v1/ships?token=(jwt goes here)

## Return format

Will return a status code of 201, along with a JSON array of the object posted

- **ship_name** - Name of the vessel
- **ship_country** - The country this vessel's home port is in
- **ship_type** - The type of vessel.
- **ship_length** - The vessel's length in meters.
- **ship_imo** - International Maritime Organization Number
- **ship_status** - The current status of the vessel.
- **ship_mmsi_callsign** - Maritime Mobile Service Identity and call sign
- **ship_current_port** - The current port where the vessel is located if any

***

## Errors
This endpoint will throw a 422 and a 500 error

```
{ 
    error: 'Error message will be here.'
}
```

***

## Example

    POST /api/v1/ships

**Return**

``` 
[
    {
        "id": "19",
        "current_status": "underway using engine",
        "imo_number": "9472410",
        "length": "118x22m",
        "mmsi_callsign": "582604000\n9JPY3",
        "port": "Osaka",
        "ship_country": "Japan",
        "ship_name": "No Free Willy",
        "type": "Fishing"
    }
]
```