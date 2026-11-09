# Review protocol

## Databases
Scopus, Web of Science, IEEE Xplore, Transportation Research (Elsevier) journals, Google Scholar (snowballing), arXiv (preprints, marked).
Grey literature: EUROCONTROL, ICAO, FAA, SESAR reports (marked as grey literature).

## Search strings (adapt per database)
A. ("flight diversion" OR "aircraft diversion" OR "diversion airport" OR "emergency landing") AND (optimi* OR "integer programming" OR assignment OR heuristic)
B. ("rerouting" OR "re-routing" OR "trajectory replanning" OR "trajectory re-planning") AND ("airspace closure" OR "volcanic ash" OR "convective weather" OR disruption) AND (flight* OR aircraft)
C. ("airport capacity" OR "apron capacity" OR "stand capacity" OR "runway capacity") AND (diversion OR emergency OR "mass diversion")

## Inclusion criteria
- I1: Addresses rerouting, diversion or trajectory replanning of airborne flights, or capacity of diversion airports.
- I2: Published 2000 or later (older only if a foundational, highly cited model).
- I3: Peer-reviewed paper, or an official report from an aviation authority/agency (marked).
- I4: Written in English.
- I5: Contains a model, method, or quantitative data (not opinion only).

## Exclusion criteria
- E1: Only pre-departure measures (ground delay programs, slot allocation) with no airborne rerouting.
- E2: Only airline recovery (crew, fleet, passengers) without flight rerouting or diversion.
- E3: UAV/drone or single-vehicle path planning not applicable to commercial traffic.
- E4: Duplicate or extended version of an included paper (keep the most complete).

## Screening stages
1. Title and abstract against I1-I5 and E1-E4.
2. Full text for borderline papers.
3. Backward and forward snowballing from the 5 most relevant included papers.

## Always extract (for the model)
Objective function and priority structure; capacity figures with units and page numbers; number of flights and solve times; data sources; real events used.
