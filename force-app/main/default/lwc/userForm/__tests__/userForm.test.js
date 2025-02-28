import { createElement } from "@lwc/engine-dom";
import UserForm from "c/userForm";
import createUser from "@salesforce/apex/UserCreationController.createUser";

// Mock the apex method
jest.mock(
  "@salesforce/apex/UserCreationController.createUser",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

describe("c-user-form", () => {
  let element;

  beforeEach(() => {
    // Create initial element
    element = createElement("c-user-form", {
      is: UserForm
    });
    document.body.appendChild(element);

    // Reset the mocked apex method
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("initializes with empty form fields and disabled button", () => {
    // Check initial state of the component
    const inputs = element.shadowRoot.querySelectorAll("lightning-input");
    expect(inputs.length).toBe(6);

    inputs.forEach((input) => {
      expect(input.value).toBe("");
    });

    // Verify button is disabled on initial load
    const button = element.shadowRoot.querySelector("lightning-button");
    expect(button.disabled).toBeTruthy();
  });

  it("enables button when all required fields are filled", () => {
    // Fill all required fields
    const inputFields = element.shadowRoot.querySelectorAll("lightning-input");

    // Helper function to update input field
    const updateInput = (name, value) => {
      const input = [...inputFields].find((el) => el.name === name);
      input.value = value;
      input.dispatchEvent(
        new CustomEvent("change", {
          detail: { value }
        })
      );
    };

    // Button should be disabled initially
    let button = element.shadowRoot.querySelector("lightning-button");
    expect(button.disabled).toBeTruthy();

    // Fill all fields
    updateInput("FirstName", "Test");
    updateInput("LastName", "User");
    updateInput("Email", "test@example.com");
    updateInput("Username", "test@example.com");
    updateInput("Alias", "tuser");
    updateInput("CommunityNickname", "TestUser");

    // Return a promise to wait for any asynchronous DOM updates
    return Promise.resolve().then(() => {
      // Button should be enabled now
      button = element.shadowRoot.querySelector("lightning-button");
      expect(button.disabled).toBeFalsy();
    });
  });

  it("auto-populates Username when Email is entered", () => {
    // Get the email input field
    const inputFields = element.shadowRoot.querySelectorAll("lightning-input");
    const emailInput = [...inputFields].find((el) => el.name === "Email");

    // Simulate email input change
    emailInput.value = "test@example.com";
    emailInput.dispatchEvent(
      new CustomEvent("change", {
        target: {
          name: "Email",
          value: "test@example.com"
        }
      })
    );

    // Return a promise to wait for any asynchronous DOM updates
    return Promise.resolve().then(() => {
      // Check if Username was auto-populated
      const usernameInput = [...inputFields].find(
        (el) => el.name === "Username"
      );
      expect(usernameInput.value).toBe("test@example.com");
    });
  });

  it("auto-populates Alias when First and Last name are entered", () => {
    const inputFields = element.shadowRoot.querySelectorAll("lightning-input");

    // Simulate first name input change
    const firstNameInput = [...inputFields].find(
      (el) => el.name === "FirstName"
    );
    firstNameInput.value = "John";
    firstNameInput.dispatchEvent(
      new CustomEvent("change", {
        target: {
          name: "FirstName",
          value: "John"
        }
      })
    );

    // Return a promise to wait for DOM updates
    return Promise.resolve()
      .then(() => {
        // Simulate last name input change
        const lastNameInput = [...inputFields].find(
          (el) => el.name === "LastName"
        );
        lastNameInput.value = "Doe";
        lastNameInput.dispatchEvent(
          new CustomEvent("change", {
            target: {
              name: "LastName",
              value: "Doe"
            }
          })
        );

        // Return another promise for next DOM updates
        return Promise.resolve();
      })
      .then(() => {
        // Check if Alias was auto-populated correctly
        const aliasInput = [...inputFields].find((el) => el.name === "Alias");
        expect(aliasInput.value).toBe("jdoe");
      });
  });

  it("auto-populates Nickname when Last name is entered", () => {
    const inputFields = element.shadowRoot.querySelectorAll("lightning-input");

    // Set FirstName first
    const firstNameInput = [...inputFields].find(
      (el) => el.name === "FirstName"
    );
    firstNameInput.value = "John";
    firstNameInput.dispatchEvent(
      new CustomEvent("change", {
        target: {
          name: "FirstName",
          value: "John"
        }
      })
    );

    // Return a promise to wait for DOM updates
    return Promise.resolve()
      .then(() => {
        // Then set LastName
        const lastNameInput = [...inputFields].find(
          (el) => el.name === "LastName"
        );
        lastNameInput.value = "Doe";
        lastNameInput.dispatchEvent(
          new CustomEvent("change", {
            target: {
              name: "LastName",
              value: "Doe"
            }
          })
        );

        // Return another promise for next DOM updates
        return Promise.resolve();
      })
      .then(() => {
        // Check if CommunityNickname was auto-populated correctly
        const nicknameInput = [...inputFields].find(
          (el) => el.name === "CommunityNickname"
        );
        expect(nicknameInput.value).toBe("JDoe");
      });
  });

  it("calls apex method when form is submitted", () => {
    // Setup mock response
    const USER_ID = "005XXXXXXXXXXXXXXX";
    createUser.mockResolvedValue(USER_ID);

    // Fill required fields
    const inputFields = element.shadowRoot.querySelectorAll("lightning-input");

    // Helper function to update input field
    const updateInput = (name, value) => {
      const input = [...inputFields].find((el) => el.name === name);
      input.value = value;
      input.dispatchEvent(
        new CustomEvent("change", {
          target: {
            name,
            value
          }
        })
      );
    };

    // Fill all fields
    updateInput("FirstName", "Test");
    updateInput("LastName", "User");
    updateInput("Email", "test@example.com");
    updateInput("Username", "test@example.com");
    updateInput("Alias", "tuser");
    updateInput("CommunityNickname", "TestUser");

    // Return a promise to wait for DOM updates
    return Promise.resolve()
      .then(() => {
        // Click submit button
        const button = element.shadowRoot.querySelector("lightning-button");
        button.click();

        // Check if apex method was called with correct data
        expect(createUser).toHaveBeenCalled();

        // Check the content of the payload
        const callPayload = JSON.parse(createUser.mock.calls[0][0].userJson);
        expect(callPayload.FirstName).toBe("Test");
        expect(callPayload.LastName).toBe("User");
        expect(callPayload.Email).toBe("test@example.com");
        expect(callPayload.Username).toBe("test@example.com");
        expect(callPayload.IsActive).toBe(true);

        // Advance mocks
        return Promise.resolve();
      })
      .then(() => {
        // Check spinner is displayed during loading
        const spinner = element.shadowRoot.querySelector("lightning-spinner");
        expect(spinner).not.toBeNull();

        // Resolve the apex method promise
        return Promise.resolve();
      });
  });

  it("shows spinner when loading and dispatches success event when user is created", () => {
    // Setup mock response
    const USER_ID = "005XXXXXXXXXXXXXXX";
    createUser.mockResolvedValue(USER_ID);

    // Setup event listener for usercreated event
    const userCreatedHandler = jest.fn();
    element.addEventListener("usercreated", userCreatedHandler);

    // Setup event listener for showtoast event
    const toastHandler = jest.fn();
    element.addEventListener("showtoast", toastHandler);

    // Fill all required fields and submit form
    const inputFields = element.shadowRoot.querySelectorAll("lightning-input");

    // Helper function to update input field
    const updateInput = (name, value) => {
      const input = [...inputFields].find((el) => el.name === name);
      input.value = value;
      input.dispatchEvent(
        new CustomEvent("change", {
          target: {
            name,
            value
          }
        })
      );
    };

    // Fill necessary fields
    updateInput("FirstName", "Test");
    updateInput("LastName", "User");
    updateInput("Email", "test@example.com");
    updateInput("Username", "test@example.com");
    updateInput("Alias", "tuser");
    updateInput("CommunityNickname", "TestUser");

    // Return a promise to wait for DOM updates
    return Promise.resolve()
      .then(() => {
        // Click submit button
        const button = element.shadowRoot.querySelector("lightning-button");
        button.click();

        // Wait for apex method mock to resolve
        return Promise.resolve();
      })
      .then(() => {
        // At this point the promise from createUser is still pending
        const spinner = element.shadowRoot.querySelector("lightning-spinner");
        expect(spinner).not.toBeNull();

        // Manually resolve the createUser promise
        // This triggers the .then() handler in the component
        return Promise.resolve(createUser.mock.results[0].value);
      })
      .then(() => {
        // The component needs time to process the resolved promise
        // Wait for multiple rendering cycles
        return Promise.resolve().then(() =>
          Promise.resolve().then(() => Promise.resolve())
        );
      })
      .then(() => {
        // Verify toast and event were fired with correct parameters
        expect(toastHandler).toHaveBeenCalled();
        expect(toastHandler.mock.calls[0][0].detail.title).toBe("Success");
        expect(toastHandler.mock.calls[0][0].detail.variant).toBe("success");

        expect(userCreatedHandler).toHaveBeenCalled();
        expect(userCreatedHandler.mock.calls[0][0].detail.userId).toBe(USER_ID);

        // Now the spinner should no longer be displayed
        const spinner = element.shadowRoot.querySelector("lightning-spinner");
        expect(spinner).toBeNull();
      });
  });

  it("handles errors from the apex call", () => {
    // Setup mock error response
    const ERROR_MSG = "Error creating user";
    createUser.mockRejectedValue({
      body: {
        message: ERROR_MSG
      }
    });

    // Setup event listener for showtoast event
    const toastHandler = jest.fn();
    element.addEventListener("showtoast", toastHandler);

    // Fill required fields and submit
    const inputFields = element.shadowRoot.querySelectorAll("lightning-input");

    // Helper function to update input field
    const updateInput = (name, value) => {
      const input = [...inputFields].find((el) => el.name === name);
      input.value = value;
      input.dispatchEvent(
        new CustomEvent("change", {
          target: {
            name,
            value
          }
        })
      );
    };

    // Fill all fields
    updateInput("FirstName", "Test");
    updateInput("LastName", "User");
    updateInput("Email", "test@example.com");
    updateInput("Username", "test@example.com");
    updateInput("Alias", "tuser");
    updateInput("CommunityNickname", "TestUser");

    // Return a promise to wait for DOM updates
    return Promise.resolve()
      .then(() => {
        // Click submit button
        const button = element.shadowRoot.querySelector("lightning-button");
        button.click();

        // Wait for the next tick when isLoading becomes true
        return Promise.resolve();
      })
      .then(() => {
        // Spinner should be displayed during the rejection
        const spinner = element.shadowRoot.querySelector("lightning-spinner");
        expect(spinner).not.toBeNull();

        // Let the promise rejection propagate
        return Promise.resolve().then(() =>
          Promise.resolve().then(() => Promise.resolve())
        );
      })
      .then(() => {
        // Verify error toast was fired with correct parameters
        expect(toastHandler).toHaveBeenCalled();
        expect(toastHandler.mock.calls[0][0].detail.title).toBe("Error");
        expect(toastHandler.mock.calls[0][0].detail.message).toBe(ERROR_MSG);
        expect(toastHandler.mock.calls[0][0].detail.variant).toBe("error");

        // Now the spinner should no longer be displayed
        const spinner = element.shadowRoot.querySelector("lightning-spinner");
        expect(spinner).toBeNull();
      });
  });
});
