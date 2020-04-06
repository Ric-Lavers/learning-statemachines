/* eslint-disable no-unused-vars */
import { assign, Machine } from "xstate"

export const carDoorMachine = Machine(
  {
    id: "carDoor",
    initial: "idle",
    context: {
      isOpen: true,
    },
    states: {
      idle: {
        on: {
          DOWN_BUTTON_PRESSED: {
            target: "lowering",
            actions: "setPending",
            cond: ({ isOpen }) => isOpen || isOpen === "pending",
          },
          UP_BUTTON_PRESSED: {
            target: "rising",
            actions: "setPending",
            cond: ({ isOpen }) => !isOpen || isOpen === "pending",
          },
        },
      },

      lowering: {
        on: {
          DOWN_BUTTON_PRESSED: { target: "idle" },
          UP_BUTTON_PRESSED: "rising",
        },
        after: {
          3000: {
            target: "idle",
            actions: "setIsClosed",
          },
        },
      },

      rising: {
        on: {
          UP_BUTTON_PRESSED: { target: "idle" },
          DOWN_BUTTON_PRESSED: "lowering",
        },
        after: {
          3000: {
            target: "idle",
            actions: "setIsOpened",
          },
        },
      },
    },
  },
  {
    actions: {
      setPending: assign(context => ({ ...context, isOpen: "pending" })),
      setIsOpened: assign(context => {
        return {
          ...context,
          isOpen: true,
        }
      }),
      setIsClosed: assign(context => {
        return {
          ...context,
          isOpen: false,
        }
      }),
    },
  },
)

const fetchMachine = Machine(
  {
    id: "form",
    initial: "editing",
    states: {
      editing: {
        on: {
          INPUT: {
            actions: "cache",
            target: "editing",
          },
          FETCH: [
            {
              cond: "isStartYearEmpty",
              target: "editing.startYear.error.empty",
            },
            {
              cond: "isStartMonthEmpty",
              target: "editing.startMonth.error.empty",
            },
            {
              cond: "isMortgageDollarsEmpty",
              target: "editing.mortgageDollars.error.empty",
            },
            {
              cond: "isMortgageDollarsBadFormat",
              target: "editing.mortgageDollars.error.badFormat",
            },
            {
              cond: "isMortgageDollarsTooLow",
              target: "editing.mortgageDollars.error.tooLow",
            },
            {
              cond: "isRatePercentEmpty",
              target: "editing.ratePercent.error.empty",
            },
            {
              cond: "isRatePercentBadFormat",
              target: "editing.ratePercent.error.badFormat",
            },
            {
              cond: "isRatePercentTooHigh",
              target: "editing.ratePercent.error.tooHigh",
            },
            {
              cond: "isRatePercentTooLow",
              target: "editing.ratePercent.error.tooLow",
            },
            {
              cond: "isLenderNameEmpty",
              target: "editing.lenderName.error.empty",
            },
            {
              target: "fetching",
            },
          ],
        },
        type: "parallel",
        states: {
          startYear: {
            initial: "valid",
            states: {
              valid: {},
              error: {
                initial: "empty",
                states: {
                  empty: {},
                },
                onEntry: "focusStartYear",
              },
            },
          },
          startMonth: {
            initial: "valid",
            states: {
              valid: {},
              error: {
                initial: "empty",
                states: {
                  empty: {},
                },
                onEntry: "focusStartMonth",
              },
            },
          },
          mortgageDollars: {
            initial: "valid",
            states: {
              valid: {},
              error: {
                initial: "empty",
                states: {
                  empty: {},
                  badFormat: {},
                  tooLow: {},
                },
                onEntry: "focusMortgageDollars",
              },
            },
          },
          ratePercent: {
            initial: "valid",
            states: {
              valid: {},
              error: {
                initial: "empty",
                states: {
                  empty: {},
                  badFormat: {},
                  tooHigh: {},
                  tooLow: {},
                },
                onEntry: "focusRatePercent",
              },
            },
          },
          lenderName: {
            initial: "valid",
            states: {
              valid: {},
              error: {
                initial: "empty",
                states: {
                  empty: {},
                },
                onEntry: "focusLenderName",
              },
            },
          },
        },
      },
      fetching: {
        invoke: {
          id: "fetch",
          src: "requestMortgageInfo",
          onDone: {
            target: "results",
            actions: "saveResults",
          },
          onError: "failure",
        },
      },
      results: {
        on: {
          INPUT: {
            actions: "cache",
            target: "editing",
          },
        },
        initial: "idle",
        states: {
          idle: {
            on: {
              OPEN_CONTACT: "contact",
            },
          },
          contact: {
            on: {
              INPUT: {
                actions: "cache",
                target: "contact",
              },
              SUBMIT_CONTACT: [
                {
                  cond: "isNameEmpty",
                  target: "contact.name.error.empty",
                },
                {
                  cond: "isContactMethodEmpty",
                  target: "contact.email.error.empty",
                },
                {
                  target: "submitting",
                },
              ],
            },
            type: "parallel",
            states: {
              name: {
                initial: "valid",
                states: {
                  valid: {},
                  error: {
                    initial: "empty",
                    states: {
                      empty: {},
                    },
                    onEntry: "focusName",
                  },
                },
              },
              email: {
                initial: "valid",
                states: {
                  valid: {},
                  error: {
                    initial: "empty",
                    states: {
                      empty: {},
                    },
                    onEntry: "focusEmail",
                  },
                },
              },
            },
          },
          submitting: {
            invoke: {
              id: "submit",
              src: "submitContactInfo",
              onDone: "success",
              onError: "idle",
            },
          },
          success: {
            type: "final",
          },
        },
      },
      failure: {
        on: {
          INPUT: {
            actions: "cache",
            target: "editing",
          },
          FETCH: "fetching",
        },
      },
    },
  },
  {
    guards: {
      isStartYearEmpty: () => false,
      isStartMonthEmpty: () => false,
      isMortgageDollarsEmpty: () => false,
      isMortgageDollarsBadFormat: () => false,
      isMortgageDollarsTooLow: () => false,
      isRatePercentEmpty: () => false,
      isRatePercentBadFormat: () => false,
      isRatePercentTooHigh: () => false,
      isRatePercentTooLow: () => false,
      isLenderNameEmpty: () => false,
      isNameEmpty: () => false,
      isContactMethodEmpty: () => false,
    },
    services: {
      requestMortgageInfo: Promise.resolve,
      submitContactInfo: Promise.resolve,
    },
    actions: {
      cache: assign((context, event) => event),
      saveResults: assign({
        mortgage: (context, event) => event.data,
      }),
    },
  },
)

