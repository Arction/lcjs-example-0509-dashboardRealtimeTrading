/**
 * Next-generation intensive trading application example with LightningChart.
 *
 * 100 charts, each receive 1000 new data points every second that are immediately displayed in real-time.
 *
 * Live analytics are placed inside each chart, displaying the last Y value and visible value change (%).
 */

const lcjs = require('@arction/lcjs')
const xydata = require('@arction/xydata')
const {
    lightningChart,
    emptyLine,
    UIElementBuilders,
    UIBackgrounds,
    emptyFill,
    SolidFill,
    SolidLine,
    ColorRGBA,
    AxisTickStrategies,
    AxisScrollStrategies,
    UILayoutBuilders,
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

const dashboard = lightningChart()
    .Dashboard({
        numberOfColumns: COLUMNS,
        numberOfRows: ROWS + 1,
        disableAnimations: true,
        // theme: Themes.darkGold
    })
    .setSplitterStyle(new SolidLine({thickness: 0}))

const uiPanel = dashboard.createUIPanel({columnIndex: 0, rowIndex: 0, columnSpan: COLUMNS})
const uiPanelHeightPx = showFullDashboard ? 24 : 64
const dashboardHeightPx = dashboard.engine.container.getBoundingClientRect().height
dashboard.setRowHeight(0, ROWS * uiPanelHeightPx / (dashboardHeightPx - uiPanelHeightPx))

const chartList = []
for (let column = 0; column < COLUMNS; column += 1) {
    for (let row = 0; row < ROWS; row += 1) {
        const chart = dashboard
            .createChartXY({
                columnIndex: column,
                rowIndex: row + 1,
            })
            .setTitleFillStyle(emptyFill)
            .setTitleMarginTop(0)
            .setTitleMarginBottom(0)
            .setPadding(0)
            .setMouseInteractions(false)
            .setAutoCursor((autoCursor) => autoCursor.disposeTickMarkerX().disposeTickMarkerY().setAutoFitStrategy(undefined))
        const axisX = chart
            .getDefaultAxisX()
            .setTickStrategy(AxisTickStrategies.Empty)
            .setMouseInteractions(false)
            .setScrollStrategy(AxisScrollStrategies.progressive)
            .setInterval(-HISTORYMS, 0)
        const axisY = chart.getDefaultAxisY().setTickStrategy(AxisTickStrategies.Empty).setMouseInteractions(false)
        chartList.push(chart)
    }
}

// Add title
uiPanel
    .addUIElement(UIElementBuilders.TextBox.setBackground(UIBackgrounds.None))
    .setText(`${COLUMNS * ROWS} live trading channels (1 ms resolution) 1 minute history`)
    .setMouseInteractions(false)
    .setPosition({x: 50, y: 100})
    .setOrigin(UIOrigins.CenterTop)

if (! showFullDashboard) {
    // Add button that will display the full 10x10 dashboard (for users with large monitors).
    uiPanel.addUIElement(UIElementBuilders.TextBox)
        .setText('Click here to show full 10x10 dashboard')
        .setPosition({x: 50, y: 100})
        .setOrigin(UIOrigins.CenterTop)
        .setMargin(30)
        .setDraggingMode(UIDraggingModes.notDraggable)
        .setMouseStyle(MouseStyles.Point)
        .onMouseClick(() => {
            // Add '?full = true' to URL and reload page.
            let url = window.location.href
            url += (url.split('?')[1] ? '&':'?') + 'full=true'
            window.location.href = url
        })
}

// Add chart specific UI elements.
const chartUiList = chartList.map((chart) => {
    const uiLayout = chart
        .addUIElement(UILayoutBuilders.Column, {x: chart.uiScale, y: chart.getDefaultAxisY()})
        .setOrigin(UIOrigins.LeftTop)
        .setPosition({ x: 0, y: chart.getDefaultAxisY().getInterval().end })
        .setMouseInteractions(false)
        .setBackground((background) => background.setStrokeStyle(emptyLine))
    chart.getDefaultAxisY().onScaleChange((start, end) => uiLayout.setPosition({ x: 0, y: end }))
    uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText('< Stock name >')
        .setTextFont((font) => font.setSize(8))
        .setMargin({ bottom: -6 })
    const rowLastValue = uiLayout.addElement(UILayoutBuilders.Row).setMargin({ bottom: -6 })
    const rowChange = uiLayout.addElement(UILayoutBuilders.Row)
    rowLastValue
        .addElement(UIElementBuilders.TextBox)
        .setText('Last value:')
        .setTextFont((font) => font.setSize(8))
    const labelLastValue = rowLastValue
        .addElement(UIElementBuilders.TextBox)
        .setText('')
        .setTextFont((font) => font.setSize(8))
    rowChange
        .addElement(UIElementBuilders.TextBox)
        .setText('Change:')
        .setTextFont((font) => font.setSize(8))
    const labelChange = rowChange
        .addElement(UIElementBuilders.TextBox)
        .setText('')
        .setTextFont((font) => font.setSize(8))

    return { labelLastValue, labelChange }
})

const seriesList = chartList.map((chart, i) => {
    const series = chart
        .addLineSeries({
            dataPattern: {
                // pattern: 'ProgressiveX' -> every X value is larger than previous one.
                pattern: 'ProgressiveX',
                // regularProgressiveStep: true -> step between every X value is always same (1, 2, 3, ...).
                regularProgressiveStep: true,
            },
            // Pass custom supplied index for automatic series coloring.
            automaticColorIndex: i,
        })
        .setName(`< Stock name >`)
        .setStrokeStyle((stroke) => stroke.setThickness(1))
        .setDataCleaning({
            minDataPointCount: 1000,
        })
        .setCursorResultTableFormatter((builder, _, x, y, dataPoint) =>
            builder
                .addRow(series.getName())
                // Display "age" of data point, as time passed since current time.
                .addRow(TimeFormattingFunctions.hhmmssmmm(dataPoint.x - window.performance.now()))
                .addRow('Value: ', series.axisY.formatValue(dataPoint.y)),
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
            // Extra array that is used to keep memory of actively visible data points. Used for calculating visible change of Y values.
            visibleDataPoints: [],
        })
    })
    const dataSetsCount = dataSetsAndSeries.length

    const initialDataVisibleCount = 30 * 1000
    let lastX = -initialDataVisibleCount
    const pushData = () => {
        const tNow = window.performance.now()
        // For each unique data set, prepare list of new XY points to add.
        const dataSetNewPoints = dataSetsAndSeries.map((_) => [])
        for (let x = lastX + 1; x < tNow; x += 1) {
            let iSample = x % dataSetLength
            while (iSample < 0) iSample += dataSetLength
            for (let iDataSet = 0; iDataSet < dataSetsCount; iDataSet += 1) {
                const y = dataSetsAndSeries[iDataSet].dataSet[iSample]
                dataSetNewPoints[iDataSet].push({ x, y })
            }
            lastX = x
        }
        // Push XY points into series.
        dataSetsAndSeries.forEach((item, i) => {
            const newPoints = dataSetNewPoints[i]
            item.seriesList.forEach((series) => {
                series.add(newPoints)
            })

            // Update analytics UI for each chart that uses the same data set.
            const lastValue = item.seriesList[0].axisY.formatValue(newPoints[newPoints.length - 1].y)

            // Update list of visible data points.
            // NOTE: push ... syntax is known to cause errors with really large arrays, this is just a bit of extra safety to prevent random crashes when chart is hidden to background and opened after a long time.
            if (newPoints.length < 100000) {
                item.visibleDataPoints.push(...newPoints)
            }

            // Update chart UI that displays last value.
            item.seriesList.forEach((series) => {
                const chartUi = chartUiList[chartList.indexOf(series.chart)]
                chartUi.labelLastValue.setText(lastValue)
            })
        })
        requestAnimationFrame(pushData)
    }
    pushData()

    // Logic for displaying visible value change for each chart.
    const fillStylePositiveChange = new SolidFill({ color: ColorRGBA(0, 255, 0) })
    const fillStyleNegativeChange = new SolidFill({ color: ColorRGBA(255, 0, 0) })
    const updateVisibleChange = () => {
        dataSetsAndSeries.forEach((item, i) => {
            if (item.visibleDataPoints.length > HISTORYMS) {
                item.visibleDataPoints = item.visibleDataPoints.slice(item.visibleDataPoints.length - HISTORYMS)
            }
            const yStart = item.visibleDataPoints[0].y
            const yEnd = item.visibleDataPoints[item.visibleDataPoints.length - 1].y
            const visibleChange =
                yEnd > yStart ? `${((yEnd / yStart - 1) * 100).toFixed(1)}%` : `-${((1 - yEnd / yStart) * 100).toFixed(1)}%`

            item.seriesList.forEach((series) => {
                const chartUi = chartUiList[chartList.indexOf(series.chart)]
                chartUi.labelChange
                    .setText(visibleChange)
                    .setTextFillStyle(yEnd > yStart ? fillStylePositiveChange : fillStyleNegativeChange)
            })
        })
    }
    setInterval(updateVisibleChange, 2000)
})
