# Server ![David](https://david-dm.org/WiseLib/Server.png) ![Travis CI](https://travis-ci.org/WiseLib/Server.svg) [![Code Climate](https://codeclimate.com/github/WiseLib/Server/badges/gpa.svg)](https://codeclimate.com/github/WiseLib/Server) [![Test Coverage](https://codeclimate.com/github/WiseLib/Server/badges/coverage.svg)](https://codeclimate.com/github/WiseLib/Server)

> A web service for managing and exploring research papers.

## Getting Started

1. Clone the source.
   
   `$ git clone git@github.com:WiseLib/Server.git`
   
2. Install the dependencies.
   
   `$ npm install`
   
3. Enable the `gulp`-command in your terminal.
   
   `$ [sudo ]npm install --global gulp`
   
4. Start coding.
   
   `$ gulp`

## Build Tasks

`gulp`

Alias of `gulp test watch`.

`gulp watch`

Analyses and compiles the source files whenever a file gets updated. Usefull when you are programming.

`gulp test`

Runs the complete set of tests for this project.

`gulp package`

Compiles and compresses all source files. The resulting output will be put into the `build/`-directory.

`gulp deploy`

Deploys the current version to our production server. A private key in `.travis/deploy_key` is required.

Other deployment methods are available. See [our wiki](https://github.com/WiseLib/Server/wiki/Deployment) for more information.

## Contributing

Please submit all issues and pull requests to the [WiseLib/Server](http://github.com/WiseLib/Server) repository!

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/WiseLib/Server/issues).

## License 

Copyright (c) 2014, WiseLib

All rights reserved.

This software is released under the GPL-2.0 License
