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

    if (window.location.pathname == '/ddtech.github.io/index.html' || window.location.pathname == '/ddtech.github.io/') {
        var iconDiv = document.querySelectorAll('.icon-wrapper');
        var textDiv = document.querySelectorAll('.text-wrapper');
    
        for (let i = 0; i < textDiv.length; i++) {
            let height = textDiv[i].offsetHeight;
            iconDiv[i].style.height = height+"px";
        }
    }

    if (window.location.pathname == '/ddtech.github.io/store.html') {
        productsInCart = getItemFromLocalStorage('cart');
        
        let brands = [];
        let types = [];
        let categories = [];
        let products = [];
        var productsInCart = [];

        function setItemToLocalStorage(name, data){
            localStorage.setItem(name, JSON.stringify(data));
        }
        function getItemFromLocalStorage(name){
            return JSON.parse(localStorage.getItem(name));
        }
    
        getData("brands", showBrands);
    
        $("#search").keyup(filterChange);
        $("#sort").change(filterChange);
        $("#price-filter").change(filterChange);
        $(".availability").change(filterChange);
        

        function getData(file, callback){
            $.ajax({
                url: "data/" + file + ".json",
                method: "get",
                dataType: "json",
                success: function(response){
                    callback(response);
                },
                error: function(err) {
                    alert('An error occurred while getting files.');
                }
            });
        }
        
        function showBrands(data){
            let html = "";
            data.forEach(brand => {
                html += `<li class="list-group-item">
                           <input type="checkbox" value="${brand.id}" class="brand" name="brands" /> ${brand.name}
                        </li>`;
            });
            document.getElementById('brandContainer').innerHTML = html;
            brands = data;
            getData("types", showTypes);
        }
        
        function showTypes(data){
            let html = "";
            data.forEach(type => {
                html += `<li class="list-group-item">
                           <input type="checkbox" value="${type.id}" class="type" name="types" /> ${type.name}
                        </li>`;
            });
            document.getElementById('typeContainer').innerHTML = html;
            types = data;
            getData("categories", showCategories);
        }

        function showCategories(data){
            let html = "";
            data.forEach(category => {
                html += `<li class="list-group-item">
                           <input type="checkbox" value="${category.id}" class="category" name="categories" /> ${category.name}
                        </li>`;
            });
            document.getElementById('categoryContainer').innerHTML = html;
            categories = data;
            getData("countries", showCountries);
        }

        function showCountries(data) {
            let html = '<option value="choose" selected>Choose...</option>';
            for (c of data) {
                html += `<option value="${c.name}">${c.name}</option>`
            }
            document.getElementById('country').innerHTML = html;
            country.addEventListener('change', checkCountry);
            country.addEventListener('blur', checkCountry);
            $(".brand").change(filterChange);
            $(".type").change(filterChange);
            $(".category").change(filterChange);
            getData("products", showProducts);
        }
        
        function ispisCarta() {
            let html = '';
            productsInCart = getItemFromLocalStorage("cart");
            if(productsInCart){
                for (let product of productsInCart) {
                    for (let item of products){
                        if (product.id == item.id) {
                            html += `
                            <div class="card border-0 item-in-cart" data-id="${product.id}">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-end">
                                        <img src="img/${item.photo.src}.png" class="img-in-cart w-100" alt="">
                                        <button data-id="${product.id}" class="btn btn-outline-danger remove-from-cart">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                    <p class="mt-3">
                                        ${item.name}
                                    </p>
                                    <div class="d-flex justify-content-between align-items-end">
                                        <div class="form-row">
                                            <button class="btn btn-outline-primary quantity-minus">
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <input type="number" class="form-control w-25 mx-2 quantity" unitPrice="${item.price.currentPrice}" value="1" min="1">
                                            <button class="btn btn-outline-primary quantity-plus">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <p class="mb-0">$ <span class="item-in-cart-cost">${item.price.currentPrice}</span></p>
                                    </div>
                                    <hr>
                                </div>
                            </div>`;
                        }
                    }
                    document.getElementById('cart').innerHTML = html;
                    $(".remove-from-cart").click(removeFromCart);
                    function removeFromCart(){
                        let deleteItem = $(this).data("id");
                        let newArray = [];
                        for(let p of productsInCart){
                            if(p.id == deleteItem){
                                continue;
                            }
                            newArray.push(p);
                        }
                        productsInCart = newArray;
                        setItemToLocalStorage("cart", productsInCart);
                        $(this).parentsUntil("#cart").remove();
                        if (productsInCart.length > 0) {
                            cartTotal();
                            ispisCarta();
                            cartTotalPrice();
                        } else {
                            cartTotal();
                            ispisCarta();
                            $(".total").html("Your cart is empty.");
                            document.querySelector('.modal-footer').style.display = 'none';
                        }
                    }
                }
            } else {
                document.getElementById('cart').innerHTML = html;
            }
        }

        function showProducts(data) {
            data = search(data);
            data = brandsFilter(data);
            data = typesFilter(data);
            data = categoriesFilter(data);
            data = availabilityFilter(data);
            data = sort(data);
            data = filterByPrice(data);
            let html = "";
            for(let product of data){
                html+= `
                <div class="product">
                    <div class="product-info">
                        <img class="w-100 product-photo" src="img/${product.photo.src}.png" alt="${product.photo.alt}" />
                        <h3 class="product-brand">${checkBrand(product.brandID)}</h3>
                        <p class="product-name">${product.name}</p>
                        <h4 class="product-price">$${product.price.currentPrice}</h4>
                        <p>${checkPrice(product.price.oldPrice)}</p>
                        <p>Categories: ${checkCategories(product.categories)}</p>
                        ${checkAvailability(product.availability)}
                    </div>
                    <div class="actions">
                        <button class="button${checkAddToCart(product.availability)} data-id="${product.id}">
                            <span>Add to cart</span>
                            <div class="cart">
                                <svg viewBox="0 0 36 26">
                                    <polyline points="1 2.5 6 2.5 10 18.5 25.5 18.5 28.5 7.5 7.5 7.5"></polyline>
                                    <polyline points="15 13.5 17 15.5 22 10.5"></polyline>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
                `;
            }
            if(data.length < 1) {
                html = `
                        <div id="no-results-found">
                            <img clas="w-100 margin-top" src="img/no-results.jpg" alt="No results found." />
                            <p class="text-center font-weight-bold w-100">No available products</p>
                        </div>
                    `;
            }
            $("#products-wrapper").html(html);
            products = data;
            $(".add-to-cart").click(function () {
                productsInCart = getItemFromLocalStorage("cart");
                let currentItemId = $(this).data("id");
                if (productsInCart != undefined && productsInCart && productsInCart.length != 0) {
                    if (alreadyAdded()) {
                        document.getElementById('alreadyInCart').style.transition = 'all 1s ease-in-out';
                        document.getElementById('alreadyInCart').style.top = '20px';
                        setTimeout(`document.getElementById('alreadyInCart').style.top = '-500px'`, 2000);
                    } else {
                        addNew();
                        addToCartAnimation(this);
                    }
                } else {
                    addFirst();
                    addToCartAnimation(this);
                }
                function addFirst(){
                    let newProductArray = [];
                    newProductArray.push({
                        id:currentItemId,
                        quantity: 1
                    });
                    setItemToLocalStorage('cart', newProductArray);
                }
                function alreadyAdded(){
                    let count = 0;
                    for(let p of productsInCart){
                        if(p.id == currentItemId){
                            count++;
                        }
                    }
                    return count;
                }
                function addNew(){
                    productsInCart.push({
                        id: currentItemId,
                        quantity: 1
                    });
                    setItemToLocalStorage("cart", productsInCart);
                }
            
            });

            $("#cart").delegate(".quantity-plus","click",function () {

                let q =$(this).siblings(".quantity").val();
                let p = $(this).siblings(".quantity").attr("unitPrice");
                let newQ = Number(q)+1;
                let newCost = p * newQ;
                $(this).siblings(".quantity").val(newQ);
                $(this).parent().siblings("p").find(".item-in-cart-cost").html(newCost.toFixed(2));
                cartTotal();
                cartTotalPrice();
            })
            
            $("#cart").delegate(".quantity-minus","click",function () {
            
                let q =$(this).siblings(".quantity").val();
                let p = $(this).siblings(".quantity").attr("unitPrice");
                if(q>1){
            
                    let newQ = Number(q)-1;
                    let newCost = p * newQ;
                    $(this).siblings(".quantity").val(newQ);
                    $(this).parent().siblings("p").find(".item-in-cart-cost").html(newCost.toFixed(2));
                    cartTotal();
                    cartTotalPrice();
                }
            
            })
            
            $("#cart").delegate(".quantity","keyup change",function () {
            
                let q =$(this).val();
                let p = $(this).attr("unitPrice");
                if(q>1){
            
                    let newQ = Number(q);
                    let newCost = p * newQ;
                    $(this).val(newQ);
                    $(this).parent().siblings("p").find(".item-in-cart-cost").html(newCost.toFixed(2));
                    cartTotal();
                    cartTotalPrice();
            
                } else {
                    alert("more than one");
                }
            
            });
        }

        function checkBrand(id) {
            let html = '';
            for (let brand of brands) {
                if (id == brand.id) {
                    html = brand.name;
                }
            }
            return html;
        }

        function checkPrice(price) {
            let html = '';
            if (price == null) {
                html = ``;
            } else {
                html = '$'+price;
            }
            return html;
        }

        function checkCategories(ids){
            let html = "";
            let productCategories = categories.filter(c => ids.includes(c.id));
            for(let i in productCategories){
                html += productCategories[i].name;
                if(i != productCategories.length - 1){
                    html += ", ";
                }
            }
            return html;
        }

        function checkAvailability(availability) {
            let html = '';
            if (availability) {
                html = `<p class="text-success">Available</p>`;
            } else {
                html = `<p class="text-danger">Not available</p>`;
            }
            return html;
        }

        function checkAddToCart(availability) {
            let html = '';
            if (availability) {
                html = ' add-to-cart"';
            } else {
                html = ' add-to-cart" disabled';
            }
            return html;
        }

        function search(data){
            let searchInput = $("#search").val().toLowerCase();
            if(searchInput) {
                return data.filter(function(element) {
                    return element.name.toLowerCase().indexOf(searchInput) !== -1;
                })
            }
            return data;
        }

        function sort(data){
            const sortType = document.getElementById('sort').value;
            if(sortType == 'asc'){
                return data.sort((a,b) => a.price.currentPrice > b.price.currentPrice ? 1 : -1);
            } else if (sortType == 'desc') {
                return data.sort((a,b) => a.price.currentPrice < b.price.currentPrice ? 1 : -1);
            } else if (sortType == 'name') {
                return data.sort((a,b ) => a.name > b.name ? 1 : -1);
            }
        }

        function filterByPrice(data){
            const filterType = document.getElementById("price-filter").value;
            if (filterType == '1') {
                return data.filter(x => x.price.currentPrice <= 100);
            } else if (filterType == '2') {
                return data.filter(x => x.price.currentPrice > 100 && x.price.currentPrice < 300);
            } else if (filterType == '3') {
                return data.filter(x => x.price.currentPrice > 300);
            } else {
                return data;
            }
        }

        function brandsFilter(data){
            let selectedBrands = [];
            $('.brand:checked').each(function(el) {
                selectedBrands.push(parseInt($(this).val()));
            });
            if (selectedBrands.length != 0) {
                return data.filter(x => selectedBrands.includes(x.brandID));
            }
            return data;
        }

        function typesFilter(data){
            let selectedTypes = [];
            $('.type:checked').each(function(el) {
                selectedTypes.push(parseInt($(this).val()));
            });
            if (selectedTypes.length != 0) {
                return data.filter(x => selectedTypes.includes(x.typeID));
            }
            return data;
        }

        function categoriesFilter(data){
            let selectedCategories = [];
            $('.category:checked').each(function(el){
                selectedCategories.push(parseInt($(this).val()));
            });
            if (selectedCategories.length != 0){
                return data.filter(x => x.categories.some(y => selectedCategories.includes(y)));
            }
            return data;
        }

        function availabilityFilter(data){
            let availability = $(".availability:checked").val();
            if (availability == "all") {
                return data;
            }
            if (availability == "available") {
                return data.filter(x => x.availability);
            } if (availability == "unavailable") {
                return data.filter(x => !x.availability);
            }
            return data;
        }

        function filterChange(){
            getData("products", showProducts);
        }

        var showFilters = document.getElementById('show-filters');
        var apply = document.getElementById('apply');

        showFilters.addEventListener('click', () => {
            document.getElementById('filters-wrapper').classList.add('filterNarrow');
            document.querySelector('body').style.overflow = 'hidden';
        });

        apply.addEventListener('click', () => {
            document.getElementById('filters-wrapper').classList.remove('filterNarrow');
            document.getElementById('filters-wrapper').classList.add('filterNarrowOff');
            document.querySelector('body').style.overflow = 'auto';
        });

        var openCart = document.getElementById('open-cart');

        function cartTotal(){
            productsInCart = getItemFromLocalStorage("cart");
            
            if(productsInCart){
                let count = productsInCart.length;
                $(".item-in-cart-count").html(count);
            }
            else{
                $(".item-in-cart-count").html(0);
            }
        
        }
        function cartTotalPrice() {
            if (localStorage.getItem("cart") !== null || !productsInCart) {
                let totalCost = $(".item-in-cart-cost").toArray().map(el=>el.innerHTML).reduce((x,y)=>Number(x)+Number(y));
                $(".total").html(`
    
                    <div class="d-flex justify-content-between font-weight-bold px-3">
                        <h4>Total</h4>
                        <h4>$ <span class="cart-cost-total">${Number(totalCost).toFixed(2)}</span></h4>
                    </div>
    
                `)
            } else {
                $(".total").html("Your cart is empty.");
            }
        }

        openCart.addEventListener('click', () => {
            productsInCart = getItemFromLocalStorage('cart');
            if (localStorage.getItem("cart") !== null && productsInCart.length > 0) {
                cartTotal();
                ispisCarta();
                cartTotalPrice();
                document.querySelector('.modal-footer').style.display = 'block';
            } else {
                $(".total").html("Your cart is empty.");
                document.querySelector('.modal-footer').style.display = 'none';
            }
            
        })

        $("#clear-cart").click(() => {
            localStorage.removeItem("cart");
            cartTotal();
            ispisCarta();
            $(".total").html("Your cart is empty.");
        });

        function addToCartAnimation(el) {
            if(!el.classList.contains('loading')) {
               el.classList.add('loading');
                setTimeout(() =>el.classList.remove('loading'), 3700);
            }
        }



        //PROVERA FORME

        

        var fullName = document.getElementById('name');
        var nameHelp = document.getElementById('nameHelp');

        var email = document.getElementById('email');
        var emailHelp = document.getElementById('emailHelp');

        var city = document.getElementById('city');
        var cityHelp = document.getElementById('cityHelp');

        var address = document.getElementById('address');
        var addressHelp = document.getElementById('addressHelp');

        var checkbox = document.getElementById('checkbox-agree');
        var checkboxHelp = document.getElementById('checkboxHelp');
        

        var nameApprove = false;
        var emailApprove = false;
        var countryApprove = false;
        var cityApprove = false;
        var addressApprove = false;
        var checkboxApprove = false;

        var nameRegex = /^[A-ZČĆŽĐŠ][a-zćčžđš]{1,14}\s([A-ZČĆŽĐŠ][a-zćčžđš]{1,14})?\s?[A-ZČĆŽŠĐ][a-zćčžđš]{1,19}$/;
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var cityRegex = /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$/;
        var addressRegex = /^[A-Za-z0-9\s/-]{5,}$/;


        function checkName() {
            if (fullName.value.match(nameRegex)) {
                nameHelp.textContent = "";
                fullName.classList.remove('error');
                fullName.classList.add('success');
                nameApprove = true;
            } else if (fullName.value.length < 1) {
                nameHelp.textContent = "Field can't be empty.";
                fullName.classList.remove('success');
                fullName.classList.add('error');
                nameApprove = false;
            } else {
                nameHelp.textContent = "First and last name have to start with a capital letter - Danilo Draskovic";
                fullName.classList.remove('success');
                fullName.classList.add('error');
                nameApprove = false;
            }
        }

        function checkEmail() {
            if (email.value.match(emailRegex)) {
                emailHelp.textContent = "";
                email.classList.remove('error');
                email.classList.add('success');
                emailApprove = true;
            } else if (email.value.length < 1) {
                emailHelp.textContent = "Field can't be empty.";
                email.classList.remove('success');
                email.classList.add('error');
                emailApprove = false;
            } else {
                emailHelp.textContent = "Enter a valid email - danilodraskovic@gmail.com";
                email.classList.remove('success');
                email.classList.add('error');
                emailApprove = false;
            }
        }

        function checkCountry() {
            let selectedValue = country.options[country.selectedIndex].value;
            console.log = selectedValue;
            if (selectedValue == "choose") {
                country.classList.remove('success');
                country.classList.add('error');
                countryHelp.textContent = "Please choose the country of your question";
                countryApprove = false;
            } else {
                country.classList.remove('error');
                country.classList.add('success');
                countryHelp.textContent = "";
                countryApprove = true;
            }
        }

        function checkCity() {
            if (city.value.match(cityRegex)) {
                cityHelp.textContent = "";
                city.classList.remove('error');
                city.classList.add('success');
                cityApprove = true;
            } else if (city.value.length < 1) {
                cityHelp.textContent = "Field can't be empty.";
                city.classList.remove('success');
                city.classList.add('error');
                cityApprove = false;
            } else {
                cityHelp.textContent = "Enter a valid city - Obrenovac";
                city.classList.remove('success');
                city.classList.add('error');
                cityApprove = false;
            }
        }

        function checkAddress() {
            if (address.value.match(addressRegex)) {
                addressHelp.textContent = "";
                address.classList.remove('error');
                address.classList.add('success');
                addressApprove = true;
            } else if (address.value.length < 1) {
                addressHelp.textContent = "Field can't be empty.";
                address.classList.remove('success');
                address.classList.add('error');
                addressApprove = false;
            } else {
                addressHelp.textContent = "Enter a valid address - Kralja Aleksandra 20";
                address.classList.remove('success');
                address.classList.add('error');
                addressApprove = false;
            }
        }

        function checkCheckbox() {
            if (checkbox.checked) {
                checkbox.classList.add('success');
                checkboxApprove = true;
                checkboxHelp.textContent = ""
            } else {
                checkbox.classList.remove('success');
                checkbox.classList.add('error');
                checkboxApprove = false;
                checkboxHelp.textContent = "This field is mandatory."
            }
        }

        fullName.addEventListener('keyup', checkName);
        fullName.addEventListener('blur', checkName);

        email.addEventListener('keyup', checkEmail);
        email.addEventListener('blur', checkEmail);

        country.addEventListener('change', checkCountry);
        country.addEventListener('blur', checkCountry);

        city.addEventListener('keyup', checkCity);
        city.addEventListener('blur', checkCity);

        address.addEventListener('keyup', checkAddress);
        address.addEventListener('blur', checkAddress);

        checkbox.addEventListener('change', checkCheckbox);

        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();
            checkName();
            checkEmail();
            checkCountry();
            checkCity();
            checkAddress();
            checkCheckbox();
            if (nameApprove && emailApprove && countryApprove && cityApprove && addressApprove && checkboxApprove) {
                localStorage.removeItem("cart");
                document.querySelector('.modal-footer').innerHTML = `
                    <div id="order-completed">
                        <div id="order-completed-inner">
                            <i class="fa-solid fa-truck-ramp-box"></i>
                            <h2 class="text-center text-success">Your order is on the way</h2>
                        </div>
                    </div>
                `
                setTimeout("location.reload(true);", 1500);
            }
        });
    }

    if (window.location.pathname == '/ddtech.github.io/contact.html') {
        var fullName = document.getElementById('name');
        var nameHelp = document.getElementById('nameHelp');

        var email = document.getElementById('email');
        var emailHelp = document.getElementById('emailHelp');

        var subject = document.getElementById('subject');
        var subjectHelp = document.getElementById('subjectHelp');

        var address = document.getElementById('address');

        var message = document.getElementById('message');
        var messageHelp = document.getElementById('messageHelp');

        var checkbox = document.getElementById('checkbox-agree');
        var checkboxHelp = document.getElementById('checkboxHelp');
        

        var nameApprove = false;
        var emailApprove = false;
        var subjectApprove = false;
        var messageApprove = false;
        var checkboxApprove = false;

        var nameRegex = /^[A-ZČĆŽĐŠ][a-zćčžđš]{1,14}\s([A-ZČĆŽĐŠ][a-zćčžđš]{1,14})?\s?[A-ZČĆŽŠĐ][a-zćčžđš]{1,19}$/;
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


        function checkName() {
            if (fullName.value.match(nameRegex)) {
                nameHelp.textContent = "";
                fullName.classList.remove('error');
                fullName.classList.add('success');
                nameApprove = true;
            } else if (fullName.value.length < 1) {
                nameHelp.textContent = "Field can't be empty.";
                fullName.classList.remove('success');
                fullName.classList.add('error');
                nameApprove = false;
            } else {
                nameHelp.textContent = "First and last name have to start with a capital letter - Danilo Draskovic";
                fullName.classList.remove('success');
                fullName.classList.add('error');
                nameApprove = false;
            }
        }

        function checkEmail() {
            if (email.value.match(emailRegex)) {
                emailHelp.textContent = "";
                email.classList.remove('error');
                email.classList.add('success');
                emailApprove = true;
            } else if (email.value.length < 1) {
                emailHelp.textContent = "Field can't be empty.";
                email.classList.remove('success');
                email.classList.add('error');
                emailApprove = false;
            } else {
                emailHelp.textContent = "Enter a valid email - danilodraskovic@gmail.com";
                email.classList.remove('success');
                email.classList.add('error');
                emailApprove = false;
            }
        }

        function checkSubject() {
            let selectedValue = subject.options[subject.selectedIndex].value;
            if (selectedValue == "choose") {
                subject.classList.remove('success');
                subject.classList.add('error');
                subjectHelp.textContent = "Please choose the subject of your question";
                subjectApprove = false;
            } else {
                subject.classList.remove('error');
                subject.classList.add('success');
                subjectHelp.textContent = "";
                subjectApprove = true;
            }
        }

        function checkMessage() {
            if (message.value < 1) {
                messageHelp.textContent = "Field can't be empty.";
                message.classList.remove('success');
                message.classList.add('error');
                messageApprove = false;
            } else {
                messageHelp.textContent = "";
                message.classList.remove('error');
                message.classList.add('success');
                messageApprove = true;
            }
        }

        function checkCheckbox() {
            if (checkbox.checked) {
                checkbox.classList.add('success');
                checkboxApprove = true;
                checkboxHelp.textContent = ""
            } else {
                checkbox.classList.remove('success');
                checkbox.classList.add('error');
                checkboxApprove = false;
                checkboxHelp.textContent = "This field is mandatory."
            }
        }

        fullName.addEventListener('keyup', checkName);
        fullName.addEventListener('blur', checkName);

        email.addEventListener('keyup', checkEmail);
        email.addEventListener('blur', checkEmail);

        subject.addEventListener('change', checkSubject);
        subject.addEventListener('blur', checkSubject);

        message.addEventListener('blur', checkMessage);

        checkbox.addEventListener('change', checkCheckbox);

        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();
            checkName();
            checkEmail();
            checkSubject();
            checkMessage();
            checkCheckbox();
            if (nameApprove && emailApprove && subjectApprove && messageApprove && checkboxApprove) {
                document.getElementById('contact-modal').style.transition = 'all 1s ease-in-out';
                document.getElementById('contact-modal').style.top = '20px';
                setTimeout(`document.getElementById('contact-modal').style.top = '-500px'`, 2500);
                setTimeout("location.reload(true);", 3000);
            }
        });
    }
}