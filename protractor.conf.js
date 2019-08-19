let chromedriver = require("chromedriver");
let SpecReporter = require("jasmine-spec-reporter").SpecReporter;

exports.config = {
  chromeDriver: chromedriver.path,
  framework: "jasmine",
  directConnect: true,
  getPageTimeout: 60000,
  allScriptsTimeout: 120000,
  rootElement: "",
  specs: ["tests/**/*.spec.js"],
  baseUrl: "http://localhost:9999",
  multiCapabilities: [
    {
      browserName: "chrome",
      chromeOptions: {
        args: [],
        prefs: {
          custom_handlers: {
            enabled: true,
            registered_protocol_handlers: [
              {
                default: true,
                protocol: "mailto",
                title: "Gmail",
                url: "#"
              }
            ]
          }
        }
      }
    }
  ],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(
      new SpecReporter({
        displayFailuresSummary: true,
        displayFailuredSpec: true,
        displaySuiteNumber: true,
        displaySpecDuration: true
      })
    );
  }
};
