window.onload = () => {
    AOS.init({
        duration: 800
    });
    var navNames = ['Home', 'About', 'Store', 'Contact', 'Documentation', 'Author'];
    var navHrefs = ['index.html', 'about.html', 'store.html', 'contact.html', 'pdf/documentation.pdf', 'author.html']; 
    var nav = document.querySelector('#nav ul');
    var navModal = document.querySelector('#menu-modal ul');

    for (let i = 0; i < navNames.length; i++) {
        let navLi = document.createElement('li');
        let navA = document.createElement('a');
        let navName = document.createTextNode(navNames[i]);
        navA.setAttribute('href', navHrefs[i]);
        navA.classList.add('navLink');
        navA.append(navName);
        navLi.append(navA);
        nav.append(navLi);
    }

    for (let i = 0; i < navNames.length; i++) {
        let navLi = document.createElement('li');
        let navA = document.createElement('a');
        let navName = document.createTextNode(navNames[i]);
        navA.setAttribute('href', navHrefs[i]);
        navA.classList.add('navLink');
        navA.append(navName);
        navLi.append(navA);
        navModal.append(navLi);
    }

    var hamburgerCounter = 1;
    var menuModal = document.getElementById('menu-modal');
    var hamburger = document.querySelector('.hamburger');
    var menuModalLinks = document.querySelectorAll('#menu-modal ul li');
    hamburger.addEventListener('click', () => {
        if (hamburgerCounter++ % 2 != 0) {
            hamburger.classList.add('is-active');
            slideDown(menuModal);
        } else {
            hamburger.classList.remove('is-active');
            slideUp(menuModal);
        }
    })

    function slideUp(el) {
        var classCounter = 1;
        el.style.transition = 'all .5s ease-in-out';
        el.style.height = '0';
        el.style.background = 'transparent';
        for (let link of menuModalLinks) {
            link.style.display = 'none';
            link.classList.remove(`slideInOnClick${classCounter}`);
            classCounter++;
        }
    }

    function slideDown(el) {
        var classCounter = 1;
        el.style.transition = 'all .5s ease-in-out';
        el.style.height = '100vh';
        el.style.background = '#FFF';
        for (let link of menuModalLinks) {
            link.style.display = 'inline-block';
            link.classList.add(`slideInOnClick${classCounter}`);
            classCounter++;
        }
    }

    if (window.location.pathname == '/index.html' || window.location.pathname == '/') {
        var iconDiv = document.querySelectorAll('.icon-wrapper');
        var textDiv = document.querySelectorAll('.text-wrapper');
    
        for (let i = 0; i < textDiv.length; i++) {
            let height = textDiv[i].offsetHeight;
            iconDiv[i].style.height = height+"px";
        }
    }
}