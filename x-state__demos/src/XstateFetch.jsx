import React from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

const fetchMachine = Machine({
  id: "fetch",
  initial: "idle",
  context: {
    retries: 0
  },
  states: {
    idle: {
      on: {
        FETCH: "loading"
      }
    },
    loading: {
      on: {
        RESOLVE: "success",
        REJECT: "failure"
      }
    },
    success: {
      type: "final"
    },
    failure: {
      on: {
        RETRY: {
          target: "loading",
          actions: assign({
            retries: (context, event) => context.retries + 1
          })
        }
      }
    }
  }
});
