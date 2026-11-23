# LO-TUD -  Light Online Time Use Diary

A light version of [O-TUD](https://github.com/andreifoldes/o-timeusediary), a web-based research tool for collecting and visualizing daily activities in a timeline format. It is a simplified and minimalist version with fewer features specifically designed for daily time-use surveys in the [Open Play](https://digital-wellbeing.github.io/open-play/) study. This version takes ~3 minutes to complete, instead of the original version which takes ~15 minutes. 

[![DOI](https://zenodo.org/badge/928261797.svg)](https://doi.org/10.5281/zenodo.17592563)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Citation
Hakman, T., & Foldes, T. A. (2025). LO-TUD - Light Online Time Use Diary (V1.0.0). Zenodo. https://doi.org/10.5281/zenodo.17592564

## 🚀 Quick Start

- **[LO-TUD Live Demo](https://timediary-game.netlify.app)** - Try the light version
- **[O-TUD Live Demo](https://andreifoldes.github.io/o-timeusediary/index.html)** - Try the full version
- **[Documentation](https://andreifoldes.github.io/o-timeusediary/docs/index.html)** - Complete setup and configuration guides

## Features

*   **Interactive Timeline Interface:**  Engage with your data through a dynamic timeline. Users can easily navigate and explore their activities with zoom and pan functionalities.
*   **Drag and Drop Activity Placement:**  Intuitively add and reposition activities directly on the timeline. This feature simplifies data entry and adjustments, making it user-friendly for participants.
*   **Mobile and Desktop Responsive Layouts:**  Access and use the tool seamlessly across various devices. Whether on a desktop for detailed analysis or a mobile device for on-the-go recording, the layout adapts to provide an optimal experience.
    - **Desktop Layout:** Features a full-width timeline with horizontal controls, optimized for precise mouse interactions and detailed data entry
    - **Mobile Layout:** Compact vertical layout with touch-friendly controls, optimized for finger navigation and thumb interaction
*   **Data Export Functionality:**  Export your collected data in common formats like CSV and JSON. This allows for easy integration with other analysis tools and research workflows.

## Screenshots

### Desktop Layout
The desktop version provides a comprehensive view with full-width timeline and horizontal navigation controls, designed for detailed data entry and analysis.

![Desktop Layout](docs/images/desktop-layout.png)

### Mobile Layout
The mobile version features a compact, touch-friendly interface with vertical controls optimized for smartphone usage and on-the-go data collection.

![Mobile Layout](docs/images/mobile-layout.png)

## Technology Stack

*   HTML
*   CSS
*   JavaScript


## Usage

### For Researchers

Researchers can utilize LO-TUD to:

*   **Design and deploy time-use studies:** Customize activity categories and study durations to fit specific research needs.
*   **Collect rich activity data:** Gather detailed information about participant's daily routines in a structured timeline format.
*   **Export data for analysis:** Easily export collected data in CSV or JSON formats for statistical analysis and visualization using other tools.

### For Participants

Participants can use LO-TUD to:

*   **Record daily activities:**  Log your daily activities in an intuitive timeline interface by simply dragging and dropping activities.
*   **Visualize time use:**  Gain insights into how your time is spent each day, week, or study period through interactive visualizations.
*   **Contribute to research:**  Participate in research studies and contribute valuable data on daily life patterns.

## Contributing

We welcome contributions to O-TUD! Since LO-TUD is a simplified version of O-TUD, any contributions to O-TUD will also benefit LO-TUD.

*   **Pull Requests:**  Feel free to submit pull requests for bug fixes, feature enhancements, or documentation improvements.
*   **Issue Reporting:**  For major changes or to report issues, please open an issue first to discuss the proposed changes.

## Browser Compatibility

### Minimum Browser Requirements (2020+)
- **Chrome:** Version 80 or later (early 2020) 
- **Firefox:** Version 75 or later (early 2020) 
- **Safari:** Version 13 or later (late 2019) 
- **Edge:** Version 80 or later (early 2020)
- **Brave:** Version 1.34 or later
- **Opera:** Version 67 or later (early 2020)

- **iOS Safari:** Version 13.4 or later (early 2020)
- **Chrome for Android:** Version 8 or later (late 2017)

### Technical Requirements
The application utilizes several modern web features:

#### JavaScript (ES6+)
- ES2017+ features (async/await)
- Native JavaScript modules (import/export)
- Optional chaining operator (`?.`) - ES2020
- Modern Web APIs (IntersectionObserver)

#### CSS (CSS3)
- Modern layout features (Flexbox with `gap`, Grid)
- CSS `clamp()` function
- `env(safe-area-inset-*)` for iOS safe areas
- `backdrop-filter` with `@supports` fallbacks

### Known Issues
- **Dates of activities in v1.0.0 (fixed in v1.0.1).** v1.0.0 dated each activity from the device's clock at the moment the block was placed or resized, which went wrong in two cases. When a diary covered the last day of a month, activities after midnight got the wrong month: for a diary of 31 October, 00:30 was recorded as 1 October instead of 1 November. A diary filled in after midnight was dated one day too late, and one filled in across midnight was split over two days. The times of day were right, except in the hour skipped when the clocks go forward, which v1.0.0 recorded an hour later. v1.0.1 fixes the date of each diary when it opens (the day before, counted from 4am to 4am, or a `DIARY_DATE=YYYY-MM-DD` link parameter). Open Play's data were collected with v1.0.0; its cleaned diary data are repaired from the release that follows Open Play v1.3.0 (columns `repaired_rollover` and `repaired_midnight`), and its raw file keeps the dates as recorded.
- Internet Explorer: Not supported (any version)
- Legacy Edge (pre-Chromium): Not supported
- Firefox: Limited support for `env(safe-area-inset-*)` features
- Browsers from before mid-2021: May experience layout issues due to Flexbox `gap` support
- Mobile browsers older than 2021: May experience significant issues

## License

This project is open-source and available under the MIT License (see LICENSE file).
