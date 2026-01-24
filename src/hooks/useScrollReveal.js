import { useEffect, useRef } from 'react';

/**
 * Custom hook for staggered scroll reveal animations
 * Uses Intersection Observer to trigger animations when elements come into view
 * with proper staggered timing between elements
 */
export function useScrollReveal(options = {}) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const {
            threshold = 0.1,
            rootMargin = '0px 0px -50px 0px',
            staggerDelay = 120 // ms between each element reveal
        } = options;

        // Track elements that need to be revealed together
        let pendingReveals = [];
        let revealTimeout = null;

        const processReveals = () => {
            // Sort by their visual position (top to bottom, left to right)
            pendingReveals.sort((a, b) => {
                const rectA = a.getBoundingClientRect();
                const rectB = b.getBoundingClientRect();
                // If roughly on the same row (within 50px), sort left to right
                if (Math.abs(rectA.top - rectB.top) < 50) {
                    return rectA.left - rectB.left;
                }
                return rectA.top - rectB.top;
            });

            // Add revealed class with staggered delays
            pendingReveals.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, index * staggerDelay);
            });

            pendingReveals = [];
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        pendingReveals.push(entry.target);
                        observer.unobserve(entry.target);
                    }
                });

                // Batch reveals that happen close together
                if (pendingReveals.length > 0) {
                    if (revealTimeout) clearTimeout(revealTimeout);
                    revealTimeout = setTimeout(processReveals, 50);
                }
            },
            { threshold, rootMargin }
        );

        // Observe all elements with reveal classes
        const revealElements = container.querySelectorAll(
            '.reveal-on-scroll, .card-reveal, .section-reveal'
        );

        revealElements.forEach((el) => observer.observe(el));

        return () => {
            if (revealTimeout) clearTimeout(revealTimeout);
            revealElements.forEach((el) => observer.unobserve(el));
        };
    }, [options]);

    return containerRef;
}

export default useScrollReveal;
