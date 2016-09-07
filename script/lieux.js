jQuery(document).ready(function(){
	/****************************
 	 *		INITIALISATION 		*
 	 ****************************/
	// Initialisation des markers	
	jQuery.ajax({
		type: "POST",
		async: false,
		url:urlBase+"ajax/marker-init.php",
		success: function(data, textStatus)
		{
			eval(data);
			var url=document.location+"";
			var nivzoom=url.indexOf('Zoom=',1);
			if(nivzoom>0) {
				var valnivzoom = parseInt(url.substring(nivzoom+5,url.length));
				map.setZoom(valnivzoom);
			}
			var pos=url.indexOf('IdLieu=',1);
			if(pos>0) {
				var idLieu = parseInt(url.substring(pos+7,url.length)).toString();
				map.setCenter(tableauMarqueurs[idLieu].marqueurPosition);
				if(! jQuery('#lieu_'+idLieu).attr('checked')) {
					jQuery('#lieu_'+idLieu).attr('checked','checked');
					jQuery('#lieu_'+idLieu).change();
				}
				updateInfoWindow('<h2>'+tableauMarqueurs[idLieu].marqueurNom.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'</h2>'+tableauMarqueurs[idLieu].marqueurContenu.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;"), idLieu);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) 
		{
			//alert(XMLHttpRequest+'-'+textStatus+'-'+errorThrown); // the options for this ajax request
		}
	});
	
	// Initialisation des checkbox (à 3 états)
	jQuery('ul#listeLieux input:checkbox.categ').each(function(){
		var self = jQuery(this);
		self.css('display','none');
		
		var id		= self.attr('id');
		var name	= id;
		var value	= self.val();
		
		self.wrap('<div class="myCheckbox1" id="'+id+'" name="'+name+'" value="'+value+'" title="'+titleMyCheckbox1+'" />');
		
		// initialisation du nombre d'�l�ments coch�s initialement --> modification de l'�tat de la checkbox parent en conc�quence
		calculNbChkbox( jQuery('div#'+id).next().next().next() );
		
		// on attache l'evenement click pour changer l'état de la coche
		self.parent('div#'+id).bind('click', function(){

			var self2 = jQuery(this);
			var chkValue = getChkValue( self2.attr('class') );
			var newChkValue = ( parseInt(chkValue) + 2 ) < 3 ? ( parseInt(chkValue) + 2 ) : 0;
			var laclass = 'myCheckbox'+newChkValue;
			var letitre = eval('titleMyCheckbox'+newChkValue);

			self2.attr('class',laclass);
			self2.attr('title',letitre);
			
			// mise à jours des chk enfants
			updateChkEnfants( self2 );
			
			calculNbChkbox( self2.next().next().next() );
			
			// action au niveau des checkbox --> la fonction zoom est d�sactiv�e
			zoomActiv = false;
			
		});
		
		// modif Damien 14/12/2010
		// on attache l'evenement click pour desactiver l'action du zoom sur la selection des lieux
		self.parent().next().next().next().children('li').children('div').bind('click', function(){

			// action au niveau des checkbox --> la fonction zoom est d�sactiv�e
			
			if (zoomActiv == true){
				
				jQuery("ul#listeLieux").find('div.myCheckbox0').each(function(){
					var self2 = jQuery(this); 
					self2.attr('title','');
				})
				jQuery("ul#listeLieux").find('div.myCheckbox1').each(function(){
					var self2 = jQuery(this); 
					self2.attr('title','');
				})
				jQuery("ul#listeLieux").find('div.myCheckbox2').each(function(){
					var self2 = jQuery(this); 
					self2.attr('title','');
				})
			}
			
			zoomActiv = false;
			
		});
		// fin modif Damien 14/12/2010
		
	});	
	
	// init champ autocomplete
	jQuery("#searchNomLieux").autocomplete({
		source: dataLieuxAutoComplete
	});
	
	/************************
 	 *		EVENEMENTS 		*
 	 ************************/
	// on masque tous les plans
	jQuery('a[href=#tabs-1]').click(function(){					
		if (ongletActifOld=='plans') razPlans();
		if (ongletActifOld=='rues') razRues();
		ongletActifOld = 'lieux';
		jQuery('ul#listeLieux input:checkbox').each(function(){
			if (memoireCheck[jQuery(this).attr('id')]=="check") {
				jQuery(this).attr('checked','checked');
				memoireCheck[jQuery(this).attr('id')]=null;
			}
		});
		jQuery('ul#listeLieux input:checkbox.categ').each(function(){
			jQuery(this).parent('div').attr('class',memoireClass[jQuery(this).attr('id')]);
			memoireClass[jQuery(this).attr('id')]=null;
		});
		jQuery('ul#listeLieux input:checkbox').change();
		changeZoom(map.getZoom());
	});
	
	jQuery(".ui-autocomplete").attr('style','display:none;max-height:417px;overflow:hidden;');
	
	// bouton OK de recherche de lieux
	jQuery('#btnSearch').click(function(){
		searchLieu();
	});	
	//click sur lien dans liste
	jQuery('ul.ui-autocomplete li a').live("click",function(){
		if (!jQuery('#tabs-1').hasClass('ui-tabs-hide')) { searchLieu(); }
	});	
	//entrée sans saisie
	jQuery('#searchNomLieux').keydown(function(event){
		if (event.keyCode == '13') { searchLieu(); }
	});	
	
	function searchLieu() {
		if( !js_in_array(jQuery('#searchNomLieux').val(), dataLieuxAutoComplete) )
		{
			alert('Le lieu recherché ne figure pas dans la liste, veuillez effectuer une autre recherche');
			return false;
		}
		else
		{
			var idLieu = getIdLieu(jQuery('#searchNomLieux').val());
			if(!isNaN(idLieu))
			{
				jQuery('#lieu_'+idLieu).attr('checked','checked');
				jQuery('#lieu_'+idLieu).change();

				updateInfoWindow('<h2>'+tableauMarqueurs[idLieu].marqueurNom.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'</h2>'+tableauMarqueurs[idLieu].marqueurContenu.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;"), idLieu);
			}
		}
		return true;
	}
	
	// Checkbox Lieux
	jQuery('ul#listeLieux input:checkbox.lieu').change(function(){
		var self = jQuery(this);
		id = self.val();
		
		//alert(jQuery(this).parent('div').parent('div').attr('id'));

		if(self.attr('checked') == true)
		{
			self.attr('title','Cliquez pour masquer le lieu');
			tableauMarqueurs[id].setVisible(true);
			if( self.parent().next('label').children('a').size() < 1 ) {
				var lien = '<a href="javascript:updateInfoWindow(\'<h2>'+tableauMarqueurs[id].marqueurNom.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'</h2>'+tableauMarqueurs[id].marqueurContenu.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'\', '+id+');" title="Cliquez pour identifier le lieu sur la carte">'+self.parent().next('label').html()+'</a>';
				self.parent().next('label').html(lien);
			}
		}
		else
		{
			self.attr('title','Cliquez pour afficher le lieu');
			if (tableauMarqueurs[id]!=undefined) tableauMarqueurs[id].setVisible(false);
			if( self.parent().next('label').children('a').size() == 1 )
			{
				self.parent().next('label').html( self.parent().next('label').children('a').html() ).children('a').remove();
			}
			infoWindow.close();
		}
		
		// Calcul du nbre de chkbox coché
		calculNbChkbox(self.parent().parent().parent());
	});
});

/************************
 *		FONCTIONS 		*
 ************************/
function razPlans()
{
	jQuery('ul#listePlans input:checkbox:checked').removeAttr('checked');
	jQuery('ul#listePlans input:checkbox.categ').removeAttr('checked');
	jQuery('ul#listePlans input:checkbox.categ').parent('div').attr('class',"myCheckbox0");
	jQuery('ul#listePlans input:checkbox').change();
}

// updateTitle(_EltChkbox) 
// _EltChkbox : <input type="checkbox" class="lieu"/>
function updateTitle(_EltChkbox)
{
		
	var nbLieu = _EltChkbox.find('input:checkbox:checked').size();
	_EltChkbox.prev().prev().children('span.nbLieu').html(nbLieu);
	switch(_EltChkbox.prev().prev().children('span.nbLieu').html()){
		case '0':
				var laclass = 'myCheckbox0';
				var letitre = eval('titleMyCheckbox0');
			break;
		case _EltChkbox.prev().prev().children('span.nbLieuMax').html():
				var laclass = 'myCheckbox2';
				var letitre = eval('titleMyCheckbox2');
			break;
		default:
				var laclass = 'myCheckbox1';
				var letitre = eval('titleMyCheckbox1');
			break;
	}
	var self_div = _EltChkbox.prev().prev().prev();

	self_div.attr('class',laclass);
	self_div.attr('title',letitre);

	
	if (_EltChkbox.parent().parent().prev().prev().children('span').hasClass('nbLieu')) { calculNbChkbox(_EltChkbox.parent().parent()) }
}

//calculNbChkbox(_EltChkbox)
//_EltChkbox : <ul>
function calculNbChkbox(_EltChkbox)
{
		
	var nbLieu = _EltChkbox.find('input:checkbox:checked').size();
	_EltChkbox.prev().prev().children('span.nbLieu').html(nbLieu);
	switch(_EltChkbox.prev().prev().children('span.nbLieu').html()){
		case '0':
				var laclass = 'myCheckbox0';
				var letitre = eval('titleMyCheckbox0');
			break;
		case _EltChkbox.prev().prev().children('span.nbLieuMax').html():
				var laclass = 'myCheckbox2';
				var letitre = eval('titleMyCheckbox2');
			break;
		default:
				var laclass = 'myCheckbox1';
				var letitre = eval('titleMyCheckbox1');
			break;
	}
	var self_div = _EltChkbox.prev().prev().prev();

	self_div.attr('class',laclass);
	self_div.attr('title',letitre);

	
	if (_EltChkbox.parent().parent().prev().prev().children('span').hasClass('nbLieu')) { calculNbChkbox(_EltChkbox.parent().parent()) }
}

function getIdLieu(_strLibLieu)
{
	for(x in tableauMarqueurs)
	{
		if( !isNaN(x))
		{
			if( tableauMarqueurs[x].marqueurNom.toUpperCase() == _strLibLieu.toUpperCase() )
			{
				return tableauMarqueurs[x].marqueurId;
			}
		}
	}
	return false;
}

function js_in_array(_val, _array)
{
	var retour = false;
	for(i in _array)
	{
		if(_array[i].toUpperCase() == _val.toUpperCase())
		{
			retour = true;
			break;
		}
	}
	return retour;
}

function updateChkEnfants( _oDivChk )
{

	switch( getChkValue(_oDivChk.attr('class') ) )
	{

		// Vide : on décoche tout
		case "0" :
			jQuery('#'+_oDivChk.attr('id')).parent('li').find('input:checkbox').each(function(){
				// C'est une categ
				if( jQuery(this).css('display') == 'none')
				{
					// on recupere le div-checkbox
					var EltChk = jQuery(this).parent('div');
					setChkValue(EltChk, 0); 
					
					// Si il y a des plans ds la categ, on les masque (tous)
					EltChk.nextAll('ul').children('li.liplan').children('input').each(function(){
						setPlanVisible(tableauPlans[jQuery(this).val()], false);
					});
				}
				else	// C'est un lieu (checkbox)
				{
					// on coche tous les lieux
					jQuery(this).removeAttr('checked');
					jQuery(this).change();
				}
			});
		break;

		// Carré : on coche tous les enfants que l'on est authorisé à voir à ce niveau de zoom		
		case "1" :
			changeZoom(map.getZoom());
			jQuery('#'+_oDivChk.attr('id')).parent('li').find('input:checkbox').each(function(){
				// C'est une categ
				if( jQuery(this).css('display') == 'none')
				{
					// on recupere le div-checkbox
					var EltChk = jQuery(this).parent('div');
					setChkValue(EltChk, 1); 
					
					// Si il y a des plans ds la categ, on les affiche (tous)
					EltChk.nextAll('ul').children('li.liplan').children('input').each(function(){
						setPlanVisible(tableauPlans[jQuery(this).val()], true);
					});
				}
			});
		break;
		
		// Coché : on coche tous les enfants peu importe le niveau de zoom
		case "2":
			jQuery('#'+_oDivChk.attr('id')).parent('li').find('input:checkbox').each(function(){
				// C'est une categ
				if( jQuery(this).css('display') == 'none')
				{
					// on recupere le div-checkbox
					var EltChk = jQuery(this).parent('div');
					setChkValue(EltChk, 2); 
					
					var nbplanmax = EltChk.next().children('span.nbPlansMax').html();
					EltChk.next().children('span.nbPlans').html(nbplanmax);
					
					// Si il y a des plans ds la categ, on les affiche (tous)
					EltChk.nextAll('ul').children('li.liplan').children('input').each(function(){
						setPlanVisible(tableauPlans[jQuery(this).val()], true);
						jQuery('path#plan_'+jQuery(this).val()).show();
					});
				}
				else	// C'est un lieu (checkbox)
				{
					// on coche tous les lieux
					jQuery(this).attr('checked','checked');
					jQuery(this).change();
				}
			});
		break;
		
		default : 
			
	}
}

function getChkValue(_strClassName)
{
	return _strClassName.charAt((_strClassName.length-1));
}

function setChkValue(_obj, _val)
{
	_obj.attr('class','myCheckbox'+_val)
}

/*
 * Affiche / Masque les lieux en fonctions du niveau de zoom
 */
function changeZoom(_level)
{
	
	if (zoomActiv == true){

		var x;
		for(x in tableauMarqueurs)
		{
			if( !isNaN(x))	// Valeur etranges ds tableauMarqueurs 
			{
				var marker = tableauMarqueurs[x];
				var elemtCateg = jQuery('#categ_'+marker.marqueurIdCategorie);
				
				//if( getChkValue( elemtCateg.attr('class') ) == 1 )
				//{
					// Le niveau du marker est plus petit que le niveau de zoom => on l'affiche et on met à jour la chk !
					if( marker.marqueurNiveau <= _level && jQuery('ul#listePlans #lieu_'+marker.marqueurId).size()==0 )
					{
						marker.marqueurVisibiliteInit = 'show';
						marker.setVisible(true);
						jQuery('#lieu_'+marker.marqueurId).attr('checked','checked');
						jQuery('#lieu_'+marker.marqueurId).change();
						jQuery('#lieu_'+marker.marqueurId).attr('title','Cliquez pour masquer le lieu');
						if( jQuery('#lieu_'+marker.marqueurId).parent().next('label').children('a').size() < 1 ) {
							var lien = '<a href="javascript:updateInfoWindow(\'<h2>'+marqueur.marqueurNom.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'</h2>'+marker.marqueurContenu.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'\', '+marker.marqueurId+');" title="Cliquez pour identifier le lieu sur la carte">'+jQuery('#lieu_'+marker.marqueurId).parent().next('label').html()+'</a>';
							jQuery('#lieu_'+marker.marqueurId).parent().next('label').html(lien);
						}
					}
					else
					{
						marker.marqueurVisibiliteInit = 'hide';
						marker.setVisible(false);
						jQuery('#lieu_'+marker.marqueurId).removeAttr('checked');
						jQuery('#lieu_'+marker.marqueurId).change();
						jQuery('#lieu_'+marker.marqueurId).attr('title','Cliquez pour afficher le lieu');
						if( jQuery('#lieu_'+marker.marqueurId).parent().next('label').children('a').size() == 1 )
						{
							jQuery('#lieu_'+marker.marqueurId).parent().next('label').html( jQuery('#lieu_'+marker.marqueurId).parent().next('label').children('a').html() ).children('a').remove();
						}
						infoWindow.close();
					}
				//}
			}
		}
	}
}

function createPoint(id, nom, categorie, idCateg, contenu, adresse1, cp, ville, setLat, setLon, visibilite, niveau, priorite, urlIcon)
{

	if (setLat == 0 || setLon == 0){
		setLat = 47.9108329;
		setLon = 1.9157977;
	}
	
	if (setLat != '' && setLon != '' && setLat != 0 && setLon != 0) 
	{
		point = new google.maps.LatLng(setLat, setLon); 
		var marqueur = createMarker(id, nom, categorie, idCateg, contenu, adresse1, cp, ville, setLat, setLon, visibilite, niveau, priorite, urlIcon, point);
		return marqueur;
	}
	else 	// Normalement on ne rentre pas ds ce cas la (batch LatLng !!!)
	{
		
		adresse = adresse1 + " " + cp + " " + ville;
		geoCoder.geocode({'address': adresse},
			function(resultats,statut) 
			{
				if (statut == google.maps.GeocoderStatus.OK) 
				{
					point = resultats[0].geometry.location; 
					var marqueur = createMarker(id, nom, categorie, contenu, adresse1, cp, ville, setLat, setLon, visibilite, niveau, priorite, urlIcon, point);
					return marqueur;
				}
			}
		);
		
	}
}

function createMarker(id, nom, categorie, idCateg, contenu, adresse1, cp, ville, setLat, setLon, visibilite, niveau, priorite, urlIcon, point)
{	
	if (visibilite == "hide" || niveau > niveauCarte) 
		visible = false;
	else
		visible = true;

	marqueur = new google.maps.Marker({
		'position': point,
		'map': map,
		'zIndex': 50-niveau-priorite, /* plus un niveau de zoom est élevé, plus l'affichage est prioritaire, mais pour une même niveau, il y a aussi une notion de priorité changée manuellement */
		'title': nom,
		'clickable': true,
		'icon' : new google.maps.MarkerImage(url_carto_picto+urlIcon),
		'visible' : visible
	});
	marqueur.marqueurCategorie = categorie;
	marqueur.marqueurIdCategorie = idCateg;
	marqueur.marqueurNom = nom;
	marqueur.marqueurNiveau = niveau;
	marqueur.marqueurId = id;
	marqueur.marqueurVisibiliteInit = visibilite;
	marqueur.marqueurContenu = contenu;
	marqueur.marqueurPosition = point;
	
	tableauMarqueurs[id] = marqueur;
	
	// Mise a jour de la checkbox ds le panel gauche
	if(visible == true)
	{
		jQuery('ul#listeLieux #lieu_'+id).attr('checked','checked');
		jQuery('ul#listeLieux #lieu_'+id).change();
		jQuery('ul#listeLieux #lieu_'+id).attr('title','Cliquez pour masquer le lieu');
		if( jQuery('ul#listeLieux #lieu_'+id).parent().next('label').children('a').size() < 1 ) {
			var lien = '<a href="javascript:updateInfoWindow(\'<h2>'+marqueur.marqueurNom.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'</h2>'+marqueur.marqueurContenu.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'\', '+id+');" title="Cliquez pour identifier le lieu sur la carte">'+jQuery('ul#listeLieux #lieu_'+id).parent().next('label').html()+'</a>';
			jQuery('ul#listeLieux #lieu_'+id).parent().next('label').html(lien);
		}
	}
	else {
		jQuery('ul#listeLieux #lieu_'+id).attr('title','Cliquez pour afficher le lieu');
	}
	
	// Calcul du nbre de chkbox cochées
	//calculNbChkbox( jQuery('ul#listeLieux #lieu_'+id).parent().parent().parent() );
	
	google.maps.event.addListener(tableauMarqueurs[id], 'click', function() {
		updateInfoWindow('<h2>'+nom.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'</h2>'+contenu.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;"), id);
	});

	return marqueur;
}

function updateInfoWindow(_contenu, _id)
{
	//on ferme les autres bulles et on vide le contenu de la div d'impression
	infoWindow.close(); 
	jQuery('#info').html("");
	infoWindow.setContent(_contenu.replace(/&quot;/g, '"')+'<p>&nbsp;</p>'); //ajout paragraphe vide pour parer à un problème de scroll de google map V3
	infoWindow.open(map, tableauMarqueurs[_id]);
	jQuery('#info').html(_contenu);
}