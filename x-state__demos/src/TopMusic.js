import { assign, Machine } from "xstate"

const table = {}

const timeFrameStates = {
  weeks: table,
  months: table,
  years: table,
}

const topMusicMachine = Machine({
  id: "top-music",
  initial: "initial",
  context: {
    retries: 0,
  },
  states: {
    initial: "tracks.weeks",
    loading: {
      RESOLVE: "success",
      REJECT: "failure",
    },
    artists: {
      states: timeFrameStates,
    },
    tracks: {
      states: timeFrameStates,
    },
  },
  on: {
    PRESS_TRACK_WEEKS: {
      target: ".tracks.weeks",
      // actions: assign( (context, event) => {
      //   subreddit: (context, event) => event.name,
      // }),
    },
    PRESS_TRACK_MONTHS: ".tracks.months",
    PRESS_TRACK_YEARS: ".tracks.years",
    PRESS_ARTIST_WEEKS: ".artists.weeks",
    PRESS_ARTIST_MONTHS: ".artists.months",
    PRESS_ARTIST_YEARS: ".artists.years",
  },
})

const jwt =
  "BQDlI1xAq58i2QdGiKn2QigkjkGyUmtjMQdb8DurGoZVeHGdBgF2Bnzrd8qSyplE9fm9HIfvTGvvO-TNHHUrWS5wfje8cbSgKAJ0t-6rnESiDd8oqBJxpEVwwutdtageUmqMFhN_qVBL2Y2GDFnaIhqvpdjKTwlo82vzPiytZYr_IAGjR4GC2UhePEY7e5ebt4AVkV-W8kaDlLaFACLo2Fer9QYe4J7qAjVkaTCw5x5AqEB8s4ND3p3mOimL3sIBXUwAMdd8N34UAsiV-L0ra5Y-"
const baseUrl = "https://api.spotify.com/v1"
const headers = {
  headers: new Headers({
    Authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
  }),
}
export const getTopTracks = async (query = {}) => {
  query = new URLSearchParams({
    limit: 50,
    time_range: "short_term",
    ...query,
  }).toString()

  let res = await fetch(`${baseUrl}/me/top/tracks?${query}`, headers)
  return res.json()
}

function invokeGetTop(context, event) {}
