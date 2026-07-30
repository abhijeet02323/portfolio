/* ==========================================================
   BLOGS.JS
   PART 1
   Load Markdown • Open Reader • Close Reader
========================================================== */

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const blogCards = document.querySelectorAll(".blog-card");

const reader = document.getElementById("reader");

const markdownContent = document.getElementById("markdown-content");

const closeReader = document.getElementById("closeReader");

const blogGrid = document.querySelector(".blogs-grid");

const progressBar = document.getElementById("progressBar");

const searchInput = document.getElementById("search");

/* ==========================================================
   CURRENT BLOG
========================================================== */

let currentBlog = "";

/* ==========================================================
   OPEN BLOG
========================================================== */

async function openBlog(file){

    currentBlog = file;

    markdownContent.innerHTML = `

        <div class="loading">

            <div class="loader"></div>

        </div>

    `;

    reader.classList.add("active");

    reader.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error("Unable to load article.");

        }

        const markdown = await response.text();

        markdownContent.innerHTML = marked.parse(markdown);
        initializeReader();

        /* Highlight Code */

        document
            .querySelectorAll("pre code")
            .forEach((block)=>{

                hljs.highlightElement(block);

            });

        /* Reset Progress */

        progressBar.style.width = "0%";

    }

    catch(error){

        markdownContent.innerHTML = `

            <div class="no-results">

                <h2>Article Not Found</h2>

                <p>

                    ${error.message}

                </p>

            </div>

        `;

    }

}

/* ==========================================================
   BLOG CARD EVENTS
========================================================== */

blogCards.forEach((card)=>{

    card.addEventListener("click",()=>{

        const file = card.dataset.file;

        openBlog(file);

    });

});

/* ==========================================================
   CLOSE READER
========================================================== */

closeReader.addEventListener("click",()=>{

    reader.classList.remove("active");

    markdownContent.innerHTML = "";

    progressBar.style.width = "0%";

    blogGrid.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

});

/* ==========================================================
   ESC KEY CLOSES READER
========================================================== */

document.addEventListener("keydown",(event)=>{

    if(event.key==="Escape"){

        reader.classList.remove("active");

    }

});

/* ==========================================================
   PAGE TITLE
========================================================== */

document.title = "Blogs | Abhijeet Dwivedi";

/* ==========================================================
   INITIALIZE
========================================================== */

window.addEventListener("load",()=>{

    reader.classList.remove("active");

});

/* ==========================================================
   BLOGS.JS
   PART 2
   Search • Filters • Progress • Back To Top • URL Hash
========================================================== */

/* ==========================================================
   SEARCH
========================================================== */

const tagButtons = document.querySelectorAll(".tags button");

const backToTop = document.getElementById("backToTop");

/* ==========================================================
   LIVE SEARCH
========================================================== */

searchInput.addEventListener("input", function(){

    const value = this.value.toLowerCase().trim();

    blogCards.forEach(card=>{

        const title = card.querySelector("h2")
            .textContent
            .toLowerCase();

        const description = card.querySelector("p")
            .textContent
            .toLowerCase();

        const tags = card.querySelector(".meta")
            .textContent
            .toLowerCase();

        if(
            title.includes(value) ||
            description.includes(value) ||
            tags.includes(value)
        ){

            card.style.display = "block";

        }

        else{

            card.style.display = "none";

        }

    });

});

/* ==========================================================
   TAG FILTER
========================================================== */

tagButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        tagButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const tag = button.textContent.toLowerCase();

        if(tag==="all"){

            blogCards.forEach(card=>{

                card.style.display="block";

            });

            return;

        }

        blogCards.forEach(card=>{

            const meta = card.querySelector(".meta")
                .textContent
                .toLowerCase();

            if(meta.includes(tag)){

                card.style.display="block";

            }

            else{

                card.style.display="none";

            }

        });

    });

});

/* ==========================================================
   READING PROGRESS
========================================================== */

window.addEventListener("scroll",()=>{

    if(!reader.classList.contains("active")) return;

    const contentHeight =
        markdownContent.scrollHeight;

    const scrollPosition =
        window.scrollY;

    const readerTop =
        reader.offsetTop;

    const windowHeight =
        window.innerHeight;

    const total =
        contentHeight - windowHeight;

    let progress =
        ((scrollPosition-readerTop)/total)*100;

    progress=Math.max(0,progress);

    progress=Math.min(100,progress);

    progressBar.style.width=progress+"%";

});

/* ==========================================================
   BACK TO TOP
========================================================== */

window.addEventListener("scroll",()=>{

    if(window.scrollY>400){

        if(backToTop){

            backToTop.style.display="block";

        }

    }

    else{

        if(backToTop){

            backToTop.style.display="none";

        }

    }

});

