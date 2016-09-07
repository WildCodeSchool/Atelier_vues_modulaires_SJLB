// Fonctions générant la carte google
function initialization() 
{
	var options = {
		zoom: niveauCarte,
		center: positionInit,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		navigationControl: true,
		navigationControlOptions: {
			style: google.maps.NavigationControlStyle.ZOOM_PAN
		},
		mapTypeControl: true,
	    mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
	    },
	    scaleControl: true
	}
	
	map = new google.maps.Map(document.getElementById('map'), options);
	
	google.maps.event.addListener(map, 'zoom_changed', function() {
		level = map.getZoom();
		changeZoom(level);   
	});
	
	miniMap();
}

function miniMap() {
	
	var myOptions = {
		zoom: Math.max(map.getZoom() - 4, 0),
		center: positionInit,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
	};
	carteMini = new google.maps.Map(document.getElementById("overlay_map"), myOptions);
	
	
	google.maps.event.addListener(map, 'zoom_changed', function() {
		var newZoom = Math.max(map.getZoom() - 4, 0);
		if (carteMini.getZoom() != newZoom) carteMini.setZoom(newZoom);
	});
	google.maps.event.addListener(carteMini, 'zoom_changed', function() {
		var newZoom = carteMini.getZoom() + 4;
		if (map.getZoom() != newZoom) map.setZoom(newZoom);
	});
	
	carteMini.bindTo('center', map, 'center');

	var overDiv = carteMini.getDiv();
	map.getDiv().appendChild(overDiv);
	overDiv.style.position = "absolute";
	overDiv.style.right = "0px";
	overDiv.style.bottom = "14px";
	overDiv.style.zIndex = 10;
	
	var maskMini = document.createElement('DIV');
  	maskMini.style.backgroundColor = '#666666';
	maskMini.style.opacity = 0.5;
  	maskMini.title = 'Zone visualisée';
	maskMini.style.zIndex = 11;
	maskMini.style.position = "relative";
	maskMini.style.left = "47px";
	maskMini.style.top = "47px";
	maskMini.style.width = "36px";
	maskMini.style.height = "36px";
  	overDiv.appendChild(maskMini);
	
	google.maps.event.addListener(carteMini, 'idle', function() {
		carteMini.getDiv().style.zIndex = 10;
	});
}

