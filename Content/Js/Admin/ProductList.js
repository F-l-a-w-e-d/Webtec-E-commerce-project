$(function() {
    fetch("http://localhost:3000/products").then(response => response.json()).then(data => {
        data.forEach(d => {
            let id = "btn-" + d.id;
            $("#product-list-container").append(`
                    <div>
                    <p>${d["name"]}</p>
                    <ul>
                        <li>${d["description"]}</li>
                        <li>${d["price"]}</li>
                        <li>${d["rarity"]}</li>
                    </ul>

                    <button id="up-${id}">Update</button>
                    <button id="del-${id}">Delete</button>
                    </div>
                `);

            $("#up-" + id).click(function () {
                window.location.href = "Update.html?id=" + d.id;
            });

            $("#del-" + id).click(function () {
                // Add messagebox confirm delete.
                fetch("http://localhost:3000/products/" + d.id, {
                    method: "DELETE",
                }).then(alert("Data deleted successfully."))
                .catch(e => alert("Error: " + e));
            });
        });
    });

    $("#createProduct").click(function() {
        window.location.href = "Create.html";
    });
});

