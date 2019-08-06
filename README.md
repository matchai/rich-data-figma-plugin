# Rich Data for Figma 

Replace placeholder Figma text values with _real_ data from _real_ APIs!

The main plugin code is in `src/code.ts`. The HTML for the UI is in
`src/ui.html`, while the embedded JavaScript is in `src/ui.ts`.

These are compiled to files in `dist/`, which are what Figma will uses to run
the plugin.

To build:

    $ npm install
    $ npm start
