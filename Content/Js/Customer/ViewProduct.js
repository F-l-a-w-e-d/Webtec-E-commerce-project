const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let actualPrice = 0;
let prodQuantity = 1;

$(function() {
    let products = [];

    fetch("http://localhost:3000/products").then(response => response.json()).then(data => {
        data.forEach(d => {
            if (d.id == id) {
                let image = d.image != "" ? d.image : "/Content/images/Admin/placeholder.png";

                let priceHtml = `${d.discountedPrice || d.price}`;
                    priceHtml += d["discount"] != null ? `<span class="pl-2" style="color:red; font-size:17px;"><del>$${d.price}</span>` : '';
                    
                actualPrice = d.discount != null ? d.discountedPrice : d.price;

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
            }
            else {
                products.push(d);
            }
        });

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
                                <div class="sold-image ${d["quantity"] == 0 ? 'is-sold-out' : ''}"></div>
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

            $("#view-" + id).click(function () {
                window.location.href = "ViewProduct.html?id=" + d.id;
            });
        })
    });

    $("#prodQty").on('input', function () { 
        if ($(this).val() == 0) {
            prodQuantity = 1;
            $(this).val(prodQuantity);

            $("#total").text(calcTotal());
            return;
        }

        $(this).val($(this).val().replace(/[^0-9]/g, ''));
        prodQuantity = parseInt($(this).val());
        $("#total").text(calcTotal());
    });

    $("#subQty").click(function() {
        if (prodQuantity != 1) {
            prodQuantity--;
            $("#prodQty").val(prodQuantity);
            $("#total").text(calcTotal());
        }
    });

    $("#addQty").click(function() {
        prodQuantity++;
        $("#prodQty").val(prodQuantity);
        $("#total").text(calcTotal());
    });

    $("#addCart").click(function() {
        let cartDetails = {
            productId: $("#prodId").val(),
            quantity: parseInt($("#prodQty").val()),
            total: parseFloat(calcTotal().replace('$', ''))
        };
    
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
    });
})

function calcTotal() {
    return "$" + (actualPrice * prodQuantity).toFixed(2);
}