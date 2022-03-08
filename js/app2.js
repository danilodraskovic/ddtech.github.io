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

    if (window.location.pathname == '/store.html') {
        let brands = [];
        let types = [];
        let categories = [];
    
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
                           <input type="checkbox" value="${brand.id}" class="brand" name="brands"/> ${brand.name}
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
                           <input type="checkbox" value="${type.id}" class="type" name="types"/> ${type.name}
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
                           <input type="checkbox" value="${category.id}" class="category" name="categories"/> ${category.name}
                        </li>`;
            });
            document.getElementById('categoryContainer').innerHTML = html;
            categories = data;
            $(".brand").change(filterChange);
            $(".type").change(filterChange);
            $(".category").change(filterChange);
            getData("products", showProducts);
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
                <div data-aos="fade-up" class="product">
                    <div class="product-info">
                        <img class="w-100 product-photo" src="img/${product.photo.src}.png" alt="${product.photo.alt}" />
                        <h3>${checkBrand(product.brandID)}</h3>
                        <p class="product-name">${product.name}</p>
                        <h4 class="product-price">$${product.price.currentPrice}</h4>
                        <p>${checkPrice(product.price.oldPrice)}</p>
                        <p>${checkCategories(product.categories)}</p>
                        ${checkAvailability(product.availability)}
                    </div>
                    <div class="actions">
                        <button class="add-to-cart" role="button">ADD TO CART</button>
                        <button role="button"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </div>
                `;
            }
            if(!data.length){
                html = `<p class="text-center w-100 margin-top">No available products</p>`;
            }
            $("#products-wrapper").html(html);
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

        function search(data){
            let searchValue = $("#search").val().toLowerCase();
            if(searchValue){
                return data.filter(function(el){
                    return el.name.toLowerCase().indexOf(searchValue) !== -1;
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
    }
}