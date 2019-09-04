// $(function(){
//     $(document).scroll(function(){
//       var $nav = $("#mainFooter");
//       $nav.toggleClass("fixed-bottom", $(this).scrollTop()<$nav.height());
//     });
// });

$("#likeButton").on("click", function(){
    $("#likeSpan").toggleClass("badge-success");
});
