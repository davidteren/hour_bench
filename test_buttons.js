// Simple test to check if buttons work
console.log('🧪 Testing landing page buttons...');

// Test basic button clicks
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    // Test Launch Demo button
    const launchBtn = document.querySelector('a[href="/session/new"].btn-glow');
    if (launchBtn) {
        console.log('✅ Launch Demo button found');
        console.log('Button data-controller:', launchBtn.getAttribute('data-controller'));
        console.log('Button data-action:', launchBtn.getAttribute('data-action'));
        
        // Test click
        launchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Launch Demo button clicked!');
            alert('Launch Demo button works! (Navigation prevented for test)');
        });
    } else {
        console.log('❌ Launch Demo button not found');
    }
    
    // Test Explore Features button
    const exploreBtn = document.querySelector('a[href="#features"]');
    if (exploreBtn) {
        console.log('✅ Explore Features button found');
        console.log('Button data-controller:', exploreBtn.getAttribute('data-controller'));
        console.log('Button data-action:', exploreBtn.getAttribute('data-action'));
        
        exploreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Explore Features button clicked!');
            alert('Explore Features button works!');
        });
    } else {
        console.log('❌ Explore Features button not found');
    }
    
    // Test Watch Demo button
    const watchBtn = document.querySelector('button[data-modal-target-value="#demo-video-modal"]');
    if (watchBtn) {
        console.log('✅ Watch Demo button found');
        watchBtn.addEventListener('click', function(e) {
            console.log('🎯 Watch Demo button clicked!');
            alert('Watch Demo button works!');
        });
    } else {
        console.log('❌ Watch Demo button not found');
    }
    
    // Check Stimulus
    setTimeout(() => {
        if (window.Stimulus) {
            console.log('✅ Stimulus loaded');
            const controllers = window.Stimulus.router ? Object.keys(window.Stimulus.router.modulesByIdentifier || {}) : [];
            console.log('📋 Registered controllers:', controllers);
        } else {
            console.log('❌ Stimulus not loaded');
        }
    }, 1000);
});

// Add this script to the page
const script = document.createElement('script');
script.textContent = `(${arguments.callee.toString()})()`;
document.head.appendChild(script);
