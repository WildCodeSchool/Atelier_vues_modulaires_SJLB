/*Animation sur le formualire de contact */
var pathname = window.location.hash;

$(document).ready(function(){

setTimeout(function (){

	if(pathname != "" && $(pathname).find("h3").hasClass("liendetail")){
		$(pathname).find(".complet").show('slow');
		$(pathname).find(".preview").hide('slow');
		}
	},1000);
	
var blocage = 0;
$("#menu > ul > li").click(function(event){
	if (blocage!=$(this).attr("id")) { 
		blocage=$(this).attr("id");
		$("#menu > ul > li > div").hide();
		$(this).find("div").show();
	}
	else blocage=0;
});

$("#header, #encartRecherche, #content, #footer, #animationflash").click(function(event){
	$("#menu > ul > li > div").hide();
	blocage=0;
});

$("#menu > ul > li").hover(function(event){
if (blocage==0) $(this).find("div").show();
},function(event){
if (blocage==0) $(this).find("div").hide();
});



if ($("#planSite").size() != 0) {
	$("#planSite").html($("#planSite").html().replace(/<br>/g,' '));
	$("#planSite").html($("#planSite").html().replace(/<h2>/g,' '));
	$("#planSite").html($("#planSite").html().replace(/<\/h2>/g,' '));
	$("#planSite img").remove();
} 

$(".lienNiv4").click(function(event){
	if ($(this).parent().next().is(':hidden')) {
		$(".niveau4").hide('slow');
		$(this).parent().next().show('slow');
	} else {
		$(".niveau4").hide('slow');
	}
	event.preventDefault(); 
});

$(".liendetail").click(function(event){
	if ($(this).parent().find(".preview").is(':hidden')) {
		$(this).parent().find(".complet").hide('slow');
		$(this).parent().find(".preview").show('slow');
	} else {
		$(this).parent().find(".complet").show('slow');
		$(this).parent().find(".preview").hide('slow');
	}
	event.preventDefault(); 
});

var pair=0;
$("#texte").children().each(function(){
	if ($(this).is('h2')) {pair=0;}
	else if ($(this).hasClass('elu')) {
		if (pair==0) {
			pair=1;
			$(this).css('clear','both');
		} else {
			pair=0
		}
		
	}
});


});

