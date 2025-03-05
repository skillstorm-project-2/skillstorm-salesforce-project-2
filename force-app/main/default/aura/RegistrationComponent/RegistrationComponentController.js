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

  handleShowToast: function (component, event) {
    var title = event.getParam("title");
    var variant = event.getParam("variant");
    var message = event.getParam("message");

    // Ensure the message isn't null
    if (!message) {
      message = "An error occurred. Please try again.";
    }

    // Handle Apex error formatting
    if (variant === "error") {
      if (message.includes("List has no rows for assignment")) {
        message = "No matching records found.";
      } else if (message.includes("FIELD_CUSTOM_VALIDATION_EXCEPTION")) {
        message = "Some data is invalid. Please check your input.";
      } else if (message.includes("DUPLICATE_VALUE")) {
        message = "This record already exists.";
      } else {
        message =
          "An error occurred while processing your request. Please try again later.";
      }
    }

    var toastComponent = component.find("toastComponent");
    if (toastComponent) {
      toastComponent.set("v.title", title || "Notification");
      toastComponent.set("v.message", message);
      toastComponent.set("v.variant", variant || "info");

      toastComponent.showToast();
    } else {
      console.error("❌ Toast component not found!");
    }
  }
});
