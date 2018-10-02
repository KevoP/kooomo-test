export default function (){

    let productsEndpoint = 'http://interviews-env-1.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products';
    let searchEndpoint = 'http://interviews-env-1.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products?search=';
    let productList = []; // an array to store all products
    let searchField = document.querySelector('#search');
    let productContainer = document.querySelector('.product-container');
    let clearIcon = document.querySelector('#clear-icon');
    let searchInfo = document.querySelector('#search-info');

    clearIcon.addEventListener('click', function(){
        searchField.value = '';
        displayProducts(productList);
        hideAlert();
    });

    function displayAlert(message, type = 'warning'){
        let alertClass = `alert-${type}`;

        searchInfo.innerHTML = message;
        searchInfo.classList.add(alertClass);
        searchInfo.classList.remove('invisible');
    }

    function hideAlert(){
        searchInfo.classList.remove('alert-warning');
        searchInfo.classList.add('invisible');
    }

    function displayProducts(products){
        let searchTerm = searchField.value;
        let message = `${products.length} results found for ${searchTerm}`;
        
        // if not results
        if(products.length == 0 && searchTerm.length > 2){
            let message = `No results found for "${searchTerm}"`;
            displayAlert(message, 'warning');
            return;
        }

        

        let productHtml = products.map(product => {
            let productName = product.name;
            // replace description with dynamic content
            let productDescription = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua";

            let imageSrc = product.images.small;
            let productPrice = Number(product.price.sell).toFixed(2);
            let productDiscount = Number(product.price.to_discount).toFixed(2);

            let options = product.main_options;
            let colors = []
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    colors.push(options[key].name);
                }
            }

            let colorMarkup = `${colors.map(color => `<span class="color ${color}"></span>`).join('')}`

            let priceMarkup = (productDiscount > 0) ? 
                `<span class="price sale">&euro;${productPrice - productDiscount}</span><del><span class="price">&euro;${productPrice}</span></del>`: 
                `</span><span class="price">&euro;${productPrice}</span>`;

            return `<div class="col-md-4 col-xl-3">
                        <div class="product text-center">
                            <span class="favorite"></span>
                            <img src="${imageSrc}" alt="" class="img-fluid">
                            <div class="product-text">
                                <h2 class="product-title">${productName}</h2>
                                <p class="short-description">${productDescription.substring(0, 88) + '...'}</p>
                            </div>
                            <div class="prices">
                                ${priceMarkup}
                            </div>
                            <div class="more-colors">
                                <p class="text-uppercase">More Colors</p>
                                ${colorMarkup}
                            </div>
                        </div>
                    </div>`;
        }).join('');

        productContainer.innerHTML = productHtml;
        
        if(searchTerm.length > 2){
            displayAlert(message, 'success');    
        }
    }


    fetch(productsEndpoint)
        .then(blob =>blob.json())
        .then(products => {
            productList = products;
            displayProducts(products);
        })
        .catch(function(error){
            console.log(error);
            displayAlert('Oops! We have encountered a problem', 'warning');
        });

    function productSearch(){
        let searchTerm = this.value;
        if(searchTerm.length < 3){
            displayProducts(productList);
            return;
        }

        // if previously searched
        let cachedResults = sessionStorage.getItem(searchTerm) || false;

        if(cachedResults){
            console.log('retrieving from session storage');
            let products = JSON.parse(cachedResults);
            displayProducts(products);
            return;
        }

        fetch(searchEndpoint + searchTerm)
            .then(blob =>blob.json())
            .then(products => {
                console.log('retrieving from API');
                let cached = JSON.stringify(products)
                sessionStorage.setItem(searchTerm, cached);
                displayProducts(products);
            })
            .catch(function(error){
                console.log(error);
                displayAlert('Oops! We have encountered a problem', 'warning');
            });
        
    }

    searchField.addEventListener('keyup', productSearch);

};


