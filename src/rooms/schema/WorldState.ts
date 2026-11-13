import { schema, t, type SchemaType } from "@colyseus/schema";

// The live roster: who is in the room. Durable progress lives in Mongo (src/db.ts).
// To sync something new about a player, add a field here and accept it in a WorldRoom message.
export const PlayerState = schema(
  {
    username: t.string().default(""), // client-reported Bloxity displayName/username, not validated
    signedIn: t.boolean().default(false), // has a Bloxity id: only signed-in players are saved
    pfp: t.string().default(""), // Bloxity profile picture URL ("" = none)
    uid: t.string().default(""), // verified Bloxity account id ("" = guest), matches chat messages' userId
    emote: t.string().default(""), // Bloxity emote catalogue id the player is playing ("" = none)
    emoteAt: t.float64().default(0), // server ms the emote started (late joiners start it mid-way)
    // Presence (presence.ts, `pose` / `loadout` / `setAvatar`): what the others draw in the world.
    x: t.float64().default(0), // feet position, metres
    y: t.float64().default(0),
    z: t.float64().default(0),
    yaw: t.float32().default(0), // heading, rad
    speed: t.float32().default(0), // ground speed m/s (drives run animation + dead reckoning)
    vy: t.float32().default(0), // vertical speed m/s
    grounded: t.boolean().default(true),
    flying: t.boolean().default(false), // in the flight over the slime
    pitch: t.float32().default(0), // flight somersault / dive angle, rad
    roll: t.float32().default(0), // flight bank, rad
    training: t.boolean().default(false), // pulling the slingshot
    // The cart launch (client flight.js pose()), so the others draw the gate, the cart and the body poses:
    ride: t.uint8().default(0), // 0 none, 1 at the gate, 2 riding the cart, 3 thrown out of it
    body: t.uint8().default(0), // body pose: 0 none, 1 sit, 2 fling, 3 tumble, 4 lie (client ridePose.js BODY_KINDS)
    arms: t.float32().default(0), // arms up over the head while riding, 0..1
    pull: t.float32().default(0), // the cart drawn back against the bungee, 0..1
    gx: t.float32().default(0), // where the launch gate stands, metres
    gz: t.float32().default(0),
    sling: t.string().default(""), // equipped slingshot id (client config.js SLINGSHOTS)
    trail: t.string().default(""), // equipped flight trail id, "" = none
    title: t.string().default(""), // equipped title id
    pets: t.string().default(""), // equipped pets "id,id:g,id:d"
    avatar: t.string().default(""), // Bloxity look JSON { equipped, proportions, skin }, "" = default
  },
  "PlayerState",
);
export type PlayerState = SchemaType<typeof PlayerState>;

export const WorldState = schema(
  {
    players: t.map(PlayerState), // keyed by sessionId
  },
  "WorldState",
);
export type WorldState = SchemaType<typeof WorldState>;
