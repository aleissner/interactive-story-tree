<script lang="ts">
import { state, editDecision, deleteDecision, addDecision } from './store.svelte';
import type { Encounter, Decision } from './store.svelte';

export let encounter: Encounter;
export let hubId: string;

let name = encounter.name;
let links = encounter.links.join(', ');

// Decision editing state
let editingDecisionIndex: number | null = null;
let editingDecision: Decision = { requirements: [], outcomes: [] };
let newReq = '';
let newOut = '';

function saveEncounter() {
  state.update(s => ({
    ...s,
    hubs: s.hubs.map(hub =>
      hub.id === hubId
        ? {
            ...hub,
            encounters: hub.encounters.map(e =>
              e.id === encounter.id
                ? { ...e, name, links: links.split(',').map(l => l.trim()).filter(Boolean) }
                : e
            )
          }
        : hub
    )
  }));
}

function startEditDecision(idx: number, d: Decision) {
  editingDecisionIndex = idx;
  editingDecision = JSON.parse(JSON.stringify(d));
}

function saveDecision() {
  if (editingDecisionIndex !== null) {
    editDecision(hubId, encounter.id, editingDecisionIndex, editingDecision);
    editingDecisionIndex = null;
  }
}

function removeDecision(idx: number) {
  deleteDecision(hubId, encounter.id, idx);
}

function addReq() {
  if (newReq.trim()) {
    editingDecision.requirements = [...editingDecision.requirements, newReq.trim()];
    newReq = '';
  }
}
function removeReq(i: number) {
  editingDecision.requirements = editingDecision.requirements.filter((_, idx) => idx !== i);
}
function addOut() {
  if (newOut.trim()) {
    editingDecision.outcomes = [...editingDecision.outcomes, newOut.trim()];
    newOut = '';
  }
}
function removeOut(i: number) {
  editingDecision.outcomes = editingDecision.outcomes.filter((_, idx) => idx !== i);
}

function addNewDecision() {
  addDecision(hubId, encounter.id, { requirements: [], outcomes: [] });
}
</script>

<div class="encounter-edit">
  <label for="encounter-name">Name:</label>
  <input id="encounter-name" bind:value={name} />
  <label for="encounter-links">Links (comma separated IDs):</label>
  <input id="encounter-links" bind:value={links} />
  <button on:click={saveEncounter}>Save Encounter</button>

  <h4>Decisions</h4>
  <ul>
    {#each encounter.decisions as d, i}
      <li>
        {#if editingDecisionIndex === i}
          <div>
            <strong>Edit Decision</strong>
            <div>
              <label for="new-req">Requirements:</label>
              <ul>
                {#each editingDecision.requirements as req, ri}
                  <li>{req} <button on:click={() => removeReq(ri)}>Remove</button></li>
                {/each}
              </ul>
              <input id="new-req" placeholder="New requirement" bind:value={newReq} />
              <button on:click={addReq}>Add Requirement</button>
            </div>
            <div>
              <label for="new-out">Outcomes:</label>
              <ul>
                {#each editingDecision.outcomes as out, oi}
                  <li>{out} <button on:click={() => removeOut(oi)}>Remove</button></li>
                {/each}
              </ul>
              <input id="new-out" placeholder="New outcome" bind:value={newOut} />
              <button on:click={addOut}>Add Outcome</button>
            </div>
            <button on:click={saveDecision}>Save Decision</button>
            <button on:click={() => (editingDecisionIndex = null)}>Cancel</button>
          </div>
        {:else}
          <div>
            <strong>Requirements:</strong> {d.requirements.join(', ')}<br />
            <strong>Outcomes:</strong> {d.outcomes.join(', ')}<br />
            <button on:click={() => startEditDecision(i, d)}>Edit</button>
            <button on:click={() => removeDecision(i)}>Delete</button>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
  <button on:click={addNewDecision}>Add New Decision</button>
</div>

<style>
.encounter-edit {
  border: 1px solid #ccc;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 6px;
}
label {
  display: block;
  margin-bottom: 0.5em;
}
input {
  margin-right: 0.5em;
}
button {
  margin-left: 0.25em;
}
</style>
