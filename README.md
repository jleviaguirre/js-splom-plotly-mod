# SPLOM Chart
The scatterplot matrix (SPLOM), is a relatively uncommon graphical tool that uses multiple scatterplots to determine the correlation (if any) between a series of variables.

These scatterplots are then organized into a matrix, making it easy to look at all the potential correlations in one place.

# Data Requirements
To make the SPLOM Chart work properly, the underlying data must have one column per continuous measure and an optional categorical column to color the markers. To create a minimum matrix, at least two columns of continuous measure are required

# Setting up SPLOM
This Mod uses a dynamic way to select multiple columns to be able to plot all the values by using hierarchies but it requires the (Row Number) built in function due to current Mod limitations.

# Source Code
This code is based of Plotly. All source code for the mod example can be found in the `src` folder, organized into GUI, Parser and the main plotly splom function

## Prerequisites
These instructions assume that you have [Node.js](https://nodejs.org/en/) (which includes npm) installed.

## How to get started (with development server)
- Open a terminal at the location of this example.
- Run `npm install`. This will install necessary tools. Run this command only the first time you are building the mod and skip this step for any subsequent builds.
- Run `npm start` to monitor file changes and copy them to dist folder
- Run `npm run server`. This will start a development server.
- Start editing, for example `src/main.js`.
- In Spotfire, follow the steps of creating a new mod and connecting to the development server.

## Working without a development server
- In Spotfire, follow the steps of creating a new mod and then browse for, and point to, the _manifest_ in the `src` folder.