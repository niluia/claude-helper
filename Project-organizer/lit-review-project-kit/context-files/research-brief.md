# Research brief: rerouting and diverting flights after sudden airspace closures

## Problem
When airspace or an airport closes suddenly (volcanic eruption, severe weather, security or technical emergency), airborne flights must be rerouted or diverted within minutes. Controllers decide which flight goes to which alternative airport or trajectory, under safety, capacity and fuel limits.

## My approach (for positioning)
- Optimisation model: binary integer linear program (BILP) assigning airborne flights to diversion airports.
- Strict priority hierarchy: (1) safety / closed-zone avoidance, (2) airport capacity, (3) aircraft-type compatibility (runway length etc.), (4) operator preference.
- Two solution methods compared: weighted-sum vs. sequential lexicographic.
- Baseline: a realistic controller rule (first-come-first-served, urgent and low-fuel flights first).
- Data: real trajectories from OpenSky; airports from OurAirports.
- Case study: a sudden volcanic-ash closure around a major airport, with a few hundred airborne flights affected. [edit details as you wish]

## Research questions for the review
- RQ1: Which models and methods are used for rerouting, diversion-airport assignment and trajectory replanning under sudden disruption (MILP/BILP, heuristics, multi-objective, reinforcement learning)?
- RQ2: Which objectives and priority structures do they use (safety, capacity, fuel, delay, airline preference), and how are they combined (weighted sum, lexicographic, Pareto)?
- RQ3: How do they model diversion-airport capacity (runway, apron/stands), and with which figures and sources?
- RQ4: Which data and real events are used (OpenSky, ADS-B, EUROCONTROL; Eyjafjallajökull 2010, Gander 9/11)?
- RQ5: What are the open gaps (real-time use, realistic capacity data, comparison with controller practice)?

## Scope
- In: airborne/en-route flights; tactical (minutes to hours) decisions; 2000 onwards; peer-reviewed papers plus key official reports.
- Out: pre-departure ground delay programs and slot allocation only; airline crew/fleet recovery without airborne rerouting; single-aircraft path planning for drones/UAVs.

## Deadline
[Your date, e.g. related-work section ready by ...]
