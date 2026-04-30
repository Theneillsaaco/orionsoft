<script>
    import { onMount, onDestroy } from "svelte";

    export let to = 100
    export let duration = 1800
    export let suffix = ''
    export let prefix = ''

    let displayed = 0
    let el
    let frame

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    function animateTo(target) {
        const start = performance.now()
        const from = displayed

        function step(now) {
            const elapsed = now - start
            const t = Math.min(elapsed / duration, 1)

            displayed = Math.round(
                from + (target - from) * easeOutExpo(t)
            )

            if (t < 1) {
                frame = requestAnimationFrame(step)
            }
        }

        frame = requestAnimationFrame(step)
    }

    onMount(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animateTo(to)
                    observer.disconnect()
                }
            },
            {
                threshold: 0.3,
            }
        )

        observer.observe(el)

        return () => {
            observer.disconnect()
        }
    })

    onDestroy(() => {
        if (frame) 
            cancelAnimationFrame(frame)
    })
</script>

<span
    bind:this={el}
    class="inline-block tabular-nums transition-all duration-300"
    class:opacity-0={displayed === 0}
    class:opacity-100={displayed > 0}
>
    {prefix}{displayed}{suffix}
</span>