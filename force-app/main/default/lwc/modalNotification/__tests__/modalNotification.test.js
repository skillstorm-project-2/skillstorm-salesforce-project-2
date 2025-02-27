import { createElement } from "@lwc/engine-dom";
import ModalNotification from "c/modalNotification";

describe("c-modal-notification", () => {
  let element;

  beforeEach(() => {
    // Create component instance
    element = createElement("c-modal-notification", {
      is: ModalNotification
    });
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up after each test
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should not display modal by default", () => {
    // Modal should be hidden by default (isOpen=false)
    const modalSection = element.shadowRoot.querySelector("section");
    expect(modalSection).toBeNull();
  });

  it("should display modal when isOpen is set to true", () => {
    // Set isOpen property to true
    element.isOpen = true;

    // Return a promise to wait for any asynchronous DOM updates
    return Promise.resolve().then(() => {
      // Modal should be visible
      const modalSection = element.shadowRoot.querySelector("section");
      expect(modalSection).not.toBeNull();
      expect(modalSection.className).toContain("slds-modal slds-fade-in-open");
    });
  });

  it("should display correct title and message", () => {
    // Set properties
    element.isOpen = true;
    element.title = "Test Title";
    element.message = "Test Message";

    // Return a promise to wait for any asynchronous DOM updates
    return Promise.resolve().then(() => {
      // Verify title
      const titleElement = element.shadowRoot.querySelector("h2");
      expect(titleElement.textContent).toBe("Test Title");

      // Verify message
      const messageElement = element.shadowRoot.querySelector("p");
      expect(messageElement.textContent).toBe("Test Message");
    });
  });

  it("should apply correct variant class to header", () => {
    // Set properties
    element.isOpen = true;
    element.variant = "success";

    // Return a promise to wait for any asynchronous DOM updates
    return Promise.resolve().then(() => {
      // Verify header class based on variant
      const headerElement = element.shadowRoot.querySelector("header");
      expect(headerElement.className).toContain(
        "slds-modal__header slds-theme_success"
      );
    });
  });

  it("should close the modal when close button is clicked", () => {
    // Set modal to open
    element.isOpen = true;

    // Return a promise to wait for any asynchronous DOM updates
    return Promise.resolve()
      .then(() => {
        // Verify modal is open
        const modalSection = element.shadowRoot.querySelector("section");
        expect(modalSection).not.toBeNull();

        // Get the close button and simulate a click
        const closeButton =
          element.shadowRoot.querySelector("lightning-button");
        closeButton.click();
      })
      .then(() => {
        // Verify modal is closed
        const modalSection = element.shadowRoot.querySelector("section");
        expect(modalSection).toBeNull();
      });
  });

  it("should dispatch close event when modal is closed", () => {
    // Create spy for close event
    const closeHandler = jest.fn();
    element.addEventListener("close", closeHandler);

    // Open modal
    element.isOpen = true;

    // Return a promise to wait for any asynchronous DOM updates
    return Promise.resolve()
      .then(() => {
        // Close the modal programmatically
        element.closeModal();
      })
      .then(() => {
        // Verify event was dispatched
        expect(closeHandler).toHaveBeenCalled();
        // Verify modal is closed
        expect(element.isOpen).toBe(false);
      });
  });

  it("should open modal when openModal is called", () => {
    // Modal should initially be closed
    expect(element.isOpen).toBe(false);

    // Call openModal method
    element.openModal();

    // Return a promise to wait for any asynchronous DOM updates
    return Promise.resolve().then(() => {
      // Verify modal is open
      expect(element.isOpen).toBe(true);
      const modalSection = element.shadowRoot.querySelector("section");
      expect(modalSection).not.toBeNull();
    });
  });
});
