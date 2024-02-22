/**
 * 100 charts, each receive 1000 new data points every second that are immediately displayed in real-time.
 */

// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Import xydata
const xydata = require('@arction/xydata')

const {
    lightningChart,
    emptyLine,
    UIElementBuilders,
    UIBackgrounds,
    emptyFill,
    SolidLine,
    AxisTickStrategies,
    AxisScrollStrategies,
    UIOrigins,
    TimeFormattingFunctions,
    UIDraggingModes,
    MouseStyles,
    Themes,
} = lcjs

const { createProgressiveTraceGenerator } = xydata

// Check whether should display 10x10 dashboard (requires large monitor), or smaller 3x3 dashboard (works on all devices nicely).
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const showFullDashboard = urlParams.get('full') === 'true'

const COLUMNS = showFullDashboard ? 10 : 3
const ROWS = showFullDashboard ? 10 : 3
const HISTORYMS = 60 * 1000

// NOTE: Using `Dashboard` is no longer recommended for new applications. Find latest recommendations here: https://lightningchart.com/js-charts/docs/basic-topics/grouping-charts/
const dashboard = lightningChart()
    .Dashboard({
        numberOfColumns: COLUMNS,
        numberOfRows: ROWS + 1,
        // theme: Themes.darkGold
    })
    .setSplitterStyle(new SolidLine({ thickness: 0 }))

const uiPanel = dashboard.createUIPanel({ columnIndex: 0, rowIndex: 0, columnSpan: COLUMNS })
const uiPanelHeightPx = showFullDashboard ? 24 : 64
const dashboardHeightPx = dashboard.engine.container.getBoundingClientRect().height
dashboard.setRowHeight(0, (ROWS * uiPanelHeightPx) / (dashboardHeightPx - uiPanelHeightPx))

const chartList = []
for (let column = 0; column < COLUMNS; column += 1) {
    for (let row = 0; row < ROWS; row += 1) {
        const chart = dashboard
            .createChartXY({
                columnIndex: column,
                rowIndex: row + 1,
            })
            .setTitleFillStyle(emptyFill)
            .setTitleMargin({ top: 0, bottom: 0 })
            .setPadding(0)
            .setMouseInteractions(false)
            .setAutoCursor((autoCursor) =>
                autoCursor.setTickMarkerXVisible(false).setTickMarkerYVisible(false).setAutoFitStrategy(undefined),
            )
        const axisX = chart
            .getDefaultAxisX()
            .setTickStrategy(AxisTickStrategies.Empty)
            .setMouseInteractions(false)
            .setScrollStrategy(AxisScrollStrategies.progressive)
            .setDefaultInterval((state) => ({ end: state.dataMax, start: (state.dataMax ?? 0) - HISTORYMS, stopAxisAfter: false }))
            .setStrokeStyle(emptyLine)
            .setAnimationScroll(false)
        const axisY = chart
            .getDefaultAxisY()
            .setTickStrategy(AxisTickStrategies.Empty)
            .setMouseInteractions(false)
            .setStrokeStyle(emptyLine)
            .setAnimationScroll(false)
        chartList.push(chart)
    }
}

// Add title
uiPanel
    .addUIElement(UIElementBuilders.TextBox.setBackground(UIBackgrounds.None))
    .setText(`${COLUMNS * ROWS} live channels (1 ms resolution) 1 minute history`)
    .setMouseInteractions(false)
    .setPosition({ x: 50, y: 100 })
    .setOrigin(UIOrigins.CenterTop)

if (!showFullDashboard) {
    // Add button that will display the full 10x10 dashboard (for users with large monitors).
    uiPanel
        .addUIElement(UIElementBuilders.TextBox)
        .setText('Click here to show full 10x10 dashboard')
        .setPosition({ x: 50, y: 100 })
        .setOrigin(UIOrigins.CenterTop)
        .setMargin(30)
        .setDraggingMode(UIDraggingModes.notDraggable)
        .setMouseStyle(MouseStyles.Point)
        .onMouseClick(() => {
            // Add '?full = true' to URL and reload page.
            let url = window.location.href
            url += (url.split('?')[1] ? '&' : '?') + 'full=true'
            window.location.href = url
        })
}

