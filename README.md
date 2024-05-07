# JavaScript Real-Time Trend Dashboard

![JavaScript Real-Time Trend Dashboard](dashboardRealtimeTrading-darkGold.png)

This demo application belongs to the set of examples for LightningChart JS, data visualization library for JavaScript.

LightningChart JS is entirely GPU accelerated and performance optimized charting library for presenting massive amounts of data. It offers an easy way of creating sophisticated and interactive charts and adding them to your website or web application.

The demo can be used as an example or a seed project. Local execution requires the following steps:

-   Make sure that relevant version of [Node.js](https://nodejs.org/en/download/) is installed
-   Open the project folder in a terminal:

          npm install              # fetches dependencies
          npm start                # builds an application and starts the development server

-   The application is available at _http://localhost:8080_ in your browser, webpack-dev-server provides hot reload functionality.


## Description

As proven in our [2021 line charts performance comparison](https://lightningchart.com/javascript-charts-performance-comparison/), LightningChart JS line charts are **over 700 times faster** than other web charts. Especially in real-time applications LightningChart enables the creation of data visualization applications unlike anything seen before in web pages.

By default, this example will show a small dashboard that displays nine real-time trends.

**However**, the real treat is activated by pressing the "Click here to show full 10x10 dashboard" button inside the chart. This is intended for Desktop users, as the complete application requires quite a bit of space.

![](./assets/show-full.png 'Show full 10x10 Dashboard example')

In its full size, the example shows 100 line charts. Each chart is connected to a real-time data source (random data), the sampling rate is 1 000 data points per second **for every chart**. This sums up to **100 000** processed data points per second.

In the previously mentioned performance comparison study we tested this kind of applications with the major manufacturers who claim their charts to be **high-performance oriented** or **the fastest**. The results showed that the wide majority of web charts are not applicable to real-time visualization of even as little as 1 000 data points per second.

Why not? Because the charts spend too much time processing this amount of data. This can be observed by the web page visibly slowing down, preventing users from interacting with their browser.

To learn more about LightningChart JS, here are some potentially interesting links:

-   [Latest news on LC JS performance](https://lightningchart.com/high-performance-javascript-charts/)

**(!) Using `Dashboard` is no longer recommended for new applications. Find latest recommendations here: https://lightningchart.com/js-charts/docs/basic-topics/grouping-charts/**


## API Links

* [Dashboard]
* [XY cartesian chart]
* [Line series]
* [Axis]
* [Axis tick strategies]
* [Axis scroll strategies]
* [UI position origins]
* [UI layout builders]
* [UI element builders]
* [Solid FillStyle]
* [RGBA color factory]
* [Time formatting functions]


## Support

If you notice an error in the example code, please open an issue on [GitHub][0] repository of the entire example.

Official [API documentation][1] can be found on [LightningChart][2] website.

If the docs and other materials do not solve your problem as well as implementation help is needed, ask on [StackOverflow][3] (tagged lightningchart).

If you think you found a bug in the LightningChart JavaScript library, please contact sales@lightningchart.com.

Direct developer email support can be purchased through a [Support Plan][4] or by contacting sales@lightningchart.com.

[0]: https://github.com/Arction/
[1]: https://lightningchart.com/lightningchart-js-api-documentation/
[2]: https://lightningchart.com
[3]: https://stackoverflow.com/questions/tagged/lightningchart
[4]: https://lightningchart.com/support-services/

© LightningChart Ltd 2009-2022. All rights reserved.


[Dashboard]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/classes/Dashboard.html
[XY cartesian chart]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/classes/ChartXY.html
[Line series]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/classes/LineSeries.html
[Axis]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/classes/Axis.html
[Axis tick strategies]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/variables/AxisTickStrategies.html
[Axis scroll strategies]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/variables/AxisScrollStrategies.html
[UI position origins]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/variables/UIOrigins.html
[UI layout builders]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/variables/UILayoutBuilders.html
[UI element builders]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/variables/UIElementBuilders.html
[Solid FillStyle]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/classes/SolidFill.html
[RGBA color factory]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/functions/ColorRGBA.html
[Time formatting functions]: https://lightningchart.com/js-charts/api-documentation/v5.2.0/variables/TimeFormattingFunctions.html

