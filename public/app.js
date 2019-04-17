$.get("/articles", function(data){
    console.log(data);
    data.forEach(element => {
        let card = $("<div>");
        let cardbody= $("<div>");
        let headline = $("<a>");
        let summary =  $("<p>");
        let form = $("<form>")
        let input = $("<input>");
        let commentBtn = $("<button>");
        let comArea = $("<div>")
        //display articles
        card.addClass("card");
        cardbody.addClass("card-body");
        headline.addClass("card-title");
        summary.addClass("card-text");
        headline.attr("href", element.link);
        headline.text(element.headline);
        summary.text(element.summary);
        cardbody.append(headline);
        cardbody.append(summary);
        card.append(cardbody);
        //display comment area
        input.attr("type", "text");
        input.addClass("comment");
        commentBtn.attr("type", "submit");
        commentBtn.attr("data-id", element._id);
        commentBtn.addClass("comment-submit");
        commentBtn.text("Add a comment")
        comArea.text("Comments:")
        if (element.comment){
            for(let i = 0; i < element.comment.length; i++){
                console.log(i);
                let com = $("<p>");
                com.text(element.comment[i].body);
                comArea.append(com);
                card.append(comArea);
            }

        }
        form.append(input);
        form.append(commentBtn);
        card.append(form);
        $("#article-area").append(card);
    });
})


$(document).on("click", ".comment-submit", function(event){
    event.preventDefault();
    id = $(this).attr("data-id");
    comment = $(".comment").val();
    if(comment)
    {
        $.post("/comment/"+id, {body:comment}, function(data){
            console.log(data);
        })
        $(".comment").val("");
        location.reload();
    }
    else alert("please write a comment");
})
$(document).on("click","#scrape" ,function(event){
    event.preventDefault();
    $.get("/scrape", function(data){
    })
    location.reload();

})