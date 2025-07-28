<script lang="ts">
import type { Hub, Encounter } from './store.svelte';
import { state } from './store.svelte';
import { get } from 'svelte/store';
import EncounterList from './EncounterList.svelte';

export let hub: Hub;

let name = hub.name;

function save() {
  state.update(s => ({
    ...s,
    hubs: s.hubs.map(h => h.id === hub.id ? { ...h, name } : h)
  }));
}
</script>

<div class="hub-edit">
  <label>
    Hub Name:
    <input bind:value={name} />
  </label>
  <button on:click={save}>Save</button>
  <EncounterList {hub} />
</div>

<style>
.hub-edit {
  border: 1px solid #ccc;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 6px;
}
label {
  display: block;
  margin-bottom: 0.5em;
}
</style>
