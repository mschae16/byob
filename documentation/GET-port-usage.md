# User Resources

    GET port usage

## Description
Returns all percentages of vessels in all ports from the database.

***

## Requires authentication
This endpoint requires the user to submit their email and application name in order to retrieve from the database.  This will create a JSON Web Token that will be used to authenticate the user.

***

## Parameters
This endpoint will accept a JSON Web Token query parameter in the url

    /api/v1/port-usage?token=(jwt goes here)

***

## Return format

A JSON array of objects with key-value pairs

- **id**  - Unique id
- **cargo_vessels** - Cargo Vessels
- **fishing_vessels** - Fishing Vessels
- **various_vessels** - An unlisted type of vessel
- **tanker_vessels** - Tanker Vessels
- **tug_offshore_supply_vessels** - Tug, Offshore, Supply or Dredge Vessel
- **passenger_vessels** - Passenger Vessel
- **authority_military_vessels** - Authority or Military Vessel
- **sailing_vessels** - Sailing Vessel
- **aid_to_nav_vessels** - Navigation Vessel
- **port_id** - An id that will associate the usages to a specific port

***

## Errors
This endpoint will throw a 500 error

```
{
	error
}
```

***

## Example

    /api/v1/port-usage

**Return** (This is a short-end example)

```
[
    {
        "cargo_vessels": "72.5%",
        "fishing_vessels": "6.14%",
        "various_vessels": "6.61%",
        "tanker_vessels": "4.89%",
        "tug_offshore_supply_vessels": "4.61%",
        "passenger_vessels": "2.59%",
        "authority_military_vessels": "1.87%",
        "sailing_vessels": "0.51%",
        "aid_to_nav_vessels": "0.28%",
        "port_id": 32
    },
    {
        "cargo_vessels": "43.38%",
        "fishing_vessels": "0.86%",
        "various_vessels": "4.76%",
        "tanker_vessels": "28.26%",
        "tug_offshore_supply_vessels": "8.66%",
        "passenger_vessels": "2.03%",
        "authority_military_vessels": "1.14%",
        "sailing_vessels": "10.83%",
        "aid_to_nav_vessels": "0.09%",
        "port_id": 35
    },
    {
        "cargo_vessels": "67.57%",
        "fishing_vessels": "4.49%",
        "various_vessels": "7.94%",
        "tanker_vessels": "4.26%",
        "tug_offshore_supply_vessels": "4.61%",
        "passenger_vessels": "6.78%",
        "authority_military_vessels": "2.91%",
        "sailing_vessels": "0.97%",
        "aid_to_nav_vessels": "0.46%",
        "port_id": 34
    }
]
```
