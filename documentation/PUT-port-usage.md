# User Resources

    PUT port usage

## Description
Update all percentages of vessels in a specific port
Returns all percentages of vessels in all ports from the database.

***

## Requires authentication
This endpoint requires the user to submit their email and app name in order to retrieve from the database.  This will create a JSON Web Token that will be used to authenticate the user.

***

## Parameters
This endpoint will accept a Jason Web Token query parameter in the url

    /api/v1/port-usage/:id?token=(jwt goes here)
    
**id** - This endpoint must contain an id that associates it with a specific port

***

## Required format
Object

  -- all values of each key should be a percentage with a total summation of 100%, written in a string
  
  -- example
      
      tanker_vessels: "12.38%"

- **cargo_vessels** - Cargo Vessels
- **fishing_vessels** - Fishing Vessels
- **various_vessels** - An unlisted type of vessel.
- **tanker_vessels** - Tanker Vessels
- **tug_offshore_supply_vessels** - Tug, Offshore, Supply or Dredge Vessel
- **passenger_vessels** - Passenger Vessel
- **authority_military_vessels** - Authority or Military Vessel
- **sailing_vessels** - Sailing Vessel
- **aid_to_nav_vessels** - Navigation Vessel
- **port_id** - An id that will associate the usages to a specific port

## Return format

A JSON array of objects with key-value pairs

- **id**  - Unique id
- **cargo_vessels** - Cargo Vessels
- **fishing_vessels** - Fishing Vessels
- **various_vessels** - An unlisted type of vessel.
- **tanker_vessels** - Tanker Vessels
- **tug_offshore_supply_vessels** - Tug, Offshore, Supply or Dredge Vessel
- **passenger_vessels** - Passenger Vessel
- **authority_military_vessels** - Authority or Military Vessel
- **sailing_vessels** - Sailing Vessel
- **aid_to_nav_vessels** - Navigation Vessel
- **port_id** - An id that will associate the usages to a specific port

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

    /api/v1/port-usage/10

**Return** (This is a shortend example)

``` 
[
	{
		"id": 3,
	    "cargo_vessels": "72.5%",
	    "fishing_vessels": "6.14%",
	    "various_vessels": "6.61%",
	    "tanker_vessels": "4.89%",
	    "tug_offshore_supply_vessels": "4.61%",
	    "passenger_vessels": "2.59%",
	    "authority_military_vessels": "1.87%",
	    "sailing_vessels": "0.51%",
	    "aid_to_nav_vessels": "0.28%",
	    "port_id": 10
    }
]
```