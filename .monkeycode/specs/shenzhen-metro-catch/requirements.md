# Requirements Document

## Introduction

深圳赶车助手是手机优先的 Web 应用，面向在深圳通勤的乘客。用户先选地铁或公交，再选定目标站点、线路与方向后，赶车页展示即将到站的班次，并明确告知目标班次还有几分钟到达，或该班次是否已经错过。到站时刻由首末班与分时段发车间隔估算，并标明「估算」。地铁覆盖全部在运营站点；公交覆盖全市线路（2026年10月一览表）。不含跨站换乘路径规划。

## Glossary

- **System**: 深圳地铁赶车助手
- **Station**: 深圳地铁在运营站点，含换乘站
- **Line**: 深圳地铁在运营线路，含支线
- **Direction**: 某条线路上列车运行的终点方向
- **Arrival**: 某列车预计到达所选站点的时间点
- **Target Train**: 用户指定要赶上的那一班列车
- **Countdown**: 当前时刻到目标列车预计到站时刻的剩余分钟数
- **Missed**: 目标列车预计到站时刻已早于当前时刻
- **Operating Hours**: 该线路在所选站点当日的运营时间范围

## Requirements

### Requirement 1: 覆盖深圳全部地铁站点

**User Story:** AS 深圳通勤乘客, I want 浏览和搜索深圳全部地铁站点, so that 我能选到要赶车的那一站

#### Acceptance Criteria

1. THE System SHALL provide a station catalog covering all Shenzhen Metro stations currently in revenue service, including interchange stations and branch-line stations.
2. WHEN the user types a station name, pinyin, or pinyin abbreviation, the System SHALL return matching stations within 300 milliseconds of the query being submitted.
3. WHEN the user selects a station, the System SHALL display every Line that serves that Station together with both Directions of each Line.
4. IF the station catalog cannot be loaded, the System SHALL display a retry action and keep previously loaded station data available for selection.

### Requirement 2: 选定赶车站点、线路与方向

**User Story:** AS 深圳上班乘客, I want 选定某个站、某条线、某个方向, so that 系统只跟踪我要赶的那一侧列车

#### Acceptance Criteria

1. WHEN the user selects a Station, a Line, and a Direction, the System SHALL treat that combination as the active watch target.
2. WHILE a watch target is active, the System SHALL display the Station name, Line name, and Direction name on the catch screen.
3. WHEN the user changes Station, Line, or Direction, the System SHALL replace the previous watch target and refresh Arrivals for the new combination.
4. THE System SHALL persist the last watch target on the same device so that the next visit restores Station, Line, and Direction.

### Requirement 3: 展示即将到站班次与剩余时间

**User Story:** AS 赶地铁的乘客, I want 看到接下来几班车还有几分钟到, so that 我能判断现在出发是否来得及

#### Acceptance Criteria

1. WHEN a watch target is active, the System SHALL list the next upcoming Arrivals for that Station, Line, and Direction, showing at least the next 3 Arrivals when 3 or more remain in Operating Hours.
2. WHEN an Arrival is listed, the System SHALL display remaining minutes until the estimated arrival time, rounded down to a whole minute.
3. WHEN remaining minutes equal 0 and the estimated arrival time has not yet passed, the System SHALL display the Arrival as arriving now.
4. WHILE a watch target is active, the System SHALL refresh Arrival estimates at least once every 20 seconds.
5. IF no more Arrivals remain for the watch target within Operating Hours, the System SHALL display that service has ended for the selected Direction.

### Requirement 4: 判断目标班次是否错过

**User Story:** AS 赶某趟地铁的乘客, I want 明确知道我要赶的那班车是否已经错过, so that 我能立刻改赶下一班

#### Acceptance Criteria

1. WHEN the user marks an Arrival as the Target Train, the System SHALL display that Arrival as the Target Train on the catch screen.
2. WHILE the Target Train estimated arrival time is later than the current time, the System SHALL display a Countdown in whole minutes for the Target Train.
3. WHEN the Target Train estimated arrival time becomes earlier than the current time, the System SHALL mark the Target Train as Missed.
4. WHEN the Target Train is Missed, the System SHALL highlight the next upcoming Arrival as the replacement train and keep the Missed Target Train visible until the user dismisses it or selects another Target Train.
5. IF the user has not marked a Target Train, the System SHALL treat the soonest upcoming Arrival as the default Target Train.

### Requirement 5: 运营时段与数据状态提示

**User Story:** AS 乘客, I want 在无车、未开、数据异常时看到明确状态, so that 我不会把空列表当成还有车

#### Acceptance Criteria

1. IF the current time is before the first Arrival of the selected Direction on the current day, the System SHALL display the time of the first Arrival.
2. IF Arrival data is stale for more than 60 seconds, the System SHALL display that the estimate may be outdated and keep the last known Arrivals visible.
3. IF Arrival data cannot be retrieved, the System SHALL display a retry action and retain the last successful Arrival list when one exists.
4. THE System SHALL display the timestamp of the latest successful Arrival update on the catch screen.

### Requirement 6: 通勤赶车主界面

**User Story:** AS 赶车乘客, I want 打开应用后立刻看到赶车倒计时, so that 我在出门前几秒就能做决定

#### Acceptance Criteria

1. WHEN the user opens the System and a persisted watch target exists, the System SHALL show the catch screen for that watch target as the first screen.
2. THE catch screen SHALL display Station name, Line name, Direction, Target Train Countdown or Missed status, and the next Arrival list above the fold on a 390-pixel-wide viewport.
3. WHEN the user searches or browses stations, the System SHALL provide a station picker that returns to the catch screen after a Station, Line, and Direction are confirmed.
