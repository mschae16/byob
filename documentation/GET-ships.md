# User Resources

    GET ships

## Description
Returns all the vessels in the database.

***

## Requires authentication
This endpoint requires the user to submit their email and application name in order to retrieve from the database.  This will create a JSON Web Token that will be used to authenticate the user.

***

## Parameters
This endpoint will accept a JSON Web Token query parameter in the url

    /api/v1/ships?token=(jwt goes here)

**id** - The id parameter will select the specific vessel from the database where the ship's id matches the given parameter

    /api/v1/ships/:id

***

## Return format

A JSON array of objects with key-value pairs

- **id**  - Unique id
- **ship_name** - Name of the vessel
- **ship_country** - The country of this vessel's home port
- **ship_type** - The type of vessel
- **ship_length** - The vessel's length in meters
- **ship_imo** - International Maritime Organization Number
- **ship_status** - The current status of the vessel
- **ship_mmsi_callsign** - Maritime Mobile Service Identity and call sign
- **ship_current_port** - The current port where the vessel is located, if any

***

## Errors
This endpoint will throw a 404 and a 500 error

```
{
    error: 'Error message will be here.'
}
```

***

## Example

    /api/v1/ships

**Return** (This is a short-end example)

```
[
    {
        "id": "3",
        "current_status": "–––",
        "imo_number": "–––",
        "length": "49x16m",
        "mmsi_callsign": "413900666\n0",
        "port": "Shekou (Shenzhen)",
        "ship_country": "China",
        "ship_name": "RONG HANG 198",
        "type": "Cargo ship"
    },
    {
        "id": "4",
        "current_status": "at anchor",
        "imo_number": "–––",
        "length": "52x10m",
        "mmsi_callsign": "413490690\n–––",
        "port": "Shekou (Shenzhen)",
        "ship_country": "China",
        "ship_name": "KE LI YOU 3",
        "type": "Tanker"
    },
    {
        "id": "5",
        "current_status": "underway using engine",
        "imo_number": "9450210",
        "length": "91x18m",
        "mmsi_callsign": "565603000\n9VNX2",
        "port": "Busan",
        "ship_country": "Singapore",
        "ship_name": "KIMTEK 1",
        "type": "Oil tanker"
    }
]
```
