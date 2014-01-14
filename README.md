Homeostasis
-----------

a Mozilla service to allow clients to self-check using the same thresholds and other data used to highlight and resolve issues in the user-facing report.  If an issue is found, the user would be notified and directed to the actual Health Report to aid in resolution.  Any ideal solution must allow for the service to evolve out of band from Firefox releases, just as the web-delivered report is expected to evolve.

Two implementation approaches come to mind:

Remote Compare API

`POST /checkClient/`
<standard FHR payload packet>

The payload packet is detailed [here](https://docs.services.mozilla.com/healthreport/index.html#payload-format). Firefox would periodically submit an FHR payload to a remote service, which would process the payload server-side and respond as follows:

```
// everything is good
{
  result: 0,
}

// some minor things or enhancements
{
  result: 1,  // nothing urgent, but worth highlighting in a subtle way
  warnings: {
    performance: true, // there are performance concerns that should get handled, but are non-urgent
    stability: true, // Firefox could be a bit more stable, but not in a REALLY BIG DEAL way
  }
  highlights: { // these should be used judiciously
    search: true,
    add-ons: true,
  }
}

// things are badly broken
{
  result: 2,  // big deal, nag/interrupt the user
  warnings: {
    performance: true, // perf issues
    stability: true, // stablity issues
    other: true, // should be rarely used
  }
}
```
