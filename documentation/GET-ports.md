# User Resources

    GET ports

## Description
Returns all the ports and each ports usage percentages from their appropriate databases.

***

## Requires authentication
This endpoint requires the user to submit their email and app name in order to retrieve from the database.  This will create a JSON Web Token that will be used to authenticate the user.

***

## Parameters
This endpoint will accept a Jason Web Token query parameter in the url

    /api/v1/ports?token=(jwt goes here)
    
**id** - The id parameter will select the specific port from the database where the port's id matches the given parameter

    /api/v1/ports/:id

***

## Nested promise
This endpoint calls on another database to return an object of the ports' usage in percentages.  

    /api/v1/port-usage

***

## Return format

A JSON array of objects with key-value pairs

- **id**  - Unique id
- **port_name** - Name of the port
- **port_locode** - The United Nations Code for Trade and Transport Locations
- **port_usage** - An object returned from another database that displays the types of vessels using this port in percentages.  See this [documentation]() for more information.
- **port_max_vessel_size** - If there is a limit to the vessel size the port can contain, it is found here in meters.
- **port_total_ships** - The total number of ships currently at the port
- **port_country** - The country the port is located in

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

    /api/v1/ports

**Return** (This is a shortend example)

``` 
[
    {
        "id": "10",
        "port_name": "Vladivostok",
        "port_locode": "RUVVO",
        "port_usage": {
            "cargo_vessels": "62.22%",
            "fishing_vessels": "8.52%",
            "various": "4.44%",
            "tankers": "15.19%",
            "tug_offshore_supply": "4.07%",
            "passenger_vessels": "2.59%",
            "authority_military": "1.48%",
            "sailing_vessels": "1.48%",
            "aids_to_nav": "0%"
        },
        "max_vessel_size": "150m",
        "total_ships_at_port": "118",
        "country": "Russia"
    },
    {
        "id": "20",
        "port_name": "Shekou (Shenzhen)",
        "port_locode": "CNSZP",
        "port_usage": {
            "cargo_vessels": "72.5%",
            "fishing_vessels": "6.14%",
            "various": "6.61%",
            "tankers": "4.89%",
            "tug_offshore_supply": "4.61%",
            "passenger_vessels": "2.59%",
            "authority_military": "1.87%",
            "sailing_vessels": "0.51%",
            "aids_to_nav": "0.28%"
        },
        "max_vessel_size": "unavailable",
        "total_ships_at_port": "721",
        "country": "China"
    },
    {
        "id": "30",
        "port_name": "Busan",
        "port_locode": "KRPUS",
        "port_usage": {
            "cargo_vessels": "47.04%",
            "fishing_vessels": "11.58%",
            "various": "14.16%",
            "tankers": "12.54%",
            "tug_offshore_supply": "9.21%",
            "passenger_vessels": "1.26%",
            "authority_military": "1.26%",
            "sailing_vessels": "2.48%",
            "aids_to_nav": "0.46%"
        },
        "max_vessel_size": "unavailable",
        "total_ships_at_port": "521",
        "country": "South Korea"
    }
]
```
