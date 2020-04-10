import { Machine, assign } from "xstate"

const garageDoorMachine = Machine(
  {
    id: "garageDoor",
    initial: "idle",
    context: {
      pctOpen: 100,
      interval: 250,
      isOpen: true,
    },
    states: {
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
    },
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
