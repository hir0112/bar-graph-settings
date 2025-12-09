## コンポーネント構成

2025/04/05 更新

```mermaid
graph TD
    App --> BarGraphDemo
    BarGraphDemo --> ManualBarGraph
    BarGraphDemo --> GraphControls
    GraphControls --> SettingsButton
    GraphControls --> DownloadButton
    BarGraphDemo <--> Widget
    Widget --> ManualBarGraph
    Widget --> DataSettings
    Widget --> GraphSettings
    Widget --> OkButton
    Widget --> CancelButton
    Widget --> DownloadButton
    GraphSettings --> AxisControl
    GraphSettings --> BarLabelControl
    GraphSettings --> LegendControl
    GraphSettings --> ColorControl
    GraphSettings --> BarWidthControl
    OkButton --> TextButton
    CancelButton --> TextButton
    DownloadButton --> ButtonIcon
    SettingsButton --> ButtonIcon
```
