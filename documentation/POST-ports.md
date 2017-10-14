# User Resources

    POST ports

## Description
Create a new port in the database.

***

## Requires authentication
This endpoint requires the user to have submitted their email and application name.  In order to post to the database, the user must have an email issued by Turing School of Software and Design ending in `@turing.io`.  This will create a JSON Web Token with administrative access that will be used to authenticate the user.

***

## Parameters
This endpoint will accept a JSON Web Token query parameter in the url

    /api/v1/ports?token=(jwt goes here)

## Return format

Will return a status code of 201, along with a JSON object of the posted information

- **id**  - Unique id
- **port_name** - Name of the port
- **port_locode** - The United Nations Code for Trade and Transport Locations
- **port_usage** - An object returned from another database that displays the types of vessels using this port in percentages.  See this [documentation](https://github.com/mschae16/byob/blob/master/documentation/GET-port-usage.md) for more information.
- **port_max_vessel_size** - If there is a limit to the vessel size the port can contain, it is found here in meters
- **port_total_ships** - The total number of ships currently in port
- **port_country** - The country in which the port is located
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

    POST /api/v1/ports

**Return**

```
{
    "id": "60",
    "port_name": "Schlagavager",
    "port_locode": "SLGVR",
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
    "max_vessel_size": "-",
    "total_ships_at_port": "319",
    "country": "Russia"
}
```
