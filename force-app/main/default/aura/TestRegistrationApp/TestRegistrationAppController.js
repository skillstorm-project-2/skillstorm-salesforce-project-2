({
  handleUserCreated: function (component, event, helper) {
    // Get userId from the event
    var userId = event.getParam("userId");

    // Store the userId
    component.set("v.userId", userId);

    // Move to next step
    component.set("v.currentStep", "2");
  },

  handleBack: function (component, event, helper) {
    // Go back to user form
    component.set("v.currentStep", "1");
  },

  handleComplete: function (component, event, helper) {
    // Process completion - could navigate away or reset the form
    var accountId = event.getParam("accountId");

    // Example: navigate to the new account record
    helper.navigateToRecord(component, accountId);
  }
});
