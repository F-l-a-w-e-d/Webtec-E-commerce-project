$(function () {
    // submit function
    $("#addProduct").submit(function(e) {
        e.preventDefault();
        $("#errorMessage").html("");

        let isError = false;
        // put all the details into an object
        let product = {
            name: $("#name").val().trim(),
            description: $("#description").val().trim(),
            price: parseFloat($("#price").val()),
            discount: parseFloat($("#discount").val()),
            rarity: $("#rarity").val(),
            category: $("#category").val(),
            image: $("#image").val(),
            quantity: parseInt($("#quantity").val()) || 0,
            sold: 0,
            discountedPrice: null
        };

        // Restrictions
        if (product.name === "") {
            $("#errorMessage").append("<p>Please provide a name.</p>");
            isError = true;
        }

        if (product.price <= 0) {
            $("#errorMessage").append("<p>Price should not be less than or equal to 0.</p>");
            isError = true;
        }

        if (product.discount <= 0 || product.discount >= 1) {
            $("#errorMessage").append("<p>Discount should not be less than or equal to 0 and should not be more than or equal to 1.</p>");
            isError = true;
        }

        // Image url restriction
        isValidImageUrl(product.image, function(isValid) {
            if (!isValid && product.image != "") {
                $("#errorMessage").append("<p>Invalid image link.</p>");
                isError = true;
            }

            if (isError) { // If there are some errors
                $("#errorMessage").removeClass("d-none");
                return;
            }
            else {  // Creates the product
                product.discountedPrice = product.discount != null ? parseFloat((product.price - (product.price * product.discount)).toFixed(2)) : null;
                Create(product);
            }
        });
    });

    // GO back
    $("#backBtn").click(function() {
        window.location.href = "/Content/Pages/Admin/ProductList.html"
    });
});

function Create(product) {
    // puts the product into json server
    fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      }).then(r => {
        if (r.ok) {
            window.location.href = "/Content/Pages/Admin/ProductList.html";
            alert("Product added successfully!");
        }
        else {
            alert("Create failed.");
        }
      }).catch(e => alert(e));
}

// image restriction
function isValidImageUrl(url, callback) {
    const img = new Image();
    img.onload = function() {
        callback(true);
    };
    img.onerror = function() {
        callback(false);
    };
    img.src = url;
}