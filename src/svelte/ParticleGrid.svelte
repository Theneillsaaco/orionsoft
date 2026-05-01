<script>
    import { onMount } from 'svelte';

    let canvas
    let animFrame
    let dots = []
    let W = 0
    let H = 0
    let mouse = { x: -999, y: -999 }

    const SPACING = 42
    const DOT_R = 1.1
    const MAX_DIST = 160

    const BASE_OPACITY = 0.12
    const HIGHLIGHT_OPACITY = 0.55

    let color = '120,120,120'

    function readColor() {
        const el = document.documentElement
        const val = getComputedStyle(el)
            .getPropertyValue('--color-md-primary')
            .trim()

        // Convert hex to rgb
        if (val.startsWith('#')) {
            const bigint = parseInt(val.slice(1), 16)
            const r = (bigint >> 16) & 255
            const g = (bigint >> 8) & 255
            const b = bigint & 255
            color = `${r},${g},${b}`
        } 
    }

    function buildDots(w, h) {
        const result = []
        const cols = Math.ceil(w / SPACING) + 1
        const rows = Math.ceil(h / SPACING) + 1

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                result.push({
                    x: c * SPACING,
                    y: r * SPACING,
                    op: BASE_OPACITY
                })
            }
        }

        return result;
    }

    function draw(ctx) {
        ctx.clearRect(0, 0, W, H)

        for (const dot of dots) {
            const dx = dot.x - mouse.x
            const dy = dot.y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            const t = Math.max(0, 1 - dist / MAX_DIST)

            dot.op += (
                BASE_OPACITY + 
                (HIGHLIGHT_OPACITY - BASE_OPACITY) * t - 
                dot.op
            ) * 0.1

            ctx.beginPath()
            ctx.arc(dot.x, dot.y, DOT_R, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${color}, ${dot.op})`
            ctx.fill()
        }

        animFrame = requestAnimationFrame(() => draw(ctx))
    }

    onMount(() => {
       const ctx = canvas.getContext('2d')

        readColor()

        const resize = () => {
            W = canvas.width  = canvas.offsetWidth
            H = canvas.height = canvas.offsetHeight
            dots = buildDots(W, H)
        }

        const onMouse = (e) => {
            const rect = canvas.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }

        resize()

        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        window.addEventListener('mousemove', onMouse)

        draw(ctx)

        return () => {
            cancelAnimationFrame(animFrame)
            ro.disconnect()
            window.removeEventListener('mousemove', onMouse)
        }
    })
</script>

<div class="pg-wrap" aria-hidden="true">
    <canvas bind:this={canvas} class="pg-canvas"></canvas>

    <!-- fades usando tu sistema -->
    <div class="pg-fade-top"></div>
    <div class="pg-fade-bottom"></div>
</div>

<style>
  .pg-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
  }

  .pg-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .pg-fade-top {
    position: absolute;
    top: 0;
    inset-inline: 0;
    height: 180px;
    background: linear-gradient(
        to bottom,
        var(--color-md-background),
        transparent
    );
    pointer-events: none;
  }

  .pg-fade-bottom {
    position: absolute;
    bottom: 0;
    inset-inline: 0;
    height: 180px;
    background: linear-gradient(
        to top,
        var(--color-md-background),
        transparent
    );
    pointer-events: none;
  }
</style>