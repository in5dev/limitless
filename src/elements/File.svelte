<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string;

  const filename = src.split('/').pop() || '';
  let size = 0;

  onMount(async () => {
    const response = await fetch(src);
    const blob = await response.blob();
    ({ size } = blob);
  });
</script>

<div>
  <img {src} alt="img" />
  <p>
    <b>{filename}</b><br />
    {size} bytes
  </p>
</div>

<style lang="scss">
  div {
    margin: 20px;
  }
  img {
    $max-size: 400px;
    max-width: $max-size;
    max-height: $max-size;
  }
  p {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
