import { Machine, assign } from "xstate"

const selectEvent = {
  "type": "SELECT",
  "name": "funny",
}

export const redditMachine = Machine({
  id: "reddit",
  initial: "idle",
  context: {
    subreddits: {}, // none selected
    posts: [{ title: "fetch for items" }],
    count: 0,
  },
  states: {
    idle: {},
    selected: {
      initial: "loading",
      states: {
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
          },
        },
        failed: {},
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
})

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
