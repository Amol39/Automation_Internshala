# Internshala Job Application Automation

## Overview

This project automates the job application process on Internshala using Puppeteer, a Node.js library for browser automation. The script performs tasks such as logging in, filling out application forms, and submitting multiple internship applications, significantly improving efficiency and reducing manual entry time.

## Features

- **Automated Login**: Logs into Internshala with provided credentials.
- **Form Filling**: Automatically fills out graduation details, training experiences, and work samples.
- **Application Submission**: Submits multiple internship applications efficiently.
- **Error Handling**: Includes robust error handling and timeout management to ensure script reliability.

## Prerequisites

Before running the script, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/get-npm)

## Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/Amol39/automation_internshala.git
    cd automation_internshala
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Credentials**

   - Create a `data.js` file and add your Internshala credentials and other data:

    ```javascript
    let id = "your-email@example.com";
    let pass = "your-password";
    module.exports = { id, pass };
    ```

   - Update `data.js` with your personal information:

    ```javascript
    module.exports = [
      {
        "College": "Your College",
        "Degree": "Your Degree",
        "Stream": "Your Stream",
        "Percentage": "Your CGPA",
        "Training": "Your Training",
        "Organization": "Your Organization",
        "description": "Your Description",
        "link": "Your GitHub Link",
        "hiringReason": "Why you want to be hired",
        "availability": "Your Availability",
        "rating": "Your Rating"
      }
    ];
    ```

## Running the Script

To execute the script, run the following command:

```bash
npm start
