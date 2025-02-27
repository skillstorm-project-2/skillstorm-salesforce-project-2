({
  handleUserCreated: function (component, event) {
    // Get userId from the event
    var userId = event.getParam("userId");

    // Store the userId
    component.set("v.userId", userId);

    // Move to next step
    component.set("v.currentStep", "2");
  },

  handleComplete: function (component) {
    component.set("v.currentStep", "3");
  },

  // Use the LWC modal instead of toast
  handleShowToast: function (component, event) {
    var title = event.getParam("title");
    var variant = event.getParam("variant");
    var message = event.getParam("message");

    if (title === "Error" || variant === "error") {
      console.error(message);
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
  handleModalClose: function (component) {
    component.set("v.showModal", false);
  }
});
