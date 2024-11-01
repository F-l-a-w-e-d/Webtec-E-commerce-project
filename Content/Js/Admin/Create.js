$(function () {
    $("#addProduct").submit(function(e) {
        e.preventDefault();
        $("#errorMessage").html("");

        let isError = false;
        let product = {
            name: $("#name").val(),
            description: $("#description").val(),
            price: parseFloat($("#price").val()),
            discount: parseFloat($("#discount").val()),
            rarity: $("#rarity").val(),
            //image: json.stringify($("#image")[0].files[0])
        };

        if (product.price <= 0) {
            $("#errorMessage").append("<p>Price should not be less than or equal to 0.</p>");
            isError = true;
        }

        if (product.discount <= 0 || product.discount >= 1) {
            $("#errorMessage").append("<p>Discount should not be less than or equal to 0 and should not be more than or equal to 1.</p>");
            isError = true;
        }

        if (isError) {
            return;
        }

        console.log(product);
        Create(product);
    });
});

function Create(product) {
    fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      }).then(r => r.json()).then(d => alert("Data added successfully!"))
      .catch(e => alert(e));
}