document.addEventListener("DOMContentLoaded", () => {
  console.log("CampusConnect JS loaded ✅");

  /* 
     DARK MODE TOGGLE
  */
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      toggleBtn.textContent = document.body.classList.contains('dark-mode')
        ? '🌞 Light Mode'
        : '🌙 Dark Mode';
    });
  }

  /* 
     NAVBAR SCROLL EFFECT
   */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* 
     FADE-IN ON SCROLL
   */
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.1 };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));

  /* 
     PARTICLES HERO
   */
  if (document.getElementById('particles-js')) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60 },
        size: { value: 3 },
        color: { value: "#ffffff" },
        line_linked: {
          enable: true,
          distance: 120,
          color: "#ffffff",
          opacity: 0.2,
          width: 1
        },
        move: { speed: 2 }
      },
      interactivity: {
        events: { onhover: { enable: true, mode: "repulse" } }
      }
    });
  }

  /* 
     POLL VOTING
   */
  const polls = document.querySelectorAll(".card[data-poll-id]");
  polls.forEach(card => {
    const voteBtn = card.querySelector("button");
    const radios = card.querySelectorAll("input[type='radio']");
    const yesBar = card.querySelector(".progress-bar.bg-success");
    const noBar = card.querySelector(".progress-bar.bg-danger");

    if (!voteBtn || radios.length === 0 || !yesBar || !noBar) return;

    voteBtn.addEventListener("click", () => {
  const selected = card.querySelector("input[type='radio']:checked");
  if (!selected) { alert("Select an option before voting!"); return; }

  const vote = selected.id.includes("yes") ? "yes" : "no";
  const poll_id = card.dataset.pollId;

  fetch('php/save_vote.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `poll_id=${poll_id}&vote=${vote}`
  })
  .then(res => res.json())
  .then(data => {
    if (!data.error) {
      const total = data.yes_votes + data.no_votes;
      yesBar.style.width = `${((data.yes_votes/total)*100).toFixed(1)}%`;
      yesBar.textContent = `Yes (${data.yes_votes})`;

      noBar.style.width = `${((data.no_votes/total)*100).toFixed(1)}%`;
      noBar.textContent = `No (${data.no_votes})`;

      voteBtn.disabled = true;
      voteBtn.textContent = "Voted ✅";
      voteBtn.classList.add("btn-success");
    } else { alert(data.error); }
  })
  .catch(() => alert("Failed to submit vote. Try again."));
});

  });

  /* 
     MEME UPLOAD
   */
  const memeInput = document.querySelector('#memeInput');
  const memePreview = document.querySelector('#memePreview');
  const memeGallery = document.getElementById("meme-gallery");

  if (memeInput && memeGallery) {
    memeInput.addEventListener("change", () => {
      const file = memeInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        memePreview.src = e.target.result;
        memePreview.style.display = "block";
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('meme', file);

      // Upload meme
fetch('php/upload_meme.php', { method: 'POST', body: formData })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const col = document.createElement("div");
      col.classList.add("col-md-4", "mb-4", "fade-in");
      col.innerHTML = `<div class="card shadow-sm"><img src="uploads/${data.filename}" class="card-img-top"></div>`;
      memeGallery.prepend(col);
      memePreview.style.display = 'none';
      memeInput.value = '';
      appearOnScroll.observe(col);
    } else { alert(data.error); }
  })
  .catch(() => alert("Failed to upload meme. Try again."));
    });
  }

  fetch('php/fetch_memes.php')
  .then(res => res.json())
  .then(data => {
    data.forEach(meme => {
      const col = document.createElement("div");
      col.classList.add("col-md-4", "mb-4", "fade-in");
      col.innerHTML = `<div class="card shadow-sm"><img src="uploads/${meme.filename}" class="card-img-top"></div>`;
      memeGallery.appendChild(col);
      appearOnScroll.observe(col);
    });
  })
  .catch(() => console.log("Failed to fetch memes from backend."));

  /* 
     SMOOTH SCROLL
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* 
     BACK TO TOP BUTTON
   */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === SCROLL REVEAL EFFECT ===
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const revealTop = el.getBoundingClientRect().top;
    const revealPoint = 100; // triggers earlier/later based on value
    if (revealTop < windowHeight - revealPoint) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Particle sparkles on vote buttons
document.querySelectorAll('.vote-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.offsetX + 'px';
    sparkle.style.top = e.offsetY + 'px';
    btn.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 500);
  });
});

// ======= HOME PAGE POLLS FETCH =======
const homePollsContainer = document.getElementById('home-polls-container');

function loadHomePolls() {
  fetch('php/fetch_polls.php')
    .then(res => res.json())
    .then(data => {
      homePollsContainer.innerHTML = ''; // Clear existing polls

      data.forEach(poll => {
        const col = document.createElement('div');
        col.classList.add('col-md-6', 'mb-4', 'fade-in');

        col.innerHTML = `
          <div class="card shadow-sm p-3 bg-gradient">
            <h5 class="poll-question">${poll.question}</h5>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="poll${poll.id}" id="poll${poll.id}Yes">
              <label class="form-check-label" for="poll${poll.id}Yes">${poll.option_yes}</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="poll${poll.id}" id="poll${poll.id}No">
              <label class="form-check-label" for="poll${poll.id}No">${poll.option_no}</label>
            </div>
            <button class="btn btn-cta mt-2 vote-btn">Vote</button>
            <div class="progress mt-3">
              <div class="progress-bar bg-success" style="width:${poll.yes_percent}%">
                Yes (${poll.yes_votes})
              </div>
              <div class="progress-bar bg-danger" style="width:${poll.no_percent}%">
                No (${poll.no_votes})
              </div>
            </div>
          </div>
        `;
        homePollsContainer.appendChild(col);

        // Add voting functionality
        const voteBtn = col.querySelector(".vote-btn");
        voteBtn.addEventListener("click", () => {
          const selected = col.querySelector("input[type='radio']:checked");
          if (!selected) { alert("Select an option before voting!"); return; }

          const vote = selected.id.includes("Yes") ? "yes" : "no";
          const poll_id = poll.id;

          fetch('php/save_vote.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `poll_id=${poll_id}&vote=${vote}`
          })
          .then(res => res.json())
          .then(data => {
            if(!data.error){
              const total = data.yes_votes + data.no_votes;
              col.querySelector('.progress-bar.bg-success').style.width = ((data.yes_votes/total)*100).toFixed(1) + "%";
              col.querySelector('.progress-bar.bg-success').textContent = `Yes (${data.yes_votes})`;
              col.querySelector('.progress-bar.bg-danger').style.width = ((data.no_votes/total)*100).toFixed(1) + "%";
              col.querySelector('.progress-bar.bg-danger').textContent = `No (${data.no_votes})`;

              voteBtn.disabled = true;
              voteBtn.textContent = "Voted ✅";
              voteBtn.classList.add("btn-success");
            } else { alert(data.error); }
          })
          .catch(() => alert("Failed to submit vote. Try again."));
        });
      });
    })
    .catch(err => console.log("Failed to fetch home polls:", err));
}

// Initial load
if(homePollsContainer) loadHomePolls();

// Optional: refresh every 30 seconds to show new polls automatically
setInterval(() => { if(homePollsContainer) loadHomePolls(); }, 30000);


}); 
