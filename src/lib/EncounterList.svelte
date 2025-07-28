
<script lang="ts">
import { state, addEncounter } from './store.svelte';
import type { Hub, Encounter } from './store.svelte';
import { get } from 'svelte/store';
import EncounterEdit from './EncounterEdit.svelte';

export let hub: Hub;

let newEncounterName = '';
let editingId: string | null = null;
let editName = '';

function handleAdd() {
  if (newEncounterName.trim()) {
    addEncounter(hub.id, { id: crypto.randomUUID(), name: newEncounterName.trim(), links: [], decisions: [] });
    newEncounterName = '';
  }
}

function handleEdit(enc: Encounter) {
  editingId = enc.id;
  editName = enc.name;
}

function handleSave(enc: Encounter) {
  const hubs = get(state).hubs.map(h =>
    h.id === hub.id
      ? { ...h, encounters: h.encounters.map(e => e.id === enc.id ? { ...e, name: editName } : e) }
      : h
  );
  state.update(s => ({ ...s, hubs }));
  editingId = null;
}

function handleDelete(encId: string) {
  const hubs = get(state).hubs.map(h =>
    h.id === hub.id
      ? { ...h, encounters: h.encounters.filter(e => e.id !== encId) }
      : h
  );
  state.update(s => ({ ...s, hubs }));
}
</script>

<div>
  <h3>Encounters</h3>
  <ul>
    {#each hub.encounters as enc}
      <li>
        {#if editingId === enc.id}
          <EncounterEdit encounter={enc} hubId={hub.id} />
          <button on:click={() => (editingId = null)}>Cancel</button>
        {:else}
          {enc.name}
          <button on:click={() => handleEdit(enc)}>Edit</button>
          <button on:click={() => handleDelete(enc.id)}>Delete</button>
        {/if}
      </li>
    {/each}
  </ul>
  <input placeholder="New encounter name" bind:value={newEncounterName} on:keydown={(e) => e.key === 'Enter' && handleAdd()} />
  <button on:click={handleAdd}>Add Encounter</button>
</div>

<style>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5em;
}
input {
  margin-right: 0.5em;
}
button {
  margin-left: 0.25em;
}
</style>
