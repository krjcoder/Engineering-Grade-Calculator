# Engineering SPI & CPI Calculator

A simple, responsive web application for engineering students to calculate their Semester Performance Index (SPI) and Cumulative Performance Index (CPI) based on subject credits and grade points.

## Features

- **SPI Calculator:** Calculate semester performance using subject credits and grade points.
- **CPI Calculator:** Calculate cumulative performance across multiple semesters.
- **Current Semester Selection:** Select your current semester from Semester 1 to Semester 8.
- **Subject Management:** Add and remove subjects and semester cards.
- **SPI-to-CPI Transfer:** Transfer semester subjects into the CPI calculator.
- **Automatic Saving:** Save subject details and semester data in browser local storage.
- **Responsive Design:** Use the calculator on desktop and mobile devices.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser Local Storage

## Formulas

**Semester SPI**

SPI = Sum of (Credits × Grade Points) / Sum of Credits

**Cumulative CPI**

CPI = Sum of (All Subject Credits × Grade Points) / Sum of All Subject Credits

## How to Use

1. Open the website.
2. Select your current semester.
3. Enter subject names, credits, and grade points in the SPI calculator.
4. Click **Calculate Semester SPI**.
5. Add semester cards and enter subject details for the CPI calculator.
6. Click **Calculate CPI** to calculate your cumulative performance.

## Run Locally

1. Download or clone this repository.
2. Open `index.html` in your browser.
3. Start using the calculator.

## Data Storage

The application uses browser local storage to save your subject and semester information. Data is stored locally in the browser and is not automatically shared between different browsers or devices.

## Disclaimer

The calculated SPI and CPI depend on the credits and grade points entered. Always verify your results against your university's official grading regulations.

## Author

Created as a web development project to practise HTML, CSS, JavaScript, and browser local storage.
