<script>
    import { onMount } from 'svelte';

    export let strength = 20;

    let card
    let inner
    
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function animate() {
        currentX = lerp(currentX, targetX, 0.1);
        currentY = lerp(currentY, targetY, 0.1);

        card.style.transform = `translate3d(${currentX * strength * 0.3}px, ${currentY * strength * 0.3}px, 0)`;

        inner.style.transform = `
            perspective(700px)
            rotateX(${-currentY * 6}deg)
            rotateY(${currentX * 6}deg)
        `;

        card.style.setProperty('--glow-x', `${(currentX * 1) * 50}%`);
        card.style.setProperty('--glow-y', `${(currentY * 1) * 50}%`);

        requestAnimationFrame(animate);
    }

    onMount(() => {
        const handleMove = (e) => {
            const rect = card.getBoundingClientRect();

            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            targetX = x * 2 - 1;
            targetY = y * 2 - 1;
        }

        const handleLeave = () => {
            targetX = 0;
            targetY = 0;
        }

        card.addEventListener('pointermove', handleMove);
        card.addEventListener('pointerleave', handleLeave);

        animate();

        return () => {
            card.removeEventListener('pointermove', handleMove)
            card.removeEventListener('pointerleave', handleLeave)
        }
    })
</script>

<div bind:this={card} class="magnetic-card">
    <div bind:this={inner} class="magnetic-card-inner">
        <slot />
    </div>
</div>

<style>
  .magnetic-card {
    position: relative;
    will-change: transform;
  }

  .magnetic-inner {
    transform-style: preserve-3d;
    will-change: transform;
  }

  .card-glow {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;

    background: radial-gradient(
      circle at var(--glow-x, 50%) var(--glow-y, 50%),
      rgba(255,255,255,0.07),
      transparent 60%
    );

    transition: opacity 200ms ease;
  }
</style>