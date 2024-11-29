// get the product id of that certain item.
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let actualPrice = 0;
let prodQuantity = 1;
let existOnCart = false;
let totalQuantity = 0;

$(function() {
    let products = [];

    // get the data from json-server
    fetch("http://localhost:3000/products").then(response => response.json()).then(data => {
        data.forEach(d => {
            if (d.id == id) { // If it matches --> It is the certain product for details.
                let image = d.image != "" ? d.image : "/Content/images/Admin/placeholder.png";

                let priceHtml = `${d.discountedPrice || d.price}`;
                    priceHtml += d["discount"] != null ? `<span class="pl-2" style="color:red; font-size:17px;"><del>$${d.price}</span>` : '';
                    
                if (d.quantity == 0) {
                    $("#addCart").attr('disabled', true);
                    $("#addCart").addClass('btn-sold-out');
                    $("#quantitySection").hide();
                    $(".sold-image-detail").addClass('is-sold-out');
                }

                actualPrice = d.discount != null ? d.discountedPrice : d.price;
                totalQuantity = d.quantity;
               
                $("#prodId").val(d.id);
                $("#image").attr("src", image);
                $("#image").attr("alt", d.name);
                $("#name").text(d.name);
                $("#category").text(d.category);
                $("#desc").text(d.description);
                $("#price").html("$" + priceHtml)
                $("#rarity").append(` ${d.rarity}`);
                $("#quantity").append(` ${d.quantity}`);
                $("#sold").append(` ${d.sold}`);
                $("#total").text("$" + actualPrice);
                $("title").text(d.name + " Details");
            }
            else { // For displaying products below.
                products.push(d);
            }
        });

        // checks if that product exists on the cart.
        fetch("http://localhost:3000/carts").then(r => r.json()).then(data => {
           for (let i of data) {
                if (i.productId == $("#prodId").val()) {
                    existOnCart = true;
                }
            }
        });

        // Displays some products below.
        products.forEach(d => {
            let priceHtml = `<span class="price-tag">$${d["discountedPrice"] || d["price"]}</span> `;
            priceHtml += d["discount"] != null ? `<span style="color:red; font-size:17px;"><del>$${d["price"]}</del></span>` : "";

            let image = d.image != "" ? d.image : "/Content/images/Admin/placeholder.png";
            let id = "btn-" + d.id;

            $("#more_product").append(`
            <div class="col-md-3 mb-3 r-${d["rarity"]} rarity">
                    <div class="card h-100">
                        <div class="card-body" id="view-${id}">
                            <h5 class="card-title">${d["name"]}</h5>
                             <div class="img-wrapper">
                                <img class="img-fluid" src="${image}" alt="${d.name}">
                                <div class="img-sold sold-image ${d["quantity"] == 0 ? 'is-sold-out' : ''}"></div>
                             </div>
                            <h6 class="card-text">${d["category"]}</h6>
                            <p class="card-text">${d["description"]}</p>
                            <ul class="list-unstyled">
                                <li>Price: ${priceHtml}</li>
                                <li>${d["sold"]} Sold(s)</li>
                            </ul>
                        </div>  
                    </div>
                </div>
            `);

            // View details of that product.
            $("#view-" + id).click(function () {
                window.location.href = "ViewProduct.html?id=" + d.id;
            });
        })
    });

    // Quantity restrictions
    $("#prodQty").on('input', function () { 
        if ($(this).val() == 0) {
            prodQuantity = 1;
            $(this).val(prodQuantity);

            $("#total").text(calcTotal());
            return;
        }

        $(this).val($(this).val().replace(/[^0-9]/g, ''));

        if ($(this).val() == "") {
            $(this).val(1);
        }

        prodQuantity = parseInt($(this).val());
        $("#total").text(calcTotal());
    });

     // Quantity restrictions
    $("#prodQty").change(function() {
        if (prodQuantity > totalQuantity) {
            $(this).val(0);
            $(this).trigger('input');
        }
    });

     // Quantity restrictions - minus
    $("#subQty").click(function() {
        if (prodQuantity != 1) {
            prodQuantity--;
            $("#prodQty").val(prodQuantity);
            $("#total").text(calcTotal());
        }
    });

     // Quantity restrictions - add
    $("#addQty").click(function() {
        if (prodQuantity < totalQuantity) {
            prodQuantity++;
            $("#prodQty").val(prodQuantity);
            $("#total").text(calcTotal());
        }
    });

    // Adds the product to cart
    $("#addCart").click(function() {
        let cartDetails = {
            productId: $("#prodId").val(),
            quantity: parseInt($("#prodQty").val()),
            total: parseFloat(calcTotal().replace('$', ''))
        };

        if (existOnCart) {
            updateExistingCart(cartDetails);
        }
        else {
            addToCart(cartDetails);
        }
    });
})

// calculate total value.
function calcTotal() {
    return "$" + (actualPrice * prodQuantity).toFixed(2);
}

// adds product to cart
function addToCart(cartDetails) {
    fetch('http://localhost:3000/carts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartDetails)
    }).then(r => {
        if (r.ok) {
            alert('Added to cart successfully.');
        }
        else {
            alert('Failed to add to cart.');
        }
    });
}

// adds product to existing cart of that certain product
function updateExistingCart(cartDetails) {
    fetch('http://localhost:3000/carts').then(r => r.json()).then(data => {
        data.forEach(d => {
            if (d.productId == cartDetails.productId) {
                if (cartDetails.quantity + d.quantity > totalQuantity) {
                    alert('Amount Exceeeded');
                    return;
                }

                cartDetails.quantity += d.quantity;
                cartDetails.total = parseFloat((cartDetails.quantity * actualPrice).toFixed(2));

                fetch('http://localhost:3000/carts/' + d.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartDetails)
                }).then(r => {
                    if (r.ok) {
                        alert('Added to existing cart successfully.');
                        return;
                    }
                    else {
                        alert('Failed to add to cart.');
                    }
                });
            }
        });
    });
}