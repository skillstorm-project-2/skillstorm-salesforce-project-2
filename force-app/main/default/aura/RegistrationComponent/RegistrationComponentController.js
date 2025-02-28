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
    component.set("v.currentStep", "3");
  },

  // Use the LWC modal instead of toast
  handleShowToast: function (component, event, helper) {
    var title = event.getParam("title");
    var variant = event.getParam("variant");
    var message = event.getParam("message");

    if (title === "Error" || variant === "error") {
      message =
        "An error has occurred, please contact your salesforce administrator.";
    }
    // Set modal attributes
    component.set("v.modalTitle", title || "Notification");
    component.set("v.modalMessage", message || "Operation completed");
    component.set("v.modalVariant", variant || "info");

    // Show the modal
    component.set("v.showModal", true);

    // Auto-close success messages after 5 seconds
    if (variant === "success") {
      window.setTimeout(
        $A.getCallback(function () {
          component.set("v.showModal", false);
        }),
        5000
      );
    }
  },

  // Handle the modal's close event
  handleModalClose: function (component, event, helper) {
    component.set("v.showModal", false);
  }
});