# GeoFS Time Warp

A Tampermonkey userscript that adds a time warp button to GeoFS, 
letting you speed up long flights without leaving the sim.

## Features

- Speed multipliers: 1x, 2x, 4x, 8x, 10x, 50x, 100x
- Button sits in the GeoFS UI bar
- Click to cycle speeds, right click to reset to 1x
- Keyboard shortcut — T to cycle, Shift+T to reset
- Button turns red when warping

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net) on Chrome
2. Open Tampermonkey → Dashboard → New Script
3. Delete everything and paste the contents of `geofs_timewarp.js`
4. Save with Ctrl+S
5. Open [GeoFS](https://www.geo-fs.com/geofs.php) and wait for it to load

## Usage

Click the ⏩ button at the bottom of the screen to cycle through speeds.
Right click to instantly reset to 1x.

## Notes

GeoFS doesn't expose a native simulation speed API so this script 
hooks into what's accessible. Works best at 2x-10x. 
50x and 100x are experimental.

## Author

[@smdsqb](https://github.com/smdsqb)
