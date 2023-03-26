# ZioPeraFinder

This tools helps you searching collisions starting from X, Y, Z coordinates and a search radius. It's useful to find the corresponding collision "chunk" file when editing a building.

The program will take X, Y, Z coordinates of the point that we want to look for and a search radius as input. If the research doesn't give any result, it will return the nearest collisions files.

## How to use it

First of all you need NodeJS (LTS), the installer will do the job for you, so steps wont be included in the guide.

Once you have downloaded ZioPeraFinder, open the folder and type the command below to install all the dependencies
```
npm install
```

At this point you can start the collision finder program by typing
```
node finder.js
```
and follow the prompts.

If you want to use the exporter from xml -> json for `lws-maputils` just use the same command but provide `export.js` instead.

### NB.
Remember to use `.` as a decimal separator, you can also just ignore the decimal part in coordinates since the search algorithm doesn't need accurate information to give decent results.