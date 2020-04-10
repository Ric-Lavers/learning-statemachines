/* eslint-disable no-unused-vars */
import { Machine, assign } from "xstate"

/*
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
      setPending: assign((context) => ({ ...context, isOpen: "pending" })),
      setIsOpened: assign((context) => {
        return {
          ...context,
          isOpen: true,
        }
      }),
      setIsClosed: assign((context) => {
        return {
          ...context,
          isOpen: false,
        }
      }),
    },
  },
)

export const carDoor_v2 = Machine(
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
      setMoving: assign((context) => ({ ...context, isOpen: "moving" })),
      setIsOpen: assign((context) => ({
        ...context,
        isOpen: true,
      })),
      setIsClosed: assign((context) => ({
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
 */

export const garageDoor_v3 = Machine(
  {
    id: "garageDoor",
    initial: "redditIdle",
    context: {
      subreddits: {}, // none selected
      posts: [{ title: "fetch for items" }],
      count: 0,
      pctOpen: 100,
      interval: 250,
      isOpen: true,
    },
    states: {
      redditIdle: {},
      selected: {
        initial: "loading",
        states /* keyword */: {
          loading: {
            invoke: {
              id: "fetch-subreddit",
              autoForward: true,
              src: invokeFetchSubreddit,
              //* special x-state transitions for promises
              onDone: {
                target: "loaded",
                actions: assign((context, event) => {
                  return {
                    subreddits: {
                      [event.data.name]: event.data.data,
                      ...context.subreddits,
                    },
                    posts: event.data.data,
                  }
                }),
              },
              onError: {
                target: "retry",
                actions: assign(({ count }) => {
                  return {
                    count: count + 1,
                  }
                }),
              },
            },
          },
          loaded: {},
          retry: {
            on: {
              "": {
                target: "loading",
                cond: "glassIsFull",
              },
              RETRY: {
                target: "loading",
                actions: assign((context, event) => {
                  console.log("context.count", context.count)

                  if (context.count < 6) {
                    return {
                      count: context.count + 1,
                    }
                  }
                }),
              },
            },
            invoke: {
              id: "test",
              target: "loading",
              // src: () =>
              //   assign({
              //     count: ({ count }) => count + 1
              //   })
            },
          },
          failed: {},
        },
      },

      idle: {
        on: {
          PRESS_DOWN: {
            target: "#garageDoor.idle.lowering",
            cond: ({ pctOpen }) => pctOpen > 0,
          },
          PRESS_UP: {
            target: "#garageDoor.idle.rising",
            cond: ({ pctOpen }) => pctOpen < 100,
          },
        },
        initial: "initial",
        states: {
          lowering: {
            initial: "moving",
            states: {
              moving: {
                type: "atomic",
                invoke: {
                  src: ({ interval }) => (callBack) => {
                    const intervalID = setInterval(() => {
                      callBack("DECREASE_OPEN_PCT")
                    }, interval)

                    return () => clearInterval(intervalID)
                  },
                },
                on: {
                  PRESS_DOWN: "#garageDoor.idle",
                  DECREASE_OPEN_PCT: {
                    actions: "closing",
                  },
                  "": {
                    target: "closed",
                    cond: "isClosed",
                  },
                },
                activities: ["beeping"],
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
                invoke: {
                  src: ({ interval }) => (callBack) => {
                    const intervalID = setInterval(() => {
                      callBack("INCREASE_OPEN_PCT")
                    }, interval)

                    return () => clearInterval(intervalID)
                  },
                },
                on: {
                  PRESS_UP: "#garageDoor.idle",
                  INCREASE_OPEN_PCT: {
                    actions: "opening",
                  },
                  "": {
                    target: "open",
                    cond: "isOpen",
                  },
                },
                activities: ["beeping"],
              },
              open: {
                type: "final",
              },
            },
          },
        },
      },
    },
    on: {
      SELECT: [
        {
          target: ".selected",
          cond: (context, event) => !context.subreddits[event.name],
          actions: assign({
            subreddit: (context, event) => event.name,
          }),
        },
        {
          target: ".selected.loaded",
        },
      ],
    },
    /*   states: {
      idle: {
        on: {
          PRESS_DOWN: {
            target: "#garageDoor.idle.lowering",
            cond: ({ pctOpen }) => pctOpen > 0,
          },
          PRESS_UP: {
            target: "#garageDoor.idle.rising",
            cond: ({ pctOpen }) => pctOpen < 100,
          },
        },
        initial: "initial",
        states: {
          initial: "lowering",
          lowering: {
            initial: "moving",
            states: {
              moving: {
                type: "atomic",
                invoke: {
                  src: ({ interval }) => (callBack) => {
                    const intervalID = setInterval(() => {
                      callBack("DECREASE_OPEN_PCT")
                    }, interval)

                    return () => clearInterval(intervalID)
                  },
                },
                on: {
                  PRESS_DOWN: "#garageDoor.idle",
                  DECREASE_OPEN_PCT: {
                    actions: "closing",
                  },
                  "": {
                    target: "closed",
                    cond: "isClosed",
                  },
                },
                activities: ["beeping"],
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
                invoke: {
                  src: ({ interval }) => (callBack) => {
                    const intervalID = setInterval(() => {
                      callBack("INCREASE_OPEN_PCT")
                    }, interval)

                    return () => clearInterval(intervalID)
                  },
                },
                on: {
                  PRESS_UP: "#garageDoor.idle",
                  INCREASE_OPEN_PCT: {
                    actions: "opening",
                  },
                  "": {
                    target: "open",
                    cond: "isOpen",
                  },
                },
                activities: ["beeping"],
              },
              open: {
                type: "final",
              },
            },
          },
        },
      },
    }, */
  },
  {
    guards: {
      isOpen: ({ pctOpen }) => pctOpen >= 100,
      isClosed: ({ pctOpen }) => pctOpen <= 0,
    },
    actions: {
      setMoving: assign((context) => ({ ...context, isOpen: "moving" })),
      opening: assign({
        pctOpen: ({ pctOpen, interval }) => {
          // console.log("opening", pctOpen)
          // should rise are a rate of 25% per second
          return pctOpen + 25 / (1000 / interval)
        },
      }),
      closing: assign({
        pctOpen: ({ pctOpen, interval }) => {
          // console.log("closing ", pctOpen)
          // should close are a rate of 25% per second
          return pctOpen - 25 / (1000 / interval)
        },
      }),
    },
    activities: {
      beeping: (context, ...args) => {
        // Start the beeping activity
        const interval = setInterval(() => {
          console.log("BEEP!")
        }, 1000)

        // Return a function that stops the beeping activity
        return () => clearInterval(interval)
      },
    },
  },
)
function invokeFetchSubreddit(context, { name }) {
  const { subreddits } = context

  // return new Promise((res, rej) => {
  //   setTimeout(() => {
  //     res({ something: "else" });
  //   }, 500);
  //   setTimeout(() => {
  //     rej({ something: "bad" });
  //   }, 1500);
  // });

  return fetch(`https://www.reddit.com/r/${name}.json`)
    .then((response) => response.json())
    .then((json) => {
      return {
        name,
        data: json.data.children.map((child) => child.data),
      }
    })
}
