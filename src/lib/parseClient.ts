import Parse from "parse/dist/parse.min.js";

Parse.initialize(
  import.meta.env.VITE_PARSE_APP_ID as string,
  import.meta.env.VITE_PARSE_JS_KEY as string
);
Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL as string;
