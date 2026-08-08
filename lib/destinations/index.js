// lib/destinations/index.js

import { themeDestinations } from "./theme";
import { beachDestinations } from "./beach";
import { outdoorsDestinations } from "./outdoors";
import { cultureDestinations } from "./culture";
import { themedDestinations } from "./themed";
import { toLegacyDestinationShape } from "./core";

const allDestinations = [
...themeDestinations,
...beachDestinations,
...outdoorsDestinations,
...cultureDestinations,
...themedDestinations
];

export const DESTINATIONS_V2 = allDestinations;

export const DESTINATIONS = allDestinations.map(toLegacyDestinationShape);
