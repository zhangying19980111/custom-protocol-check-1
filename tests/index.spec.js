describe("customProtocolCheck", function() {
  beforeEach(function() {
    browser.waitForAngularEnabled(false);
    browser.get("/demo/example.html");
    browser.ignoreSynchronization = true;
  });
  it("should call fail callback, if custom protocol is not installed", function() {
    const aNonExistCustomProtocol = element(by.id("aNonExistCustomProtocol"));
    aNonExistCustomProtocol.click();
    browser.sleep(2000);
    expect(aNonExistCustomProtocol.getAttribute("result")).toEqual("false");
  });

  it("should open app associated with custom protocol", function() {
    const aExistingProtocol = element(by.id("aExistingProtocol"));
    aExistingProtocol.click();
    browser.sleep(2000);
    expect(aExistingProtocol.getAttribute("result")).toEqual("true");
  });
});
