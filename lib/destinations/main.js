// lib/destinations/main.js
import { createDestination } from "./core";

export const MAIN_DESTINATIONS = [
createDestination({
name: "Orlando, FL",
country: "US",
lat: 28.5383,
lng: -81.3792,
vacationTypeWeights: { themeParks: 10, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/a-large-castle-with-a-lot-of-people-around-it-f6ImWlMhn18",
imageCredit: "Younhoo Choo",
}),

createDestination({
name: "Anaheim, CA",
country: "US",
lat: 33.8366,
lng: -117.9143,
vacationTypeWeights: { themeParks: 10, beach: 8 },
imageSourceUrl: "https://unsplash.com/photos/brown-and-blue-castle-under-cloudy-sky-during-daytime-Lmd-CpZOGWc",
imageCredit: "Bastien Nvs",
}),

createDestination({
name: "Tampa, FL",
country: "US",
lat: 27.9506,
lng: -82.4572,
vacationTypeWeights: { themeParks: 8, beach: 10, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/a-large-mural-on-the-side-of-a-building-5tRdiHnc46Q",
imageCredit: "Ryan Haft",
}),

createDestination({
name: "Kansas City, MO",
country: "US",
lat: 39.0997,
lng: -94.5786,
vacationTypeWeights: { cultureHistory: 10, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/a-group-of-people-walking-through-a-lobby-h1e1HtLcR-4",
imageCredit: "Samuel Myles",
}),

createDestination({
name: "Branson, MO",
country: "US",
lat: 36.6437,
lng: -93.2185,
vacationTypeWeights: { themeParks: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/silver-dollar-city-sign-with-pumpkins-and-axe-decoration-tJj2HWeQ4Ug",
imageCredit: "Cliff",
}),

createDestination({
name: "Williamsburg, VA",
country: "US",
lat: 37.2707,
lng: -76.7075,
vacationTypeWeights: { themeParks: 8, cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/brown-bricked-building-EAZpA9RzzjE",
imageCredit: "Christian Alvarez",
}),

createDestination({
name: "Pigeon Forge, TN",
country: "US",
lat: 35.7884,
lng: -83.5543,
vacationTypeWeights: { themeParks: 10, outdoorAdventure: 8, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/aerial-view-of-city-buildings-during-daytime-MLRonmR0XBk",
imageCredit: "Rodney Truitt Jr",
}),

createDestination({
name: "Gatlinburg, TN",
country: "US",
lat: 35.7143,
lng: -83.5102,
vacationTypeWeights: { cultureHistory: 8, outdoorAdventure: 10, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/water-falls-on-brown-rocky-mountain-x9KqgPZfGEY",
imageCredit: "Joshua Bedford",
}),

createDestination({
name: "Hershey, PA",
country: "US",
lat: 40.2859,
lng: -76.6502,
vacationTypeWeights: { themeParks: 10, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/a-sign-that-is-in-front-of-a-grassy-hill-TTkRxp7GZUc",
imageCredit: "Praswin Prakashan",
}),

createDestination({
name: "Wisconsin Dells, WI",
country: "US",
lat: 43.6275,
lng: -89.7709,
vacationTypeWeights: { themeParks: 8, outdoorAdventure: 9, familyFriendly: 10 },
imageSourceUrl: "https://unsplash.com/photos/an-aerial-view-of-a-lake-surrounded-by-trees-BjezMHGDThI",
imageCredit: "Jason Leung",
}),

createDestination({
name: "San Antonio, TX",
country: "US",
lat: 29.4241,
lng: -98.4936,
vacationTypeWeights: { themeParks: 9, cultureHistory: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/an-old-stone-church-stands-proudly-in-the-sunlight-27NNbSHb2V0",
imageCredit: "Dennis Lamberth",
}),

createDestination({
name: "South Padre Island, TX",
country: "US",
lat: 26.1118,
lng: -97.1681,
vacationTypeWeights: { beach: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-beach-with-waves-coming-in-to-shore-0Bj2YXSGWVM",
imageCredit: "Callen Romell",
}),

createDestination({
name: "Destin, FL",
country: "US",
lat: 30.3935,
lng: -86.4958,
vacationTypeWeights: { beach: 10 },
imageSourceUrl: "https://unsplash.com/photos/people-on-beach-during-daytime-PX_lDAEgC68",
imageCredit: "Sophia Simoes",
}),

createDestination({
name: "Clearwater Beach, FL",
country: "US",
lat: 27.977,
lng: -82.827,
vacationTypeWeights: { beach: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-beach-with-a-pier-in-the-distance-AQDyLjaVt6A",
imageCredit: "Engin Akyurt",
}),

createDestination({
name: "Outer Banks, NC",
country: "US",
lat: 35.5582,
lng: -75.4665,
vacationTypeWeights: { beach: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-large-body-of-water-next-to-a-pier-NEtJSLnxxfM",
imageCredit: "Gene Gallin",
}),

createDestination({
name: "Rehoboth Beach, DE",
country: "US",
lat: 38.7209,
lng: -75.076,
vacationTypeWeights: { beach: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/water-wave-beside-sea-dock-Og7gkkxdN58",
imageCredit: "Bob Bowie",
}),

createDestination({
name: "Bethany Beach, DE",
country: "US",
lat: 38.5396,
lng: -75.0552,
vacationTypeWeights: { beach: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-sandy-beach-with-a-fence-and-bushes-68M2IzyoMdU",
imageCredit: "Spyder Marketing Co.",
}),

createDestination({
name: "Cape May, NJ",
country: "US",
lat: 38.9351,
lng: -74.906,
vacationTypeWeights: { themeParks: 9, cultureHistory: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-large-american-flag-on-the-side-of-a-boat-BFE5rY1HwHY",
imageCredit: "Zachary Brown",
}),

createDestination({
name: "Myrtle Beach, SC",
country: "US",
lat: 33.6891,
lng: -78.8867,
vacationTypeWeights: { beach: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/pineapple-juice-on-brown-sand-WXyrWIqZYes",
imageCredit: "Marissa Daeger",
}),

createDestination({
name: "Hilton Head, SC",
country: "US",
lat: 32.2163,
lng: -80.7526,
vacationTypeWeights: { beach: 10, cultureHistory: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-lighthouse-tops-a-harbor-side-building-qTYn528bvT8",
imageCredit: "Ken Bitar",
}),

createDestination({
name: "Cocoa Beach / Cape Canaveral, FL",
country: "US",
lat: 28.3922,
lng: -80.6077,
vacationTypeWeights: { beach: 10, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/a-sailboat-floating-in-the-ocean-at-sunset-dYnL31bP7tA",
imageCredit: "Valeriia Neganova",
}),

createDestination({
name: "Miami, FL",
country: "US",
lat: 25.7617,
lng: -80.1918,
vacationTypeWeights: { beach: 10, cultureHistory: 8 },
imageSourceUrl: "https://unsplash.com/photos/palm-trees-line-a-waterfront-walkway-in-the-city-O_G1yq86o9M",
imageCredit: "Austin Hervias",
}),

createDestination({
name: "Fort Lauderdale, FL",
country: "US",
lat: 26.1224,
lng: -80.1373,
vacationTypeWeights: { beach: 10 },
imageSourceUrl: "https://unsplash.com/photos/palm-trees-line-a-sidewalk-along-the-beach-fYiuzfeeZfo",
imageCredit: "Austin Hervias",
}),

createDestination({
name: "Key West, FL",
country: "US",
lat: 24.5551,
lng: -81.78,
vacationTypeWeights: { beach: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-sign-on-the-side-of-a-boat-in-the-ocean-oVUmFyST27s",
imageCredit: "Jametlene Reskp",
}),

createDestination({
name: "Naples, FL",
country: "US",
lat: 26.142,
lng: -81.7948,
vacationTypeWeights: { beach: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-beach-with-palm-trees-and-a-person-in-the-distance-XdETIDt5c1g",
imageCredit: "Pasqualino Capobianco",
}),

createDestination({
name: "San Diego, CA",
country: "US",
lat: 32.7157,
lng: -117.1611,
vacationTypeWeights: { beach: 9, outdoorAdventure: 8, familyFriendly: 10 },
imageSourceUrl: "https://unsplash.com/photos/white-and-blue-sailing-boat-beside-brown-floor-1Xw7GWnivl4",
imageCredit: "big.tiny.belly",
}),

createDestination({
name: "Santa Monica, CA",
country: "US",
lat: 34.0195,
lng: -118.4912,
vacationTypeWeights: { beach: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/sport-fishing-boating-arch-sign-under-blue-sky-cpmZ9WkkYGE",
imageCredit: "Gerson Repreza",
}),

createDestination({
name: "Huntington Beach, CA",
country: "US",
lat: 33.6595,
lng: -117.9988,
vacationTypeWeights: { beach: 10, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/cars-parked-on-parking-lot-near-buildings-during-daytime-AKrLIvrhJvU",
imageCredit: "Mike Fox",
}),

createDestination({
name: "Waikiki / Honolulu, HI",
country: "US",
lat: 21.3069,
lng: -157.8583,
vacationTypeWeights: { beach: 10, outdoorAdventure: 8, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/a-view-of-a-city-and-a-body-of-water-CooMc288DAE",
imageCredit: "Daniel Lee",
}),

createDestination({
name: "Maui, HI",
country: "US",
lat: 20.7984,
lng: -156.3319,
vacationTypeWeights: { beach: 10, outdoorAdventure: 9 },
imageSourceUrl: "https://unsplash.com/photos/long-exposure-photography-of-seaside-9K5gSWen4cU",
imageCredit: "Pascal Debrunner",
}),
createDestination({
name: "Yellowstone National Park, WY",
country: "US",
lat: 44.428,
lng: -110.5885,
vacationTypeWeights: { outdoorAdventure: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/green-trees-under-blue-sky-and-white-clouds-during-daytime-eprFKRjtoE0",
imageCredit: "Meina Yin",
}),

createDestination({
name: "Jackson Hole, WY",
country: "US",
lat: 43.4799,
lng: -110.7624,
vacationTypeWeights: { cultureHistory: 9, outdoorAdventure: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/snow-covered-mountain-during-sunset-g-4TvrOHPH8",
imageCredit: "Danny Holland",
}),

createDestination({
name: "Sedona, AZ",
country: "US",
lat: 34.8697,
lng: -111.7609,
vacationTypeWeights: { cultureHistory: 8, outdoorAdventure: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-view-of-the-mountains-and-the-city-below-fA83wNGmKTk",
imageCredit: "Jake Johnson",
}),

createDestination({
name: "Grand Canyon, AZ",
country: "US",
lat: 36.1069,
lng: -112.1129,
vacationTypeWeights: { outdoorAdventure: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-view-of-the-grand-canyon-of-the-grand-canyon-D391N3cKjiY",
imageCredit: "Colin + Meg",
}),

createDestination({
name: "Lake Tahoe, CA/NV",
country: "US",
lat: 39.0968,
lng: -120.0324,
vacationTypeWeights: { cultureHistory: 9, outdoorAdventure: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/green-leafed-trees-UWQP2mh5YJI",
imageCredit: "Fabian Quintero",
}),

createDestination({
name: "Moab, UT",
country: "US",
lat: 38.5733,
lng: -109.5498,
vacationTypeWeights: { outdoorAdventure: 10 },
imageSourceUrl: "https://unsplash.com/photos/arch-landmark-N9PCtj8wdFg",
imageCredit: "Tom Gainor",
}),

createDestination({
name: "Zion / Springdale, UT",
country: "US",
lat: 37.1889,
lng: -112.9986,
vacationTypeWeights: { outdoorAdventure: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/river-between-rocky-mountains-aHdAdA0JzLE",
imageCredit: "Karan Chawla",
}),

createDestination({
name: "Asheville, NC",
country: "US",
lat: 35.5951,
lng: -82.5515,
vacationTypeWeights: { cultureHistory: 10, outdoorAdventure: 9, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-large-building-with-a-fountain-in-front-of-it-with-biltmore-estate-in-the-background-DEsIimo9kvE",
imageCredit: "William Recinos",
}),

createDestination({
name: "Bar Harbor / Acadia, ME",
country: "US",
lat: 44.3876,
lng: -68.2039,
vacationTypeWeights: { outdoorAdventure: 10, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/a-lighthouse-on-top-of-a-rocky-cliff-4N5xEOxuB30",
imageCredit: "Hasnain Sikora",
}),

createDestination({
name: "San Francisco, CA",
country: "US",
lat: 37.7749,
lng: -122.4194,
vacationTypeWeights: { cultureHistory: 10, outdoorAdventure: 9, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-view-of-the-golden-gate-bridge-at-sunset-JdoyKffQ5I8",
imageCredit: "Rockwell Branding Agency",
}),

createDestination({
name: "Seattle, WA",
country: "US",
lat: 47.6062,
lng: -122.3321,
vacationTypeWeights: { outdoorAdventure: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-view-of-a-city-with-a-mountain-in-the-background-Rd8cbDmGr0Q",
imageCredit: "Toan Chu",
}),

createDestination({
name: "Nashville, TN",
country: "US",
lat: 36.1627,
lng: -86.7816,
vacationTypeWeights: { cultureHistory: 10, outdoorAdventure: 9, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/american-football-arena-beside-building-and-roadway-during-daytime-GmoaEH48m8c",
imageCredit: "Tanner Boriack",
}),

createDestination({
name: "Austin, TX",
country: "US",
lat: 30.2672,
lng: -97.7431,
vacationTypeWeights: { cultureHistory: 9, outdoorAdventure: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/photo-of-city-AlBgcDfDG_s",
imageCredit: "Carlos Delgado",
}),

createDestination({
name: "New Orleans, LA",
country: "US",
lat: 29.9511,
lng: -90.0715,
vacationTypeWeights: { cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/brown-and-gray-3-story-building-nUkxLPE5Fto",
imageCredit: "Rosie Kerr",
}),

createDestination({
name: "Savannah, GA",
country: "US",
lat: 32.0809,
lng: -81.0912,
vacationTypeWeights: { cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/white-and-brown-boat-on-sea-near-city-buildings-during-sunset-xP1ySp_Nnjo",
imageCredit: "Tyler Edic",
}),

createDestination({
name: "Charleston, SC",
country: "US",
lat: 32.7765,
lng: -79.9311,
vacationTypeWeights: { beach: 10, cultureHistory: 9, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/cars-parked-beside-brown-concrete-building-during-daytime-A56yu_pmNKQ",
imageCredit: "Leo Heisenberg",
}),

createDestination({
name: "Washington, DC",
country: "US",
lat: 38.9072,
lng: -77.0369,
vacationTypeWeights: { cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/white-concrete-dome-museum-XWW746i6WoM",
imageCredit: "Louis Velazquez",
}),

createDestination({
name: "Boston, MA",
country: "US",
lat: 42.3601,
lng: -71.0589,
vacationTypeWeights: { cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/cars-parked-on-side-of-the-road-near-brown-concrete-building-during-daytime-LgHghP14qeU",
imageCredit: "Leo Heisenberg",
}),

createDestination({
name: "New York City, NY",
country: "US",
lat: 40.7128,
lng: -74.006,
vacationTypeWeights: { cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/the-statue-of-liberty-is-shown-against-a-blue-sky-004Rn6neA7A",
imageCredit: "Manuel RB",
}),

createDestination({
name: "Chicago, IL",
country: "US",
lat: 41.8781,
lng: -87.6298,
vacationTypeWeights: { cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/photo-of-high-rise-building-tnv84LOjes4",
imageCredit: "Sawyer Bengtson",
}),
createDestination({
name: "Pella, IA",
country: "US",
lat: 41.408,
lng: -92.9163,
vacationTypeWeights: { themedTowns: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-group-of-people-walking-down-a-street-next-to-a-windmill-lwvtQZX0qq8",
imageCredit: "Brad",
}),

createDestination({
name: "Solvang, CA",
country: "US",
lat: 34.5958,
lng: -120.1376,
vacationTypeWeights: { themedTowns: 10, cultureHistory: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-sign-that-is-on-the-side-of-a-building-EGM8YVSpwfA",
imageCredit: "Mario Perez",
}),

createDestination({
name: "Fredericksburg, TX",
country: "US",
lat: 30.2752,
lng: -98.8719,
vacationTypeWeights: { themedTowns: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/an-aerial-view-of-a-small-town-with-a-church-Ac1m89nfNjA",
imageCredit: "Nils Huenerfuerst",
}),

createDestination({
name: "Helen, GA",
country: "US",
lat: 34.7037,
lng: -83.7274,
vacationTypeWeights: { themedTowns: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-winding-charming-alley-with-old-world-architecture-ZWzHzABqVno",
imageCredit: "Tolga Ahmetler",
}),

createDestination({
name: "Leavenworth, WA",
country: "US",
lat: 47.5962,
lng: -120.6615,
vacationTypeWeights: { themedTowns: 10, outdoorAdventure: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-building-with-christmas-lights-and-decorations-on-it-ZPpKyLhQb_4",
imageCredit: "Afif Ramdhasuma",
}),

createDestination({
name: "Frankenmuth, MI",
country: "US",
lat: 43.3314,
lng: -83.7392,
vacationTypeWeights: { themedTowns: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-horse-pulling-a-carriage-down-a-street-2dbPyOP-5xc",
imageCredit: "Bruno Guerrero",
}),

createDestination({
name: "Lindsborg, KS",
country: "US",
lat: 38.5736,
lng: -97.6745,
vacationTypeWeights: { themedTowns: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-street-with-buildings-on-the-side-3IiD2ghwJQ4",
imageCredit: "Magnus Jonasson",
}),

createDestination({
name: "Amana Colonies, IA",
country: "US",
lat: 41.7997,
lng: -91.8729,
vacationTypeWeights: { themedTowns: 10, familyFriendly: 8 },
imageSourceUrl: "https://unsplash.com/photos/people-walking-on-street-near-buildings-during-daytime-ellJUjLhfXU",
imageCredit: "Simon Pallard",
}),

createDestination({
name: "Carmel-by-the-Sea, CA",
country: "US",
lat: 36.5552,
lng: -121.9233,
vacationTypeWeights: { themedTowns: 10 },
imageSourceUrl: "https://unsplash.com/photos/white-and-green-store-during-daytime-V7cDc3OCjig",
imageCredit: "Daniela Araya",
}),

createDestination({
name: "Mendocino, CA",
country: "US",
lat: 39.3077,
lng: -123.7995,
vacationTypeWeights: { themedTowns: 10 },
imageSourceUrl: "https://unsplash.com/photos/white-and-red-house-on-brown-grass-field-under-blue-sky-during-daytime-y-FLgyhJqLE",
imageCredit: "Arkin Si",
}),

createDestination({
name: "Santa Fe, NM",
country: "US",
lat: 35.687,
lng: -105.9378,
vacationTypeWeights: { themedTowns: 8, cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-street-with-cars-parked-on-the-side-of-it-YJI-WI4dJEU",
imageCredit: "Wendy Shervington",
}),

createDestination({
name: "Amsterdam, Netherlands",
country: "NL",
lat: 52.3676,
lng: 4.9041,
vacationTypeWeights: { cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-canal-runs-through-amsterdam-with-buildings-SQHx-gsk11g",
imageCredit: "Omar Ramadan",
}),

createDestination({
name: "Giethoorn, Netherlands",
country: "NL",
lat: 52.74,
lng: 6.0792,
vacationTypeWeights: { themedTowns: 10, cultureHistory: 8 },
imageSourceUrl: "https://unsplash.com/photos/a-boat-traveling-down-a-river-next-to-a-lush-green-field-1WbY_I8Gwcw",
imageCredit: "Paula Jinga",
}),

createDestination({
name: "Rothenburg ob der Tauber, Germany",
country: "DE",
lat: 49.3805,
lng: 10.1798,
vacationTypeWeights: { themedTowns: 10, cultureHistory: 9 },
imageSourceUrl: "https://unsplash.com/photos/white-and-pink-petaled-flowers-on-metal-fence-near-concrete-houses-and-tower-at-daytime-g_gwdpsCVAY",
imageCredit: "Roman Kraft",
}),

createDestination({
name: "Hallstatt, Austria",
country: "AT",
lat: 47.5613,
lng: 13.6493,
vacationTypeWeights: { themedTowns: 10 },
imageSourceUrl: "https://unsplash.com/photos/a-scenic-view-of-a-small-town-with-a-lake-and-mountains-in-the-background-jwa4WdPJuAc",
imageCredit: "Quy Truong",
}),

createDestination({
name: "Colmar, France",
country: "FR",
lat: 48.0794,
lng: 7.3585,
vacationTypeWeights: { themedTowns: 10 },
imageSourceUrl: "https://unsplash.com/photos/red-umbrella-on-river-near-houses-rJ-CD2e7iMQ",
imageCredit: "Mateo Krossler",
}),

createDestination({
name: "Prague, Czech Republic",
country: "CZ",
lat: 50.0755,
lng: 14.4378,
vacationTypeWeights: { cultureHistory: 10 },
imageSourceUrl: "https://unsplash.com/photos/photo-of-boat-on-body-of-water-near-high-rise-buildings-WAPFd4fMy2o",
imageCredit: "Rodrigo Ardilha",
}),

createDestination({
name: "Santorini, Greece",
country: "GR",
lat: 36.3932,
lng: 25.4615,
vacationTypeWeights: { beach: 10 },
imageSourceUrl: "https://unsplash.com/photos/white-and-blue-concrete-building-near-body-of-water-during-daytime-vF0l0bqLRKY",
imageCredit: "Tânia Mousinho",
}),

createDestination({
name: "Bali, Indonesia",
country: "ID",
lat: -8.3405,
lng: 115.092,
vacationTypeWeights: { beach: 10, cultureHistory: 9, outdoorAdventure: 9, familyFriendly: 9 },
imageSourceUrl: "https://unsplash.com/photos/brown-and-green-temple-near-lake-and-green-mountain-under-blue-sky-during-daytime-QqPcxfFKqfU",
imageCredit: "Mahmud Ahsan",
}),
];
