<script lang="ts">
import { state, addHub } from './store.svelte';
import type { Hub } from './store.svelte';
import HubEdit from './HubEdit.svelte';

let newHubName = '';
let editingId: string | null = null;

function handleAdd() {
  if (newHubName.trim()) {
    addHub({ id: crypto.randomUUID(), name: newHubName.trim(), links: [], encounters: [] });
    newHubName = '';
  }
}

function handleEdit(hub: Hub) {
  editingId = hub.id;
}

function handleCloseEdit() {
  editingId = null;
}

function handleDelete(hubId: string) {
  state.update(s => ({ ...s, hubs: s.hubs.filter(h => h.id !== hubId) }));
}
</script>

<div>
  <h2>Hubs</h2>
  <ul>
    {#each $state.hubs as hub}
      <li>
        {#if editingId === hub.id}
          <HubEdit {hub} on:close={handleCloseEdit} />
          <button on:click={handleCloseEdit}>Cancel</button>
        {:else}
          {hub.name}
          <button on:click={() => handleEdit(hub)}>Edit</button>
          <button on:click={() => handleDelete(hub.id)}>Delete</button>
        {/if}
      </li>
    {/each}
  </ul>
  <input placeholder="New hub name" bind:value={newHubName} on:keydown={(e) => e.key === 'Enter' && handleAdd()} />
  <button on:click={handleAdd}>Add Hub</button>
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
