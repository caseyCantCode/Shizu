/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
import Bot from "../../api/Client";
import Event from "../../struct/Event";
import { sync } from "glob";
import { resolve } from "path";

// tslint:disable-next-line: ban-types
const registerEvents: Function = (client: Bot) => {
  const eventFiles = sync(resolve("dist/bot/events/**/*"));
  eventFiles.forEach((file) => {
    if (/\.(j|t)s$/iu.test(file)) {
      const File = require(file).default;
      if (File && File.prototype instanceof Event) {
        // tslint:disable-next-line: new-parens
        const event: Event = new File();
        event.client = client;
        client.events.set(event.name, event);
        client[event.type ? "once" : "on"](event.name, (...args: any[]) =>
          event.exec(...args).catch((err) => console.log(err))
        );
      }
    }
  });
};

export default registerEvents;