if(backToTop){

    backToTop.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/* ==========================================================
   URL HASH SUPPORT
========================================================== */

window.addEventListener("load",()=>{

    const hash =
        window.location.hash
        .replace("#","");

    if(hash==="") return;

    blogCards.forEach(card=>{

        const file =
            card.dataset.file;

        const filename =
            file
            .split("/")
            .pop()
            .replace(".md","");

        if(filename===hash){

            openBlog(file);

        }

    });

});

/* ==========================================================
   UPDATE URL WHEN BLOG OPENS
========================================================== */

blogCards.forEach(card=>{

    card.addEventListener("click",()=>{

        const file =
            card.dataset.file;

        const filename =
            file
            .split("/")
            .pop()
            .replace(".md","");

        history.replaceState(
            null,
            "",
            "#"+filename
        );

    });

});

/* ==========================================================
   REMOVE HASH WHEN CLOSED
========================================================== */

closeReader.addEventListener("click",()=>{

    history.replaceState(

        null,

        "",

        window.location.pathname

    );

});

/* ==========================================================
   BLOGS.JS
   PART 3
   TOC • Reading Time • Copy Code • Shortcuts
========================================================== */

/* ==========================================================
   INITIALIZE READER
========================================================== */

function initializeReader(){

    generateTOC();

    addCopyButtons();

    calculateReadingTime();

}

/* ==========================================================
   READING TIME
========================================================== */

function calculateReadingTime(){

    const text =
        markdownContent.innerText;

    const words =
        text.trim().split(/\s+/).length;

    const minutes =
        Math.max(1,Math.ceil(words/200));

    let badge =
        document.querySelector(".reading-time");

    if(!badge){

        badge=document.createElement("div");

        badge.className="reading-time";

        markdownContent.prepend(badge);

    }

    badge.innerHTML=`📖 ${minutes} min read`;

}

/* ==========================================================
   TABLE OF CONTENTS
========================================================== */

function generateTOC(){

    const headings =
        markdownContent.querySelectorAll("h2,h3");

    if(headings.length===0) return;

    const toc =
        document.createElement("div");

    toc.className="table-of-contents";

    toc.innerHTML="<h3>Contents</h3>";

    const list =
        document.createElement("ul");

    headings.forEach((heading,index)=>{

        const id=
            "section-"+index;

        heading.id=id;

        const item=
            document.createElement("li");

        item.innerHTML=

        `<a href="#${id}">
            ${heading.textContent}
        </a>`;

        list.appendChild(item);

    });

    toc.appendChild(list);

    markdownContent.prepend(toc);

}

/* ==========================================================
   COPY BUTTONS
========================================================== */

function addCopyButtons(){

    const blocks =
        markdownContent.querySelectorAll("pre");

    blocks.forEach(pre=>{

        const button =
            document.createElement("button");

        button.innerHTML="Copy";

        button.className="copy-btn";

        pre.style.position="relative";

        pre.appendChild(button);

        button.addEventListener("click",()=>{

            const code =
                pre.querySelector("code")
                .innerText;

            navigator.clipboard
                .writeText(code);

            button.innerHTML="Copied ✓";

            setTimeout(()=>{

                button.innerHTML="Copy";

            },2000);

        });

    });

}

/* ==========================================================
   CTRL + K
========================================================== */

document.addEventListener("keydown",(event)=>{

    if(event.ctrlKey &&
        event.key==="k"){

        event.preventDefault();

        searchInput.focus();

    }

});

/* ==========================================================
   "/" SEARCH SHORTCUT
========================================================== */

document.addEventListener("keydown",(event)=>{

    if(event.key==="/"){

        if(document.activeElement.tagName==="INPUT")
            return;

        event.preventDefault();

        searchInput.focus();

    }

});

/* ==========================================================
   ENTER OPENS FIRST VISIBLE BLOG
========================================================== */

searchInput.addEventListener("keydown",(event)=>{

    if(event.key!=="Enter")
        return;

    const visible=
        [...blogCards].find(card=>

            card.style.display!=="none"

        );

    if(visible){

        openBlog(

            visible.dataset.file

        );

    }

});

/* ==========================================================
   IMAGE ZOOM
========================================================== */

markdownContent.addEventListener("click",(event)=>{

    if(event.target.tagName==="IMG"){

        const src=
            event.target.src;

        window.open(src,"_blank");

    }

});

/* ==========================================================
   EXTERNAL LINKS
========================================================== */

markdownContent.addEventListener("click",(event)=>{

    if(event.target.tagName==="A"){

        const href=
            event.target.getAttribute("href");

        if(href &&
           href.startsWith("http")){

            event.target.target="_blank";

        }

    }

});

/* ==========================================================
   CONSOLE
========================================================== */

console.log(

"📚 Blog System Ready"

);

console.log(

`${blogCards.length} articles loaded.`

);