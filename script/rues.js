jQuery(document).ready(function(){	
	
	jQuery('#searchNomRues').autocomplete({
			source: dataRuesAutoComplete
	});
	
	// on masque tous les lieux
	jQuery('a[href=#tabs-2]').click(function(){ 
		if (ongletActifOld=='lieux') razLieux();
		if (ongletActifOld=='plans') razPlans();
		ongletActifOld = 'rues';	
	});
	
	// bouton OK de recherche de lieux
	// bouton OK de recherche de lieux
	jQuery('#btnSearchRue').click(function(){
		searchRue();
	});	
	//click sur lien dans liste
	jQuery('ul.ui-autocomplete li a').live("click",function(){
		if (!jQuery('#tabs-2').hasClass('ui-tabs-hide')) { searchRue(); }
	});	
	//entrée sans saisie
	jQuery('#searchNomRues').keydown(function(event){
		jQuery("#searchNomRues").autocomplete({
			source: "ajax/rues.php?mot="+escape(jQuery("#searchNomRues").val())
		});
		if (event.keyCode == '13') { searchRue(); }
	});	
	jQuery('#searchNomRues').keyup(function(event){
		/*jQuery.ajax({
			type: "GET",
			async: false,
			url:"ajax/rues.php?mot="+jQuery('#searchNomRues').val(),
			success: function(data, textStatus)
			{
				dataRuesAutoComplete = data;
				//alert(dataRuesAutoComplete);
				jQuery('#searchNomRues').autocomplete({source:data});
			}
		});*/
		jQuery(this).autocomplete("option","source","ajax/rues.php?mot="+escape(jQuery('#searchNomRues').val()));
		//jQuery(this).autocomplete({source:"ajax/rues.php?mot="+jQuery('#searchNomRues').val()});
	});
	
	function searchRue() {
		
		jQuery.ajax({
			type: "POST",
			async: false,
			url:"ajax/rues-select.php",
			data:"mot="+jQuery('#searchNomRues').val(),
			success: function(data, textStatus)
			{
				if( data == "" )
				{
					//alert('La rue recherchée n\'existe pas, veuillez effectuer une autre recherche');
					// attention spécifique
					//alert('Le moteur n’a pas trouvé de rue correspondant aux données que vous avez entrées. Nous vous invitons à contacter le service Qualité Déchets par téléphone : 02 38 56 90 00 ou par courriel : qualitedechets@agglo-orleans.fr.');
					return false;
				}
				else
				{
					var geocoder = new google.maps.Geocoder();
					
					//var libTypeNomRue = jQuery('#searchNomRues').val();
					var data_temp = data.split('|');
					var libTypeNomRue = data_temp[0]+','+data_temp[1];
					var data = '<h2>'+data_temp[0]+'</h2><p>'+data_temp[1]+'</p><p>'+data_temp[2]+'</p>';
					
					//var CpRue = jQuery('#CodepostalRues').val();
					//var VilleRue = jQuery('#VilleRues').val();
					//var PaysRue = 'France';
					var addresse = libTypeNomRue+', France';
					
					if (geocoder) 
						{
								geocoder.geocode( { 'address': addresse}, function(results, status) 
								{
									if (status == google.maps.GeocoderStatus.OK) 
									{
										if(tableauRues.length == 1)
											tableauRues[0].setMap();
										
										map.setCenter(results[0].geometry.location);
										point = results[0].geometry.location; 
											
										marqueurRue = new google.maps.Marker({
											'position': point,
											'map': map,
											'title': addresse,
											'icon' : new google.maps.MarkerImage(url_carto_picto+"info.png"),
											'visible' : true
										});
										
										tableauRues[0] = marqueurRue;
										
										infoWindow.close(); 
										infoWindow.setContent(data+'<p>&nbsp;</p><p>&nbsp;</p>'); //ajout paragraphe vide pour parer à un problème de scroll de google map V3
										infoWindow.open(map, tableauRues[0]);
									} 
									else 
									{
											alert("Geocode was not successful for the following reason: " + status);
									}
								});
						}
				}
				return true;
			}
		});
	
	}
	
});

function razRues()
{
	if(tableauRues.length == 1)
	{
		tableauRues[0].setVisible(true);
		tableauRues[0].setMap();
		tableauRues = [];
	}
}