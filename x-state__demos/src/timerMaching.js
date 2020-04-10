import { Machine, assign } from "xstate"

export const timerMachine = Machine({
  initial: "running",
  context: {
    elapsed: 0,
    duration: 5,
    interval: 0.1,
  },
  states: {
    running: {
      invoke: {
        src: (context) => (cb) => {
          const interval = setInterval(() => {
            cb("TICK")
          }, 1000 * context.interval)

          return () => {
            clearInterval(interval)
          }
        },
      },
      on: {
        "": {
          target: "paused",
          cond: (context) => {
            return context.elapsed >= context.duration
          },
        },
        TICK: {
          actions: assign({
            elapsed: (context) =>
              +(context.elapsed + context.interval).toFixed(2),
          }),
        },
      },
    },
    paused: {
      on: {
        "": {
          target: "running",
          cond: (context) => context.elapsed < context.duration,
        },
      },
    },
  },
  on: {
    "DURATION.UPDATE": {
      actions: assign({
        duration: (_, event) => event.value,
      }),
    },
    RESET: {
      actions: assign({
        elapsed: 0,
      }),
    },
  },
})
