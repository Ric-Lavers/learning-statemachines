import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

export const redditMachine = Machine({
  id: "reddit",
  initial: "idle",
  context: {
    subreddit: null // none selected
  },
  states: {
    idle: {},
    selected: {
      initial: "loading",
      states /* keyword */: {
        loading: {
          invoke: {
            id: "fetch-subreddit",
            src: invokeFetchSubreddit,
            // special x-state transitions for promises
            onDone: {
              target: "loaded",
              actions: assign({
                posts: (context, event) => event.data
              })
            },
            onError: "failed" //? <- is this the same as target?
          }
        },
        loaded: {},
        failed: {}
      }
    }
  },
  on: {
    SELECT: {
      target: ".selected",
      actions: assign({
        subreddit: (context, event) => {
          console.log({ context, event });
          return event.name;
        }
      })
    }
  }
});

// sample SELECT eventxp
const selectEvent = {
  type: "SELECT", // event type
  name: "funny" // subreddit name
};

/* --- */

// function timeout(ms = 2500, promise) {
//   console.log("there");
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       reject(new Error("timeout"));
//     }, ms);
//     promise.then(resolve, reject);
//   });
// }
// fetch = require("node-fetch");
function invokeFetchSubreddit(context) {
  const { subreddit } = context;

  // return new Promise((res, rej) => {
  //   setTimeout(() => {
  //     res({ something: "else" });
  //   }, 500);
  //   setTimeout(() => {
  //     rej({ something: "bad" });
  //   }, 1500);
  // });

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => {
      return json.data.children.map(child => child.data);
    })
    .catch(err => {
      console.log(err);
    });
}