const carDoor_v2 = Machine(
  {
    id: "garage-door",
    initial: "idle",
    context: {
      isOpen: false,
    },
    states: {
      idle: {
        initial: "initial",
        on: {
          PRESS_DOWN: {
            target: "idle.lowering",
            cond: ({ isOpen }) => isOpen || isOpen === "moving",
            actions: "setMoving",
          },
          PRESS_UP: {
            target: "idle.rising",
            cond: ({ isOpen }) => !isOpen || isOpen === "moving",
            actions: "setMoving",
          },
        },
        states: {
          initial: "lowering",
          lowering: {
            initial: "moving",
            states: {
              moving: {
                on: {
                  PRESS_DOWN: "#garage-door.idle",
                },
                activities: ["beeping"],
                after: {
                  3000: {
                    target: "closed",
                    actions: "setIsClosed",
                  },
                },
              },
              closed: {
                type: "final",
              },
            },
          },
          rising: {
            initial: "moving",
            states: {
              moving: {
                on: {
                  PRESS_UP: "#garage-door.idle",
                },
                after: {
                  3000: {
                    target: "open",
                    actions: "setIsOpen",
                  },
                },
              },
              open: {
                type: "final",
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      setMoving: assign(context => ({ ...context, isOpen: "moving" })),
      setIsOpen: assign(context => ({
        ...context,
        isOpen: true,
      })),
      setIsClosed: assign(context => ({
        ...context,
        isOpen: false,
      })),
    },
    activities: {
      beeping: (context, ...args) => {
        // Start the beeping activity
        const interval = setInterval(
          () => console.log("BEEP!", context, args),
          1000,
        )

        // Return a function that stops the beeping activity
        return () => clearInterval(interval)
      },
    },
  },
)
