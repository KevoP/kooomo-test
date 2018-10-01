import 'bootstrap';
import './scss/app.scss';

let productsEndpoint = 'http://interviews-env-1.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products';
let searchEndpoint = 'http://interviews-env-1.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products?search=';
let productList = []; // an array to store all products
let searchField = document.querySelector('#search');
let productContainer = document.querySelector('.product-container');

function displayProducts(products){
    console.table(products[0]);

    let productHtml = products.map(product => {
        let productName = product.name;
        // replace description with dynamic content
        let productDescription = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua";

        let imageSrc = product.images.small;
        let productPrice = Number(product.price.sell).toFixed(2);
        let productDiscount = Number(product.price.to_discount).toFixed(2);
        let colors = ['red', 'blue', 'green']; //expand this

        let priceMarkup = (productDiscount > 0) ? 
            `<span class="price sale">&euro;${productPrice - productDiscount}</span><del><span class="price">&euro;${productPrice}</span></del>`: 
            `</span><span class="price">&euro;${productPrice}</span>`;

        return `<div class="col-md-4 col-lg-3">
                    <div class="product text-center">
                        <span class="favorite"></span>
                        <img src="${imageSrc}" alt="" class="img-responsive">
                        <h2 class="product-title">${productName}</h2>
                        <p class="short-description">${productDescription.substring(0, 88) + '...'}</p>
                        ${priceMarkup}
                        <p class="text-uppercase">More Colors</p>
                        <div class="colors">
                            <span class="color"></span>
                        </div>
                    </div>
                </div>`;
    }).join('');

    productContainer.innerHTML = productHtml;
}


fetch(productsEndpoint)
    .then(blob =>blob.json())
    .then(products => {
        productList = products;
        displayProducts(products);
    });

function productSearch(){
    let searchTerm = this.value;
    if(searchTerm.length < 3){
        displayProducts(productList);
        return;
    }

    fetch(searchEndpoint + searchTerm)
        .then(blob =>blob.json())
        .then(products => displayProducts(products));
    
}

searchField.addEventListener('keyup', productSearch);

