import { writable } from 'svelte/store';

// Decision type definition
export type Decision = {
  requirements: string[];
  outcomes: string[];
};

// TypeScript type definitions
export type Encounter = {
  id: string;
  name: string;
  links: string[]; // Array of encounter IDs this encounter links to
  decisions: Decision[];
};

export type Hub = {
  id: string;
  name: string;
  links: string[]; // Array of hub IDs this hub links to
  encounters: Encounter[];
};

export type State = {
  hubs: Hub[];
};

// Initial state
const initialState: State = {
  hubs: []
};

export const state = writable<State>(initialState);

// Helper functions for manipulating the state

export function addHub(hub: Hub) {
  state.update(s => ({
    ...s,
    hubs: [...s.hubs, { ...hub, links: hub.links || [], encounters: hub.encounters || [] }]
  }));
}

export function addEncounter(hubId: string, encounter: Encounter) {
  state.update(s => ({
    ...s,
    hubs: s.hubs.map(hub =>
      hub.id === hubId
        ? { ...hub, encounters: [...hub.encounters, { ...encounter, links: encounter.links || [], decisions: encounter.decisions || [] }] }
        : hub
    )
  }));
}

// Decision manipulation functions
export function addDecision(hubId: string, encounterId: string, decision: Decision) {
  state.update(s => ({
    ...s,
    hubs: s.hubs.map(hub =>
      hub.id === hubId
        ? {
            ...hub,
            encounters: hub.encounters.map(enc =>
              enc.id === encounterId
                ? { ...enc, decisions: [...(enc.decisions || []), decision] }
                : enc
            )
          }
        : hub
    )
  }));
}

export function editDecision(hubId: string, encounterId: string, decisionIndex: number, newDecision: Decision) {
  state.update(s => ({
    ...s,
    hubs: s.hubs.map(hub =>
      hub.id === hubId
        ? {
            ...hub,
            encounters: hub.encounters.map(enc =>
              enc.id === encounterId
                ? {
                    ...enc,
                    decisions: enc.decisions.map((d, i) => i === decisionIndex ? newDecision : d)
                  }
                : enc
            )
          }
        : hub
    )
  }));
}

export function deleteDecision(hubId: string, encounterId: string, decisionIndex: number) {
  state.update(s => ({
    ...s,
    hubs: s.hubs.map(hub =>
      hub.id === hubId
        ? {
            ...hub,
            encounters: hub.encounters.map(enc =>
              enc.id === encounterId
                ? {
                    ...enc,
                    decisions: enc.decisions.filter((_, i) => i !== decisionIndex)
                  }
                : enc
            )
          }
        : hub
    )
  }));
}


export function linkHubs(fromHubId: string, toHubId: string) {
  state.update(s => ({
    ...s,
    hubs: s.hubs.map(hub =>
      hub.id === fromHubId && !hub.links.includes(toHubId)
        ? { ...hub, links: [...hub.links, toHubId] }
        : hub
    )
  }));
}


export function linkEncounters(hubId: string, fromEncounterId: string, toEncounterId: string) {
  state.update(s => ({
    ...s,
    hubs: s.hubs.map(hub =>
      hub.id === hubId
        ? {
            ...hub,
            encounters: hub.encounters.map(enc =>
              enc.id === fromEncounterId && !enc.links.includes(toEncounterId)
                ? { ...enc, links: [...enc.links, toEncounterId] }
                : enc
            )
          }
        : hub
    )
  }));
}
