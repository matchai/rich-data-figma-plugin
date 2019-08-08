# Rich Data for Figma

> ⚠️ This is very much a WIP! Feel free to play around with it, but it won't be published to Figma's plugin list for a bit.

Replace placeholder Figma text values with _real_ data from _real_ APIs!

The main plugin code is in `src/code.ts`. The HTML for the UI is in
`src/ui.html`, while the embedded JavaScript is in `src/ui.ts`.

These are compiled to files in `dist/`, which are what Figma will uses to run
the plugin.

To build:

    $ npm install
    $ npm start

## Development Plans

- [x] Replace JSON paths with values from JSON API
- [x] Revert values back to JSON paths
- [x] Increment array values for JSON paths in component instances
- [ ] Create UI for substituting values with JSON keys
- [ ] Allow image URLs to be used as element backgrounds

## License

Copyright © 2019-present.<br>
This project is [ISC](./LICENSE) licensed.