const seriesList = chartList.map((chart, i) => {
    const series = chart
        .addPointLineAreaSeries({
            dataPattern: 'ProgressiveX',
            // Pass custom supplied index for automatic series coloring.
            automaticColorIndex: i,
        })
        .setName(`Channel ${i + 1}`)
        .setStrokeStyle((stroke) => stroke.setThickness(1))
        .setAreaFillStyle(emptyFill)
        .setMaxSampleCount(HISTORYMS)
        .setCursorResultTableFormatter((builder, _, sample) =>
            builder
                .addRow(series.getName())
                // Display "age" of data point, as time passed since current time.
                .addRow(TimeFormattingFunctions.hhmmssmmm(sample.x - window.performance.now()))
                .addRow('Value: ', series.axisY.formatValue(sample.y)),
        )
    return series
})

// Generate a couple of progressive XY data sets.
// For saving test data generation time and memory, some channels will display same data set.
Promise.all(
    new Array(10).fill(0).map((_) =>
        createProgressiveTraceGenerator()
            .setNumberOfPoints(HISTORYMS)
            .generate()
            .toPromise()
            .then((xyTrace) => {
                // Map generated XY trace data set into a more realistic trading data set.
                const baseLine = 10 + Math.random() * 2000
                const variationAmplitude = baseLine * 0.03
                const yMin = xyTrace.reduce((min, cur) => Math.min(min, cur.y), Number.MAX_SAFE_INTEGER)
                const yMax = xyTrace.reduce((max, cur) => Math.max(max, cur.y), -Number.MAX_SAFE_INTEGER)
                const yIntervalHalf = (yMax - yMin) / 2
                const yTraceBaseline = yMin + yIntervalHalf
                return xyTrace.map((xy) => baseLine + ((xy.y - yTraceBaseline) / yIntervalHalf) * variationAmplitude)
            })
            .then((yList) => {
                // Duplicate data set, reverse it and append to original to get infinitely looping effect.
                yList.push(...yList.slice().reverse())
                return yList
            }),
    ),
).then((dataSets) => {
    const dataSetLength = dataSets[0].length
    // Pair each series with a random data set.
    const seriesDataPair = seriesList.map((series) => ({
        series,
        dataSet: dataSets[Math.round(Math.random() * (dataSets.length - 1))],
    }))
    // Map series and data set pairs to format where each data set has reference to a list of series that use that data set.
    const dataSetsAndSeries = []
    seriesDataPair.forEach((pair) => {
        const existingItem = dataSetsAndSeries.find((existing) => existing.dataSet === pair.dataSet)
        if (existingItem) {
            existingItem.seriesList.push(pair.series)
            return
        }
        dataSetsAndSeries.push({
            dataSet: pair.dataSet,
            seriesList: [pair.series],
        })
    })
    const dataSetsCount = dataSetsAndSeries.length

    const initialDataVisibleCount = 30 * 1000
    let lastX = -initialDataVisibleCount
    const pushData = () => {
        const tNow = window.performance.now()
        // For each unique data set, prepare list of new Y values to add.
        const dataSetNewPoints = dataSetsAndSeries.map((_) => [])
        for (let x = lastX + 1; x < tNow; x += 1) {
            let iSample = x % dataSetLength
            while (iSample < 0) iSample += dataSetLength
            for (let iDataSet = 0; iDataSet < dataSetsCount; iDataSet += 1) {
                const y = dataSetsAndSeries[iDataSet].dataSet[iSample]
                dataSetNewPoints[iDataSet].push(y)
            }
            lastX = x
        }
        // Push XY points into series.
        dataSetsAndSeries.forEach((item, i) => {
            const newPoints = dataSetNewPoints[i]
            item.seriesList.forEach((series) => {
                series.appendSamples({ yValues: newPoints })
            })
        })
        requestAnimationFrame(pushData)
    }
    pushData()
})
