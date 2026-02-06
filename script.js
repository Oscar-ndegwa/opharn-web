// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simulate sending (replace with actual backend call)
    setTimeout(() => {
        contactMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        contactMessage.className = 'form-message success';
        contactForm.reset();
        
        setTimeout(() => {
            contactMessage.className = 'form-message';
        }, 5000);
    }, 1000);
});

// Donation Amount Selection
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');
const donateAmountDisplay = document.getElementById('donate-amount');
let selectedAmount = 0;

amountButtons.forEach(button => {
    button.addEventListener('click', () => {
        amountButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedAmount = parseInt(button.dataset.amount);
        customAmountInput.value = '';
        updateDonateButton();
    });
});

customAmountInput.addEventListener('input', () => {
    amountButtons.forEach(btn => btn.classList.remove('active'));
    selectedAmount = parseInt(customAmountInput.value) || 0;
    updateDonateButton();
});

function updateDonateButton() {
    if (selectedAmount > 0) {
        donateAmountDisplay.textContent = `KSh ${selectedAmount.toLocaleString()}`;
    } else {
        donateAmountDisplay.textContent = 'KSh 0';
    }
}

// ============================================
// STRIPE PAYMENT INTEGRATION
// ============================================
// IMPORTANT: Replace 'YOUR_STRIPE_PUBLISHABLE_KEY' with your actual Stripe publishable key
// Sign up at https://stripe.com to get your API keys

// Initialize Stripe (uncomment and add your key)
// const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

// For demonstration without actual Stripe key:
const paymentForm = document.getElementById('payment-form');
const paymentMessage = document.getElementById('payment-message');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const spinner = document.getElementById('spinner');

// Simulate Stripe Elements (replace with actual Stripe Elements when you have a key)
const cardElementDiv = document.getElementById('card-element');
cardElementDiv.innerHTML = '<div style="padding: 10px; background: #f8f9fa; border-radius: 5px;">Card payment form will appear here when Stripe is configured</div>';

// When you have a Stripe account, uncomment this code:
/*
const elements = stripe.elements();
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
        }
    }
});
cardElement.mount('#card-element');

cardElement.on('change', (event) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});
*/

paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (selectedAmount < 100) {
        paymentMessage.textContent = 'Please select or enter a donation amount (minimum KSh 100).';
        paymentMessage.className = 'form-message error';
        return;
    }
    
    const donorName = document.getElementById('donorName').value;
    const donorEmail = document.getElementById('donorEmail').value;
    
    if (!donorName || !donorEmail) {
        paymentMessage.textContent = 'Please fill in your name and email.';
        paymentMessage.className = 'form-message error';
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    buttonText.classList.add('hidden');
    spinner.classList.remove('hidden');
    
    // Simulate payment processing (replace with actual Stripe payment)
    setTimeout(() => {
        // Success message
        paymentMessage.textContent = `Thank you ${donorName} for your generous donation of KSh ${selectedAmount.toLocaleString()}! Your support makes a real difference.`;
        paymentMessage.className = 'form-message success';
        
        // Reset form
        paymentForm.reset();
        amountButtons.forEach(btn => btn.classList.remove('active'));
        selectedAmount = 0;
        updateDonateButton();
        
        // Reset button state
        submitButton.disabled = false;
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
        
        // Hide message after 10 seconds
        setTimeout(() => {
            paymentMessage.className = 'form-message';
        }, 10000);
    }, 2000);
    
    /* 
    When you have Stripe configured, replace the above simulation with:
    
    try {
        // Create payment intent on your server
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: selectedAmount * 100, // Convert to cents
                name: donorName,
                email: donorEmail
            })
        });
        
        const { clientSecret } = await response.json();
        
        // Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: donorName,
                    email: donorEmail
                }
            }
        });
        
        if (error) {
            paymentMessage.textContent = error.message;
            paymentMessage.className = 'form-message error';
        } else if (paymentIntent.status === 'succeeded') {
            paymentMessage.textContent = `Thank you for your donation of KSh ${selectedAmount.toLocaleString()}!`;
            paymentMessage.className = 'form-message success';
            paymentForm.reset();
            cardElement.clear();
        }
    } catch (error) {
        paymentMessage.textContent = 'Payment failed. Please try again.';
        paymentMessage.className = 'form-message error';
    } finally {
        submitButton.disabled = false;
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
    */
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(section);
});