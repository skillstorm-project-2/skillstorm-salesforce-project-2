// userAccountCreationContainerHelper.js
({
  navigateToRecord: function (component, recordId) {
    var navEvt = $A.get("e.force:navigateToSObject");
    if (navEvt) {
      navEvt.setParams({
        recordId: recordId,
        slideDevName: "detail"
      });
      navEvt.fire();
    } else {
      // If not in Lightning Experience, fall back to standard navigation
      window.location.href = "/" + recordId;
    }
  }
});