document.addEventListener('DOMContentLoaded', () => {
    // Function to load a partial into all matching slots and return a Promise
    function loadPartial(url, slot) {
        if (!url || !slot) return Promise.resolve();

        return fetch(url)
            .then(response => response.text())
            .then(html => {
                // Find all target elements using the slot name
                const targetElements = document.querySelectorAll(`[data-slot="${slot}"]`);
                targetElements.forEach(targetElement => {
                    if (targetElement.tagName.toLowerCase() === 'a') {
                        return; // Skip links with data-slot and data-part attributes
                    }

                    targetElement.innerHTML = html;

                    // Find and process nested partials within the newly inserted content
                    const nestedElements = targetElement.querySelectorAll('[data-part]');
                    const nestedPromises = Array.from(nestedElements).map(nestedElement => {
                        const nestedUrl = nestedElement.getAttribute('data-part');
                        const nestedSlot = nestedElement.getAttribute('data-slot');

                        // Skip links with both data-part and data-slot attributes
                        if (nestedElement.tagName.toLowerCase() === 'a' && nestedSlot) {
                            return Promise.resolve(); // Skip processing this link element
                        }

                        if (nestedUrl && nestedSlot) {
                            return loadPartial(nestedUrl, nestedSlot);
                        }

                        return Promise.resolve(); // Resolve immediately if no nestedUrl or nestedSlot
                    });

                    return Promise.all(nestedPromises); // Wait for all nested partials to load
                });
            })
            .catch(error => {
                console.error('Error loading partial:', error);
            });
    }

    // Handle link clicks
    async function handleNavigation(event) {
        event.preventDefault();

        const href = event.currentTarget.getAttribute('href');
        const partUrl = event.currentTarget.getAttribute('data-part');
        const slots = event.currentTarget.getAttribute('data-slot').split(' ');

        if (href) {
            history.pushState(null, '', href); // Update the browser URL
        }

        if (partUrl && slots.length > 0) {
            await Promise.all(slots.map(slot => loadPartial(partUrl, slot)));
        }
    }

    // Initial load based on the current URL
    async function loadInitialContent() {
        const hash = window.location.hash;
        if (hash) {
            const slot = 'main'; // Default slot to load into if hash exists
            const partUrl = document.querySelector(`[data-slot="${slot}"]`)?.getAttribute('data-part');
            if (partUrl) {
                await loadPartial(partUrl, slot);
            }
        }
    }

    // Load static parts based on data-part attributes
    async function loadStaticParts() {
        const partElements = document.querySelectorAll('[data-part]');
        const loadPromises = Array.from(partElements).map(element => {
            const url = element.getAttribute('data-part');
            const slots = element.getAttribute('data-slot')?.split(' ');

            // Skip links (a elements) with both data-part and data-slot attributes
            if (element.tagName.toLowerCase() === 'a' && slots?.length > 0) {
                return Promise.resolve(); // Skip processing this element
            }

            if (url && slots?.length > 0) {
                return Promise.all(slots.map(slot => loadPartial(url, slot)));
            }

            return Promise.resolve(); // Resolve immediately if no url or slots
        });

        await Promise.all(loadPromises); // Wait for all static parts to load
    }

    // Attach click handlers to all navigation links
    document.querySelectorAll('nav a[data-part][data-slot]').forEach(link => {
        // link.addEventListener('click', handleNavigation);
    });

    // Load initial content for the main slot based on the current URL hash
    loadInitialContent();

    // Load all static parts on page load
    loadStaticParts().then(() => {
        console.log("All static parts loaded.");
    });

    // Handle back/forward navigation
    // window.addEventListener('popstate', loadInitialContent);
});
