$(function () {
    $("#addProduct").submit(function(e) {
        e.preventDefault();
        $("#errorMessage").html("");

        let isError = false;
        let product = {
            name: $("#name").val().trim(),
            description: $("#description").val().trim(),
            price: parseFloat($("#price").val()),
            discount: parseFloat($("#discount").val()),
            rarity: $("#rarity").val(),
            category: $("#category").val(),
            image: $("#image").val()
        };

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

        isValidImageUrl(product.image, function(isValid) {
            if (!isValid && product.image != "") {
                $("#errorMessage").append("<p>Invalid image link.</p>");
                isError = true;
            }

            if (isError) {
                $("#errorMessage").removeClass("d-none");
                return;
            }
            else {  
                Create(product);
            }
        });
    });

    $("#backBtn").click(function() {
        window.location.href = "/Content/Pages/Admin/ProductList.html"
    });
});

function Create(product) {
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