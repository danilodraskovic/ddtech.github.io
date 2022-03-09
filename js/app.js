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
                error: function(err){
                    console.log(err);
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
                        cartTotal();
                        ispisCarta();
                        cartTotalPrice();
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
                        <button data-id="${product.id}" ${checkAddToCart(product.availability)}>ADD TO CART</button>
                    </div>
                </div>
                `;
            }
            if(data.length < 1) {
                html = `<p class="text-center w-100 margin-top">No available products</p>`;
            }
            $("#products-wrapper").html(html);
            products = data;
            $(".add-to-cart").click(function () {
                productsInCart = getItemFromLocalStorage("cart");
                let currentItemId = $(this).data("id");
                if (productsInCart != undefined && productsInCart && productsInCart.length != 0) {
                    if (alreadyAdded()) {
                        alert('Pusi kurac');
                    } else {
                        addNew();
                        cartTotalPrice();
                    }
                } 
                else {
                    addFirst();
                    cartTotalPrice();
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
            
                }else{
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
                html = 'class="add-to-cart"';
            } else {
                html = 'class="add-to-cart-disabled" disabled';
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
        });

        apply.addEventListener('click', () => {
            document.getElementById('filters-wrapper').classList.remove('filterNarrow');
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
        function cartTotalPrice(){
            count = getItemFromLocalStorage("cart").length;
            if(count > 0) {
                let totalCost = $(".item-in-cart-cost").toArray().map(el=>el.innerHTML).reduce((x,y)=>Number(x)+Number(y));
                $(".total").html(`
    
                    <div class="d-flex justify-content-between font-weight-bold px-3">
                        <h4>Total</h4>
                        <h4>$ <span class="cart-cost-total">${Number(totalCost).toFixed(2)}</span></h4>
                    </div>
    
                `)
            } else {
                $(".total").html("empty cart")
            }
        }

        openCart.addEventListener('click', () => {
            productsInCart = getItemFromLocalStorage('cart');
            cartTotal();
            ispisCarta();
            cartTotalPrice();
        })

        $("#clear-cart").click(() => {
            localStorage.removeItem("cart");
            cartTotal();
            ispisCarta();
            cartTotalPrice();
        });
    }
}