// src/services/ActionHandler.js

const ActionHandler = (action) => {
    console.log(`Action in ACTION HANDLER is "${action}"`);
    let purpose = "click";

    if (action !== "DONE" && action !== "START") {
        let uid = action;
        let inputVal = null;

        if (action.includes(":")) {
            const actionArr = action.split(":");
            uid = actionArr[0];
            inputVal = actionArr[1];
            purpose = "fill";
        }

        const element = document.getElementById(uid);

        if (!element) {
            console.error(`Element with uid "${uid}" not found.`);
            return;
        }
        console.log(`ELEMENT IS ${element.tagName}`);

        switch (purpose) {
            case 'click':
                console.log(`Attempting to click element with uid "${uid}".`);
                // Create and dispatch a MouseEvent
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                });
                element.dispatchEvent(clickEvent);
                console.log(`Dispatched click event on element with uid "${uid}".`);
                break;
            case 'fill':
                if (inputVal !== undefined) {
                    console.log(`Filling element with uid "${uid}" with value "${inputVal}".`);
                    element.value = inputVal;
                    // Dispatch input event to notify React of the change
                    const event = new Event('input', { bubbles: true });
                    element.dispatchEvent(event);
                    console.log(`Filled element with uid "${uid}" with input "${inputVal}".`);
                } else {
                    console.error(`No input provided for fill action on uid "${uid}".`);
                }
                break;
            // Add more cases as needed for different purposes
            default:
                console.warn(`Unknown purpose "${purpose}" for action with uid "${uid}".`);
        }
    }
};

export default ActionHandler;
