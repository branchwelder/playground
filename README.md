# playground

This is a little javascript playground meant for quickly iterating on P5.js
sketches. See it live [here](https://twigg.gg/playground/)!

## running locally

Everything's loaded from a CDN, so you just need to serve `index.html` using a
tool such as VSCode's Live Server.

## todo

- **sketch eval**
  - [x] p5 sketch eval in iframe
  - [x] editor full height
  - [x] eval p5 sketch on type
  - [x] intercept p5 friendly errors
- **interface**
  - [x] refactor view into templates
  - [x] resize panels
  - [x] copy sketch code button
  - [x] sketch upload
  - [x] sketch download
  - [ ] show/hide sketch pane
  - [ ] example dropdown
    - [ ] open in official p5 sketch editor? gist?
    - [ ] share - put sketch code in url?
  - [ ] stop/pause sketch loop button
- **editor**
  - [x] changes eval sketch
  - [x] save to local storage
  - [x] eval after change timeout
  - [x] linting with jshint
  - [ ] jsbeautify
  - [ ] autocomplete with p5 terms
  - [ ] shortcuts e.g. commenting
  - [ ] ctrl-s should save sketch code
- **output**
  - [x] different output formatting: p5 friendly, error, log
  - [x] same message just increments counter
  - [ ] should respect buffer
  - [ ] scroll with output
  - [ ] should output persist?
- **bugs**
  - [ ] iframe resize
  - [ ] fix flash on execute? is this possible, as it needs to remove the
        canvas?
  - [ ] sometimes remove is not defined - I believe this is when `new P5()`
        doesn't run due to an error
  - [ ] audio library loading
- **settings**
  - [ ] toggle localstorage
  - [ ] toggle formatting
  - [ ] set sketch timeout interval
  - [ ] select library addons
- **misc**
  - [ ] mobile?
  - [ ] sketch templates
    - [ ] minimal - setup and draw
  - [ ] click on p5 function to go to documentation page