jQuery(document).ready(function(){
	var etatPanel = 'ouvert';
	
	// Init des categ Plans
	jQuery('ul#listePlans').children('li').children('label').nextAll('ul').hide();
	
	// AFFICHER / MASQUER les listes de lieux dans le panneau latéral
	jQuery('ul#listeLieux li label').click(function(){
		jQuery(this).nextAll('ul').toggle('fast');
		
		if(jQuery(this).nextAll('img').attr('alt') == 'bas')
		{
			jQuery(this).nextAll('img').attr('alt','haut');
			jQuery(this).nextAll('img').attr('src',url_carto_img+'haut.gif');
		}
		else
		{
			jQuery(this).nextAll('img').attr('alt','bas');
			jQuery(this).nextAll('img').attr('src', url_carto_img+'bas.gif');
		}
	});
	
	jQuery('ul#listeLieux li img').click(function(){
		jQuery(this).nextAll('ul').toggle('fast');
		
		if(jQuery(this).attr('alt') == 'bas')
		{
			jQuery(this).attr('alt','haut');
			jQuery(this).attr('src',url_carto_img+'haut.gif');
		}
		else
		{
			jQuery(this).attr('alt','bas');
			jQuery(this).attr('src', url_carto_img+'bas.gif');
		}
	});
	
	
	/*
	jQuery('ul#listePlans li ul label').click(function(){
		jQuery(this).nextAll('ul').toggle('fast');
	});
	*/
	
	
	// AFFICHER / MASQUER les listes des lieux/plans dans le panneau latéral
	jQuery('ul#listePlans li label').click(function(){
		
		/*
		if( jQuery(this).nextAll('ul').css('display') == 'none' )
		{
			if( getChkValue( jQuery(this).prev('div').attr('class') ) == 0 )
			{
				razChk();
				setDivChkValue(jQuery(this).prev('div'));
				updateChkEnfants(jQuery(this).prev('div'));
			}
		}
		*/
		
		// SPECIFICITE PLAN - on ferme tous les noeuds principaux
		//jQuery('ul#listePlans').children('li').children('ul').hide('fast');
		
		// si action sur le noeud prinicpale --> erase all
		
		if (jQuery(this).prev('div').children('input').attr('class') == 'categ main' && getChkValue(jQuery(this).prev('div').attr('class')) == '0'){
			jQuery(this).prev('div').click();
		}
		else{
			jQuery(this).nextAll('ul').toggle('fast');
			
			if(jQuery(this).nextAll('img').attr('alt') == 'bas')
			{
				jQuery(this).nextAll('img').attr('alt','haut');
				jQuery(this).nextAll('img').attr('src',url_carto_img+'haut.gif');
			}
			else
			{
				jQuery(this).nextAll('img').attr('alt','bas');
				jQuery(this).nextAll('img').attr('src', url_carto_img+'bas.gif');
			}
		}
	});
	
	jQuery('ul#listePlans li img').click(function(){
		
		/*
		if( jQuery(this).nextAll('ul').css('display') == 'none' )
		{
			if( getChkValue( jQuery(this).prev('div').attr('class') ) == 0 )
			{
				razChk();
				setDivChkValue(jQuery(this).prev('div'));
				updateChkEnfants(jQuery(this).prev('div'));
			}
		}
		*/
		
		if (jQuery(this).prevAll('div').children('input').attr('class') == 'categ main' && getChkValue(jQuery(this).prevAll('div').attr('class')) == '0'){
			jQuery(this).prevAll('div').click();
		}
		else{
		
			// SPECIFICITE PLAN - on ferme tous les noeuds principaux
			//jQuery('ul#listePlans').children('li').children('ul').hide('fast');
					
			jQuery(this).nextAll('ul').toggle('fast');
			
			if(jQuery(this).attr('alt') == 'bas')
			{
				jQuery(this).attr('alt','haut');
				jQuery(this).attr('src',url_carto_img+'haut.gif');
			}
			else
			{
				jQuery(this).attr('alt','bas');
				jQuery(this).attr('src', url_carto_img+'bas.gif');
			}
		}
	});
	
	
	// AFFICHER / MASQUER le panneau latéral
	jQuery('a#aFermer').click(function(){
		if(etatPanel == 'fermer')
		{
			etatPanel = 'ouvert';
			jQuery('#cartoPanel').css('width','303px');
			jQuery('#tabs').css('display','block');
			jQuery('#btnFermer').removeClass('close');
			jQuery('#map').css('margin-left','279px');
			jQuery('#map').css('width',(jQuery('#map').width()-279)+'px');
		}
		else
		{
			etatPanel = 'fermer';
			jQuery('#cartoPanel').css('width','24px');
			jQuery('#tabs').css('display','none');
			jQuery('#btnFermer').addClass('close');
			jQuery('#map').css('margin-left','0');
			jQuery('#map').css('width',(jQuery('#map').width()+279)+'px');
		}
		return false;
	});
	
	//désactivation des plan s'il n'y en a pas
	/*if (jQuery('ul#listePlans input:checkbox').size()==0) {
		jQuery('#tabs ul.first').children().next().next().html(jQuery('#tabs ul.first').children().next().next().text());
		jQuery('#tabs-3').css("display","none");
	}*/
	
	//fermer par défaut
	function initClose() {
		jQuery('a#aFermer').click();jQuery('#map').css('width',(jQuery('#map').width()-279)+'px');
	}
	setTimeout(initClose,2000);
	
	// Gestion du style des onglets
	jQuery('div#tabs ul li a').click(function(){
		var self = jQuery(this);
		var ongletActif = self.attr("class");
		var classes = jQuery(this).parent('li').parent('ul').attr('class');
		var tabClasses = classes.split(' ');
		var nbre = tabClasses.length-1;
		var laclass = tabClasses[nbre];
		if( laclass.indexOf('actif') != -1)
			jQuery(this).parent('li').parent('ul').removeClass( laclass );
		jQuery(this).parent('li').parent('ul').addClass(ongletActif+'_actif');
	});
	
	// modification du menu principale en fonction de la taille du texte
	var i=0;
	var tailleAll = 0;
	var taille = new Array();
	var TailleTotalMenu = 150;

	jQuery('ul.first li').each(function(){
		taille[i] = $(this).children('a').children('span').html().length;
		tailleAll = tailleAll + taille[i];	
		i++;
	});

	for (i=0; i<3; i++){
		taille[i] =	Math.round(taille[i]/tailleAll*TailleTotalMenu);
		if (taille[i] > '80'){
			taille[i] = 80;
		}
		if (taille[i] < '10'){
			taille[i] = 10;
		}
	}

	jQuery('ul.first li.li-lieux a').width(taille[0]);
	jQuery('ul.first li.li-rues a').width(taille[1]);
	jQuery('ul.first li.li-plans a').width(taille[2]);
	
		
	
});