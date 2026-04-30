<script>
    import { onMount } from "svelte";

    let canvas
    let animFrame
    let cols = []
    let W = 0
    let H = 0

    const TITLE_W = 48
    const TILE_GAP = 2
    const SPEEDS = [0.4, 0.6, 0.8, 1.0, 0.5, 0.7, 0.3, 0.9]
    const OPACITIES = [0.04, 0.07, 0.05, 0.09, 0.06, 0.03, 0.08, 0.05]

    function buildCols(w, h) {
        const count = Math.ceil(w / (TITLE_W + TILE_GAP)) + 1
        return Array.from({ length: count }, (_, i) => ({
            x: i * (TITLE_W + TILE_GAP),
            y: (Math.random() * h * -1),
            speed: SPEEDS[i % SPEEDS.length] * (Math.random() * 0.5 + 0.75),
            opacity: OPACITIES[i % OPACITIES.length],
            tileH: Math.floor(Math.random() * 80 + 60),
            gap: Math.floor(Math.random() * 40 + 20),
        }))
    }
     
    function draw(ctx) {
        ctx.clearRect(0, 0, W, H)

        for (const col of cols) {
            col.y += col.speed

            if (col.y > H + col.tileH + col.gap) {
                col.y = -(col.tileH + col.gap) * 2
                col.tileH = Math.floor(Math.random() * 80 + 60)
                col.gap = Math.floor(Math.random() * 40 + 20)
            }

            let ty = col.y
            while (ty < H + col.tileH) {
                const grad = ctx.createLinearGradient(col.x, ty, col.x, ty + col.tileH)

                grad.addColorStop(0, `rgba(255,255,255,0)`)
                grad.addColorStop(0.3, `rgba(255,255,255,${col.opacity * 1.5})`)
                grad.addColorStop(0.7, `rgba(255,255,255,${col.opacity})`)
                grad.addColorStop(1, `rgba(255,255,255,0)`)

                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.roundRect(col.x, ty, TITLE_W, col.tileH, 4)
                ctx.fill()

                ctx.fillStyle = `rgba(255,255,255,${col.opacity * 4})`
                ctx.fillRect(col.x, ty, TITLE_W, 2)

                ty += col.tileH + col.gap
            }
        }

        animFrame = requestAnimationFrame(() => draw(ctx))
    }

  onMount(() => {
    const ctx = canvas.getContext('2d')

    const resize = () => {
      W = canvas.width = canvas.offsetWidth || window.innerWidth
      H = canvas.height = canvas.offsetHeight || window.innerHeight
      cols = buildCols(W, H)
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    draw(ctx)

    return () => {
      cancelAnimationFrame(animFrame)
      ro.disconnect()
    }
  })
</script>

<div class="absolute inset-0 overflow-hidden z-[1] pointer-events-none">    <!-- Canvas -->
    <canvas bind:this={canvas}
        class="absolute inset-0 w-full h-full block">
    </canvas>

    <!-- Vignette -->
    <div class="absolute inset-0 z-[2]
              bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_30%,rgba(10,10,10,0.6)_70%,rgba(10,10,10,0.95)_100%)]" >
    </div>


    <!-- Center glow -->
    <div class="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[600px] h-[600px] z-[3]
                bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]">
    </div>

    <!-- Bottom fade -->
    <div class="absolute bottom-0 left-0 right-0 h-[40%] z-[4]
                bg-gradient-to-b from-transparent to-[#0a0a0a]">
    </div>
</div>