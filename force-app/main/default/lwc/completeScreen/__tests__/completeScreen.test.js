import { createElement } from "@lwc/engine-dom";
import CompleteScreen from "c/completeScreen";

describe("c-complete-screen", () => {
  let element;

  beforeEach(() => {
    // Create the component
    element = createElement("c-complete-screen", {
      is: CompleteScreen
    });
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up after each test
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays the lightning-card with correct title", () => {
    // Verify the lightning-card title
    const cardElement = element.shadowRoot.querySelector("lightning-card");
    expect(cardElement).not.toBeNull();
    expect(cardElement.title).toBe("Thanks for Registering");
  });

  it("displays the correct message to the user", () => {
    // Verify the paragraph text content
    const pElement = element.shadowRoot.querySelector("p");
    expect(pElement).not.toBeNull();
    expect(pElement.textContent).toContain(
      "Please check your email for instructions"
    );
  });

  it("has proper styling with slds class", () => {
    // Verify the div has the proper styling class
    const divElement = element.shadowRoot.querySelector("div");
    expect(divElement).not.toBeNull();
    expect(divElement.className).toContain("slds-p-around_medium");
  });
});
