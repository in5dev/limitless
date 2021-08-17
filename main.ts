import File from './src/elements/File.svelte';
import url from './assets/strad.png';

const app = new File({ target: document.body, props: { src: url } });

export default app;
