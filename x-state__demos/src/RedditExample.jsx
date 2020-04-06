import React from "react";
import { useMachine } from "@xstate/react";

import { redditMachine } from "./XstateRedditExample";

const subreddits = ["frontend", "reactjs", "vuejs", "funny"];

const RedditExample = () => {
  const [
    current,
    send // shape = (type, name)
  ] = useMachine(redditMachine);
  const { subreddit, posts } = current.context;
  // console.log(current.context);
  // console.log({ subreddit, posts });
  return (
    <section>
      <header>
        <pre>{str(current.value)}</pre>
        <select
          onChange={e => {
            // console.log(e.target.value);

            send("SELECT", { name: e.target.value });
          }}>
          {subreddits.map(subreddit => {
            return <option key={subreddit}>{subreddit}</option>;
          })}
        </select>
      </header>
      <section>
        <h1>{current.matches("idle") ? "Select a subreddit" : subreddit}</h1>
        {current.matches({ selected: "failed" }) && <div>Failed</div>}
        {current.matches({ selected: "retry" }) && <div>retry...</div>}
        {current.matches({ selected: "loading" }) && <div>Loading...</div>}
        {current.matches({ selected: "loaded" }) && (
          <ul>
            {(posts || []).map(post => (
              <>
                <li key={post.title}>{post.title}</li>
                {post.url && <img alt="img" src={post.url} />}
              </>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default RedditExample;
