


## Awair API

https://developer.getawair.com/console/whats-new



Get the latest air data

```
query {
  AirDataLatest(deviceUUID: "awair-r2_0000") {
    airDataSeq {
      timestamp,
      score,
      sensors {
        component,
        value
      }
    }
  }
}
```

Get raw data:

```
query {
  AirDataRaw(
    deviceUUID: "awair-r2_0000",
    from: "2019-01-28T23:00:00.603Z",
    to: "2019-01-28T23:15:00.603Z"
  ) {
    airDataSeq {
      timestamp,
      score,
      sensors {
        component,
        value
      },
      indices {
        component,
        value
      }
    }
  }
}

```

Quotas

```
query {
  User {
    usage {
      scope,
      counts
    },
    permissions {
      scope,
      quota
    }
  }
}
```

returns

```
{
  "data": {
    "User": {
      "usage": [
        {
          "scope": "USER_DEVICE_LIST",
          "counts": 5
        },
        {
          "scope": "USER_INFO",
          "counts": 4
        }
      ],
      "permissions": [
        {
          "scope": "FIFTEEN_MIN",
          "quota": 100
        },
        {
          "scope": "FIVE_MIN",
          "quota": 300
        },
        {
          "scope": "RAW",
          "quota": 500
        },
        {
          "scope": "LATEST",
          "quota": 300
        },
        {
          "scope": "PUT_PREFERENCE",
          "quota": 300
        },
        {
          "scope": "PUT_DISPLAY_MODE",
          "quota": 300
        },
        {
          "scope": "PUT_LED_MODE",
          "quota": 300
        },
        {
          "scope": "PUT_KNOCKING_MODE",
          "quota": 300
        },
        {
          "scope": "PUT_TIMEZONE",
          "quota": 300
        },
        {
          "scope": "PUT_DEVICE_NAME",
          "quota": 300
        },
        {
          "scope": "PUT_LOCATION",
          "quota": 300
        },
        {
          "scope": "PUT_ROOM_TYPE",
          "quota": 300
        },
        {
          "scope": "PUT_SPACE_TYPE",
          "quota": 300
        },
        {
          "scope": "USER_DEVICE_LIST",
          "quota": 2147483647
        },
        {
          "scope": "USER_INFO",
          "quota": 2147483647
        }
      ]
    }
  }
}
```

